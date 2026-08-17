"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  ShoppingBag, 
  AlertTriangle,
  RotateCcw,
  Printer,
  Truck,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { useCurrency } from "@/lib/store/CurrencyContext";
import { useCart } from "@/lib/store/CartContext";
import { getProductVariantInfo } from "@/lib/utils";

interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  variant_info: any;
  products: { slug: string; metadata: any } | null;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  payment_status: string;
  fulfillment_status: string;
  shipping_method: string;
  coupon_code: string | null;
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "delivered">("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, created_at, total, subtotal, shipping_cost, discount_amount, payment_status, fulfillment_status, shipping_method, coupon_code")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setIsLoading(false);
    };

    fetchOrders();
  }, [user]);

  const toggleExpand = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    if (!orderItems[orderId]) {
      setIsLoadingItems(true);
      const { data } = await supabase
        .from("order_items")
        .select("*, products(slug, metadata)")
        .eq("order_id", orderId);

      setOrderItems((prev) => ({ ...prev, [orderId]: data || [] }));
      setIsLoadingItems(false);
    }
  };

  const handleReOrder = async (orderId: string) => {
    let items = orderItems[orderId];
    if (!items) {
      const { data } = await supabase
        .from("order_items")
        .select("*, products(slug, metadata)")
        .eq("order_id", orderId);
      items = data || [];
    }

    if (!items || items.length === 0) {
      addToast({ title: "Error", message: "No items found in this order.", type: "error" });
      return;
    }

    items.forEach(item => {
      const sizeText = item.variant_info?.size || undefined;
      const variantInfo = getProductVariantInfo(item.products || { title: item.title }, sizeText);
      const sizeFromInfo = variantInfo.split(" ")[0];
      const fullProductId = `${item.product_id}-${sizeFromInfo}`;

      addItem({
        productId: fullProductId,
        variantId: fullProductId,
        title: item.title,
        price: item.unit_price,
        quantity: item.quantity,
        image: item.products?.metadata?.images?.[0] || "/assets/placeholder.jpg",
        variantInfo
      });
    });

    addToast({ 
      title: "Items Added to Cart!", 
      message: `${items.length} item(s) from order #${orders.find(o => o.id === orderId)?.order_number} added to your cart.`, 
      type: "success" 
    });
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    setIsCancelling(true);
    try {
      const res = await fetch("/api/order/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, userId: user.id })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel order");
      }

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillment_status: "cancelled" } : o));
      addToast({ title: "Order Cancelled", message: "Your order has been cancelled successfully.", type: "success" });
      setCancellingOrderId(null);
    } catch (err: any) {
      addToast({ title: "Cancellation Failed", message: err.message, type: "error" });
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeFilter === "active") return o.fulfillment_status !== "delivered" && o.fulfillment_status !== "cancelled";
    if (activeFilter === "delivered") return o.fulfillment_status === "delivered";
    return true;
  });

  if (isLoading) {
    return (
      <div className="h-64 bg-white rounded-2xl border border-neutral-200/90 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Page Header & Filters ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-neutral-900">Purchase History</h2>
          <p className="text-xs text-neutral-400">View live status, track shipments, and re-order your favorite scents</p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "all" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "active" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Active ({orders.filter(o => o.fulfillment_status !== "delivered" && o.fulfillment_status !== "cancelled").length})
          </button>
          <button
            onClick={() => setActiveFilter("delivered")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "delivered" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Delivered ({orders.filter(o => o.fulfillment_status === "delivered").length})
          </button>
        </div>
      </div>

      {/* ── Order List ── */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-10 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-900">No orders found</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">There are no orders matching your selected filter.</p>
          <Link href="/products" className="inline-block bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const items = orderItems[order.id] || [];

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
                {/* Header Strip */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 bg-neutral-50/40">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-neutral-900">{order.order_number}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        order.fulfillment_status === "delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        order.fulfillment_status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {order.fulfillment_status}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        order.payment_status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-neutral-100 text-neutral-700 border-neutral-200"
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-neutral-100 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Total</span>
                      <span className="font-mono text-sm font-bold text-neutral-900">{formatPrice(Number(order.total))}</span>
                    </div>

                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="flex items-center gap-1 bg-white hover:bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {isLoadingItems ? (
                      <div className="py-6 flex justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
                      </div>
                    ) : (
                      <>
                        {/* Order Items */}
                        <div className="divide-y divide-neutral-100">
                          {items.map((item) => {
                            const imageUrl = item.products?.metadata?.images?.[0] || "/assets/placeholder.jpg";
                            return (
                              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/80">
                                    <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1">{item.title}</p>
                                    <p className="text-[11px] text-neutral-400">
                                      Qty: {item.quantity} {item.variant_info?.size && `• Size: ${item.variant_info.size}`}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">
                                  {formatPrice(Number(item.line_total))}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Summary & Actions */}
                        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                          <div className="space-y-1 text-neutral-500 font-medium w-full sm:w-auto">
                            <div className="flex justify-between sm:justify-start gap-4">
                              <span>Subtotal:</span>
                              <span className="font-mono text-neutral-900">{formatPrice(Number(order.subtotal))}</span>
                            </div>
                            <div className="flex justify-between sm:justify-start gap-4">
                              <span>Shipping ({order.shipping_method || "Standard"}):</span>
                              <span className="font-mono text-neutral-900">{formatPrice(Number(order.shipping_cost))}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                              onClick={() => handleReOrder(order.id)}
                              className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Re-Order Items</span>
                            </button>

                            {(order.fulfillment_status === "pending" || order.fulfillment_status === "processing") && (
                              <button
                                onClick={() => setCancellingOrderId(order.id)}
                                className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={() => !isCancelling && setCancellingOrderId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Cancel Order?</h3>
              <p className="text-xs text-neutral-500 mt-1">Are you sure you want to cancel this order? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancellingOrderId(null)}
                disabled={isCancelling}
                className="flex-1 py-2.5 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancelOrder(cancellingOrderId)}
                disabled={isCancelling}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                {isCancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

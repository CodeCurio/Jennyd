"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/store/AuthContext";
import { supabase } from "@/lib/supabase";
import { Package, ChevronDown, ChevronUp, Loader2, ShoppingBag, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

interface OrderItem {
  id: string;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    setIsCancelling(true);
    try {
      const res = await fetch("/api/order/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          userId: user.id
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel order");
      }

      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillment_status: "cancelled" } : o));
      addToast({ title: "Order Cancelled", message: "Your order has been cancelled successfully.", type: "success" });
      setCancellingOrderId(null);
    } catch (err: any) {
      addToast({ title: "Cancellation Failed", message: err.message, type: "error" });
    } finally {
      setIsCancelling(false);
    }
  };

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

    // Fetch items if not already cached
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "processing": return "bg-indigo-100 text-indigo-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Order History</h2>
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-sm text-gray-500 mb-6">Once you place an order, it will show up here.</p>
          <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const items = orderItems[order.id] || [];

            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                {/* Order Header */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2">
                        <p className="text-sm font-bold text-gray-900 font-mono">{order.order_number}</p>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          order.payment_status === "paid" ? "text-green-600" :
                          order.payment_status === "refunded" ? "text-gray-500" :
                          order.payment_status === "failed" ? "text-red-500" : "text-amber-500"
                        }`}>
                          Payment: {order.payment_status === "pending" ? "Pending / COD" : order.payment_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusColor(order.fulfillment_status)}`}>
                      Order: {order.fulfillment_status === "processing" ? "packed" : order.fulfillment_status}
                    </span>
                    <span className="font-bold text-sm text-gray-900 font-mono min-w-[80px] text-right">₹{Number(order.total).toLocaleString("en-IN")}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {isLoadingItems ? (
                      <div className="py-8 flex justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        {/* Items */}
                        <div className="divide-y divide-gray-50">
                          {items.map((item) => {
                            const imageUrl = item.products?.metadata?.images?.[0] || "/assets/placeholder.jpg";
                            return (
                              <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                  <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                                  {item.variant_info?.size && (
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Size: {item.variant_info.size}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-0.5">₹{Number(item.unit_price).toLocaleString("en-IN")} × {item.quantity}</p>
                                </div>
                                <p className="font-bold text-sm text-gray-900 font-mono">₹{Number(item.line_total).toLocaleString("en-IN")}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Summary */}
                        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 text-xs space-y-1.5 text-gray-500 font-medium">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-gray-900 font-mono">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping ({order.shipping_method || "Standard"})</span>
                            <span className="text-gray-900 font-mono">₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
                          </div>
                          {Number(order.discount_amount) > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</span>
                              <span className="font-mono">-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t border-gray-200 text-gray-900 font-bold">
                            <span className="uppercase tracking-wider">Total</span>
                            <span className="font-mono text-sm">₹{Number(order.total).toLocaleString("en-IN")}</span>
                          </div>
                          
                          {/* Cancel Order Action */}
                          {(order.fulfillment_status === "pending" || order.fulfillment_status === "processing") && (
                            <div className="pt-4 border-t border-gray-200 flex justify-end">
                              <button
                                onClick={() => setCancellingOrderId(order.id)}
                                className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
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

      {/* Cancellation Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => !isCancelling && setCancellingOrderId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Your Order?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to cancel this order? This action will permanently cancel the order and return items to stock.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancellingOrderId(null)}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={() => handleCancelOrder(cancellingOrderId)}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

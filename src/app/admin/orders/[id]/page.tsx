"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, MapPin, User, CreditCard, Box, Loader2, CheckCircle2, Circle, Truck, Package, PackageCheck, Copy, Check, MessageSquare, Mail, Phone, ExternalLink } from "lucide-react";
import { OrderActionsClient } from "@/components/admin/OrderActionsClient";
import { useToast } from "@/components/ui/Toast";

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { addToast } = useToast();

  const fetchOrderData = async () => {
    setIsLoading(true);
    const { data: orderData, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (orderData && !error) {
      setOrder(orderData);
      const { data: itemsData } = await supabase.from("order_items").select("*, products(slug, metadata)").eq("order_id", orderId);
      if (itemsData) setOrderItems(itemsData);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchOrderData(); }, [orderId]);

  const copyShippingAddress = () => {
    if (!order?.shipping_address) return;
    const sa = order.shipping_address;
    const text = `${sa.fullName || ''}\n${sa.addressLine1 || ''} ${sa.addressLine2 || ''}\n${sa.city || ''}, ${sa.state || ''} - ${sa.zipCode || sa.zip || ''}\n${sa.country || 'India'}\nPhone: ${sa.phone || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    addToast({ title: "Copied!", message: "Shipping address copied to clipboard.", type: "success" });
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-neutral-200 shadow-xs">
        <Loader2 className="w-7 h-7 animate-spin text-[#D4AF37]" strokeWidth={2} />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Loading Order Details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-neutral-200 shadow-xs">
        <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
        <h1 className="text-base font-bold text-neutral-900 mb-1">Order Not Found</h1>
        <Link href="/admin/orders" className="text-[#D4AF37] hover:text-[#b8952c] text-xs font-bold uppercase tracking-wider transition-colors">
          &larr; Return to Orders Catalog
        </Link>
      </div>
    );
  }

  const cleanPhone = (order.shipping_address?.phone || "").replace(/\D/g, "");
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}` : null;

  // Determine timeline steps
  const steps = [
    { label: "Order Placed", status: "complete", date: order.created_at },
    { label: "Payment Verified", status: order.payment_status === "paid" ? "complete" : "pending", date: order.payment_status === "paid" ? order.created_at : null },
    { label: "Packed", status: ["processing", "shipped", "delivered"].includes(order.fulfillment_status) ? "complete" : "pending", date: null },
    { label: "Shipped", status: ["shipped", "delivered"].includes(order.fulfillment_status) ? "complete" : "pending", date: null },
    { label: "Delivered", status: order.fulfillment_status === "delivered" ? "complete" : "pending", date: null },
  ];

  return (
    <div className="space-y-4 pb-16 font-sans max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs">
        <Link href="/admin/orders" className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 hover:text-black mb-2 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Orders Catalog
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold uppercase tracking-wider text-neutral-900">
                Order #{order.order_number}
              </h1>
              {order.payment_status === "paid" ? (
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">Paid</span>
              ) : (
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 rounded">COD / Pending</span>
              )}
              <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border ${
                ['shipped', 'delivered'].includes(order.fulfillment_status) ? 'bg-[#D4AF37]/10 text-[#b8952c] border-[#D4AF37]/30' : 'bg-neutral-100 text-neutral-700 border-neutral-200'
              }`}>
                {order.fulfillment_status === 'processing' ? 'packed' : order.fulfillment_status}
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
              Placed on {format(new Date(order.created_at), "MMM dd, yyyy 'at' hh:mm a")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShippingAddress}
              className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              <span>{copiedAddress ? "Address Copied" : "Copy Address"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Executive Action Control Toolbar */}
          <OrderActionsClient order={order} onUpdate={fetchOrderData} />

          {/* Purchased Items Card */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-[#D4AF37]" /> Purchased Items ({orderItems.length})
              </h2>
            </div>

            <div className="divide-y divide-neutral-100">
              {orderItems.map((item: any) => {
                const imageUrl = item.products?.metadata?.images?.[0] || "/assets/placeholder.jpg";
                const productSlug = item.products?.slug;

                return (
                  <div key={item.id} className="p-3.5 sm:p-4 flex items-center gap-3.5">
                    <div className="w-14 h-14 relative bg-neutral-50 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                      <img src={imageUrl} alt={item.title} className="object-cover w-full h-full mix-blend-multiply" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                        {productSlug ? (
                          <Link href={`/products/${productSlug}`} target="_blank" className="hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1">
                            <span>{item.title}</span>
                            <ExternalLink className="w-3 h-3 text-neutral-400 opacity-60" />
                          </Link>
                        ) : item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.variant_info?.size && (
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase tracking-wider">
                            Size: {item.variant_info.size}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-neutral-500">
                          ₹{Number(item.unit_price).toLocaleString('en-IN')} × {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-sm text-neutral-900">₹{Number(item.line_total).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financial Summary */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/40 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Items Subtotal</span>
                <span className="font-mono text-neutral-900 font-bold">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-600 font-medium">
                <span>Shipping Fee</span>
                <span className="font-mono text-neutral-900 font-bold">{Number(order.shipping_cost) > 0 ? `₹${order.shipping_cost}` : "FREE"}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({order.coupon_code || 'PROMO'})</span>
                  <span className="font-mono">-₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-3 mt-1 border-t border-neutral-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 block">Total Amount</span>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    Payment via {order.payment_status === "paid" ? "Online Razorpay" : "Cash on Delivery (COD)"}
                  </span>
                </div>
                <span className="text-xl font-bold font-mono text-[#D4AF37]">₹{Number(order.total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Customer & Address Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Contact */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" /> Customer Profile
                </h3>
              </div>

              <div>
                <p className="font-bold text-sm text-neutral-900">{order.shipping_address?.fullName || "Guest Customer"}</p>
                <a href={`mailto:${order.email}`} className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3" /> {order.email}
                </a>
                {order.shipping_address?.phone && (
                  <p className="text-xs font-mono text-neutral-700 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3 text-neutral-400" /> {order.shipping_address.phone}
                  </p>
                )}
              </div>

              {whatsappUrl && (
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Delivery Address
                </h3>
              </div>

              <div className="text-xs text-neutral-700 leading-relaxed font-medium">
                <p className="font-bold text-neutral-900">{order.shipping_address?.fullName}</p>
                <p>{order.shipping_address?.addressLine1}</p>
                {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                <p>{order.shipping_address?.city}, {order.shipping_address?.state} - <span className="font-mono font-bold">{order.shipping_address?.zipCode || order.shipping_address?.zip}</span></p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">Country: {order.shipping_address?.country || "India"}</p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Timeline Stepper */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider pb-2 border-b border-neutral-100">
              Fulfillment Timeline
            </h3>

            <div className="space-y-4 relative pl-2 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-100">
              {steps.map((step, idx) => {
                const isComplete = step.status === "complete";
                return (
                  <div key={idx} className="relative flex items-start gap-3 z-10">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 bg-white ${
                      isComplete ? "border-[#D4AF37] bg-[#D4AF37] text-white" : "border-neutral-200 text-neutral-300"
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Circle className="w-2.5 h-2.5 fill-current text-neutral-300" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${isComplete ? "text-neutral-900" : "text-neutral-400"}`}>{step.label}</p>
                      {step.date && (
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                          {format(new Date(step.date), "MMM dd, HH:mm")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tracking Summary Block */}
            {order.metadata?.tracking_number && (
              <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5 text-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block">Dispatch & Tracking Info</span>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                  <p className="font-bold text-neutral-800">Courier: <span className="font-semibold text-neutral-600">{order.metadata.courier}</span></p>
                  <p className="font-bold text-neutral-800">AWB: <span className="font-mono text-blue-600 select-all">{order.metadata.tracking_number}</span></p>
                  {order.metadata.tracking_url && (
                    <a
                      href={order.metadata.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Track Live Package</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, MapPin, User, CreditCard, Box, Loader2, CheckCircle2, Circle, Truck, Package, PackageCheck } from "lucide-react";
import { OrderActionsClient } from "@/components/admin/OrderActionsClient";

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" strokeWidth={1.5} />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Loading Order Profile...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <Package className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Order Not Found</h1>
        <Link href="/admin/orders" className="text-[#D4AF37] hover:text-[#b8952c] text-xs font-bold uppercase tracking-wider transition-colors">
          &larr; Return to Orders
        </Link>
      </div>
    );
  }

  // Determine timeline steps
  const steps = [
    { label: "Order Placed", status: "complete", icon: Box, date: order.created_at },
    { label: "Payment Verified", status: order.payment_status === "paid" ? "complete" : "pending", icon: CreditCard, date: order.payment_status === "paid" ? order.created_at : null },
    { label: "Packed", status: ["processing", "shipped", "delivered"].includes(order.fulfillment_status) ? "complete" : "pending", icon: PackageCheck, date: null },
    { label: "Shipped", status: ["shipped", "delivered"].includes(order.fulfillment_status) ? "complete" : "pending", icon: Truck, date: null },
    { label: "Delivered", status: order.fulfillment_status === "delivered" ? "complete" : "pending", icon: CheckCircle2, date: null },
  ];

  return (
    <div className="space-y-6 pb-16 font-sans max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <Link href="/admin/orders" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 mb-6 transition-colors group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-widest text-neutral-900 mb-2">
              Order {order.order_number}
            </h1>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
              Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' HH:mm")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg border ${
              order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
            }`}>
              {order.payment_status}
            </span>
            <span className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg border ${
              ['shipped', 'delivered'].includes(order.fulfillment_status) ? 'bg-[#D4AF37]/10 text-[#b8952c] border-[#D4AF37]/30' : 'bg-neutral-50 text-neutral-600 border-neutral-200'
            }`}>
              {order.fulfillment_status === 'processing' ? 'packed' : order.fulfillment_status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Actions / Tracking Update */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-[0.15em] mb-4">Order Management</h2>
            <OrderActionsClient 
              order={order} 
              onUpdate={fetchOrderData}
            />
          </div>
          
          {/* Items Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-[0.15em] flex items-center gap-2">
                <Box className="w-4 h-4 text-[#D4AF37]" /> Purchased Items ({orderItems.length})
              </h2>
            </div>
            
            <div className="divide-y divide-neutral-50">
              {orderItems.map((item: any) => {
                const imageUrl = item.products?.metadata?.images?.[0] || "/assets/placeholder.jpg";
                const productSlug = item.products?.slug;

                return (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5">
                    <div className="w-20 h-20 relative bg-neutral-50 rounded-xl overflow-hidden shrink-0 border border-neutral-100">
                      <img src={imageUrl} alt={item.title} className="object-cover w-full h-full mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wide truncate">
                        {productSlug ? (
                          <Link href={`/products/${productSlug}`} target="_blank" className="hover:text-[#D4AF37] transition-colors">
                            {item.title}
                          </Link>
                        ) : item.title}
                      </h3>
                      {item.variant_info?.size && (
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mt-1.5">Size: {item.variant_info.size}</p>
                      )}
                      <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mt-2">₹{Number(item.unit_price).toLocaleString('en-IN')} × {item.quantity}</p>
                    </div>
                    <div className="text-right flex items-center sm:items-start justify-end">
                      <p className="font-bold text-sm font-mono text-neutral-900">₹{Number(item.line_total).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Totals */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 space-y-3">
              <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-900">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <span>Shipping</span>
                <span className="font-mono text-neutral-900">₹{Number(order.shipping_cost).toLocaleString('en-IN')}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-wider">
                  <span>Discount ({order.coupon_code})</span>
                  <span className="font-mono">-₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-4 mt-2 border-t border-neutral-200 flex justify-between items-center">
                <span className="font-black uppercase tracking-[0.2em] text-xs text-neutral-900">Total Paid</span>
                <span className="text-2xl font-black font-mono text-[#D4AF37]">₹{Number(order.total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Fulfillment Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-[0.15em] mb-6">Fulfillment Timeline</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-neutral-100">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isComplete = step.status === "complete";
                return (
                  <div key={idx} className="relative flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-white ${
                      isComplete ? "border-[#D4AF37] text-[#D4AF37]" : "border-neutral-200 text-neutral-300"
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-3.5 h-3.5 fill-current text-white" /> : <Circle className="w-3 h-3 fill-current" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${isComplete ? "text-neutral-900" : "text-neutral-400"}`}>{step.label}</p>
                      {step.date && <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5 font-mono">{format(new Date(step.date), "MMM d, HH:mm")}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
            {order.metadata?.tracking_number && (
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Tracking Information</p>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-bold text-neutral-900">Courier: <span className="font-medium text-neutral-600">{order.metadata.courier}</span></p>
                  <p className="text-xs font-bold text-neutral-900">AWB: <span className="font-mono text-blue-600 select-all cursor-text">{order.metadata.tracking_number}</span></p>
                  {order.metadata.tracking_url && (
                    <a href={order.metadata.tracking_url} target="_blank" className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider hover:underline mt-1 inline-block">Track Package &rarr;</a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customer Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-[0.15em] flex items-center gap-2">
                <User className="w-4 h-4 text-[#D4AF37]" /> Customer
              </h2>
            </div>
            <div className="p-6 text-xs space-y-4">
              <div>
                <p className="font-black text-sm text-neutral-900 uppercase tracking-wide">{order.shipping_address?.fullName || "Guest Customer"}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-neutral-400 text-[9px] uppercase tracking-[0.2em] font-bold">Contact Info</p>
                <p className="text-blue-600 hover:underline break-all font-semibold lowercase font-mono">{order.email}</p>
                {order.shipping_address?.phone && (
                  <p className="text-neutral-700 font-mono font-medium">{order.shipping_address.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-[0.15em] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" /> Delivery
              </h2>
            </div>
            <div className="p-6 text-xs space-y-1.5 text-neutral-700 font-medium font-sans">
              <p className="font-black text-neutral-900 uppercase tracking-wide mb-2">{order.shipping_address?.fullName}</p>
              <p>{order.shipping_address?.addressLine1}</p>
              {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} - <span className="font-mono">{order.shipping_address?.zipCode || order.shipping_address?.zip}</span></p>
              <p className="uppercase tracking-[0.2em] text-[9px] text-neutral-400 font-bold mt-4">Country: {order.shipping_address?.country || "India"}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

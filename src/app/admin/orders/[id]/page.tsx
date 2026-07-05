"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ChevronLeft, MapPin, User, CreditCard, Box, Loader2 } from "lucide-react";
import { OrderActionsClient } from "@/components/admin/OrderActionsClient";

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrderData = async () => {
    setIsLoading(true);
    const { data: orderData, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderData && !error) {
      setOrder(orderData);
      
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*, products(slug, metadata)")
        .eq("order_id", orderId);

      if (itemsData) {
        setOrderItems(itemsData);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 bg-white border border-gray-150 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-black" strokeWidth={1.5} />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Loading order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center bg-white border border-gray-200 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Order Not Found</h1>
        <Link href="/admin/orders" className="text-blue-600 hover:underline text-xs font-bold uppercase tracking-wider">
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Header */}
      <div>
        <Link href="/admin/orders" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-widest flex items-center gap-3">
              Order {order.order_number}
              <span className="text-xs tracking-wider bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold font-mono">
                {format(new Date(order.created_at), "MMM d, yyyy h:mm a")}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Badges */}
            <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md ${
              order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.payment_status}
            </span>
            <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md ${
              order.fulfillment_status === 'shipped' || order.fulfillment_status === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {order.fulfillment_status === 'processing' ? 'packed' : order.fulfillment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <OrderActionsClient 
          orderId={order.id} 
          currentFulfillment={order.fulfillment_status} 
          currentPayment={order.payment_status} 
          onUpdate={fetchOrderData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Items & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <Box className="w-4 h-4 text-gray-500" /> Purchased Items
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {orderItems.map((item: any) => {
                const imageUrl = item.products?.metadata?.images?.[0] || "/assets/placeholder.jpg";
                const productSlug = item.products?.slug;

                return (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
                    <div className="w-16 h-16 relative bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                      <img src={imageUrl} alt={item.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm uppercase tracking-wide">
                        {productSlug ? (
                          <Link href={`/products/${productSlug}`} target="_blank" className="hover:underline">
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h3>
                      {item.variant_info?.size && (
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Size: {item.variant_info.size}</p>
                      )}
                      <p className="text-gray-500 text-[10px] font-semibold mt-1">₹{Number(item.unit_price).toLocaleString('en-IN')} × {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm font-mono">₹{Number(item.line_total).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Totals */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-gray-950">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-gray-950">₹{Number(order.shipping_cost).toLocaleString('en-IN')}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Discount ({order.coupon_code})</span>
                  <span className="font-mono">-₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-gray-950">
                <span className="font-bold uppercase tracking-widest text-xs">Total Paid</span>
                <span className="text-xl font-black font-mono">₹{Number(order.total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Customer Details */}
        <div className="space-y-6">
          
          {/* Customer Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" /> Customer Details
              </h2>
            </div>
            <div className="p-4 text-xs space-y-3">
              <div>
                <p className="font-bold text-sm text-gray-900 uppercase tracking-wide">{order.shipping_address?.fullName || "Guest Customer"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Contact Info</p>
                <p className="text-blue-600 hover:underline break-all font-semibold lowercase font-mono">{order.email}</p>
                {order.shipping_address?.phone && (
                  <p className="text-gray-700 font-mono">{order.shipping_address.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" /> Shipping Address
              </h2>
            </div>
            <div className="p-4 text-xs space-y-1 text-gray-700 font-medium font-sans">
              <p className="font-bold text-gray-950 uppercase tracking-wide">{order.shipping_address?.fullName}</p>
              <p>{order.shipping_address?.addressLine1}</p>
              {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.zipCode || order.shipping_address?.zip}</p>
              <p className="uppercase tracking-widest text-[10px] text-gray-400 font-bold mt-2">Country: {order.shipping_address?.country || "India"}</p>
            </div>
          </div>

          {/* Payment Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" /> Payment Details
              </h2>
            </div>
            <div className="p-4 text-xs space-y-3 font-semibold text-gray-500">
              <div className="flex justify-between items-center">
                <span>Method</span>
                <span className="font-bold text-gray-900 uppercase">
                  {order.payment_status === 'pending' && order.shipping_method?.toLowerCase()?.includes("standard") ? "COD (Standard)" : "Online / COD"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Gateway Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{order.payment_status}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

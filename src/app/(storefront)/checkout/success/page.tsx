"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Clipboard, Package, ArrowRight, Truck, ShieldCheck, ShoppingBag, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const { addToast } = useToast();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    // Generate a fixed simulated tracking number on mount
    setTrackingNumber(`JD-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`);

    const fetchOrder = async () => {
      if (!orderNumber) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single();

      if (data && !error) {
        setOrder(data);
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderNumber]);

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    addToast({ title: "Copied!", message: "Tracking ID copied to clipboard.", type: "success" });
  };

  // Compute estimated delivery window
  const getDeliveryEstimate = () => {
    const isExpress = order?.shipping_method?.toLowerCase()?.includes("express");
    const minDays = isExpress ? 1 : 3;
    const maxDays = isExpress ? 2 : 5;
    
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + minDays);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDays);

    const options = { month: "short", day: "numeric" } as const;
    return `${minDate.toLocaleDateString("en-IN", options)} - ${maxDate.toLocaleDateString("en-IN", options)}`;
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-16 font-sans">
      <div className="max-w-3xl mx-auto px-4 text-center">
        
        {/* Draw SVG animation checkmark */}
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100">
          <svg className="w-14 h-14 text-emerald-600" viewBox="0 0 52 52" fill="none">
            <motion.circle
              cx="26"
              cy="26"
              r="23"
              stroke="currentColor"
              strokeWidth="3.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <motion.path
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 27l7 7 14-15"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
            />
          </svg>
        </div>

        {/* Dynamic Titles */}
        <h1 className="text-3xl font-serif text-gray-900 uppercase tracking-widest mb-3">
          Order Confirmed
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-10">
          Thank you for shopping with Jennyd. Your luxurious fragrance order has been placed and is currently being prepared.
        </p>

        {isLoading ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Loading order info...</span>
          </div>
        ) : !order ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-xs mb-8">
            <div className="flex justify-between items-center border-b border-gray-150 pb-4 mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              <span>Order ID</span>
              <span className="text-gray-900 font-mono">{orderNumber || "JD-XXXXXX"}</span>
            </div>
            <p className="text-xs text-red-600 font-semibold">We couldn't retrieve detailed order metadata, but it was processed successfully.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Tracking & Delivery Details */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs text-left text-xs font-bold uppercase tracking-wider text-gray-500 space-y-4">
              <h3 className="text-sm font-serif text-gray-900 tracking-widest border-b border-gray-100 pb-3 flex items-center gap-2">
                <Truck className="w-4.5 h-4.5" /> Shipment & Tracking
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 block">Order Reference</span>
                  <span className="text-gray-900 font-mono text-sm">{order.order_number}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 block">Estimated Delivery</span>
                  <span className="text-emerald-700 text-sm font-bold">{getDeliveryEstimate()}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 block">Shipping Method</span>
                  <span className="text-gray-800">{order.shipping_method}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 block">Courier Carrier</span>
                  <span className="text-gray-800">BlueDart Logistics</span>
                </div>

                <div className="col-span-1 md:col-span-2 pt-2 border-t border-gray-100 flex flex-col md:flex-row justify-between items-baseline gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] text-gray-400 block">Simulated tracking ID</span>
                    <span className="text-gray-800 font-mono tracking-normal text-xs">{trackingNumber}</span>
                  </div>
                  <button 
                    onClick={handleCopyTracking}
                    className="text-[10px] text-black hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Clipboard className="w-3.5 h-3.5" /> Copy Tracking ID
                  </button>
                </div>

              </div>

            </div>

            {/* Receipt Summary details */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs text-left text-xs font-bold uppercase tracking-wider text-gray-500 space-y-4">
              <h3 className="text-sm font-serif text-gray-900 tracking-widest border-b border-gray-100 pb-3 flex items-center gap-2">
                <Package className="w-4.5 h-4.5" /> Order Summary
              </h3>

              <div className="space-y-2 text-gray-550 border-b border-gray-100 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-gray-900">₹{Number(order.subtotal).toLocaleString()}</span>
                </div>
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({order.coupon_code})</span>
                    <span className="font-mono">-₹{Number(order.discount_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-gray-900">
                    {Number(order.shipping_cost) === 0 ? "FREE" : `₹${Number(order.shipping_cost)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-gray-900">
                <span className="text-xs">Final Amount Paid</span>
                <span className="text-lg font-mono text-black">₹{Number(order.total).toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400 normal-case font-medium leading-relaxed">
                A confirmation receipt with details has been sent to <strong>{order.email}</strong>. Our courier partner will call you before delivery attempt.
              </div>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-4">
          <Link href="/products">
            <Button className="bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest py-4 px-10 rounded-none flex items-center gap-2 cursor-pointer shadow-sm">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="text-xs font-bold uppercase tracking-widest py-4 px-10 rounded-none border-black hover:bg-black hover:text-white cursor-pointer transition-all">
              Go to Homepage
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Verifying order confirmation...</span>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

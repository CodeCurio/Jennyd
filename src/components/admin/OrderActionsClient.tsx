"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { CheckCircle, Truck, RefreshCcw, Printer, FileText } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  currentFulfillment: string;
  currentPayment: string;
}

export function OrderActionsClient({ orderId, currentFulfillment, currentPayment }: OrderActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const updateStatus = async (field: 'fulfillment_status' | 'payment_status', status: string, successMsg: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: status })
        .eq('id', orderId);

      if (error) throw error;

      addToast({ title: "Success", message: successMsg, type: "success" });
      router.refresh(); // Refresh the page to get the updated status from the server
    } catch (err: any) {
      addToast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const mockPrintAction = (actionName: string) => {
    setIsUpdating(true);
    addToast({ title: "Generating...", message: `Preparing your ${actionName}. Please wait.`, type: "success" });
    setTimeout(() => {
      setIsUpdating(false);
      addToast({ title: "Ready", message: `The ${actionName} is ready for printing.`, type: "success" });
    }, 1500);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      
      {/* Confirm Order (Changes status to processing/packed) */}
      {currentFulfillment === 'pending' && (
        <button 
          onClick={() => updateStatus('fulfillment_status', 'processing', 'Order confirmed and packed.')}
          disabled={isUpdating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" /> Confirm Order
        </button>
      )}

      {/* Mark Shipped */}
      {(currentFulfillment === 'pending' || currentFulfillment === 'processing') && (
        <button 
          onClick={() => updateStatus('fulfillment_status', 'shipped', 'Order marked as shipped.')}
          disabled={isUpdating}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Truck className="w-4 h-4" /> Mark Shipped
        </button>
      )}

      {/* Mock Generate Invoice */}
      <button 
        onClick={() => mockPrintAction('Invoice')}
        disabled={isUpdating}
        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        <FileText className="w-4 h-4" /> Invoice
      </button>

      {/* Mock Print Label */}
      <button 
        onClick={() => mockPrintAction('Shipping Label')}
        disabled={isUpdating}
        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        <Printer className="w-4 h-4" /> Print Label
      </button>

      {/* Refund */}
      {currentPayment === 'paid' && (
        <button 
          onClick={() => updateStatus('payment_status', 'refunded', 'Payment has been refunded.')}
          disabled={isUpdating}
          className="ml-auto bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md text-sm font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCcw className="w-4 h-4" /> Refund
        </button>
      )}

    </div>
  );
}

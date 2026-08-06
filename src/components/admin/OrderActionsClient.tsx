"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { CheckCircle, Truck, RefreshCcw, Printer, FileText, Loader2, X, Navigation } from "lucide-react";

interface OrderActionsProps {
  order: any;
  onUpdate?: () => void;
}

export function OrderActionsClient({ order, onUpdate }: OrderActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  
  // Shipping details state
  const [trackingNumber, setTrackingNumber] = useState(order.metadata?.tracking_number || "");
  const [courier, setCourier] = useState(order.metadata?.courier || "Delhivery");
  const [trackingUrl, setTrackingUrl] = useState(order.metadata?.tracking_url || "");

  const router = useRouter();
  const { addToast } = useToast();

  const currentFulfillment = order.fulfillment_status;
  const currentPayment = order.payment_status;

  const updateStatus = async (field: 'fulfillment_status' | 'payment_status', status: string, successMsg: string, additionalMetadata?: any) => {
    setIsUpdating(true);
    try {
      const updateData: any = { [field]: status };
      
      if (additionalMetadata) {
        updateData.metadata = { ...(order.metadata || {}), ...additionalMetadata };
      }

      const { error } = await supabase.from('orders').update(updateData).eq('id', order.id);
      if (error) throw error;

      addToast({ title: "Success", message: successMsg, type: "success" });
      setShowShippingModal(false);
      if (onUpdate) onUpdate();
      else router.refresh();
    } catch (err: any) {
      addToast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkShipped = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus('fulfillment_status', 'shipped', 'Order marked as shipped with tracking details.', {
      tracking_number: trackingNumber,
      courier: courier,
      tracking_url: trackingUrl
    });
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
    <>
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Confirm Order (Changes status to processing/packed) */}
        {currentFulfillment === 'pending' && (
          <button 
            onClick={() => updateStatus('fulfillment_status', 'processing', 'Order confirmed and packed.')}
            disabled={isUpdating}
            className="bg-neutral-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} 
            Confirm & Pack
          </button>
        )}

        {/* Mark Shipped / Update Tracking */}
        {(currentFulfillment === 'pending' || currentFulfillment === 'processing' || currentFulfillment === 'shipped') && (
          <button 
            onClick={() => setShowShippingModal(true)}
            disabled={isUpdating}
            className={`${currentFulfillment === 'shipped' ? 'bg-neutral-100 text-neutral-900 border-neutral-200' : 'bg-[#D4AF37] text-white border-[#D4AF37] hover:bg-[#b8952c]'} border px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50`}
          >
            <Truck className="w-4 h-4" /> 
            {currentFulfillment === 'shipped' ? 'Update Tracking' : 'Dispatch Order'}
          </button>
        )}

        {/* Mark Delivered */}
        {currentFulfillment === 'shipped' && (
          <button 
            onClick={() => updateStatus('fulfillment_status', 'delivered', 'Order marked as delivered.')}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" /> Mark Delivered
          </button>
        )}

        <div className="h-6 w-px bg-neutral-200 mx-1 hidden sm:block"></div>

        {/* Mock Generate Invoice */}
        <button 
          onClick={() => mockPrintAction('Invoice')}
          disabled={isUpdating}
          className="bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-black px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <FileText className="w-4 h-4" /> Invoice
        </button>

        {/* Mock Print Label */}
        <button 
          onClick={() => mockPrintAction('Shipping Label')}
          disabled={isUpdating}
          className="bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-black px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Printer className="w-4 h-4" /> Label
        </button>

        {/* Refund */}
        {currentPayment === 'paid' && (
          <button 
            onClick={() => updateStatus('payment_status', 'refunded', 'Payment has been refunded.')}
            disabled={isUpdating}
            className="ml-auto bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className="w-4 h-4" /> Refund
          </button>
        )}

      </div>

      {/* Shipping Details Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => !isUpdating && setShowShippingModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 uppercase tracking-widest text-xs flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#D4AF37]" /> Dispatch Details
              </h3>
              <button onClick={() => setShowShippingModal(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleMarkShipped} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Courier Partner *</label>
                <select 
                  required
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] appearance-none"
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="DTDC">DTDC</option>
                  <option value="Shadowfax">Shadowfax</option>
                  <option value="Ecom Express">Ecom Express</option>
                  <option value="India Post">India Post</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Tracking Number / AWB *</label>
                <input 
                  type="text" 
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 1234567890"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Tracking Link (Optional)</label>
                <input 
                  type="url" 
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://track.delhivery.com/..."
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowShippingModal(false)} disabled={isUpdating} className="flex-1 py-3 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} className="flex-1 py-3 bg-[#D4AF37] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#b8952c] transition-colors flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />} 
                  {currentFulfillment === 'shipped' ? 'Update' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

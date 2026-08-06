"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { CheckCircle2, Truck, RefreshCcw, Printer, FileText, Loader2, X, Navigation, Copy, Check, ExternalLink } from "lucide-react";

interface OrderActionsProps {
  order: any;
  onUpdate?: () => void;
}

export function buildAutoTrackingUrl(selectedCourier: string, trackingNum: string): string {
  const num = trackingNum.trim();
  if (!num) return "";

  const c = selectedCourier.toLowerCase();

  // Delhivery Official Package Tracking
  if (c.includes("delhivery")) {
    return `https://www.delhivery.com/track/package/${num}`;
  }

  // Shiprocket Direct Tracking
  if (c.includes("shiprocket")) {
    return `https://shiprocket.co/tracking/${num}`;
  }

  // Blue Dart Official Tracking Page
  if (c.includes("blue dart") || c.includes("bluedart")) {
    return `https://www.bluedart.com/maintracking.html?trackFor=0&waybillNo=${num}`;
  }

  // Shadowfax Official Tracking
  if (c.includes("shadowfax")) {
    return `https://track.shadowfax.in/track/${num}`;
  }

  // Ecom Express Tracking
  if (c.includes("ecom")) {
    return `https://ecomexpress.in/tracking/?awb_field=${num}`;
  }

  // DTDC Official Tracking
  if (c.includes("dtdc")) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp?strTrakNo=${num}`;
  }

  // India Post Tracking
  if (c.includes("india post")) {
    return `https://t.17track.net/en#nums=${num}`;
  }

  // DHL Express Global
  if (c.includes("dhl")) {
    return `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${num}`;
  }

  // FedEx Global
  if (c.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${num}`;
  }

  // Aramex Middle East & Global
  if (c.includes("aramex")) {
    return `https://www.aramex.com/express/track-results-detail?mode=0&num=${num}`;
  }

  // UPS Global & USA
  if (c.includes("ups") && !c.includes("usps")) {
    return `https://www.ups.com/track?tracknum=${num}`;
  }

  // USPS USA
  if (c.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
  }

  // 17TRACK Universal Global Fallback
  return `https://t.17track.net/en#nums=${num}`;
}

export function OrderActionsClient({ order, onUpdate }: OrderActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  
  // Shipping details state
  const [trackingNumber, setTrackingNumber] = useState(order.metadata?.tracking_number || "");
  const [courier, setCourier] = useState(order.metadata?.courier || "Delhivery");
  const [trackingUrl, setTrackingUrl] = useState(order.metadata?.tracking_url || "");

  const router = useRouter();
  const { addToast } = useToast();

  const currentFulfillment = order.fulfillment_status || "pending";
  const currentPayment = order.payment_status || "pending";

  const updateStatus = async (field: 'fulfillment_status' | 'payment_status', status: string, successMsg: string, additionalMetadata?: any) => {
    setIsUpdating(true);
    try {
      const updateData: any = { [field]: status };
      
      if (additionalMetadata) {
        updateData.metadata = { ...(order.metadata || {}), ...additionalMetadata };
      }

      const { error } = await supabase.from('orders').update(updateData).eq('id', order.id);
      if (error) throw error;

      // Trigger email if marked as packed (processing)
      if (field === 'fulfillment_status' && status === 'processing') {
        try {
          await fetch('/api/emails/order-packed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: order.email,
              orderNumber: order.order_number,
              customerName: order.shipping_address?.fullName || 'Valued Customer',
              items: order.order_items || [],
              shippingAddress: order.shipping_address
            })
          });
        } catch (emailErr) {
          console.error("Failed to trigger packed email:", emailErr);
        }
      }

      // Trigger email if marked as shipped
      if (field === 'fulfillment_status' && status === 'shipped') {
        try {
          const finalUrl = additionalMetadata?.tracking_url || buildAutoTrackingUrl(additionalMetadata?.courier || courier, additionalMetadata?.tracking_number || trackingNumber);
          await fetch('/api/emails/order-shipped', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: order.email,
              orderNumber: order.order_number,
              customerName: order.shipping_address?.fullName || 'Valued Customer',
              trackingUrl: finalUrl,
              trackingId: additionalMetadata?.tracking_number || trackingNumber
            })
          });
        } catch (emailErr) {
          console.error("Failed to trigger shipped email:", emailErr);
        }
      }

      addToast({ title: "Order Updated", message: successMsg, type: "success" });
      setShowShippingModal(false);
      if (onUpdate) onUpdate();
      else router.refresh();
    } catch (err: any) {
      addToast({ title: "Update Failed", message: err.message, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkShipped = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTrackingUrl = trackingUrl.trim() || buildAutoTrackingUrl(courier, trackingNumber);

    updateStatus('fulfillment_status', 'shipped', `Order marked as Shipped via ${courier}. Email notification dispatched to customer!`, {
      tracking_number: trackingNumber,
      courier: courier,
      tracking_url: finalTrackingUrl
    });
  };

  const handlePrint = (type: 'invoice' | 'label') => {
    window.print();
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopiedId(true);
    addToast({ title: "Copied!", message: `Order #${order.order_number} copied to clipboard.`, type: "success" });
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 p-3 sm:p-4 shadow-2xs space-y-3">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Fulfillment Status:</span>
            <select
              value={currentFulfillment}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "shipped") {
                  setShowShippingModal(true);
                } else {
                  updateStatus('fulfillment_status', val, `Fulfillment status changed to ${val.toUpperCase()}.`);
                }
              }}
              disabled={isUpdating}
              className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border border-neutral-200 bg-neutral-50 hover:border-neutral-300 text-neutral-900 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            >
              <option value="pending">🟡 Unfulfilled / Pending</option>
              <option value="processing">📦 Confirmed & Packed</option>
              <option value="shipped">🚚 Shipped & Dispatched</option>
              <option value="delivered">✅ Delivered</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyOrderId}
              className="px-2.5 py-1 text-[11px] font-semibold text-neutral-600 hover:text-black bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              <span>{copiedId ? "Copied" : "Copy Order ID"}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Dispatch Button */}
          <button 
            onClick={() => setShowShippingModal(true)}
            disabled={isUpdating}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952c] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 disabled:opacity-50"
          >
            <Truck className="w-3.5 h-3.5" /> 
            <span>{currentFulfillment === 'shipped' ? 'Update Tracking' : 'Dispatch Order'}</span>
          </button>

          {/* Quick Mark Delivered */}
          {currentFulfillment === 'shipped' && (
            <button 
              onClick={() => updateStatus('fulfillment_status', 'delivered', 'Order marked as delivered.')}
              disabled={isUpdating}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> 
              <span>Mark Delivered</span>
            </button>
          )}

          {/* Print Invoice */}
          <button 
            onClick={() => handlePrint('invoice')}
            disabled={isUpdating}
            className="px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-500" /> 
            <span>Invoice</span>
          </button>

          {/* Print Label */}
          <button 
            onClick={() => handlePrint('label')}
            disabled={isUpdating}
            className="px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" /> 
            <span>Shipping Label</span>
          </button>

          {/* Payment Refund Toggle */}
          {currentPayment === 'paid' && (
            <button 
              onClick={() => updateStatus('payment_status', 'refunded', 'Payment marked as refunded.')}
              disabled={isUpdating}
              className="ml-auto px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-red-500" /> 
              <span>Refund Payment</span>
            </button>
          )}

        </div>

      </div>

      {/* Shipping / Dispatch Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={() => !isUpdating && setShowShippingModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">Dispatch & Tracking Details</h3>
                  <p className="text-[10px] text-neutral-500 font-mono">Order #{order.order_number}</p>
                </div>
              </div>
              <button onClick={() => setShowShippingModal(false)} className="p-1 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleMarkShipped} className="p-5 space-y-4">
              
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">Courier Partner *</label>
                <select 
                  required
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                >
                  <optgroup label="🇮🇳 Domestic Couriers (India)">
                    <option value="Delhivery">Delhivery</option>
                    <option value="Shiprocket">Shiprocket</option>
                    <option value="Blue Dart">Blue Dart</option>
                    <option value="DTDC">DTDC</option>
                    <option value="Shadowfax">Shadowfax</option>
                    <option value="Ecom Express">Ecom Express</option>
                    <option value="India Post">India Post</option>
                  </optgroup>
                  <optgroup label="🌍 International Couriers (Worldwide)">
                    <option value="DHL Express">DHL Express (Global)</option>
                    <option value="FedEx">FedEx (Global)</option>
                    <option value="Aramex">Aramex (Global / Middle East)</option>
                    <option value="UPS">UPS (Global / USA)</option>
                    <option value="USPS">USPS (USA)</option>
                    <option value="17TRACK Universal">17TRACK (Universal Global)</option>
                  </optgroup>
                  <optgroup label="✏️ Custom">
                    <option value="Custom Direct Link">Custom Direct Link</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1">Tracking Number / AWB *</label>
                <input 
                  type="text" 
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DLH12345678 or 9876543210"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Tracking Link (Auto-Generated if empty)</label>
                  {trackingNumber && (
                    <button
                      type="button"
                      onClick={() => setTrackingUrl(buildAutoTrackingUrl(courier, trackingNumber))}
                      className="text-[10px] text-[#D4AF37] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" /> Auto-fill Link
                    </button>
                  )}
                </div>
                <input 
                  type="url" 
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder={buildAutoTrackingUrl(courier, trackingNumber || "AWB123") || "https://..."}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
                <p className="text-[10px] text-neutral-400 mt-1">Direct link sent to customer email for live package tracking.</p>
              </div>

              <div className="pt-3 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowShippingModal(false)} 
                  disabled={isUpdating} 
                  className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating} 
                  className="flex-1 py-2.5 bg-[#D4AF37] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#b8952c] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />} 
                  <span>{currentFulfillment === 'shipped' ? 'Update & Email' : 'Dispatch & Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

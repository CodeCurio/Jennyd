"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Truck, ClipboardList, Loader2, ArrowRight, ShieldCheck, CheckCircle, Package } from "lucide-react";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { useCurrency } from "@/lib/store/CurrencyContext";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, appliedCoupon, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const [activeStep, setActiveStep] = useState<Step>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string } | null>(null);
  const orderPlacedRef = useRef(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form State - Shipping Info
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

  // Terms agreement
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Check auth user session on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        setEmail(session.user.email || "");
      }
    };
    checkUser();
  }, []);

  // Redirect if cart is empty on mount (but not after order placement)
  useEffect(() => {
    if (items.length === 0 && !isSubmitting && !orderPlacedRef.current) {
      router.push("/products");
    }
  }, [items, router, isSubmitting]);

  // Derived costs
  const baseShippingCost = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const shippingCost = shippingMethod === "express" ? 150 : baseShippingCost;
  const grandTotal = subtotal - discount + shippingCost;

  // Form Validations
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !addressLine1 || !city || !state || !zip || !phone) {
      addToast({ title: "Validation Error", message: "Please fill out all required fields.", type: "error" });
      return;
    }
    setActiveStep("payment");
  };

  // Helper to load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep("review");
  };

  // Save order to database helper
  const saveOrderToDatabase = async (orderNumber: string, razorpayPaymentId?: string, razorpayOrderId?: string) => {
    const fullAddress = {
      fullName: `${firstName} ${lastName}`,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      phone,
      country: "India"
    };

    if (userId && email) {
      const profileRes = await fetch("/api/profile/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, fullName: `${firstName} ${lastName}`, phone })
      });
      if (!profileRes.ok) {
        const profileErrData = await profileRes.json();
        throw new Error(profileErrData.error || "Failed to sync user profile");
      }
    }

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          user_id: userId,
          email,
          shipping_address: fullAddress,
          billing_address: fullAddress,
          shipping_method: shippingMethod === "express" ? "Express Delivery" : "Standard Delivery",
          shipping_cost: shippingCost,
          subtotal: subtotal,
          discount_amount: discount,
          tax_amount: 0,
          total: grandTotal,
          coupon_code: appliedCoupon ? appliedCoupon.code : null,
          payment_status: paymentMethod === "cod" ? "pending" : "paid",
          fulfillment_status: "pending",
          metadata: razorpayPaymentId ? { razorpay_payment_id: razorpayPaymentId, razorpay_order_id: razorpayOrderId } : null
        }
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error(orderError?.message || "Failed to create order");
    }

    const orderItemsPayload = items.map((item) => {
      const cleanProductId = item.productId.substring(0, 36);
      const sizeInfo = item.productId.length > 36 ? item.productId.substring(37) : "100ml";
      return {
        order_id: orderData.id,
        product_id: cleanProductId,
        variant_id: item.variantId || null,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.price,
        line_total: item.price * item.quantity,
        variant_info: { size: sizeInfo }
      };
    });

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
    if (itemsError) throw new Error(itemsError.message);

    if (appliedCoupon) {
      await supabase.from("coupons").update({ times_used: (appliedCoupon.times_used || 0) + 1 }).eq("id", appliedCoupon.id);
    }

    orderPlacedRef.current = true;
    clearCart();
    setOrderSuccess({ orderNumber });

    setTimeout(() => {
      router.push(`/checkout/success?orderNumber=${orderNumber}`);
    }, 2500);
  };

  // Main Order Placement Action
  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      addToast({ title: "Required Check", message: "Please agree to the Terms & Conditions.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    const orderNumber = `JD-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      if (paymentMethod === "online") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
        }

        // 1. Create Razorpay order on server
        const createOrderRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grandTotal, receipt: orderNumber })
        });
        const createOrderData = await createOrderRes.json();
        if (!createOrderData.success || !createOrderData.order) {
          throw new Error(createOrderData.error || "Failed to initialize Razorpay payment");
        }

        const razorpayOrder = createOrderData.order;

        // 2. Open Razorpay Checkout Modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Jennyd Parfums",
          description: `Order #${orderNumber}`,
          image: "/logo.png",
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
              // 3. Verify Payment Signature
              const verifyRes = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response)
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                await saveOrderToDatabase(orderNumber, response.razorpay_payment_id, response.razorpay_order_id);
              } else {
                throw new Error(verifyData.error || "Payment verification failed.");
              }
            } catch (vErr: any) {
              addToast({ title: "Payment Failed", message: vErr.message, type: "error" });
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: `${firstName} ${lastName}`,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#1A1A1A",
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              addToast({ title: "Payment Cancelled", message: "Razorpay payment window closed.", type: "error" });
            }
          }
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.open();
      } else {
        // Cash on Delivery
        await saveOrderToDatabase(orderNumber);
      }
    } catch (err: any) {
      addToast({ title: "Order Placement Failed", message: err.message || "Something went wrong.", type: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ─── Order Success Overlay ─── */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ animation: "fadeIn 0.3s ease-out" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 text-center" style={{ animation: "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
            {/* Animated Check Circle */}
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6" style={{ animation: "popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
              <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: "drawCheck 0.5s ease-out 0.5s forwards" }} />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ animation: "fadeUp 0.4s ease-out 0.4s both" }}>
              Order Placed Successfully!
            </h2>
            <p className="text-gray-500 text-sm mb-6" style={{ animation: "fadeUp 0.4s ease-out 0.5s both" }}>
              Your order <span className="font-bold text-gray-900 font-mono">#{orderSuccess.orderNumber}</span> has been confirmed.
            </p>

            {/* Mini info cards */}
            <div className="flex gap-3 justify-center mb-6" style={{ animation: "fadeUp 0.4s ease-out 0.6s both" }}>
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">Preparing your order</span>
              </div>
            </div>

            <p className="text-xs text-gray-400" style={{ animation: "fadeUp 0.4s ease-out 0.7s both" }}>
              Redirecting to order details...
            </p>

            {/* Animated progress bar */}
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden" style={{ animation: "fadeUp 0.4s ease-out 0.7s both" }}>
              <div className="h-full bg-green-500 rounded-full" style={{ animation: "progressBar 2.5s linear forwards" }} />
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes popIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
            @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes drawCheck { to { stroke-dashoffset: 0; } }
            @keyframes progressBar { from { width: 0%; } to { width: 100%; } }
          `}</style>
        </div>
      )}

    <div className="bg-[#fcfaf8] min-h-screen py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Step Indicator Headers */}
        <div className="flex justify-center items-center gap-4 mb-12 max-w-lg mx-auto text-xs font-bold uppercase tracking-wider text-gray-400">
          <button 
            disabled={activeStep === "shipping"} 
            onClick={() => setActiveStep("shipping")}
            className={`flex items-center gap-1.5 pb-2 border-b-2 transition-all cursor-pointer ${
              activeStep === "shipping" ? "text-black border-black" : "text-gray-900 border-transparent hover:text-black"
            }`}
          >
            <Truck className="w-4 h-4" /> 1. Shipping
          </button>
          
          <span className="text-gray-300">/</span>

          <button 
            disabled={activeStep === "shipping" || activeStep === "payment"} 
            onClick={() => setActiveStep("payment")}
            className={`flex items-center gap-1.5 pb-2 border-b-2 transition-all cursor-pointer ${
              activeStep === "payment" ? "text-black border-black" : 
              activeStep === "review" ? "text-gray-900 border-transparent hover:text-black" : "text-gray-300 border-transparent cursor-not-allowed"
            }`}
          >
            <CreditCard className="w-4 h-4" /> 2. Payment
          </button>

          <span className="text-gray-300">/</span>

          <span className={`flex items-center gap-1.5 pb-2 border-b-2 ${
            activeStep === "review" ? "text-black border-black" : "text-gray-300 border-transparent"
          }`}>
            <ClipboardList className="w-4 h-4" /> 3. Review
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left Column: Form Fields (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Shipping Info */}
            {activeStep === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="bg-white border border-gray-100 rounded-lg p-6 md:p-8 shadow-xs space-y-6 text-xs font-bold uppercase tracking-wider text-gray-500">
                <h2 className="text-lg font-serif text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">
                  Shipping Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black lowercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    placeholder="Street address, P.O. Box"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black normal-case"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit, building"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black normal-case"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-black font-mono"
                    />
                  </div>
                </div>

                {/* Shipping Method Selector */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="text-sm font-serif text-gray-900 uppercase tracking-widest">Shipping Method</h3>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${
                      shippingMethod === "standard" ? "border-black bg-gray-50/50" : "border-gray-200 bg-white"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_radio"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                        <div>
                          <span className="text-gray-900 font-bold block">Standard Delivery</span>
                          <span className="text-[10px] text-gray-450 lowercase font-medium tracking-normal block mt-0.5">3-5 Business Days</span>
                        </div>
                      </div>
                      <span className="font-mono text-gray-950 font-bold">
                        {baseShippingCost === 0 ? "FREE" : formatPrice(baseShippingCost)}
                      </span>
                    </label>

                    <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${
                      shippingMethod === "express" ? "border-black bg-gray-50/50" : "border-gray-200 bg-white"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_radio"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className="w-4 h-4 accent-black cursor-pointer"
                        />
                        <div>
                          <span className="text-gray-900 font-bold block">Express Delivery</span>
                          <span className="text-[10px] text-gray-450 lowercase font-medium tracking-normal block mt-0.5">1-2 Business Days</span>
                        </div>
                      </div>
                      <span className="font-mono text-gray-950 font-bold">{formatPrice(150)}</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-none flex items-center gap-1.5">
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

              </form>
            )}

            {/* Step 2: Payment Selector */}
            {activeStep === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="bg-white border border-gray-100 rounded-lg p-6 md:p-8 shadow-xs space-y-6 text-xs font-bold uppercase tracking-wider text-gray-500">
                <h2 className="text-lg font-serif text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  
                  {/* Option 1: Razorpay Online Payment */}
                  <label className={`flex items-start gap-3.5 p-5 border rounded cursor-pointer transition-all ${
                    paymentMethod === "online" ? "border-black bg-gray-50/50 shadow-xs" : "border-gray-200 bg-white"
                  }`}>
                    <input
                      type="radio"
                      name="payment_radio"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="w-4 h-4 accent-black cursor-pointer mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-bold block text-sm">Online Payment (Razorpay Secure)</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded uppercase">Recommended</span>
                      </div>
                      <span className="text-[11px] text-gray-500 lowercase font-medium tracking-normal block mt-1 leading-normal">
                        Instant payment via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Netbanking & Wallets.
                      </span>
                    </div>
                  </label>

                  {/* Option 2: COD */}
                  <label className={`flex items-start gap-3.5 p-5 border rounded cursor-pointer transition-all ${
                    paymentMethod === "cod" ? "border-black bg-gray-50/50 shadow-xs" : "border-gray-200 bg-white"
                  }`}>
                    <input
                      type="radio"
                      name="payment_radio"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 accent-black cursor-pointer mt-0.5"
                    />
                    <div>
                      <span className="text-gray-900 font-bold block text-sm">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-gray-500 lowercase font-medium tracking-normal block mt-1 leading-normal">
                        Pay cash upon physical delivery at your doorstep.
                      </span>
                    </div>
                  </label>

                </div>

                <div className="pt-4 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep("shipping")}
                    className="py-3 px-6 border border-gray-250 hover:bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-600 transition-all cursor-pointer rounded-none"
                  >
                    ← Back
                  </button>
                  <Button type="submit" className="bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-none flex items-center gap-1.5">
                    Continue to Review <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Order Review */}
            {activeStep === "review" && (
              <div className="bg-white border border-gray-100 rounded-lg p-6 md:p-8 shadow-xs space-y-6 text-xs font-bold uppercase tracking-wider text-gray-500">
                <h2 className="text-lg font-serif text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">
                  Review Your Order
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                  <div className="space-y-2 border border-gray-100 p-4 rounded bg-gray-50/50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Shipping Details</span>
                    <p className="font-bold text-gray-950">{firstName} {lastName}</p>
                    <p className="text-[11px] font-medium text-gray-650 leading-relaxed font-sans normal-case">
                      {addressLine1}, {addressLine2 ? `${addressLine2}, ` : ""}{city}, {state} - {zip}
                    </p>
                    <p className="text-[11px] font-medium text-gray-600 font-mono">Ph: {phone}</p>
                    <p className="text-[11px] font-medium text-gray-600 lowercase">{email}</p>
                  </div>

                  <div className="space-y-2 border border-gray-100 p-4 rounded bg-gray-50/50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Shipping & Payment Methods</span>
                    <div className="space-y-1 font-bold text-gray-900">
                      <p>Method: {shippingMethod === "express" ? "Express Delivery" : "Standard Delivery"}</p>
                      <p className="font-sans lowercase font-normal text-[11px] text-gray-500">
                        {shippingMethod === "express" ? "1-2 Business Days" : "3-5 Business Days"}
                      </p>
                      <p className="pt-2 border-t border-gray-200 mt-2">
                        Payment: {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div className="pt-4 border-t border-gray-100 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4.5 h-4.5 accent-black cursor-pointer rounded border-gray-300 text-black focus:ring-black mt-0.5"
                  />
                  <label htmlFor="agreeTerms" className="text-[11px] text-gray-500 font-medium normal-case select-none cursor-pointer leading-relaxed">
                    I agree to the <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>, and authorize charge/collection on delivery for this order.
                  </label>
                </div>

                <div className="pt-4 flex justify-between gap-4 border-t border-gray-100">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setActiveStep("payment")}
                    className="py-3 px-6 border border-gray-255 hover:bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-600 transition-all cursor-pointer rounded-none disabled:opacity-50"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || !agreeTerms}
                    className="bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest py-3.5 px-10 rounded-none flex items-center justify-center gap-2 cursor-pointer transition-all disabled:bg-gray-300 disabled:cursor-not-allowed min-w-[180px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order ({formatPrice(grandTotal)}) <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Checkout Summary Panel (1/3 width) */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-xs space-y-6 sticky top-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-1.5">
              Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
            </h3>

            {/* Scrollable list of items */}
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3.5 items-center">
                  <div className="relative w-12 h-15 bg-gray-50 border border-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[11px] text-gray-900 block truncate uppercase tracking-wide leading-tight">
                      {item.title}
                    </span>
                    {item.variantInfo && (
                      <span className="text-[9px] text-gray-400 block uppercase tracking-wider font-semibold mt-0.5">
                        Size: {item.variantInfo}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                      {item.quantity}x {formatPrice(item.price)}
                    </span>
                  </div>
                  <span className="font-bold text-xs font-mono text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal calculation */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs uppercase tracking-wider font-semibold text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-mono">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-gray-900">
                  {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                </span>
              </div>
            </div>

            {/* Total calculation */}
            <div className="border-t border-gray-150 pt-4 flex justify-between items-baseline font-bold uppercase tracking-wider text-gray-900">
              <span className="text-xs">Total to pay</span>
              <span className="text-lg font-mono">{formatPrice(grandTotal)}</span>
            </div>

            {/* Security seal */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Secure Luxury Checkout
            </div>

          </div>

        </div>

      </div>
    </div>
    </>
  );
}

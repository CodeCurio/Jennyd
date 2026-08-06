"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  ArrowRight, 
  Lock, 
  MapPin, 
  ChevronRight, 
  ShoppingBag,
  ArrowLeft,
  Check,
  ShieldCheck,
  Globe
} from "lucide-react";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { useCurrency } from "@/lib/store/CurrencyContext";

type Step = "shipping" | "payment" | "review";

const POPULAR_COUNTRIES = [
  "India",
  "United States",
  "United Arab Emirates",
  "United Kingdom",
  "Canada",
  "Australia",
  "Saudi Arabia",
  "Singapore",
  "Germany",
  "France",
  "Qatar",
  "Oman",
  "Kuwait",
  "Bahrain",
  "Other Country"
];

const COUNTRY_STATES: Record<string, string[]> = {
  "India": [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Delhi (NCT)", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ],
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming"
  ],
  "United Arab Emirates": [
    "Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"
  ],
  "United Kingdom": [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
  "Canada": [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
    "Newfoundland and Labrador", "Nova Scotia", "Ontario", 
    "Prince Edward Island", "Quebec", "Saskatchewan"
  ],
  "Australia": [
    "New South Wales", "Victoria", "Queensland", "Western Australia", 
    "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
  ],
  "Saudi Arabia": [
    "Riyadh", "Makkah", "Madinah", "Eastern Province", "Asir", "Tabuk", "Qassim"
  ],
  "Singapore": ["Central Region", "East Region", "North Region", "North-East Region", "West Region"],
  "Germany": [
    "Bavaria", "Baden-Württemberg", "North Rhine-Westphalia", "Hesse", "Saxony", "Berlin", "Hamburg"
  ],
  "France": [
    "Île-de-France", "Auvergne-Rhône-Alpes", "Provence-Alpes-Côte d'Azur", "Nouvelle-Aquitaine", "Occitanie"
  ],
  "Qatar": ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor"],
  "Oman": ["Muscat", "Dhofar", "Al Batinah", "Al Dakhiliyah"],
  "Kuwait": ["Al Asimah", "Hawalli", "Farwaniya", "Ahmadi"],
  "Bahrain": ["Capital", "Muharraq", "Northern", "Southern"]
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, appliedCoupon, clearCart } = useCart();
  const { formatPrice, rates } = useCurrency();
  const { addToast } = useToast();

  const [activeStep, setActiveStep] = useState<Step>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orderPlacedRef = useRef(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Form State - Shipping Info
  const [country, setCountry] = useState("India");
  const [customCountry, setCustomCountry] = useState("");
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
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const isOtherCountry = country === "Other Country";
  const finalCountryName = isOtherCountry ? customCountry.trim() : country;
  const availableStates = COUNTRY_STATES[country] || [];

  // Check auth user session on mount; require login to proceed
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        setEmail(session.user.email || "");
        setIsCheckingAuth(false);
      } else {
        addToast({ title: "Sign In Required", message: "Please log in or create an account to proceed with checkout and enable order tracking.", type: "error" });
        router.push("/account/login?next=/checkout");
      }
    };
    checkUser();
  }, [router, addToast]);

  // Update state defaults when country changes
  useEffect(() => {
    if (availableStates.length > 0) {
      if (!availableStates.includes(state)) {
        setState(availableStates[0]);
      }
    } else if (isOtherCountry) {
      setState("");
    }
  }, [country]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting && !orderPlacedRef.current) {
      const timer = setTimeout(() => {
        router.push("/products");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [items, router, isSubmitting]);

  // Derived costs
  const usdRate = rates["USD"] || 0.012;
  const internationalShippingCost = subtotal === 0 ? 0 : Math.round(10 / usdRate);
  const isIndia = finalCountryName === "India";
  const baseShippingCost = isIndia ? 0 : internationalShippingCost;
  const shippingCost = (isIndia && shippingMethod === "express") ? 150 : baseShippingCost;
  const grandTotal = subtotal - discount + shippingCost;

  // Form Validation
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOtherCountry && !customCountry.trim()) {
      addToast({ title: "Country Required", message: "Please enter your country name.", type: "error" });
      return;
    }
    if (!email || !firstName || !lastName || !addressLine1 || !city || !state || !zip || !phone) {
      addToast({ title: "Required Fields Missing", message: "Please complete all mandatory address fields.", type: "error" });
      return;
    }
    setActiveStep("payment");
  };

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

  const saveOrderToDatabase = async (orderNumber: string, razorpayPaymentId?: string, razorpayOrderId?: string) => {
    const fullAddress = {
      fullName: `${firstName} ${lastName}`,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      phone,
      country: finalCountryName
    };

    if (userId && email) {
      await fetch("/api/profile/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, fullName: `${firstName} ${lastName}`, phone })
      });
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

    setTimeout(() => {
      router.push(`/checkout/success?orderNumber=${orderNumber}`);
    }, 2000);
  };

  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      addToast({ title: "Terms Agreement Required", message: "Please agree to the Terms of Sale to proceed.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    const orderNumber = `JD-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      if (paymentMethod === "online") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Razorpay SDK failed to load.");
        }

        const cleanPhone = phone.replace(/\D/g, "").slice(-10);
        const createOrderRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grandTotal, receipt: orderNumber })
        });
        const createOrderData = await createOrderRes.json();
        if (!createOrderData.success || !createOrderData.order) {
          throw new Error(createOrderData.error || "Failed to initialize payment");
        }

        const razorpayOrder = createOrderData.order;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || "INR",
          name: "Jennyd Parfums",
          description: `Order #${orderNumber}`,
          image: "/logo.png",
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
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
            contact: cleanPhone ? `+91${cleanPhone}` : phone,
          },
          theme: { color: "#1A1A1A" },
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
        await saveOrderToDatabase(orderNumber);
      }
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Order Failed", message: err.message || "Something went wrong.", type: "error" });
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex flex-col items-center justify-center gap-3 font-sans text-neutral-800">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Securing checkout & verifying account...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen font-sans text-neutral-900 pb-24">
      
      {/* Minimal Luxury Header */}
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#1A1A1A]">
            JENNYD PARFUMS
          </Link>
          
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Clean Stepper Breadcrumb */}
      <div className="bg-white border-b border-neutral-200/60 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs font-medium text-neutral-400 overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link href="/products" className="hover:text-black">Bag</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <button 
            onClick={() => setActiveStep("shipping")}
            className={activeStep === "shipping" ? "text-neutral-900 font-bold" : "hover:text-black"}
          >
            1. Address
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <button 
            onClick={() => { if (email && firstName && addressLine1) setActiveStep("payment"); }}
            className={activeStep === "payment" ? "text-neutral-900 font-bold" : "hover:text-black"}
          >
            2. Shipping & Payment
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <span className={activeStep === "review" ? "text-neutral-900 font-bold" : ""}>
            3. Review Order
          </span>
        </div>
      </div>

      {/* Mobile Drawer Trigger */}
      <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3">
        <button
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>{isMobileSummaryOpen ? "Hide Order Summary" : "Show Order Summary"}</span>
          </span>
          <span className="font-bold text-[#1A1A1A]">{formatPrice(grandTotal)}</span>
        </button>

        {isMobileSummaryOpen && (
          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-xs">
                <span className="text-neutral-700 font-medium truncate max-w-[200px]">{item.title} (x{item.quantity})</span>
                <span className="font-semibold text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column (7 Cols) */}
          <div className="lg:col-span-7">
            
            {/* STEP 1: Address */}
            {activeStep === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-5">
                <h2 className="text-lg sm:text-xl font-serif text-[#1A1A1A] font-semibold border-b border-neutral-100 pb-3">
                  Shipping & Contact Address
                </h2>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* Address Lines */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat, House no., Building, Street"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">Apartment, Suite (Optional)</label>
                    <input
                      type="text"
                      placeholder="Apartment or suite number"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* Country Dropdown & Custom Country Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-700 block">Country / Region *</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (e.target.value !== "India") {
                          setShippingMethod("standard");
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none cursor-pointer"
                    >
                      {POPULAR_COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-neutral-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* If user picks "Other Country", show custom country text field */}
                  {isOtherCountry && (
                    <div className="pt-1">
                      <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Specify Country Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your Country Name (e.g. Japan, Italy, New Zealand)"
                        value={customCountry}
                        onChange={(e) => setCustomCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-amber-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  )}
                </div>

                {/* City, State & Zip Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  {/* State Select or Custom Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">State / Region *</label>
                    {availableStates.length > 0 ? (
                      <div className="relative">
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none cursor-pointer"
                        >
                          {availableStates.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        required
                        placeholder="State / Region"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700 block">Postal / ZIP Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                  >
                    <span>Continue to Shipping & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: Delivery & Payment Options */}
            {activeStep === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6">
                <h2 className="text-lg sm:text-xl font-serif text-[#1A1A1A] font-semibold border-b border-neutral-100 pb-3">
                  Delivery Speed & Payment Method
                </h2>

                {/* Delivery Options */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
                    Select Delivery Option
                  </span>
                  
                  <div className="space-y-2.5">
                    {isIndia ? (
                      <>
                        <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                          shippingMethod === "standard" 
                            ? "border-neutral-900 bg-neutral-50 shadow-xs" 
                            : "border-neutral-200 bg-white hover:border-neutral-300"
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
                              <span className="text-xs sm:text-sm font-bold text-neutral-900 block">Standard Delivery</span>
                              <span className="text-[11px] text-neutral-500 block">Delivered in 3–5 business days</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            FREE
                          </span>
                        </label>

                        <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                          shippingMethod === "express" 
                            ? "border-neutral-900 bg-neutral-50 shadow-xs" 
                            : "border-neutral-200 bg-white hover:border-neutral-300"
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
                              <span className="text-xs sm:text-sm font-bold text-neutral-900 block">Priority Air Express</span>
                              <span className="text-[11px] text-neutral-500 block">Dispatch within 12 hours • 1–2 business days</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-neutral-900">
                            {formatPrice(150)}
                          </span>
                        </label>
                      </>
                    ) : (
                      <label className="flex items-center justify-between p-4 rounded-xl border border-neutral-900 bg-neutral-50 cursor-default">
                        <div className="flex items-center gap-3">
                          <input type="radio" checked readOnly className="w-4 h-4 accent-black" />
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-neutral-900 block">International Tracked Airmail</span>
                            <span className="text-[11px] text-neutral-500 block">7–12 business days delivery</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-neutral-900">{formatPrice(baseShippingCost)}</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
                    Select Payment Method
                  </span>

                  <div className="space-y-2.5">
                    
                    <label className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === "online" 
                        ? "border-neutral-900 bg-neutral-50 shadow-xs" 
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}>
                      <input
                        type="radio"
                        name="payment_radio"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="w-4 h-4 accent-black mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 block">Online Payment (Razorpay Secure)</span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Pay safely via UPI (GPay, PhonePe, Paytm, BHIM), Cards or NetBanking.
                        </p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === "cod" 
                        ? "border-neutral-900 bg-neutral-50 shadow-xs" 
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}>
                      <input
                        type="radio"
                        name="payment_radio"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="w-4 h-4 accent-black mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 block">Cash on Delivery (COD)</span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Pay cash to courier partner at delivery.
                        </p>
                      </div>
                    </label>

                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep("shipping")}
                    className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <Button 
                    type="submit" 
                    className="bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

              </form>
            )}

            {/* STEP 3: Final Review */}
            {activeStep === "review" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs space-y-6">
                <h2 className="text-lg sm:text-xl font-serif text-[#1A1A1A] font-semibold border-b border-neutral-100 pb-3">
                  Review & Complete Order
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">Shipping To</span>
                      <button onClick={() => setActiveStep("shipping")} className="text-[10px] text-neutral-600 font-semibold hover:underline cursor-pointer">Change</button>
                    </div>
                    <p className="font-semibold text-neutral-800">{firstName} {lastName}</p>
                    <p className="text-neutral-500">{addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}</p>
                    <p className="text-neutral-500">{city}, {state} - {zip}</p>
                    <p className="text-neutral-500">{finalCountryName} • {phone}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">Payment Method</span>
                      <button onClick={() => setActiveStep("payment")} className="text-[10px] text-neutral-600 font-semibold hover:underline cursor-pointer">Change</button>
                    </div>
                    <p className="font-semibold text-neutral-800">
                      {paymentMethod === "online" ? "Online Payment (Razorpay)" : "Cash on Delivery (COD)"}
                    </p>
                    <p className="text-neutral-500">
                      Speed: {shippingMethod === "express" ? "Priority Express" : "Standard Delivery"}
                    </p>
                  </div>

                </div>

                {/* Terms Agreement */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 accent-black mt-0.5 rounded cursor-pointer shrink-0"
                    />
                    <span className="text-neutral-600 leading-relaxed font-light">
                      I confirm that my shipping details are correct and agree to the <Link href="/terms" className="underline font-medium text-black">Terms of Sale</Link>.
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep("payment")}
                    className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || !agreeTerms}
                    className={`text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98 ${
                      !agreeTerms || isSubmitting 
                        ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                        : "bg-[#1A1A1A] hover:bg-black text-white shadow-lg"
                    }`}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" /> Processing...</>
                    ) : (
                      <><span>PLACE ORDER ({formatPrice(grandTotal)})</span> <ArrowRight className="w-4 h-4 text-[#D4AF37]" /></>
                    )}
                  </Button>
                </div>

              </div>
            )}

          </div>

          {/* Right Summary Column (5 Cols) */}
          <div className="lg:col-span-5 hidden lg:block sticky top-20">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-5">
              
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">Order Summary</h3>
                <span className="text-xs font-semibold text-neutral-400">{items.length} Item{items.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-white rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                      <Image src={item.image} alt={item.title} fill unoptimized className="object-cover p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-semibold text-xs text-[#1A1A1A] truncate">{item.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation Table */}
              <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-bold">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-neutral-900">
                    {shippingCost === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              {/* Grand Total Bar */}
              <div className="pt-3 border-t border-neutral-200 flex items-baseline justify-between text-[#1A1A1A]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">Total Amount</span>
                  <span className="text-[10px] text-neutral-400 font-light">Taxes & shipping included</span>
                </div>
                <span className="text-xl font-serif font-bold">{formatPrice(grandTotal)}</span>
              </div>

              {/* Minimal Luxury Guarantees */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1 text-[11px] text-neutral-600 font-light">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sealed original packaging guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>24-Hour express dispatch</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Full-screen Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mb-4" />
            <h3 className="text-xl font-serif tracking-wide mb-1">Processing Your Order...</h3>
            <p className="text-xs text-neutral-300 font-sans max-w-xs">
              Please wait a moment while we process your request safely.
            </p>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

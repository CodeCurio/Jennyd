"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, Ticket, ArrowRight, ShoppingBag, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck, Check } from "lucide-react";
import { useCart } from "@/lib/store/CartContext";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/lib/store/CurrencyContext";
import { getProductVariantInfo } from "@/lib/utils";

const QUICK_NAV = [
  { label: "Bestsellers", href: "/products?sort=best-selling" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "All Perfumes", href: "/products" },
];

const FREE_SHIPPING_THRESHOLD = 2000;

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon,
    addItem,
  } = useCart();
  const { formatPrice, currency, rates } = useCurrency();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch recommended products for cart page
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, slug, price, sale_price, metadata")
          .limit(8);
        if (!error && data) {
          setRecommendations(
            data.map((p: any) => ({
              ...p,
              image: p.metadata?.images?.[0] || "/assets/placeholder.jpg",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };
    fetchRecommendations();
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplying(true);
    setCouponError("");
    const result = await applyCoupon(couponInput);
    setIsApplying(false);

    if (result.success) {
      setCouponInput("");
    } else {
      setCouponError(result.message);
    }
  };

  const scrollCarousel = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const usdRate = rates["USD"] || 0.012;
  const shippingCost = currency === "INR" || subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : Math.round(10 / usdRate);
  const grandTotal = subtotal - discount + shippingCost;

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="border-b border-[#EAE7E1] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold font-sans block mb-1">
              Your Selection
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif text-[#121212] uppercase tracking-wider">
              Shopping Cart
            </h1>
          </div>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-[#121212] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 border-b border-[#121212] pb-1 hover:border-[#D4AF37] self-start sm:self-auto">
            ← Continue Browsing
          </Link>
        </div>

        {/* Free Express Shipping Banner Across India */}
        {items.length > 0 && (
          <div className="mb-8 bg-emerald-50/90 border border-emerald-200 p-4 sm:p-4.5 rounded-2xl shadow-2xs flex items-center gap-3">
            <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div className="flex-1 text-xs sm:text-sm font-semibold text-emerald-950">
              <span>FREE Express Delivery Across India on All Orders</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
              100% Free Shipping
            </span>
          </div>
        )}

        {items.length === 0 ? (
          /* =================== PREMIUM EMPTY CART STATE =================== */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-[#EAE7E1] p-10 sm:p-16 text-center rounded-2xl shadow-sm">
              <div className="w-24 h-24 bg-[#FAF8F5] border border-[#EAE7E1] rounded-full flex items-center justify-center mx-auto mb-6 text-[#D4AF37] shadow-inner">
                <ShoppingBag className="w-10 h-10" strokeWidth={1.5} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#121212] mb-3 tracking-wide">
                Your Bag is Currently Empty
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mb-10 max-w-md mx-auto leading-relaxed">
                Discover our opulent extraits and handcrafted attars to begin your fragrance journey.
              </p>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                {QUICK_NAV.map((nav) => (
                  <Link key={nav.label} href={nav.href}>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-none border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white text-xs font-bold uppercase tracking-widest transition-all duration-300"
                    >
                      {nav.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommendations Carousel */}
            {recommendations.length > 0 && (
              <div className="mt-14 sm:mt-20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif text-[#121212] tracking-wide flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" /> You May Also Like
                  </h3>
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => scrollCarousel("left")}
                      className="w-9 h-9 border border-[#EAE7E1] bg-white flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer text-neutral-400 rounded-lg"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scrollCarousel("right")}
                      className="w-9 h-9 border border-[#EAE7E1] bg-white flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer text-neutral-400 rounded-lg"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div
                  ref={scrollRef}
                  className="flex gap-5 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
                >
                  {recommendations.map((product) => {
                    const salePrice = product.sale_price;
                    const isSale = !!salePrice;
                    const displayPrice = isSale ? salePrice : product.price;
                    return (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-[180px] sm:w-[220px] snap-start group bg-white border border-[#EAE7E1] rounded-xl p-3 shadow-2xs hover:shadow-md transition-shadow"
                      >
                        <Link href={`/products/${product.slug}`} className="block relative w-full aspect-[3/4] bg-[#FAF8F5] rounded-lg overflow-hidden mb-3 border border-[#EAE7E1]">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            unoptimized
                            className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                        </Link>

                        <Link href={`/products/${product.slug}`}>
                          <h4 className="font-serif text-sm font-bold text-[#121212] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1 mb-1">
                            {product.title}
                          </h4>
                        </Link>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-sm font-bold font-mono text-[#121212]">{formatPrice(displayPrice)}</span>
                          {isSale && (
                            <span className="text-xs text-neutral-400 line-through font-mono">{formatPrice(product.price)}</span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            addItem({
                              productId: product.id,
                              title: product.title,
                              price: displayPrice,
                              image: product.image,
                              quantity: 1,
                            });
                          }}
                          className="w-full h-10 border border-[#121212] bg-[#121212] text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer rounded-lg"
                        >
                          + Quick Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Cart Items List (8 cols on desktop) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-[#EAE7E1] rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 divide-y divide-[#EAE7E1]">
                <div className="pb-2 flex justify-between items-center text-xs uppercase tracking-widest text-neutral-400 font-bold">
                  <span>Product Details</span>
                  <span className="hidden sm:inline">Subtotal</span>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="pt-6 first:pt-0 flex gap-4 sm:gap-6 items-center sm:items-start">
                    
                    {/* Large Product Image */}
                    <div className="relative w-28 sm:w-36 md:w-40 aspect-[3/4] bg-[#FAF8F5] border border-[#EAE7E1] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-3 shadow-2xs">
                      <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                    </div>

                    {/* Detail Column */}
                    <div className="flex-1 flex flex-col justify-between self-stretch py-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-serif font-bold text-base sm:text-xl text-[#121212] leading-tight">
                              {item.title}
                            </h3>
                            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                              <span className="text-xs bg-[#FAF8F5] border border-[#EAE7E1] text-neutral-600 font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                                {item.variantInfo || getProductVariantInfo({ title: item.title }, item.productId.includes("-") ? item.productId.split("-").pop() : undefined)}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                In Stock
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-[#EAE7E1]">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Qty:</span>
                          <div className="flex items-center border border-[#EAE7E1] bg-white rounded-lg p-0.5 shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#FAF8F5] transition-colors cursor-pointer text-neutral-600 rounded"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-bold text-sm text-[#121212] font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#FAF8F5] transition-colors cursor-pointer text-neutral-600 rounded"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-neutral-400 block font-semibold uppercase tracking-wider">Item Total</span>
                          <span className="font-bold text-base sm:text-xl font-mono text-[#121212]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

              {/* Recommendations below cart list */}
              {recommendations.length > 0 && (
                <div className="bg-white border border-[#EAE7E1] rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-base font-serif font-bold text-[#121212] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Complete Your Fragrance Collection
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {recommendations.slice(0, 4).map((p) => (
                      <div key={p.id} className="p-3 bg-[#FAF8F5] border border-[#EAE7E1] rounded-xl flex flex-col justify-between group">
                        <Link href={`/products/${p.slug}`} className="block relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-[#EAE7E1] mb-2">
                          <img src={p.image} alt={p.title} className="object-cover w-full h-full group-hover:scale-108 transition-transform duration-500" />
                        </Link>
                        <h4 className="font-serif text-xs font-bold text-[#121212] line-clamp-1 mb-1">{p.title}</h4>
                        <span className="text-xs font-mono font-bold text-[#121212] block mb-2">{formatPrice(p.sale_price || p.price)}</span>
                        <button
                          onClick={() => {
                            const variantInfo = getProductVariantInfo(p);
                            const sizeFromInfo = variantInfo.split(" ")[0];
                            addItem({
                              productId: `${p.id}-${sizeFromInfo}`,
                              variantId: `${p.id}-${sizeFromInfo}`,
                              title: p.title,
                              price: p.sale_price || p.price,
                              image: p.image,
                              quantity: 1,
                              variantInfo,
                            });
                          }}
                          className="w-full py-1.5 bg-[#121212] text-white hover:bg-[#D4AF37] text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Cart Summary & Coupons (5 cols on desktop, sticky) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              
              {/* Promo Code Block */}
              <div className="bg-white border border-[#EAE7E1] p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#121212] flex items-center gap-2 border-b border-[#EAE7E1] pb-3">
                  <Ticket className="w-4 h-4 text-[#D4AF37]" /> Have a Promotional Code?
                </h3>
                
                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-emerald-800 uppercase tracking-widest font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Coupon Applied
                      </p>
                      <p className="text-sm font-bold text-emerald-950 mt-0.5 font-mono">
                        {appliedCoupon.code} (-{formatPrice(discount)})
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError("");
                        }}
                        className="flex-1 text-xs border border-[#EAE7E1] bg-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#D4AF37] uppercase font-bold text-[#121212] placeholder:text-neutral-400 placeholder:normal-case shadow-2xs"
                      />
                      <button
                        type="submit"
                        disabled={isApplying || !couponInput.trim()}
                        className="bg-[#121212] hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg disabled:bg-neutral-300 disabled:cursor-not-allowed cursor-pointer transition-colors duration-300"
                      >
                        {isApplying ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 font-semibold">{couponError}</p>
                    )}
                    
                    {/* Available Coupon Pills */}
                    <div className="pt-2 border-t border-[#EAE7E1]">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-2">Available Coupons</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setCouponInput("WELCOME10")}
                          className="text-[10px] font-mono font-bold bg-[#FAF8F5] border border-[#EAE7E1] hover:border-[#D4AF37] text-[#121212] px-2.5 py-1 rounded cursor-pointer transition-colors"
                        >
                          WELCOME10 (10% OFF)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCouponInput("FLAT500")}
                          className="text-[10px] font-mono font-bold bg-[#FAF8F5] border border-[#EAE7E1] hover:border-[#D4AF37] text-[#121212] px-2.5 py-1 rounded cursor-pointer transition-colors"
                        >
                          FLAT500 ({formatPrice(500)} OFF)
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Order Summary card */}
              <div className="bg-white border border-[#EAE7E1] p-6 rounded-2xl shadow-sm space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#121212] border-b border-[#EAE7E1] pb-3">
                  Order Summary
                </h3>
                
                <div className="space-y-3 text-xs uppercase tracking-wider font-semibold text-neutral-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#121212] text-sm">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-mono text-sm">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Express Shipping</span>
                    <span className="font-mono text-sm text-emerald-700 font-bold">
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#EAE7E1] pt-4 flex justify-between items-baseline uppercase tracking-wider font-bold text-[#121212]">
                  <span className="text-sm">Estimated Total</span>
                  <span className="text-2xl font-mono text-[#121212]">{formatPrice(grandTotal)}</span>
                </div>

                <Link href="/checkout" className="block pt-2">
                  <Button className="w-full min-h-[48px] py-3 px-4 bg-[#121212] text-white hover:bg-[#D4AF37] text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl cursor-pointer transition-colors duration-300 shadow-md">
                    <span className="whitespace-nowrap flex items-center gap-2">Proceed to Checkout <ArrowRight className="w-4 h-4 shrink-0" /></span>
                  </Button>
                </Link>

                <div className="flex flex-col items-center gap-2 pt-2 border-t border-[#EAE7E1] text-center">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>256-Bit Encrypted & Verified Checkout</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    Insured International Courier Delivery | No Returns / Final Sale
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

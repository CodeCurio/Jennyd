"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, Ticket, ArrowRight, ShoppingBag, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCart } from "@/lib/store/CartContext";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

const QUICK_NAV = [
  { label: "Bestsellers", href: "/products?sort=best-selling" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "All Perfumes", href: "/products" },
];

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

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch recommended products for empty cart state
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

  const shippingCost = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal - discount + shippingCost;

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="border-b border-neutral-200 pb-5 sm:pb-6 mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] uppercase tracking-widest">Shopping Cart</h1>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-[#D4AF37] transition-colors duration-300">
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* =================== PREMIUM EMPTY CART STATE =================== */
          <div className="max-w-3xl mx-auto">
            
            {/* Empty Cart Message Card */}
            <div className="bg-white border border-neutral-100 p-10 sm:p-14 text-center shadow-[0_2px_20px_-6px_rgba(0,0,0,0.04)]">
              {/* Elegant Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F5F5F0] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 relative">
                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" strokeWidth={1.5} />
                <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/20 animate-[spin_20s_linear_infinite]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] mb-2 tracking-wide">Your Cart is Currently Empty</h2>
              <p className="text-sm text-neutral-500 mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
                Discover our curated collection of luxury fragrances and find the perfect scent for you.
              </p>

              {/* Quick Navigation Buttons - Ajmal Style */}
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                {QUICK_NAV.map((nav) => (
                  <Link key={nav.label} href={nav.href}>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-none border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300"
                    >
                      {nav.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* You May Also Like - Product Recommendations Carousel */}
            {recommendations.length > 0 && (
              <div className="mt-12 sm:mt-16">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-serif text-[#1A1A1A] tracking-wide">You May Also Like</h3>
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => scrollCarousel("left")}
                      className="w-9 h-9 border border-neutral-200 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer text-neutral-400"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scrollCarousel("right")}
                      className="w-9 h-9 border border-neutral-200 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer text-neutral-400"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Horizontally Scrollable Carousel */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
                >
                  {recommendations.map((product) => {
                    const salePrice = product.sale_price;
                    const isSale = !!salePrice;
                    const displayPrice = isSale ? salePrice : product.price;
                    return (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[220px] snap-start group"
                      >
                        {/* Product Image */}
                        <Link href={`/products/${product.slug}`} className="block relative w-full aspect-[4/5] bg-[#F5F5F0] overflow-hidden mb-3">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            unoptimized
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          {isSale && (
                            <div className="absolute top-2 left-2 z-10 border border-[#D4AF37] bg-white/95 backdrop-blur-xs text-[#D4AF37] text-[8px] uppercase font-bold px-2 py-0.5 tracking-widest">
                              Sale
                            </div>
                          )}
                        </Link>

                        {/* Product Info */}
                        <Link href={`/products/${product.slug}`}>
                          <h4 className="font-serif text-sm text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1 mb-1">
                            {product.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-accent text-accent" />)}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2.5">
                          <span className="text-sm font-semibold text-[#1A1A1A]">₹{displayPrice}</span>
                          {isSale && (
                            <span className="text-xs text-neutral-400 line-through">₹{product.price}</span>
                          )}
                        </div>

                        {/* Add Button */}
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
                          className="w-full h-9 border border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
            
            {/* Left Column: Cart Items List (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-neutral-100 shadow-[0_2px_20px_-6px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-5 sm:p-6 divide-y divide-neutral-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-5 sm:py-6 first:pt-0 last:pb-0 flex gap-4 sm:gap-6">
                      
                      {/* Image */}
                      <div className="relative w-20 sm:w-24 aspect-[4/5] bg-[#F5F5F0] border border-neutral-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                      </div>

                      {/* Detail Column */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-bold text-xs sm:text-sm text-[#1A1A1A] uppercase tracking-wide">
                                {item.title}
                              </h3>
                              {item.variantInfo && (
                                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mt-1">
                                  Size: {item.variantInfo}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Qty editor row */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-neutral-200 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5 text-neutral-500" />
                            </button>
                            <span className="px-4 text-xs font-bold text-[#1A1A1A]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-neutral-500" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 block mb-0.5 font-medium uppercase tracking-wider">Subtotal</span>
                            <span className="font-bold text-sm font-mono text-[#1A1A1A]">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Cart Summary & Coupons (1/3 width on desktop) */}
            <div className="space-y-6">
              
              {/* Promo Code Block */}
              <div className="bg-white border border-neutral-100 p-5 sm:p-6 shadow-[0_2px_20px_-6px_rgba(0,0,0,0.04)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 flex items-center gap-1.5 border-b border-neutral-100 pb-3">
                  <Ticket className="w-4 h-4 text-[#D4AF37]" /> Have a Promo Code?
                </h3>
                
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-green-700 uppercase tracking-widest font-bold">Coupon Applied</p>
                      <p className="text-xs font-bold text-green-900 mt-0.5">
                        {appliedCoupon.code} (-₹{discount.toLocaleString()})
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
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError("");
                        }}
                        className="flex-1 text-xs border border-neutral-200 bg-white px-3 py-2.5 focus:outline-none focus:border-[#1A1A1A] uppercase font-bold transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={isApplying || !couponInput.trim()}
                        className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 disabled:bg-neutral-300 disabled:cursor-not-allowed cursor-pointer transition-colors duration-300"
                      >
                        {isApplying ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-600 font-medium">{couponError}</p>
                    )}
                    <p className="text-[9px] text-neutral-400 leading-normal">
                      Try codes <strong>WELCOME10</strong> (10% off above ₹500) or <strong>FLAT500</strong> (Flat ₹500 off above ₹2,000).
                    </p>
                  </form>
                )}
              </div>

              {/* Order Summary details */}
              <div className="bg-white border border-neutral-100 p-5 sm:p-6 shadow-[0_2px_20px_-6px_rgba(0,0,0,0.04)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 border-b border-neutral-100 pb-3">
                  Order Summary
                </h3>
                
                <div className="space-y-2 text-xs uppercase tracking-wider font-semibold text-neutral-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#1A1A1A]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-mono">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-[#1A1A1A]">
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                    </span>
                  </div>

                  {shippingCost > 0 && (
                    <p className="text-[9px] text-neutral-400 lowercase tracking-normal font-normal text-right">
                      Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-neutral-150 pt-4 flex justify-between items-baseline font-bold uppercase tracking-wider text-[#1A1A1A]">
                  <span className="text-xs">Estimated Total</span>
                  <span className="text-xl font-mono">₹{grandTotal.toLocaleString()}</span>
                </div>

                <Link href="/checkout" className="block pt-2">
                  <Button className="w-full bg-[#1A1A1A] text-white hover:bg-[#D4AF37] text-xs font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 rounded-none cursor-pointer transition-colors duration-300">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="text-center pt-2">
                  <span className="text-[10px] text-neutral-400 font-medium block">
                    Secured Checkout | 7-Days Easy Returns
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


"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Ticket, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/CartContext";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

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

  const shippingCost = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal - discount + shippingCost;

  return (
    <div className="bg-[#fcfaf8] min-h-screen py-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-10 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
          <h1 className="text-3xl font-serif text-gray-900 uppercase tracking-widest">Shopping Cart</h1>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-lg p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-serif uppercase tracking-wider mb-2">Your Cart is Empty</h2>
            <p className="text-xs text-gray-500 mb-8 leading-relaxed">
              Looks like you haven't added any luxury fragrances to your collection yet.
            </p>
            <Link href="/products">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-none text-xs uppercase tracking-widest font-bold py-4 px-8">
                Explore Perfumes
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left Column: Cart Items List (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-100 rounded-lg shadow-xs overflow-hidden">
                <div className="p-6 divide-y divide-gray-150">
                  {items.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-6">
                      
                      {/* Image - using raw img tag for maximum asset loader safety */}
                      <div className="relative w-24 h-30 bg-gray-50 border border-gray-100 overflow-hidden rounded shrink-0">
                        <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                      </div>

                      {/* Detail Column */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                                {item.title}
                              </h3>
                              {item.variantInfo && (
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1">
                                  Size: {item.variantInfo}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Qty editor row */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-300 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                            <span className="px-4 text-xs font-bold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block mb-0.5 font-medium">Subtotal</span>
                            <span className="font-bold text-sm font-mono text-gray-900">
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
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-3">
                  <Ticket className="w-4 h-4 text-accent" /> Have a Promo Code?
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
                        className="flex-1 text-xs border border-gray-300 bg-white px-3 py-2.5 focus:outline-none focus:border-black uppercase font-bold"
                      />
                      <button
                        type="submit"
                        disabled={isApplying || !couponInput.trim()}
                        className="bg-black hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isApplying ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-600 font-medium">{couponError}</p>
                    )}
                    <p className="text-[9px] text-gray-400 leading-normal">
                      Try codes <strong>WELCOME10</strong> (10% off above ₹500) or <strong>FLAT500</strong> (Flat ₹500 off above ₹2,000).
                    </p>
                  </form>
                )}
              </div>

              {/* Order Summary details */}
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-gray-100 pb-3">
                  Order Summary
                </h3>
                
                <div className="space-y-2 text-xs uppercase tracking-wider font-semibold text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-mono">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-gray-900">
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                    </span>
                  </div>

                  {shippingCost > 0 && (
                    <p className="text-[9px] text-gray-400 lowercase tracking-normal font-normal text-right">
                      Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-150 pt-4 flex justify-between items-baseline font-bold uppercase tracking-wider text-gray-900">
                  <span className="text-xs">Estimated Total</span>
                  <span className="text-xl font-mono">₹{grandTotal.toLocaleString()}</span>
                </div>

                <Link href="/checkout" className="block pt-2">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 rounded-none cursor-pointer">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="text-center pt-2">
                  <span className="text-[10px] text-gray-400 font-medium block">
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

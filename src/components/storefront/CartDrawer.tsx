"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Ticket } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/store/CartContext";
import { Button } from "../ui/Button";

export function CartDrawer() {
  const { 
    isDrawerOpen, 
    setIsDrawerOpen, 
    items, 
    updateQuantity, 
    removeItem, 
    subtotal,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    const result = await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
    if (result.success) {
      setCouponCode("");
    } else {
      setCouponError(result.message);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-card shadow-2xl flex flex-col font-sans"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-serif tracking-wide uppercase">Your Cart</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-secondary-foreground hover:text-foreground cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-secondary-foreground">
                  <div className="w-20 h-20 bg-secondary-background rounded-full flex items-center justify-center mb-2">
                    <Trash2 size={28} />
                  </div>
                  <p className="text-xs uppercase tracking-widest font-bold">Your cart is empty.</p>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(false)} className="rounded-none text-xs uppercase tracking-widest font-bold border-black hover:bg-black hover:text-white cursor-pointer">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0, x: 50 }}
                        animate={{ opacity: 1, height: "auto", x: 0 }}
                        exit={{ opacity: 0, height: 0, x: 50 }}
                        className="flex gap-4 overflow-hidden"
                      >
                        {/* Standard img tag to support spaces in local asset paths and Supabase remote assets without loading errors */}
                        <div className="relative w-20 h-24 bg-gray-50 border border-gray-150 shrink-0 overflow-hidden rounded">
                          <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wide leading-tight">{item.title}</h3>
                              {item.variantInfo && <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-medium">{item.variantInfo}</p>}
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-300">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                className="p-1.5 hover:bg-gray-100 transition-all cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 text-xs font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                className="p-1.5 hover:bg-gray-100 transition-all cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="font-bold text-xs font-mono">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50/50 space-y-4">
                
                {/* Coupon Input Block */}
                <div className="border-b border-gray-200 pb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 text-green-800 text-[11px] px-3 py-2 border border-green-200 font-medium">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <Ticket className="w-3.5 h-3.5" /> {appliedCoupon.code} (-₹{discount.toLocaleString()})
                      </span>
                      <button onClick={removeCoupon} className="text-red-600 hover:text-red-900 font-bold uppercase tracking-widest text-[9px] cursor-pointer">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo Code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError("");
                          }}
                          className="flex-1 text-xs border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:border-black uppercase font-bold"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="bg-black hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-[10px] text-red-600 font-medium">{couponError}</p>}
                    </div>
                  )}
                </div>

                {/* Subtotals & Discounts */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-xs text-green-700 font-semibold uppercase tracking-wider">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-mono">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-150 uppercase tracking-widest">
                    <span>Total</span>
                    <span className="font-mono">₹{(subtotal - discount).toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 text-center leading-normal">Shipping and taxes calculated at checkout.</p>
                
                {/* Checkout Links */}
                <div className="flex gap-3">
                  <Link href="/cart" onClick={() => setIsDrawerOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full text-[10px] py-3 rounded-none uppercase tracking-widest font-bold border-black text-black cursor-pointer">
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={() => setIsDrawerOpen(false)} className="flex-1">
                    <Button className="w-full text-[10px] py-3 rounded-none uppercase tracking-widest font-bold bg-black hover:bg-gray-900 text-white cursor-pointer">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

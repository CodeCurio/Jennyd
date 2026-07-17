"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/store/CartContext";
import { Button } from "../ui/Button";
import { supabase } from "@/lib/supabase";

const QUICK_NAV = [
  { label: "Bestsellers", href: "/products?sort=best-selling" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "All Perfumes", href: "/products" },
];

/* ── Horizontal sliding product carousel for "You may also like" ── */
function RecommendationCarousel({
  products,
  onAdd,
  onClose,
}: {
  products: any[];
  onAdd: (p: any) => void;
  onClose: () => void;
}) {
  const ITEMS_PER_PAGE = 2;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  // Touch / swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (page: number) => {
      if (page < 0 || page >= totalPages) return;
      setCurrentPage(page);
    },
    [totalPages]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo(currentPage + 1);
      else goTo(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-2 shrink-0 pb-2">
      {/* Header row with arrows */}
      <div className="flex items-center justify-between">
        <h4 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wide">You may also like</h4>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-1 text-neutral-400 hover:text-black disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Previous products"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="p-1 text-neutral-400 hover:text-black disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Next products"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Sliding track */}
      <div
        className="overflow-hidden"
        ref={trackRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <div
              key={pageIdx}
              className="flex gap-3 w-full shrink-0 px-[1px]"
              style={{ minWidth: "100%" }}
            >
              {products
                .slice(pageIdx * ITEMS_PER_PAGE, (pageIdx + 1) * ITEMS_PER_PAGE)
                .map((product) => {
                  const salePrice = product.sale_price;
                  const isSale = !!salePrice;
                  const displayPrice = isSale ? salePrice : product.price;
                  return (
                    <div
                      key={product.id}
                      className="flex-1 p-2 bg-white border border-gray-150 hover:border-gray-300 rounded-lg flex flex-col group transition-colors shadow-sm hover:shadow-md"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="block relative aspect-[4/5] w-full bg-gray-50/50 rounded-md overflow-hidden mb-2.5"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      <div className="flex flex-col flex-1 justify-between">
                        <Link href={`/products/${product.slug}`} onClick={onClose} className="mb-2">
                          <h5 className="text-[11px] font-medium text-gray-800 line-clamp-2 hover:text-accent transition-colors leading-snug">
                            {product.title}
                          </h5>
                        </Link>

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[13px] font-bold text-gray-900">
                              ₹{displayPrice.toLocaleString()}
                            </span>
                            {isSale && (
                              <span className="text-[10px] text-neutral-400 line-through font-mono">
                                ₹{product.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => onAdd(product)}
                            className="w-full py-1.5 border border-black bg-white text-black hover:bg-black hover:text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors duration-300 cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentPage
                  ? "w-2.5 h-2.5 bg-neutral-600"
                  : "w-2 h-2 bg-neutral-200 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════ */

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
    removeCoupon,
    addItem,
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

  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Fetch recommended products for empty cart state inside drawer
  useEffect(() => {
    if (!isDrawerOpen) return;
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
  }, [isDrawerOpen]);

  const handleAddRecommendation = (product: any) => {
    const displayPrice = product.sale_price || product.price;
    addItem({
      productId: product.id,
      title: product.title,
      price: displayPrice,
      image: product.image,
      quantity: 1,
    });
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
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col font-sans"
          >
            {/* ── Drawer Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold tracking-wider uppercase text-[#1A1A1A] font-sans">
                Your Cart
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer p-1"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Drawer Body ── */}
            {items.length === 0 ? (
              /* Empty state – everything fits in one viewport, no scroll required */
              <div className="flex-1 flex flex-col px-6 py-5 overflow-hidden">
                {/* Empty message */}
                <div className="text-center flex flex-col items-center">
                  <h3 className="text-base font-serif text-[#1a1a1a] mb-5">
                    Your cart is currently empty
                  </h3>

                  {/* Quick navigation – compact stacked buttons */}
                  <div className="flex flex-col gap-2.5 w-full max-w-[240px] mx-auto">
                    {QUICK_NAV.map((nav) => (
                      <Link
                        key={nav.label}
                        href={nav.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className="w-full"
                      >
                        <button className="w-full h-9 border border-neutral-300 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer bg-white">
                          {nav.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-100 my-4" />

                {/* Sliding recommendations carousel */}
                {recommendations.length > 0 && (
                  <RecommendationCarousel
                    products={recommendations}
                    onAdd={handleAddRecommendation}
                    onClose={() => setIsDrawerOpen(false)}
                  />
                )}
              </div>
            ) : (
              /* ── Cart items ── */
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-white">
                <div className="flex flex-col gap-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0, x: 50 }}
                        animate={{ opacity: 1, height: "auto", x: 0 }}
                        exit={{ opacity: 0, height: 0, x: 50 }}
                        className="flex gap-4 overflow-hidden border-b border-gray-100 pb-4"
                      >
                        {/* Image: unclipped object-contain box */}
                        <div className="relative w-20 h-24 bg-gray-50/50 border border-gray-100 shrink-0 overflow-hidden rounded-xl flex items-center justify-center p-2">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                        
                        <div className="flex flex-col justify-between flex-1 py-0.5">
                          <div className="flex justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-xs text-foreground uppercase tracking-wide leading-tight">
                                {item.title}
                              </h3>
                              {item.variantInfo && (
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-medium">
                                  {item.variantInfo}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1 -mt-1"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          
                          {/* Quantity Selector & Price */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-gray-50 border border-gray-250 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-150 transition-colors cursor-pointer"
                              >
                                <Minus size={10} strokeWidth={2.5} />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-150 transition-colors cursor-pointer"
                              >
                                <Plus size={10} strokeWidth={2.5} />
                              </button>
                            </div>
                            <p className="font-extrabold text-xs text-gray-900 font-mono">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* ── Footer (only when items exist) ── */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50/50 space-y-4">
                {/* Coupon Input Block */}
                <div className="border-b border-gray-200 pb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 text-green-800 text-[11px] px-3 py-2 border border-green-200 font-medium">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <Ticket className="w-3.5 h-3.5" /> {appliedCoupon.code}{" "}
                        (-₹{discount.toLocaleString()})
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-900 font-bold uppercase tracking-widest text-[9px] cursor-pointer"
                      >
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
                      {couponError && (
                        <p className="text-[10px] text-red-600 font-medium">
                          {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtotals & Discounts */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="font-mono">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-xs text-green-700 font-semibold uppercase tracking-wider">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-mono">
                        -₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-150 uppercase tracking-widest">
                    <span>Total</span>
                    <span className="font-mono">
                      ₹{(subtotal - discount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 text-center leading-normal">
                  Shipping and taxes calculated at checkout.
                </p>

                {/* Checkout Links */}
                <div className="flex gap-3">
                  <Link
                    href="/cart"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full text-[10px] py-3 rounded-none uppercase tracking-widest font-bold border-black text-black cursor-pointer"
                    >
                      View Cart
                    </Button>
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1"
                  >
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

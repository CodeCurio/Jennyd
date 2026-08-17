"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Ticket, ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Sparkles, Truck, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/store/CartContext";
import { Button } from "../ui/Button";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/lib/store/CurrencyContext";
import { getProductVariantInfo } from "@/lib/utils";

const QUICK_NAV = [
  { label: "Bestsellers", href: "/products?sort=best-selling" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "All Perfumes", href: "/products" },
];

/* ── Horizontal sliding product carousel for recommendations ── */
function RecommendationCarousel({
  products,
  onAdd,
  onClose,
}: {
  products: any[];
  onAdd: (p: any) => void;
  onClose: () => void;
}) {
  const { formatPrice } = useCurrency();
  const ITEMS_PER_PAGE = 2;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
    <div className="flex flex-col gap-2 mt-2 shrink-0">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-serif font-bold text-[#121212] uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" /> You May Also Like
        </h4>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-0.5 text-neutral-400 hover:text-black disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="p-0.5 text-neutral-400 hover:text-black disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <div
              key={pageIdx}
              className="flex gap-2 w-full shrink-0"
              style={{ minWidth: "100%" }}
            >
              {products
                .slice(pageIdx * ITEMS_PER_PAGE, (pageIdx + 1) * ITEMS_PER_PAGE)
                .map((product) => {
                  const salePrice = product.sale_price;
                  const displayPrice = salePrice || product.price;
                  return (
                    <div
                      key={product.id}
                      className="flex-1 p-2 bg-[#FAF8F5] border border-[#EAE7E1] hover:border-[#D4AF37] rounded-xl flex items-center gap-2 group transition-all"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="relative w-11 h-13 bg-white rounded-lg overflow-hidden shrink-0 border border-[#EAE7E1]"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <Link href={`/products/${product.slug}`} onClick={onClose}>
                          <h5 className="text-[10px] font-serif font-bold text-[#121212] truncate group-hover:text-[#D4AF37]">
                            {product.title}
                          </h5>
                        </Link>
                        <span className="text-[10px] font-bold font-mono text-[#121212] block">
                          {formatPrice(displayPrice)}
                        </span>
                        <button
                          onClick={() => onAdd(product)}
                          className="mt-1 w-full py-0.5 bg-[#121212] text-white hover:bg-[#D4AF37] text-[8px] font-bold uppercase tracking-wider rounded cursor-pointer"
                        >
                          + Quick Add
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  const { formatPrice } = useCurrency();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  useEffect(() => {
    if (!isDrawerOpen) return;
    const fetchRecommendations = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, slug, price, sale_price, metadata")
          .limit(6);
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
    const variantInfo = getProductVariantInfo(product);
    const sizeFromInfo = variantInfo.split(" ")[0];
    addItem({
      productId: `${product.id}-${sizeFromInfo}`,
      variantId: `${product.id}-${sizeFromInfo}`,
      title: product.title,
      price: displayPrice,
      image: product.image,
      quantity: 1,
      variantInfo,
    });
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:max-w-md md:max-w-lg lg:max-w-[460px] bg-white shadow-2xl flex flex-col font-sans border-l border-[#EAE7E1]"
          >
            {/* ── Drawer Header ── */}
            <div className="px-4 py-3.5 border-b border-[#EAE7E1] bg-[#FAF8F5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-serif font-bold tracking-wide text-[#121212] uppercase">
                  Your Cart
                </h2>
                <span className="bg-[#121212] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-neutral-400 hover:text-black p-1 rounded-full hover:bg-neutral-200/50 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Express Shipping Banner Across India */}
            <div className="px-3.5 py-1.5 bg-emerald-50/90 border-b border-emerald-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-900 shrink-0">
              <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>FREE Express Shipping Across India on All Orders</span>
            </div>

            {/* ── Drawer Body ── */}
            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar justify-between">
                <div className="text-center flex flex-col items-center py-6">
                  <div className="w-14 h-14 bg-[#FAF8F5] border border-[#EAE7E1] rounded-full flex items-center justify-center mb-3 text-[#D4AF37] shadow-inner">
                    <ShoppingBag className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-serif text-[#121212] font-bold mb-1">
                    Your cart is currently empty
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mb-5 leading-relaxed">
                    Discover our luxury extraits and handcrafted attars to build your signature scent profile.
                  </p>

                  <div className="flex flex-col gap-2 w-full max-w-[220px] mx-auto">
                    {QUICK_NAV.map((nav) => (
                      <Link
                        key={nav.label}
                        href={nav.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className="w-full"
                      >
                        <button className="w-full py-2 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer bg-white">
                          {nav.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="pt-2 border-t border-[#EAE7E1]">
                    <RecommendationCarousel
                      products={recommendations}
                      onAdd={handleAddRecommendation}
                      onClose={() => setIsDrawerOpen(false)}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* ── High-Density Compact Cart Items List ── */
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 no-scrollbar bg-white space-y-2.5 max-h-[52vh] sm:max-h-[56vh]">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-3 p-2.5 bg-[#FAF8F5] border border-[#EAE7E1] rounded-xl hover:border-[#D4AF37]/50 transition-all shadow-2xs group relative items-center"
                    >
                      {/* Compact Product Thumbnail */}
                      <div className="relative w-14 h-16 bg-white border border-[#EAE7E1] rounded-lg shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info & Quantity Controls */}
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-serif font-bold text-xs text-[#121212] truncate leading-tight">
                            {item.title}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer shrink-0"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
                          {item.variantInfo || getProductVariantInfo({ title: item.title }, item.productId.includes("-") ? item.productId.split("-").pop() : undefined)}
                        </span>

                        <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-[#EAE7E1]/60">
                          {/* Compact Stepper */}
                          <div className="flex items-center bg-white border border-[#EAE7E1] rounded-md p-0.5 shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:bg-[#FAF8F5] hover:text-black rounded transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={10} strokeWidth={2.5} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-[#121212] font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:bg-[#FAF8F5] hover:text-black rounded transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={10} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Line Total */}
                          <span className="font-bold text-xs text-[#121212] font-mono">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Optional Recommendations Carousel if items are 1 or 2 */}
                {items.length <= 2 && recommendations.length > 0 && (
                  <div className="pt-2 border-t border-[#EAE7E1] mt-2">
                    <RecommendationCarousel
                      products={recommendations}
                      onAdd={handleAddRecommendation}
                      onClose={() => setIsDrawerOpen(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Fixed Streamlined Drawer Footer ── */}
            {items.length > 0 && (
              <div className="p-3.5 border-t border-[#EAE7E1] bg-[#FAF8F5] space-y-2.5 shadow-lg shrink-0 mt-auto">
                
                {/* Always-Visible Promo Code Form & Pills */}
                <div className="space-y-1.5">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 text-xs px-3 py-1.5 border border-emerald-200 rounded-lg font-medium">
                      <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> {appliedCoupon.code} (-{formatPrice(discount)})
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-900 font-bold uppercase tracking-widest text-[9px] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <Ticket className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            placeholder="Enter Promo Code (e.g. WELCOME10)"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError("");
                            }}
                            className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-[#EAE7E1] bg-white rounded-lg focus:outline-none focus:border-[#D4AF37] uppercase font-bold text-[#121212] placeholder:text-neutral-400 placeholder:normal-case shadow-2xs"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="bg-[#121212] hover:bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-lg disabled:bg-neutral-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      
                      {couponError && (
                        <p className="text-[10px] text-red-600 font-semibold pl-1">
                          {couponError}
                        </p>
                      )}

                      {/* Quick Apply Coupon Pills */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[9px] text-neutral-400 font-bold uppercase">Quick Add:</span>
                        <button
                          type="button"
                          onClick={() => { setCouponCode("WELCOME10"); applyCoupon("WELCOME10"); }}
                          className="text-[9px] font-mono font-bold bg-white border border-[#EAE7E1] hover:border-[#D4AF37] text-[#121212] px-2 py-0.5 rounded cursor-pointer"
                        >
                          WELCOME10 (10% OFF)
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Subtotals & Total */}
                <div className="space-y-1 pt-1.5 border-t border-[#EAE7E1]">
                  <div className="flex justify-between text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#121212]">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-mono">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                    <span>Shipping</span>
                    <span className="font-mono text-emerald-700 font-bold">FREE</span>
                  </div>

                  <div className="flex justify-between items-baseline text-sm sm:text-base font-bold text-[#121212] pt-1.5 border-t border-[#EAE7E1] uppercase tracking-wider">
                    <span>Total Payable</span>
                    <span className="font-mono text-base sm:text-lg text-[#121212]">
                      {formatPrice(subtotal - discount)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-0.5">
                  <Link
                    href="/checkout"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full block"
                  >
                    <Button className="w-full h-12 text-xs uppercase tracking-widest font-bold bg-[#121212] hover:bg-[#D4AF37] text-white rounded-lg cursor-pointer transition-colors duration-300 flex items-center justify-center gap-1 shadow-md whitespace-nowrap">
                      PROCEED TO CHECKOUT →
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-medium pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Complimentary Luxury Samples & 256-Bit Encrypted Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

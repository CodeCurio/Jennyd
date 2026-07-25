"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Ticket, ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/store/CartContext";
import { Button } from "../ui/Button";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/lib/store/CurrencyContext";

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
    <div className="flex flex-col gap-2.5 mt-2 shrink-0 pb-1">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-serif font-bold text-[#121212] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Complete Your Selection
        </h4>
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

      <div
        className="overflow-hidden"
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
              className="flex gap-2.5 w-full shrink-0 px-[1px]"
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
                      className="flex-1 p-2 bg-[#FAF8F5] border border-[#EAE7E1] hover:border-[#D4AF37] rounded-xl flex flex-col group transition-all duration-300 shadow-2xs"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="block relative aspect-[4/5] w-full bg-white rounded-lg overflow-hidden mb-2 border border-[#EAE7E1]"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover w-full h-full group-hover:scale-108 transition-transform duration-700 ease-out"
                        />
                      </Link>

                      <div className="flex flex-col flex-1 justify-between">
                        <Link href={`/products/${product.slug}`} onClick={onClose} className="mb-1">
                          <h5 className="text-[11px] font-serif font-bold text-[#121212] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                            {product.title}
                          </h5>
                        </Link>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-bold font-mono text-[#121212]">
                              {formatPrice(displayPrice)}
                            </span>
                            {isSale && (
                              <span className="text-[10px] text-neutral-400 line-through font-mono">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => onAdd(product)}
                            className="w-full py-1 bg-[#121212] text-white hover:bg-[#D4AF37] hover:text-white text-[9px] font-bold uppercase tracking-widest rounded transition-colors duration-300 cursor-pointer"
                          >
                            + Quick Add
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 pt-0.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentPage
                  ? "w-3.5 h-1 bg-[#D4AF37]"
                  : "w-1 h-1 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      )}
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
  const [showPromoInput, setShowPromoInput] = useState(false);

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

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
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:max-w-md md:max-w-lg lg:max-w-[480px] bg-white shadow-2xl flex flex-col font-sans border-l border-[#EAE7E1]"
          >
            {/* ── Drawer Header ── */}
            <div className="px-5 py-4 border-b border-[#EAE7E1] bg-[#FAF8F5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-serif font-bold tracking-wide text-[#121212] uppercase">
                  Your Cart
                </h2>
                <span className="bg-[#121212] text-[#D4AF37] text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
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

            {/* Free Shipping Badge Banner across India */}
            <div className="px-4 py-2 bg-emerald-50/90 border-b border-emerald-100 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-900 shrink-0">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>FREE Express Shipping Across India on All Orders</span>
            </div>

            {/* ── Drawer Body ── */}
            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar justify-between">
                <div className="text-center flex flex-col items-center py-6">
                  <div className="w-16 h-16 bg-[#FAF8F5] border border-[#EAE7E1] rounded-full flex items-center justify-center mb-4 text-[#D4AF37] shadow-inner">
                    <ShoppingBag className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-serif text-[#121212] font-bold mb-1.5">
                    Your cart is currently empty
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mb-6 leading-relaxed">
                    Explore our luxury perfume oils, extraits, and handcrafted attars to build your signature scent profile.
                  </p>

                  <div className="flex flex-col gap-2 w-full max-w-[240px] mx-auto">
                    {QUICK_NAV.map((nav) => (
                      <Link
                        key={nav.label}
                        href={nav.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className="w-full"
                      >
                        <button className="w-full py-2.5 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer bg-white">
                          {nav.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="pt-3 border-t border-[#EAE7E1]">
                    <RecommendationCarousel
                      products={recommendations}
                      onAdd={handleAddRecommendation}
                      onClose={() => setIsDrawerOpen(false)}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* ── Cart items list ── */
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar bg-white space-y-3">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-3.5 p-3 bg-[#FAF8F5] border border-[#EAE7E1] rounded-xl hover:border-[#D4AF37]/50 transition-all duration-300 shadow-2xs group relative"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 sm:w-22 h-26 sm:h-28 bg-white border border-[#EAE7E1] rounded-lg shrink-0 overflow-hidden flex items-center justify-center p-1.5 shadow-2xs">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Info & Actions */}
                      <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-serif font-bold text-xs sm:text-sm text-[#121212] leading-snug line-clamp-2">
                              {item.title}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-neutral-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer shrink-0"
                              title="Remove item"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] bg-white border border-[#EAE7E1] text-neutral-600 font-semibold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                              {item.variantInfo || "100ml Extrait"}
                            </span>
                            <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              In Stock
                            </span>
                          </div>
                        </div>

                        {/* Quantity Stepper + Total Item Price */}
                        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#EAE7E1]/80">
                          <div className="flex items-center bg-white border border-[#EAE7E1] rounded-lg p-0.5 shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-[#FAF8F5] hover:text-black rounded transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={11} strokeWidth={2.5} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-[#121212] font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-[#FAF8F5] hover:text-black rounded transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={11} strokeWidth={2.5} />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-xs sm:text-sm text-[#121212] font-mono">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {recommendations.length > 0 && (
                  <div className="pt-3 border-t border-[#EAE7E1] mt-4">
                    <RecommendationCarousel
                      products={recommendations}
                      onAdd={handleAddRecommendation}
                      onClose={() => setIsDrawerOpen(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Compact Footer Summary (Low Height) ── */}
            {items.length > 0 && (
              <div className="p-4 border-t border-[#EAE7E1] bg-[#FAF8F5] space-y-2.5 shadow-lg shrink-0">
                
                {/* Collapsible / Sleek Promo Code Block */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 text-xs px-3 py-1.5 border border-emerald-200 rounded-lg font-medium">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                        <Ticket className="w-3.5 h-3.5 text-emerald-700" /> {appliedCoupon.code}{" "}
                        (-{formatPrice(discount)})
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-900 font-bold uppercase tracking-widest text-[9px] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : showPromoInput ? (
                    <div className="space-y-1">
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Promo code (e.g. WELCOME10)"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError("");
                          }}
                          className="flex-1 text-xs border border-[#EAE7E1] bg-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#D4AF37] uppercase font-bold text-[#121212] placeholder:text-neutral-400 placeholder:normal-case shadow-2xs"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="bg-[#121212] hover:bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-lg disabled:bg-neutral-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[10px] text-red-600 font-semibold pl-1">
                          {couponError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowPromoInput(true)}
                      className="text-xs font-semibold text-neutral-600 hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Have a promo code?</span>
                    </button>
                  )}
                </div>

                {/* Subtotals & Discounts */}
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
                    <span>Total Amount</span>
                    <span className="font-mono text-lg sm:text-xl text-[#121212]">
                      {formatPrice(subtotal - discount)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-0.5">
                  <Link
                    href="/checkout"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1"
                  >
                    <Button className="w-full min-h-[44px] py-2.5 px-3 text-[11px] sm:text-xs uppercase tracking-wider font-bold bg-[#121212] hover:bg-[#D4AF37] text-white rounded-lg cursor-pointer transition-colors duration-300 flex items-center justify-center gap-1 shadow-md whitespace-nowrap">
                      Proceed to Checkout →
                    </Button>
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-24 sm:w-28 shrink-0"
                  >
                    <Button
                      variant="outline"
                      className="w-full min-h-[44px] py-2.5 px-2 text-[10px] sm:text-[11px] rounded-lg uppercase tracking-wider font-bold border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white cursor-pointer transition-colors whitespace-nowrap"
                    >
                      View Cart
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

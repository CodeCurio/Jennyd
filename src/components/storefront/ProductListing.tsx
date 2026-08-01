"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Sparkles, SlidersHorizontal, Check } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { QuickViewModal } from "./QuickViewModal";
import { useCurrency } from "@/lib/store/CurrencyContext";

type Product = any;

const QUICK_CATEGORIES = [
  { label: "All Fragrances", category: "All", note: "All" },
  { label: "Best Sellers", category: "All", note: "All", sort: "best-selling" },
  { label: "Men's Collection", category: "men", note: "All" },
  { label: "Women's Collection", category: "women", note: "All" },
  { label: "Unisex Scents", category: "unisex", note: "All" },
  { label: "Pure Attar", category: "attar", note: "All" },
  { label: "Kids Collection", category: "kids", note: "All" },
  { label: "Oud Accords", category: "All", note: "Oud" },
  { label: "Vanilla Notes", category: "All", note: "Vanilla" },
  { label: "Rose & Floral", category: "All", note: "Rose" },
  { label: "Amber Notes", category: "All", note: "Amber" },
];

export function ProductListing({ initialProducts }: { initialProducts: Product[] }) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { currency, formatPrice } = useCurrency();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const categoryParam = searchParams.get("category");
  const noteParam = searchParams.get("note");
  const sortParam = searchParams.get("sort");
  const sizeParam = searchParams.get("size");
  const priceParam = searchParams.get("price");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  // Local filter states
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeNote, setActiveNote] = useState<string>("All");
  const [activeSize, setActiveSize] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("featured");
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<any>(null);

  // Dynamic price boundaries
  const absoluteMinPrice = useMemo(() => {
    if (initialProducts.length === 0) return 0;
    return Math.min(...initialProducts.map(p => p.sale_price || p.price));
  }, [initialProducts]);

  const absoluteMaxPrice = useMemo(() => {
    if (initialProducts.length === 0) return 10000;
    return Math.max(...initialProducts.map(p => p.sale_price || p.price));
  }, [initialProducts]);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);

  const getProductSize = (product: any) => {
    const title = product.title.toLowerCase();
    if (title.includes("50ml") || title.includes("50 ml")) return "50ml";
    return "100ml";
  };

  const parsePriceRange = (param: string | null) => {
    if (!param) return null;
    const lower = param.toLowerCase();
    if (lower === "under-499") return { min: 0, max: 499 };
    if (lower === "under-999") return { min: 0, max: 999 };
    if (lower === "500-999") return { min: 500, max: 999 };
    if (lower === "1000-1999") return { min: 1000, max: 1999 };
    if (lower === "2000-4999") return { min: 2000, max: 4999 };
    if (lower === "above-5000") return { min: 5000, max: 100000 };
    if (lower.includes("-")) {
      const parts = lower.split("-");
      const min = Number(parts[0]);
      const max = Number(parts[1]);
      if (!isNaN(min) && !isNaN(max)) return { min, max };
    }
    return null;
  };

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
    else setActiveCategory("All");

    if (noteParam) setActiveNote(noteParam);
    else setActiveNote("All");

    if (sizeParam) setActiveSize(sizeParam);
    else setActiveSize("All");

    if (sortParam) setSortOrder(sortParam);
    else setSortOrder("featured");

    const range = parsePriceRange(priceParam);
    if (range) {
      setPriceMin(range.min);
      setPriceMax(range.max);
    } else {
      if (minPriceParam) setPriceMin(Number(minPriceParam));
      else setPriceMin(absoluteMinPrice);
      if (maxPriceParam) setPriceMax(Number(maxPriceParam));
      else setPriceMax(absoluteMaxPrice);
    }
  }, [categoryParam, noteParam, sizeParam, sortParam, priceParam, minPriceParam, maxPriceParam, absoluteMinPrice, absoluteMaxPrice]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    initialProducts.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t: string) => cats.add(t));
      }
    });
    return Array.from(cats);
  }, [initialProducts]);

  const fragranceNotes = useMemo(() => {
    const notesSet = new Set<string>();
    notesSet.add("All");
    initialProducts.forEach((p) => {
      if (p.metadata?.notes && Array.isArray(p.metadata.notes)) {
        p.metadata.notes.forEach((n: any) => {
          if (n.name) notesSet.add(n.name);
        });
      }
    });
    return Array.from(notesSet);
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (activeCategory !== "All") {
      result = result.filter((p) =>
        p.tags && Array.isArray(p.tags) &&
        p.tags.some((t: string) => t.toLowerCase() === activeCategory.toLowerCase())
      );
    }

    if (activeNote !== "All") {
      result = result.filter((p) => {
        const matchesInMetadata = p.metadata?.notes?.some(
          (n: any) => n.name && n.name.toLowerCase().includes(activeNote.toLowerCase())
        );
        const matchesInTags = p.tags?.some(
          (t: string) => t.toLowerCase().includes(activeNote.toLowerCase())
        );
        return matchesInMetadata || matchesInTags;
      });
    }

    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery) ||
        (p.description && p.description.toLowerCase().includes(searchQuery)) ||
        (p.metadata?.accordion?.description && p.metadata.accordion.description.toLowerCase().includes(searchQuery))
      );
    }

    if (activeSize !== "All") {
      result = result.filter((p) => getProductSize(p) === activeSize.toLowerCase());
    }

    result = result.filter((p) => {
      const price = p.sale_price || p.price;
      return price >= priceMin && price <= priceMax;
    });

    if (sortOrder === "price-asc") {
      result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOrder === "best-selling") {
      result.sort((a, b) => (b.metadata?.badge ? 1 : -1));
    }

    return result;
  }, [initialProducts, activeCategory, activeNote, activeSize, priceMin, priceMax, sortOrder, searchQuery]);

  const handleQuickAdd = (product: Product) => {
    const displayPrice = product.sale_price || product.price;
    const image = product.metadata?.images?.[0] || "/assets/placeholder.jpg";

    addItem({
      productId: product.id,
      title: product.title,
      price: displayPrice,
      image,
      quantity: 1
    });
    addToast({ title: "Added to cart", message: `${product.title} has been added.`, type: "success" });
  };

  const clearAllFilters = () => {
    setActiveCategory("All");
    setActiveNote("All");
    setActiveSize("All");
    setPriceMin(absoluteMinPrice);
    setPriceMax(absoluteMaxPrice);
    setSortOrder("featured");
    setTimeout(() => {
      router.push(pathname, { scroll: false });
    }, 0);
  };

  const handlePricePreset = (presetValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    if (presetValue === "all") {
      params.delete("price");
      setPriceMin(absoluteMinPrice);
      setPriceMax(absoluteMaxPrice);
    } else {
      params.set("price", presetValue);
      const range = parsePriceRange(presetValue);
      if (range) {
        setPriceMin(range.min);
        setPriceMax(range.max);
      }
    }
    const qs = params.toString();
    setTimeout(() => {
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, 0);
  };

  const activeFilterCount = (activeCategory !== "All" ? 1 : 0) +
    (activeNote !== "All" ? 1 : 0) +
    (activeSize !== "All" ? 1 : 0) +
    (priceMin > absoluteMinPrice || priceMax < absoluteMaxPrice || !!priceParam ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-6 font-sans overflow-x-hidden">
      
      {/* ── 1. Compact Category Chips Bar for Mobile & Desktop ── */}
      <div className="relative w-full max-w-full overflow-hidden mb-4">
        {/* Soft edge gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10 pointer-events-none" />

        <div className="w-full overflow-x-auto no-scrollbar py-1 scroll-smooth">
          <div className="flex items-center gap-1.5 sm:gap-2.5 w-max px-0.5">
            {QUICK_CATEGORIES.map((chip) => {
              const isSelected =
                (chip.category === "All" && chip.note === "All" && !chip.sort && activeCategory === "All" && activeNote === "All" && sortOrder === "featured") ||
                (chip.category !== "All" && activeCategory.toLowerCase() === chip.category.toLowerCase()) ||
                (chip.note !== "All" && activeNote.toLowerCase() === chip.note.toLowerCase()) ||
                (chip.sort && sortOrder === chip.sort);

              return (
                <button
                  key={chip.label}
                  onClick={() => {
                    if (chip.sort) {
                      setSortOrder(chip.sort);
                    } else {
                      setActiveCategory(chip.category);
                      setActiveNote(chip.note);
                    }
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer border shrink-0 ${
                    isSelected
                      ? "bg-[#121212] text-[#D4AF37] border-[#121212] shadow-2xs font-serif"
                      : "bg-white text-neutral-600 border-[#EAE7E1] hover:border-[#D4AF37] hover:text-[#121212]"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 2. Ultra-Compact Mobile & Desktop Filter Toolbar ── */}
      <div className="bg-white border border-[#EAE7E1] p-2.5 sm:p-4 rounded-2xl mb-6 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          
          {/* Left: Filter Trigger Button */}
          <button
            onClick={() => setIsFilterPanelOpen(true)}
            className="flex items-center gap-1.5 bg-[#121212] hover:bg-[#D4AF37] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all duration-300 shadow-2xs cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#D4AF37] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Middle: Count Info */}
          <span className="text-[11px] sm:text-xs text-neutral-500 font-medium font-mono hidden min-[360px]:inline">
            <strong className="text-[#121212]">{filteredProducts.length}</strong> Perfumes
          </span>

          {/* Right: Sort Selector */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-[#EAE7E1] bg-[#FAF8F5] text-[#121212] px-2.5 sm:px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37] cursor-pointer shadow-2xs shrink-0"
          >
            <option value="featured">Sort: Featured</option>
            <option value="best-selling">Bestsellers</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low-High</option>
            <option value="price-desc">Price: High-Low</option>
          </select>

        </div>

        {/* Embedded Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EAE7E1]">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Active:</span>
            {activeCategory !== "All" && (
              <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#121212] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#EAE7E1]">
                Cat: {activeCategory}
                <button onClick={() => setActiveCategory("All")} className="hover:text-red-600 cursor-pointer"><X size={11} /></button>
              </span>
            )}
            {activeNote !== "All" && (
              <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#121212] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#EAE7E1]">
                Note: {activeNote}
                <button onClick={() => setActiveNote("All")} className="hover:text-red-600 cursor-pointer"><X size={11} /></button>
              </span>
            )}
            {activeSize !== "All" && (
              <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#121212] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#EAE7E1]">
                Size: {activeSize.toUpperCase()}
                <button onClick={() => setActiveSize("All")} className="hover:text-red-600 cursor-pointer"><X size={11} /></button>
              </span>
            )}
            {(!!priceParam || priceMin > absoluteMinPrice || priceMax < absoluteMaxPrice) && (
              <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#121212] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#EAE7E1]">
                Price: {formatPrice(priceMin)}-{formatPrice(priceMax)}
                <button onClick={() => handlePricePreset("all")} className="hover:text-red-600 cursor-pointer"><X size={11} /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#121212] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#EAE7E1]">
                Search: "{searchQuery}"
                <button onClick={() => router.push(pathname)} className="hover:text-red-600 cursor-pointer"><X size={11} /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[10px] text-red-600 font-bold uppercase tracking-wider ml-auto cursor-pointer flex items-center gap-0.5"
            >
              <RefreshCw size={10} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* ── 3. Slide-Over Filter Panel Drawer ── */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterPanelOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[80]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 w-full sm:max-w-md bg-white z-[90] flex flex-col shadow-2xl border-r border-[#EAE7E1] font-sans"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#EAE7E1] bg-[#FAF8F5] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#121212]">
                    Filter & Refine Collection
                  </h3>
                </div>
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-200/50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-7 no-scrollbar bg-white">
                
                {/* Categories */}
                <div>
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-3 text-[#121212] border-b border-[#EAE7E1] pb-2">
                    Collection / Gender
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`text-xs py-2.5 px-3 rounded-xl border font-bold uppercase tracking-wider text-left transition-all duration-300 cursor-pointer flex items-center justify-between ${
                            isActive
                              ? "bg-[#121212] text-[#D4AF37] border-[#121212] shadow-2xs"
                              : "bg-[#FAF8F5] text-neutral-600 border-[#EAE7E1] hover:border-[#D4AF37]"
                          }`}
                        >
                          <span>{cat}</span>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fragrance Notes */}
                {fragranceNotes.length > 1 && (
                  <div>
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-3 text-[#121212] border-b border-[#EAE7E1] pb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Fragrance Accords & Notes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {fragranceNotes.map((note) => {
                        const isActive = activeNote.toLowerCase() === note.toLowerCase();
                        return (
                          <button
                            key={note}
                            onClick={() => setActiveNote(note)}
                            className={`text-xs px-3.5 py-2 border rounded-xl font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                              isActive
                                ? "bg-[#121212] text-[#D4AF37] border-[#121212] shadow-2xs"
                                : "bg-[#FAF8F5] text-neutral-600 border-[#EAE7E1] hover:border-[#D4AF37]"
                            }`}
                          >
                            {note}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bottle Sizes */}
                <div>
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-3 text-[#121212] border-b border-[#EAE7E1] pb-2">
                    Bottle Sizes
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {(["All", "50ml", "100ml"] as const).map((size) => {
                      const isActive = activeSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setActiveSize(size)}
                          className={`text-xs py-2.5 px-3 rounded-xl border font-bold uppercase tracking-wider text-center transition-all duration-300 cursor-pointer ${
                            isActive
                              ? "bg-[#121212] text-[#D4AF37] border-[#121212]"
                              : "bg-[#FAF8F5] text-neutral-600 border-[#EAE7E1] hover:border-[#D4AF37]"
                          }`}
                        >
                          {size === "All" ? "All Sizes" : size.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider mb-3 text-[#121212] border-b border-[#EAE7E1] pb-2">
                    Shop By Price Range
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label: "All Prices", value: "all" },
                      { label: `Under ${formatPrice(499)}`, value: "under-499" },
                      { label: `${formatPrice(500)} - ${formatPrice(999)}`, value: "500-999" },
                      { label: `${formatPrice(1000)} - ${formatPrice(1999)}`, value: "1000-1999" },
                      { label: `${formatPrice(2000)} - ${formatPrice(4999)}`, value: "2000-4999" },
                      { label: `Above ${formatPrice(5000)}`, value: "above-5000" },
                    ].map((p) => {
                      const isSelected = (p.value === "all" && !priceParam && priceMin <= absoluteMinPrice && priceMax >= absoluteMaxPrice) || priceParam === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => handlePricePreset(p.value)}
                          className={`text-xs py-2 px-3 border rounded-xl font-bold text-left transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-[#121212] text-[#D4AF37] border-[#121212]"
                              : "bg-[#FAF8F5] text-neutral-600 border-[#EAE7E1] hover:border-[#D4AF37]"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-3">Custom Range ({currency})</span>
                  <div className="space-y-3 px-1">
                    <div className="relative w-full h-6 flex items-center">
                      <div className="absolute left-0 right-0 h-1.5 bg-neutral-100 rounded-full" />
                      <div 
                        className="absolute h-1.5 bg-[#D4AF37] rounded-full" 
                        style={{
                          left: `${((priceMin - absoluteMinPrice) / (absoluteMaxPrice - absoluteMinPrice || 1)) * 100}%`,
                          right: `${100 - ((priceMax - absoluteMinPrice) / (absoluteMaxPrice - absoluteMinPrice || 1)) * 100}%`
                        }}
                      />
                      <input
                        type="range"
                        min={absoluteMinPrice}
                        max={absoluteMaxPrice}
                        value={priceMin}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), priceMax - 100);
                          setPriceMin(val);
                        }}
                        className="absolute w-full h-1.5 appearance-none pointer-events-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#121212] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#D4AF37] [&::-webkit-slider-thumb]:cursor-pointer"
                        style={{ zIndex: priceMin > absoluteMaxPrice - 100 ? 5 : 3 }}
                      />
                      <input
                        type="range"
                        min={absoluteMinPrice}
                        max={absoluteMaxPrice}
                        value={priceMax}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), priceMin + 100);
                          setPriceMax(val);
                        }}
                        className="absolute w-full h-1.5 appearance-none pointer-events-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#121212] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#D4AF37] [&::-webkit-slider-thumb]:cursor-pointer"
                        style={{ zIndex: 4 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold font-mono text-[#121212]">
                      <span>{formatPrice(priceMin)}</span>
                      <span>{formatPrice(priceMax)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-[#EAE7E1] bg-[#FAF8F5] flex gap-3 shrink-0">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 text-xs font-bold border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white uppercase tracking-widest transition-all cursor-pointer rounded-xl bg-white"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="flex-1 py-3 text-xs font-bold bg-[#121212] hover:bg-[#D4AF37] text-white uppercase tracking-widest transition-all cursor-pointer rounded-xl shadow-md"
                >
                  Apply ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── 4. Main Product Grid ── */}
      <div className="pt-1">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-[#FAF8F5] border border-dashed border-[#EAE7E1] rounded-2xl">
            <p className="text-base text-neutral-600 font-serif mb-4">No luxury perfumes match your selected filters.</p>
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold uppercase tracking-widest bg-[#121212] text-white px-8 py-3.5 hover:bg-[#D4AF37] transition-colors cursor-pointer rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard 
                    product={product} 
                    onQuickAdd={() => handleQuickAdd(product)} 
                    onQuickView={() => setSelectedQuickViewProduct(product)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedQuickViewProduct && (
        <QuickViewModal
          product={selectedQuickViewProduct}
          isOpen={!!selectedQuickViewProduct}
          onClose={() => setSelectedQuickViewProduct(null)}
        />
      )}

    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, RefreshCw, Sparkles, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { QuickViewModal } from "./QuickViewModal";

type Product = any;

export function ProductListing({ initialProducts }: { initialProducts: Product[] }) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const categoryParam = searchParams.get("category");
  const noteParam = searchParams.get("note");
  const sortParam = searchParams.get("sort");
  const sizeParam = searchParams.get("size");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  // Local filter states
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeNote, setActiveNote] = useState<string>("All");
  const [activeSize, setActiveSize] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("featured");
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<any>(null);

  // Dynamic absolute price boundaries based on catalog data
  const absoluteMinPrice = useMemo(() => {
    if (initialProducts.length === 0) return 0;
    return Math.min(...initialProducts.map(p => p.sale_price || p.price));
  }, [initialProducts]);

  const absoluteMaxPrice = useMemo(() => {
    if (initialProducts.length === 0) return 10000;
    return Math.max(...initialProducts.map(p => p.sale_price || p.price));
  }, [initialProducts]);

  // Price slider states
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);

  // Helper to extract product size from title/metadata
  const getProductSize = (product: any) => {
    const title = product.title.toLowerCase();
    if (title.includes("50ml") || title.includes("50 ml")) return "50ml";
    return "100ml";
  };

  // Sync states with URL parameters on mount
  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
    if (noteParam) setActiveNote(noteParam);
    if (sizeParam) setActiveSize(sizeParam);
    if (sortParam) setSortOrder(sortParam);
    if (minPriceParam) setPriceMin(Number(minPriceParam));
    else setPriceMin(absoluteMinPrice);
    if (maxPriceParam) setPriceMax(Number(maxPriceParam));
    else setPriceMax(absoluteMaxPrice);
  }, [categoryParam, noteParam, sizeParam, sortParam, minPriceParam, maxPriceParam, absoluteMinPrice, absoluteMaxPrice]);

  // Sync state changes back to the browser's URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (activeNote !== "All") params.set("note", activeNote);
    if (activeSize !== "All") params.set("size", activeSize);
    if (priceMin > absoluteMinPrice) params.set("minPrice", priceMin.toString());
    if (priceMax < absoluteMaxPrice) params.set("maxPrice", priceMax.toString());
    if (sortOrder !== "featured") params.set("sort", sortOrder);
    if (searchQuery) params.set("q", searchQuery);

    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [activeCategory, activeNote, activeSize, priceMin, priceMax, sortOrder, searchQuery, absoluteMinPrice, absoluteMaxPrice]);

  // Extract unique categories (from tags)
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

  // Extract unique fragrance notes
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

  // Apply Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category Filter (Case insensitive match with tags)
    if (activeCategory !== "All") {
      result = result.filter((p) =>
        p.tags && Array.isArray(p.tags) &&
        p.tags.some((t: string) => t.toLowerCase() === activeCategory.toLowerCase())
      );
    }

    // Fragrance Note Filter
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

    // Search Query Filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery) ||
        (p.description && p.description.toLowerCase().includes(searchQuery)) ||
        (p.metadata?.accordion?.description && p.metadata.accordion.description.toLowerCase().includes(searchQuery))
      );
    }

    // Size Filter
    if (activeSize !== "All") {
      result = result.filter((p) => getProductSize(p) === activeSize.toLowerCase());
    }

    // Price Slider Filter
    result = result.filter((p) => {
      const price = p.sale_price || p.price;
      return price >= priceMin && price <= priceMax;
    });

    // Sorting
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
    router.push(pathname);
  };

  const hasActiveFilters = 
    activeCategory !== "All" || 
    activeNote !== "All" || 
    activeSize !== "All" || 
    priceMin > absoluteMinPrice || 
    priceMax < absoluteMaxPrice || 
    searchQuery;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-10 font-sans">
      
      {/* Mobile Filter Header Button */}
      <div className="lg:hidden flex items-center justify-between pb-4 border-b border-gray-200">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-5 py-3 rounded-none cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filter & Sort
        </button>
        <span className="text-xs font-medium text-gray-500">{filteredProducts.length} Products Found</span>
      </div>

      {/* Desktop Sidebar Filters */}
      <div className="hidden lg:block w-70 shrink-0 space-y-8 bg-white p-6 border border-gray-100 rounded-lg shadow-xs h-fit">
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-4 h-4 text-accent" /> Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-red-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 animate-spin-hover" /> Reset
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] mb-4 text-[#1A1A1A] border-b border-neutral-100 pb-2">Collection / Tag</h4>
          <div className="flex flex-col gap-1.5">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left text-xs py-2 px-1 transition-all duration-300 cursor-pointer border-l-2 ${
                    isActive
                      ? "border-[#D4AF37] pl-3 text-[#1A1A1A] font-bold tracking-wider"
                      : "border-transparent pl-2 text-neutral-500 hover:text-black hover:border-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fragrance Notes Filter */}
        {fragranceNotes.length > 1 && (
          <div className="border-t border-neutral-100 pt-6">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] mb-4 text-[#1A1A1A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Fragrance Notes
            </h4>
            <div className="flex flex-wrap gap-2">
              {fragranceNotes.map((note) => {
                const isActive = activeNote.toLowerCase() === note.toLowerCase();
                return (
                  <button
                    key={note}
                    onClick={() => setActiveNote(note)}
                    className={`text-[10px] px-3 py-1.5 border uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#1A1A1A] font-semibold"
                        : "border-neutral-200 text-neutral-500 hover:border-neutral-400 bg-transparent"
                    }`}
                  >
                    {note}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size Filter */}
        <div className="border-t border-neutral-100 pt-6">
          <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] mb-4 text-[#1A1A1A]">Size Options</h4>
          <div className="flex flex-col gap-1.5">
            {(["All", "50ml", "100ml"] as const).map((size) => {
              const isActive = activeSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setActiveSize(size)}
                  className={`text-left text-xs py-2 px-1 transition-all duration-300 cursor-pointer border-l-2 ${
                    isActive
                      ? "border-[#D4AF37] pl-3 text-[#1A1A1A] font-bold tracking-wider"
                      : "border-transparent pl-2 text-neutral-500 hover:text-black hover:border-neutral-200"
                  }`}
                >
                  {size === "All" ? "All Sizes" : size.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual-Thumb Price Slider */}
        <div className="border-t border-gray-100 pt-6">
          <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-700">Price (₹)</h4>
          <div className="space-y-4 px-1">
            <div className="relative w-full h-6 flex items-center">
              {/* Slider Track background */}
              <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
              {/* Slider Active Track fill */}
              <div 
                className="absolute h-1 bg-black rounded-full" 
                style={{
                  left: `${((priceMin - absoluteMinPrice) / (absoluteMaxPrice - absoluteMinPrice || 1)) * 100}%`,
                  right: `${100 - ((priceMax - absoluteMinPrice) / (absoluteMaxPrice - absoluteMinPrice || 1)) * 100}%`
                }}
              />
              {/* Min Thumb input */}
              <input
                type="range"
                min={absoluteMinPrice}
                max={absoluteMaxPrice}
                value={priceMin}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), priceMax - 100);
                  setPriceMin(val);
                }}
                className="absolute w-full h-1 appearance-none pointer-events-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer"
                style={{ zIndex: priceMin > absoluteMaxPrice - 100 ? 5 : 3 }}
              />
              {/* Max Thumb input */}
              <input
                type="range"
                min={absoluteMinPrice}
                max={absoluteMaxPrice}
                value={priceMax}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), priceMin + 100);
                  setPriceMax(val);
                }}
                className="absolute w-full h-1 appearance-none pointer-events-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer"
                style={{ zIndex: 4 }}
              />
            </div>
            {/* Display Values */}
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 font-mono">
              <span>₹{priceMin.toLocaleString()}</span>
              <span>₹{priceMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-white z-50 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="font-bold uppercase tracking-widest text-sm">Filter Products</span>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 -mr-2 cursor-pointer">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-500">Categories</h4>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); }}
                        className={`text-left text-sm py-2 px-3 rounded cursor-pointer ${
                          activeCategory.toLowerCase() === cat.toLowerCase()
                            ? "bg-black text-white font-bold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {fragranceNotes.length > 1 && (
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-500">Fragrance Notes</h4>
                    <div className="flex flex-wrap gap-2">
                      {fragranceNotes.map((note) => (
                        <button
                          key={note}
                          onClick={() => { setActiveNote(note); }}
                          className={`text-xs px-3 py-1.5 border cursor-pointer ${
                            activeNote.toLowerCase() === note.toLowerCase()
                              ? "border-black bg-black text-white font-bold"
                              : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {note}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-500">Sizes</h4>
                  <div className="flex gap-2">
                    {(["All", "50ml", "100ml"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => { setActiveSize(size); }}
                        className={`text-xs px-4 py-2 border cursor-pointer ${
                          activeSize === size
                            ? "border-black bg-black text-white font-bold"
                            : "border-gray-200 text-gray-700"
                        }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-500">Price (₹)</h4>
                  <div className="space-y-4 px-1">
                    <div className="relative w-full h-6 flex items-center">
                      <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
                      <div 
                        className="absolute h-1 bg-black rounded-full" 
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
                        className="absolute w-full h-1 appearance-none pointer-events-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer"
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
                        className="absolute w-full h-1 appearance-none pointer-events-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer"
                        style={{ zIndex: 4 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 font-mono">
                      <span>₹{priceMin.toLocaleString()}</span>
                      <span>₹{priceMax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 text-xs font-bold border border-gray-200 uppercase tracking-widest cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 py-3 text-xs font-bold bg-black text-white uppercase tracking-widest cursor-pointer"
                >
                  Apply ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Grid Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Sorting & Active Filters Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Showing <span className="font-bold text-black">{filteredProducts.length}</span> Products
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sort By:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-xs font-bold uppercase tracking-wider border border-gray-200 bg-white px-3 py-2 rounded focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="best-selling">Bestsellers</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
            <span className="text-xs text-gray-400 font-medium">Active Filters:</span>
            {activeCategory !== "All" && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Category: {activeCategory}
                <button onClick={() => setActiveCategory("All")} className="hover:text-red-600 ml-1 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {activeNote !== "All" && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Note: {activeNote}
                <button onClick={() => setActiveNote("All")} className="hover:text-red-600 ml-1 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {activeSize !== "All" && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Size: {activeSize.toUpperCase()}
                <button onClick={() => setActiveSize("All")} className="hover:text-red-600 ml-1 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            {(priceMin > absoluteMinPrice || priceMax < absoluteMaxPrice) && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Price: ₹{priceMin.toLocaleString()} - ₹{priceMax.toLocaleString()}
                <button 
                  onClick={() => {
                    setPriceMin(absoluteMinPrice);
                    setPriceMax(absoluteMaxPrice);
                  }} 
                  className="hover:text-red-600 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Search: "{searchQuery}"
                <button onClick={() => router.push(pathname)} className="hover:text-red-600 ml-1 cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:underline font-bold uppercase tracking-wider ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="pt-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-lg">
              <p className="text-base text-gray-600 font-medium mb-4">No perfumes found matching your selected filters.</p>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold uppercase tracking-widest bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
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

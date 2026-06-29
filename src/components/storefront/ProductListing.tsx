"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, RefreshCw, Sparkles, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";

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

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeNote, setActiveNote] = useState<string>("All");
  const [activePrice, setActivePrice] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("featured");

  // Sync state with URL Search Params on load or changes
  useEffect(() => {
    if (categoryParam) {
      const matchedCat = categories.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase()
      );
      setActiveCategory(matchedCat || categoryParam);
    }
    if (noteParam) {
      setActiveNote(noteParam);
    }
    if (sortParam) {
      if (sortParam === "best-selling") setSortOrder("best-selling");
      else setSortOrder(sortParam);
    }
  }, [categoryParam, noteParam, sortParam]);

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

  const priceRanges = [
    { label: "All Prices", value: "All" },
    { label: "Under ₹999", value: "under-999", check: (p: number) => p < 999 },
    { label: "₹1,000 - ₹1,999", value: "1000-1999", check: (p: number) => p >= 1000 && p <= 1999 },
    { label: "₹2,000 - ₹2,999", value: "2000-2999", check: (p: number) => p >= 2000 && p <= 2999 },
    { label: "Above ₹3,000", value: "above-3000", check: (p: number) => p >= 3000 },
  ];

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

    // Price Filter
    if (activePrice !== "All") {
      const range = priceRanges.find((r) => r.value === activePrice);
      if (range && range.check) {
        result = result.filter((p) => {
          const price = p.sale_price || p.price;
          return range.check(price);
        });
      }
    }

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
  }, [initialProducts, activeCategory, activeNote, activePrice, sortOrder, searchQuery]);

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
    setActivePrice("All");
    setSortOrder("featured");
    router.push(pathname);
  };

  const hasActiveFilters = activeCategory !== "All" || activeNote !== "All" || activePrice !== "All" || searchQuery;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-10 font-sans">
      
      {/* Mobile Filter Header Button */}
      <div className="lg:hidden flex items-center justify-between pb-4 border-b border-gray-200">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-5 py-3 rounded-none"
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
              className="text-[11px] text-red-600 hover:underline flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-700">Collection / Tag</h4>
          <div className="flex flex-col gap-2.5">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center justify-between text-left text-xs py-1.5 px-2.5 rounded transition-all ${
                    isActive
                      ? "bg-black text-white font-bold tracking-wide"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fragrance Notes Filter */}
        {fragranceNotes.length > 1 && (
          <div className="border-t border-gray-100 pt-6">
            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Fragrance Notes
            </h4>
            <div className="flex flex-wrap gap-2">
              {fragranceNotes.map((note) => {
                const isActive = activeNote.toLowerCase() === note.toLowerCase();
                return (
                  <button
                    key={note}
                    onClick={() => setActiveNote(note)}
                    className={`text-xs px-3 py-1.5 border transition-all ${
                      isActive
                        ? "border-black bg-black text-white font-semibold"
                        : "border-gray-200 text-gray-600 hover:border-gray-400 bg-gray-50"
                    }`}
                  >
                    {note}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="border-t border-gray-100 pt-6">
          <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-700">Price Range</h4>
          <div className="flex flex-col gap-2.5">
            {priceRanges.map((range) => {
              const isActive = activePrice === range.value;
              return (
                <button
                  key={range.value}
                  onClick={() => setActivePrice(range.value)}
                  className={`flex items-center justify-between text-left text-xs py-1.5 px-2.5 rounded transition-all ${
                    isActive
                      ? "bg-black text-white font-bold tracking-wide"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <span>{range.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </button>
              );
            })}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
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
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 -mr-2">
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
                        onClick={() => { setActiveCategory(cat); setIsMobileFiltersOpen(false); }}
                        className={`text-left text-sm py-2 px-3 rounded ${
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
                          onClick={() => { setActiveNote(note); setIsMobileFiltersOpen(false); }}
                          className={`text-xs px-3 py-1.5 border ${
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
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-500">Price</h4>
                  <div className="flex flex-col gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => { setActivePrice(range.value); setIsMobileFiltersOpen(false); }}
                        className={`text-left text-sm py-2 px-3 rounded ${
                          activePrice === range.value
                            ? "bg-black text-white font-bold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 text-xs font-bold border border-gray-200 uppercase tracking-widest"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 py-3 text-xs font-bold bg-black text-white uppercase tracking-widest"
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
                <button onClick={() => setActiveCategory("All")} className="hover:text-red-600 ml-1"><X className="w-3 h-3" /></button>
              </span>
            )}
            {activeNote !== "All" && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Note: {activeNote}
                <button onClick={() => setActiveNote("All")} className="hover:text-red-600 ml-1"><X className="w-3 h-3" /></button>
              </span>
            )}
            {activePrice !== "All" && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Price: {priceRanges.find(r => r.value === activePrice)?.label}
                <button onClick={() => setActivePrice("All")} className="hover:text-red-600 ml-1"><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Search: "{searchQuery}"
                <button onClick={() => router.push(pathname)} className="hover:text-red-600 ml-1"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:underline font-bold uppercase tracking-wider ml-2"
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
                className="text-xs font-bold uppercase tracking-widest bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
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
                    <ProductCard product={product} onQuickAdd={() => handleQuickAdd(product)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

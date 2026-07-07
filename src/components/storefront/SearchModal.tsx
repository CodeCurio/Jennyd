"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, History, TrendingUp, ArrowRight, CornerDownLeft, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/Skeleton";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync keyboard events & body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
      
      // Load recent searches
      const saved = localStorage.getItem("jennyd-recent-searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing recent searches", e);
        }
      }

      // Fetch trending products
      fetchTrending();
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Debounce input value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results from Supabase database
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .limit(5);

        if (error) throw error;
        
        if (data) {
          setResults(data);
          setActiveIndex(-1);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const fetchTrending = async () => {
    try {
      const { data } = await supabase
        .from("products")
        .select("*")
        .limit(3);
      if (data) setTrendingProducts(data);
    } catch (e) {
      console.error("Error fetching trending products:", e);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const searchVal = query.trim();
    if (!searchVal) return;

    saveRecentSearch(searchVal);
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchVal)}`);
  };

  const saveRecentSearch = (searchVal: string) => {
    const updated = [searchVal, ...recentSearches.filter((item) => item.toLowerCase() !== searchVal.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("jennyd-recent-searches", JSON.stringify(updated));
  };

  // Delete single recent search item
  const removeRecentSearch = (e: React.MouseEvent, searchVal: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item.toLowerCase() !== searchVal.toLowerCase());
    setRecentSearches(updated);
    localStorage.setItem("jennyd-recent-searches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("jennyd-recent-searches");
  };

  const handleRecentSearchClick = (searchVal: string) => {
    setQuery(searchVal);
    saveRecentSearch(searchVal);
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchVal)}`);
  };

  const handleProductClick = (slug: string, title: string) => {
    saveRecentSearch(title);
    onClose();
    router.push(`/products/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    const totalItems = results.length;
    if (totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < totalItems) {
        const selectedProduct = results[activeIndex];
        handleProductClick(selectedProduct.slug, selectedProduct.title);
      } else {
        handleSearchSubmit();
      }
    }
  };

  const POPULAR_CATEGORIES = [
    { label: "Oud Collection", href: "/products?category=Oud" },
    { label: "Floral Scents", href: "/products?category=Floral" },
    { label: "Woody Series", href: "/products?category=Woody" },
    { label: "Gift Sets", href: "/products?category=Gifts" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Frosted Glass Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#FAF9F6]/97 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-50 bg-[#FAF9F6] border-b border-[#1a1a1a]/5 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] max-h-screen overflow-y-auto"
            onKeyDown={handleKeyDown}
          >
            {/* Minimalist Top Close Button - Hidden on mobile, shown on desktop */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-6 right-6 md:top-10 md:right-16 flex-col items-center gap-1 group cursor-pointer"
              aria-label="Close search overlay"
            >
              <div className="w-10 h-10 border border-black/5 hover:border-black rounded-full flex items-center justify-center transition-all duration-300 bg-white shadow-xs">
                <X className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
              </div>
              <span className="text-[9px] tracking-widest text-neutral-400 group-hover:text-black uppercase select-none transition-colors mt-1 font-mono">
                ESC
              </span>
            </button>

            <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-24 md:pb-20">
              
              {/* Premium Search Input Area */}
              <div className="relative pb-5 md:pb-8 border-b border-black/5">
                <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-[#6B6B6B] uppercase font-bold mb-3 md:mb-4 block">
                  What are you looking for?
                </span>
                <div className="flex items-center gap-3 md:gap-4">
                  <Search className="w-6 h-6 md:w-8 md:h-8 text-neutral-350 shrink-0" />
                  <form onSubmit={handleSearchSubmit} className="flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search scents, notes..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full text-xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-light italic text-[#1A1A1A] placeholder-neutral-300 bg-transparent border-none outline-none focus:ring-0 focus:outline-none"
                    />
                  </form>
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="p-1.5 hover:bg-black/5 rounded-full transition-colors text-neutral-400 hover:text-black shrink-0 cursor-pointer"
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="text-xs uppercase tracking-wider font-bold text-neutral-500 hover:text-black shrink-0 md:hidden ml-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Suggestions Grid */}
              <div className="py-6 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                
                {/* Left Side: Recent Searches & Categories (5 cols) */}
                <div className="md:col-span-5 space-y-10">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && !query && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B6B6B] flex items-center gap-2">
                          <History className="w-4 h-4 text-neutral-400" /> Recent Searches
                        </span>
                        <button
                          onClick={clearRecentSearches}
                          className="text-[10px] font-semibold text-red-600 hover:underline cursor-pointer tracking-wider uppercase"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-col gap-1">
                        {recentSearches.map((search, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleRecentSearchClick(search)}
                            className="flex items-center justify-between text-left text-sm py-2.5 px-3 hover:bg-black/5 text-[#1A1A1A]/85 hover:text-black rounded transition-all cursor-pointer group/item"
                          >
                            <span className="truncate pr-4">{search}</span>
                            <div className="flex items-center gap-2">
                              {/* Single item delete button */}
                              <button
                                onClick={(e) => removeRecentSearch(e, search)}
                                className="p-1 hover:bg-red-50 text-neutral-300 hover:text-red-600 rounded transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
                                title="Remove search from history"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover/item:text-black transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Categories */}
                  <div className="space-y-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B6B6B] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-neutral-400" /> Popular Categories
                    </span>
                    <div className="flex flex-col gap-2">
                      {POPULAR_CATEGORIES.map((cat, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onClose();
                            router.push(cat.href);
                          }}
                          className="flex items-center justify-between text-left text-xs uppercase font-semibold tracking-wider px-4 py-3 border border-black/5 hover:border-black transition-all duration-300 rounded-none bg-white hover:shadow-xs group cursor-pointer"
                        >
                          <span>{cat.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-black transition-all group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Autocomplete Results or Trending Scents (7 cols) */}
                <div className="md:col-span-7 space-y-6">
                  {query ? (
                    <>
                      <div className="flex items-center justify-between border-b border-black/5 pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B6B6B]">
                          {isLoading ? "Searching catalog..." : `Search Results (${results.length})`}
                        </span>
                        {results.length > 0 && (
                          <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 select-none">
                            arrows <CornerDownLeft className="w-2.5 h-2.5 inline" /> to select
                          </span>
                        )}
                      </div>

                      {isLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 items-center">
                              <Skeleton className="w-16 h-20 shrink-0" />
                              <div className="flex-1 space-y-2.5">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-2/3" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : results.length > 0 ? (
                        <div className="space-y-2">
                          {results.map((product, idx) => {
                            const isSelected = idx === activeIndex;
                            const image = product.metadata?.images?.[0] || "/assets/placeholder.jpg";
                            const isSale = !!(product.sale_price || product.salePrice);
                            const displayPrice = isSale ? (product.sale_price || product.salePrice) : product.price;

                            return (
                              <div
                                key={product.id}
                                onClick={() => handleProductClick(product.slug, product.title)}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={`flex gap-5 p-3.5 items-center cursor-pointer transition-all border group ${
                                  isSelected 
                                    ? "bg-white border-[#1a1a1a]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] scale-[1.01]" 
                                    : "border-transparent hover:bg-white/40"
                                }`}
                              >
                                {/* Thumbnail Image Container with Hover Scale */}
                                <div className="relative w-16 h-20 bg-white border border-[#1a1a1a]/5 rounded overflow-hidden shrink-0">
                                  <Image
                                    src={image}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    unoptimized
                                  />
                                </div>
                                
                                {/* Product metadata details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-serif text-lg text-[#1A1A1A] group-hover:text-accent transition-colors truncate">
                                    {product.title}
                                  </h4>
                                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest truncate mt-0.5">
                                    {product.tags?.join(" | ") || "Collection"}
                                  </p>
                                  {product.metadata?.notes && (
                                    <p className="text-xs text-neutral-500 truncate mt-1">
                                      Notes: {product.metadata.notes.map((n: any) => n.name).join(", ")}
                                    </p>
                                  )}
                                </div>
                                
                                {/* Pricing column */}
                                <div className="text-right shrink-0">
                                  <p className={`text-sm font-semibold ${isSale ? 'text-sale' : 'text-[#1A1A1A]'}`}>
                                    ₹{displayPrice}
                                  </p>
                                  {isSale && (
                                    <p className="text-xs text-neutral-400 line-through mt-0.5">
                                      ₹{product.price}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Full Search Results submission trigger link */}
                          <button
                            onClick={() => handleSearchSubmit()}
                            className="w-full text-center text-xs font-bold uppercase tracking-widest text-accent hover:text-black py-4 border-t border-black/5 hover:underline transition-colors mt-2 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            View all results for "{query}" <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-16 text-center border border-dashed border-neutral-200 bg-white/40">
                          <p className="text-sm font-medium text-neutral-500">No fragrances found matching "{query}"</p>
                          <p className="text-xs text-neutral-400 mt-1">Try checking your spelling or typing notes like "oud", "rose", or "woody".</p>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Curated Trending Scents */
                    <div className="space-y-4">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B6B6B] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Trending Scents
                      </span>
                      <div className="space-y-3">
                        {trendingProducts.map((product) => {
                          const image = product.metadata?.images?.[0] || "/assets/placeholder.jpg";
                          const isSale = !!(product.sale_price || product.salePrice);
                          const displayPrice = isSale ? (product.sale_price || product.salePrice) : product.price;

                          return (
                            <div
                              key={product.id}
                              onClick={() => handleProductClick(product.slug, product.title)}
                              className="flex gap-4 p-3 items-center bg-white/60 hover:bg-white border border-[#1a1a1a]/5 hover:border-[#1a1a1a]/10 hover:shadow-xs rounded-none cursor-pointer transition-all group"
                            >
                              <div className="relative w-14 h-18 bg-white border border-[#1a1a1a]/5 rounded overflow-hidden shrink-0">
                                <Image
                                  src={image}
                                  alt={product.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-base text-[#1A1A1A] truncate group-hover:text-accent transition-colors">
                                  {product.title}
                                </h4>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest truncate mt-0.5">
                                  {product.tags?.join(" | ") || "Fragrance"}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-semibold text-black">₹{displayPrice}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

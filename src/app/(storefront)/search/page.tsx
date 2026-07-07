"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Loader2, Compass, AlertCircle, Sparkles, Trash2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";
  
  const [searchInput, setSearchInput] = useState(queryParam);
  const [products, setProducts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const { addItem } = useCart();
  const { addToast } = useToast();

  // Synchronize SEO Title & Meta tags
  useEffect(() => {
    const titleText = queryParam 
      ? `Search results for "${queryParam}" | Jennyd Perfumes`
      : `Search Our Evocative Scents | Jennyd Perfumes`;
    document.title = titleText;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        queryParam 
          ? `Discover premium fragrances matching your search for "${queryParam}". Find your next signature scent.`
          : "Search and explore the Jennyd collection of luxury perfumes, attars, and custom fragrance gift sets."
      );
    }
  }, [queryParam]);

  // Sync search input state when URL param changes
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  // Load recent searches and recommendations on mount
  useEffect(() => {
    const saved = localStorage.getItem("jennyd-recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    fetchRecommendations();
  }, []);

  // Perform search query from Supabase
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!queryParam.trim()) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(`title.ilike.%${queryParam}%,description.ilike.%${queryParam}%`);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [queryParam]);

  const fetchRecommendations = async () => {
    try {
      const { data } = await supabase
        .from("products")
        .select("*")
        .limit(4);
      if (data) setRecommendations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchVal = searchInput.trim();
    if (!searchVal) return;

    saveRecentSearch(searchVal);
    router.push(`/search?q=${encodeURIComponent(searchVal)}`);
  };

  const saveRecentSearch = (searchVal: string) => {
    const updated = [searchVal, ...recentSearches.filter((s) => s.toLowerCase() !== searchVal.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("jennyd-recent-searches", JSON.stringify(updated));
  };

  // Remove individual recent search item from search page
  const handleRemoveSearchItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s.toLowerCase() !== item.toLowerCase());
    setRecentSearches(updated);
    localStorage.setItem("jennyd-recent-searches", JSON.stringify(updated));
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("jennyd-recent-searches");
  };

  const handleQuickAdd = (product: any) => {
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

  const POPULAR_TAGS = [
    { label: "Oud Collection", q: "Oud" },
    { label: "Floral Series", q: "Floral" },
    { label: "Woody Perfumes", q: "Woody" },
    { label: "Premium Attars", q: "Attar" }
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-12 pb-24 font-sans text-[#1A1A1A]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Elegant Search Bar Header */}
        <section className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-accent uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold block">
            Search Our Scent Library
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-8" id="search-title-heading">
            {queryParam ? (
              <>
                Search results for <span className="italic font-normal">"{queryParam}"</span>
              </>
            ) : (
              "Explore Fragrances"
            )}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mx-auto" id="search-page-form">
            <input
              type="text"
              placeholder="Search by notes, ingredients, scent family..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-16 px-6 pl-14 pr-16 bg-white border border-[#1a1a1a]/5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-base rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.015)] transition-all font-serif italic"
              id="search-page-input"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <button
              type="submit"
              className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-accent transition-colors cursor-pointer"
              id="search-page-submit"
            >
              Search
            </button>
          </form>

          {/* Popular Tag suggestions below input */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">Suggested:</span>
            {POPULAR_TAGS.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchInput(tag.q);
                  router.push(`/search?q=${encodeURIComponent(tag.q)}`);
                }}
                className="text-xs font-semibold px-4 py-2 bg-white hover:bg-black hover:text-white border border-[#1a1a1a]/5 hover:border-black rounded-none transition-all cursor-pointer shadow-xs"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-[#1a1a1a]/5 my-12" />

        {/* Content results area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-xs uppercase tracking-widest font-bold">Searching catalog database...</p>
          </div>
        ) : queryParam.trim() ? (
          // IF SEARCH TERM SPECIFIED
          <div>
            {products.length > 0 ? (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between border-b border-black/5 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Showing {products.length} matching perfumes
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        slug: product.slug,
                        title: product.title,
                        price: product.price,
                        salePrice: product.sale_price,
                        image: product.metadata?.images?.[0] || "/assets/product image 1.jpeg",
                        badge: product.metadata?.badge
                      }}
                      onQuickAdd={() => handleQuickAdd(product)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // EMPTY RESULTS STATE
              <div className="max-w-xl mx-auto text-center py-16 space-y-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[#FAF9F6] border border-black/5 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-xs">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-serif italic">No Perfumes Found</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed max-w-md mx-auto">
                    We couldn't find any products matching "{queryParam}". Check your spelling or search for notes like "floral", "musk", or "woody".
                  </p>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="border-t border-black/5 pt-12 space-y-8 text-left">
                    <h4 className="font-serif text-xl text-center flex items-center justify-center gap-1.5 font-light">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Recommended Just for You
                    </h4>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      {recommendations.slice(0, 2).map((product) => (
                        <ProductCard
                          key={product.id}
                          product={{
                            id: product.id,
                            slug: product.slug,
                            title: product.title,
                            price: product.price,
                            salePrice: product.sale_price,
                            image: product.metadata?.images?.[0] || "/assets/product image 1.jpeg",
                            badge: product.metadata?.badge
                          }}
                          onQuickAdd={() => handleQuickAdd(product)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // IF NO SEARCH TERM SPECIFIED
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Left side: Recent searches (4 cols) */}
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-accent" /> Recent Searches
                </span>
                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearRecent}
                    className="text-[10px] font-bold text-red-650 hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {recentSearches.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {recentSearches.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchInput(s);
                        router.push(`/search?q=${encodeURIComponent(s)}`);
                      }}
                      className="flex items-center justify-between text-left text-sm py-3 px-4 bg-white border border-[#1a1a1a]/5 hover:border-black transition-all cursor-pointer group shadow-xs"
                    >
                      <span className="truncate pr-4">{s}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Single search item delete button */}
                        <button
                          onClick={(e) => handleRemoveSearchItem(e, s)}
                          className="p-1 hover:bg-red-50 text-neutral-350 hover:text-red-600 rounded transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white border border-dashed border-neutral-200">
                  <p className="text-xs text-neutral-400 font-medium">Your search history is empty.</p>
                </div>
              )}
            </div>

            {/* Right side: Trending Scents (8 cols) */}
            <div className="md:col-span-8 space-y-6">
              <div className="border-b border-black/5 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Trending Scents
                </span>
              </div>
              
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {recommendations.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        slug: product.slug,
                        title: product.title,
                        price: product.price,
                        salePrice: product.sale_price,
                        image: product.metadata?.images?.[0] || "/assets/product image 1.jpeg",
                        badge: product.metadata?.badge
                      }}
                      onQuickAdd={() => handleQuickAdd(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-neutral-400">
                  Loading trending scents...
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

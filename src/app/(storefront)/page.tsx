"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Award, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/lib/store/CurrencyContext";

const HERO_SLIDES = [
  {
    image: "/assets/Banner-1.jpeg",
    tabletImage: "/assets/Mobile-banner1.jpeg",
    mobileImage: "/assets/Mobile-banner1.jpeg",
    title: "",
    subtitle: "",
    cta: "",
    link: "/products"
  },
  {
    image: "/assets/Banner-2.jpeg",
    tabletImage: "/assets/Mobile-banner2.jpeg",
    mobileImage: "/assets/Mobile-banner2.jpeg",
    title: "",
    subtitle: "",
    cta: "",
    link: "/products"
  },
  {
    image: "/assets/Banner-3.jpeg",
    tabletImage: "/assets/Mobile-banner3.png",
    mobileImage: "/assets/Mobile-banner3.png",
    title: "",
    subtitle: "",
    cta: "",
    link: "/products"
  }
];


const MOCK_PRODUCTS = [
  { id: "1", title: "Oud Royale Extrait", price: 2499, salePrice: 1999, image: "/assets/product image 1.jpeg", slug: "oud-royale", badge: "Best Seller" },
  { id: "2", title: "Velvet Rose & Vanilla", price: 1899, image: "/assets/product image 2.jpeg", slug: "velvet-rose" },
  { id: "3", title: "Midnight Amber Intense", price: 2999, salePrice: 2499, image: "/assets/product image 3.jpeg", slug: "midnight-amber", badge: "New" },
  { id: "4", title: "Citrus Breeze Eau De Parfum", price: 1499, image: "/assets/product image 4.jpeg", slug: "citrus-breeze" },
];

const MOCK_BEST_SELLERS = [
  { id: "b1", title: "Oud Royale Extrait", price: 2499, salePrice: 1999, image: "/assets/product image 1.jpeg", slug: "oud-royale", badge: "Best Seller" },
  { id: "b2", title: "Midnight Amber Intense", price: 2999, salePrice: 2499, image: "/assets/product image 3.jpeg", slug: "midnight-amber", badge: "Best Seller" },
  { id: "b3", title: "Velvet Rose & Vanilla", price: 1899, image: "/assets/product image 2.jpeg", slug: "velvet-rose", badge: "Best Seller" },
  { id: "b4", title: "Citrus Breeze Eau De Parfum", price: 1499, image: "/assets/product image 4.jpeg", slug: "citrus-breeze", badge: "Best Seller" },
];

const ZODIAC_SIGNS = [
  { name: "Aries", dates: "Mar 21 - Apr 19", element: "Fire", notes: "Fiery Orange, Amber, Spicy Pink Pepper", description: "Bold, energetic, and pioneering. A vibrant fragrance to match your passionate drive.", slug: "aries" },
  { name: "Taurus", dates: "Apr 20 - May 20", element: "Earth", notes: "Rich Rose, Vanilla, Grounding Sandalwood", description: "Sensual, grounded, and elegant. A comforting and luxurious blend.", slug: "taurus" },
  { name: "Gemini", dates: "May 21 - Jun 20", element: "Air", notes: "Fresh Mint, Bergamot, Bright Green Tea", description: "Dynamic, intellectual, and versatile. A fresh and sparkling scent profile.", slug: "gemini" },
  { name: "Cancer", dates: "Jun 21 - Jul 22", element: "Water", notes: "Sea Salt, White Lily, Soft Musk", description: "Nurturing, intuitive, and emotional. A soothing, clean aquatic signature.", slug: "cancer" },
  { name: "Leo", dates: "Jul 23 - Aug 22", element: "Fire", notes: "Golden Oud, Warm Amber, Radiant Citrus", description: "Majestic, expressive, and warm. An unforgettable, high-projection scent.", slug: "leo" },
  { name: "Virgo", dates: "Aug 23 - Sep 22", element: "Earth", notes: "Fresh Vetiver, Lavender, Clean Sage", description: "Pure, methodical, and elegant. A sophisticated and balanced herbal wood.", slug: "virgo" },
  { name: "Libra", dates: "Sep 23 - Oct 22", element: "Air", notes: "Bulgarian Rose, White Iris, Honeyed Pear", description: "Harmonious, charming, and artistic. A perfectly balanced floral wood.", slug: "libra" },
  { name: "Scorpio", dates: "Oct 23 - Nov 21", element: "Water", notes: "Dark Patchouli, Black Cherry, Spicy Oud", description: "Intense, mysterious, and magnetic. A deep, sensual evening fragrance.", slug: "scorpio" },
  { name: "Sagittarius", dates: "Nov 22 - Dec 21", element: "Fire", notes: "Spicy Cardamom, Cedarwood, Warm Vanilla", description: "Adventurous, optimistic, and free-spirited. A warm, woody oriental blend.", slug: "sagittarius" },
  { name: "Capricorn", dates: "Dec 22 - Jan 19", element: "Earth", notes: "Smoky Leather, Tobacco Leaf, Rich Vetiver", description: "Timeless, ambitious, and structured. A classic, high-performance executive scent.", slug: "capricorn" },
  { name: "Aquarius", dates: "Jan 20 - Feb 18", element: "Air", notes: "Ozone Accord, Juniper Berries, Patchouli", description: "Unique, visionary, and independent. A refreshing and unconventional scent.", slug: "aquarius" },
  { name: "Pisces", dates: "Feb 19 - Mar 20", element: "Water", notes: "Dreamy Jasmine, Sandalwood, Coconut Water", description: "Dreamy, intuitive, and empathetic. A serene, mystical floral amber.", slug: "pisces" }
];

const REVIEWS = [
  {
    title: "Stays on all day!",
    content: "Absolutely in love with Velvet Rose & Vanilla. The projection is fantastic without being overwhelming. I sprayed it in the morning, went out for dinner, and could still catch whiffs of warm vanilla late at night. Definitely my new signature scent.",
    author: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    date: "July 12, 2026",
    product: "Velvet Rose & Vanilla",
    initial: "PS"
  },
  {
    title: "Identical to high-end niche perfumes",
    content: "Smells exactly like a 15k luxury brand perfume I used to buy. The blend of rich oud and warm spice is incredibly rich and expensive. Everyone at my workplace asked me what I was wearing. Truly incredible craftsmanship.",
    author: "Rahul Mehta",
    location: "Delhi",
    rating: 5,
    date: "July 08, 2026",
    product: "Oud Royale Extrait",
    initial: "RM"
  },
  {
    title: "Superb packaging & projection",
    content: "Gifted Citrus Breeze to my partner. The box packaging feels extremely luxurious—very heavy glass bottle and high-quality atomizer. The scent itself is clean, zesty, and perfect for hot days. Buying the Unisex collection next!",
    author: "Ananya Kapoor",
    location: "Bangalore",
    rating: 5,
    date: "June 29, 2026",
    product: "Citrus Breeze",
    initial: "AK"
  }
];

const DELIVERY_PARTNERS = [
  { name: "DHL Express", short: "DHL", desc: "Fast international express delivery", color: "bg-[#FFCC00] text-[#D00000] font-black italic border-y-4 border-[#D00000]" },
  { name: "FedEx", short: "FedEx", desc: "International shipping & freight", color: "bg-white text-[#4D148C] font-black border border-gray-200" },
  { name: "UPS", short: "UPS", desc: "Worldwide parcel & supply chain", color: "bg-[#351C15] text-[#FFB500] font-bold border border-[#FFB500]" },
  { name: "Aramex", short: "aramex", desc: "Middle East, Asia & Africa", color: "bg-white text-[#E31B23] font-black tracking-tighter uppercase border border-gray-200" },
  { name: "TNT Express", short: "TNT", desc: "International express services", color: "bg-[#FF6600] text-black font-black uppercase border border-[#FF6600]" },
  { name: "EMS", short: "EMS", desc: "International postal express", color: "bg-[#005A9C] text-white font-extrabold italic border border-[#005A9C]" },
  { name: "India Post", short: "India Post", desc: "Affordable Speed Post & EMS", color: "bg-[#F39C12] text-[#C0392B] font-extrabold border-l-8 border-[#C0392B]" },
  { name: "Blue Dart", short: "BLUE DART", desc: "Premium domestic & international", color: "bg-[#003399] text-[#FFCC00] font-black italic border border-[#003399]" },
  { name: "DTDC", short: "DTDC", desc: "International courier networks", color: "bg-white text-[#002B7A] font-extrabold border border-gray-200" },
  { name: "Delhivery", short: "DELHIVERY", desc: "Cross-border e-commerce logistics", color: "bg-black text-white font-black tracking-widest uppercase border border-neutral-800" },
  { name: "Xpressbees", short: "xpressbees", desc: "Business shipping solutions", color: "bg-[#E67E22] text-white font-extrabold uppercase border border-[#E67E22]" },
  { name: "SF Express", short: "SF Express", desc: "Asia & international express", color: "bg-[#E74C3C] text-white font-bold border border-[#E74C3C]" },
  { name: "YunExpress", short: "YunExpress", desc: "Popular e-commerce exports", color: "bg-[#2980B9] text-white font-extrabold border border-[#2980B9]" },
  { name: "DB Schenker", short: "DB SCHENKER", desc: "Air, sea, and land freight", color: "bg-[#005C53] text-white font-bold uppercase border border-[#005C53]" },
  { name: "Kuehne+Nagel", short: "KUEHNE+NAGEL", desc: "Global freight & supply chain", color: "bg-[#0D2C54] text-white font-semibold uppercase border border-[#0D2C54]" },
  { name: "Maersk", short: "MAERSK", desc: "Ocean freight & logistics", color: "bg-[#009FD9] text-white font-black tracking-wider uppercase border border-[#009FD9]" }
];

export default function Home() {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  
  // Slide States
  const [slides, setSlides] = useState<any[]>(HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [promoSettings, setPromoSettings] = useState<any>(null);
  
  // Zodiac States
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[0]);
  const [zodiacProduct, setZodiacProduct] = useState<any>(null);
  const [loadingZodiac, setLoadingZodiac] = useState(false);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Fetch Hero Slides and Site Settings dynamically
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from("hero_slides")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        
        if (data && data.length > 0 && !error) {
          const mappedSlides = data.map(slide => ({
            image: slide.image_url,
            tabletImage: slide.tablet_image_url || slide.image_url,
            mobileImage: slide.mobile_image_url || slide.image_url,
            title: slide.heading || "Scent of Luxury",
            subtitle: slide.subheading || "EXCLUSIVELY JENNYD",
            cta: slide.cta_text || "SHOP NOW",
            link: slide.cta_link || "/products"
          }));
          setSlides(mappedSlides);
        }
      } catch (err) {
        console.error("Error fetching hero slides:", err);
      }
    };

    const fetchPromoSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1);
        if (data && data.length > 0 && !error) {
          setPromoSettings(data[0]);
        }
      } catch (err) {
        console.error("Error fetching site settings on home:", err);
      }
    };

    fetchSlides();
    fetchPromoSettings();
  }, []);

  // Fetch Best Sellers & Trending Products
  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*)");
        
        if (data && !error) {
          const productsWithImages = data.map(p => ({
            ...p,
            image: p.product_images?.[0]?.image_url || p.metadata?.images?.[0] || "/assets/placeholder.jpg",
            hoverImage: p.product_images?.[1]?.image_url || p.metadata?.images?.[1] || undefined
          }));

          // Filter best sellers (by badge metadata or tags), fallback to first 4
          const best = productsWithImages.filter(p => 
            p.metadata?.badge?.toLowerCase().includes("best") || 
            p.tags?.some((t: string) => t.toLowerCase().includes("best"))
          );

          if (best.length >= 4) {
            setBestSellers(best.slice(0, 4));
            setTrendingProducts(productsWithImages.filter(p => !best.includes(p)).slice(0, 4));
          } else {
            setBestSellers(productsWithImages.slice(0, 4));
            setTrendingProducts(productsWithImages.slice(4, 8));
          }
        }
      } catch (err) {
        console.error("Error fetching home products:", err);
      }
    };
    fetchHomeProducts();
  }, []);

  // Fetch Zodiac Product dynamically
  useEffect(() => {
    const fetchZodiacProduct = async () => {
      setLoadingZodiac(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*)")
          .eq("slug", selectedSign.slug)
          .single();
        
        if (data && !error) {
          setZodiacProduct({
            ...data,
            image: data.product_images?.[0]?.image_url || `/assets/zodiacs/${selectedSign.slug}.jpeg`
          });
        } else {
          // Fallback static structure
          setZodiacProduct({
            id: selectedSign.slug,
            title: selectedSign.name,
            price: 1999,
            image: `/assets/zodiacs/${selectedSign.slug}.jpeg`,
            slug: selectedSign.slug,
            description: selectedSign.description
          });
        }
      } catch (err) {
        console.error("Error fetching zodiac product:", err);
      } finally {
        setLoadingZodiac(false);
      }
    };
    fetchZodiacProduct();
  }, [selectedSign]);

  const handleQuickAdd = (product: any) => {
    const displayPrice = product.sale_price || product.price;
    const image = product.image || product.metadata?.images?.[0] || "/assets/placeholder.jpg";
    addItem({ productId: product.id, title: product.title, price: displayPrice, image, quantity: 1 });
    addToast({ title: "Added to cart", message: `${product.title} has been added.`, type: "success" });
  };

  return (
    <div className="flex flex-col bg-background selection:bg-accent selection:text-white overflow-hidden pb-20">
      
      {/* 1. Hero Carousel */}
      <section className="relative w-full aspect-[4/5] sm:aspect-[12/5] overflow-hidden group">
        {slides.map((slide, i) => {
          const isActive = i === currentSlide;
          return (
            <Link
              key={i}
              href={slide.link || "/products"}
              className="absolute inset-0 block"
              style={{ 
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 10 : 0
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Gentle, slow zoom-in animation when active */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: isActive ? 1.04 : 1 }}
                  transition={{ duration: 5.2, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <picture className="w-full h-full absolute inset-0">
                    <source media="(max-width: 640px)" srcSet={slide.mobileImage || slide.image} />
                    <source media="(max-width: 1024px)" srcSet={slide.tabletImage || slide.image} />
                    <img
                      src={slide.image}
                      alt={slide.title || "Hero banner"}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                </motion.div>
              </motion.div>
            </Link>
          );
        })}

        {/* Carousel Controls - Hidden on mobile, shown on desktop */}
        <button onClick={prevSlide} className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3.5 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextSlide} className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3.5 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20">
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Dynamic Line Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className="h-[2px] w-8 md:w-16 bg-white/20 relative overflow-hidden cursor-pointer"
            >
              {i === currentSlide && (
                <motion.div
                  key={i}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute top-0 left-0 h-full bg-accent"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Shop By Category — Story Circles */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1440px] mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12 flex flex-col gap-2">
          <span className="text-accent uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">Collections</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-foreground">Shop By Category</h2>
        </div>

        {/* Circles Row */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex justify-start md:justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-20 min-w-max mx-auto px-2">
            {[
              { name: "Best Sellers", image: "/assets/product image 1.jpeg", link: "/products?sort=best-selling" },
              { name: "For Him",      image: "/assets/product image 2.jpeg", link: "/products?category=men" },
              { name: "For Her",      image: "/assets/product image 3.jpeg", link: "/products?category=women" },
              { name: "Unisex",       image: "/assets/product image 4.jpeg", link: "/products?category=unisex" },
              { name: "Combos",       image: "/assets/product image 5.jpeg", link: "/products?category=combos" },
              { name: "Attars",       image: "/assets/product image 1.jpeg", link: "/products?category=attar" },
            ].map((circle) => (
              <Link
                key={circle.name}
                href={circle.link}
                className="flex flex-col items-center gap-4 group cursor-pointer shrink-0"
              >
                {/* Circle Frame */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center">
                  {/* Outer gold ring — always visible, brightens on hover */}
                  <div className="absolute inset-0 rounded-full border-2 border-accent/25 group-hover:border-accent group-hover:scale-105 transition-all duration-500 ease-out pointer-events-none" />
                  {/* Inner dashed ring — rotates on hover */}
                  <div className="absolute inset-[4px] rounded-full border border-dashed border-accent/15 group-hover:border-accent/40 group-hover:rotate-45 transition-all duration-[1.2s] ease-out pointer-events-none" />

                  {/* Photo */}
                  <div className="w-[84%] h-[84%] rounded-full overflow-hidden relative bg-secondary-background shadow-md ring-1 ring-black/5">
                    <Image
                      src={circle.image}
                      alt={circle.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>

                {/* Label */}
                <span className="text-[11px] md:text-[13px] font-semibold uppercase tracking-[0.22em] text-gray-500 group-hover:text-accent transition-colors duration-300 text-center">
                  {circle.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Best Sellers Section */}
      <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto w-full bg-secondary-background">
        <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-gray-200 pb-4">
          <div className="flex flex-col gap-2">
            <span className="text-accent uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold font-sans">Highly Recommended</span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-serif text-foreground font-normal">Best Sellers</h2>
          </div>
          <Link href="/products?sort=best-selling" className="text-xs font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors self-end pb-1 border-b border-black hover:border-accent">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-y-12 md:gap-x-8 md:gap-y-16">
          {(bestSellers.length > 0 ? bestSellers : MOCK_BEST_SELLERS).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickAdd={() => handleQuickAdd(product)}
            />
          ))}
        </div>
      </section>

      {/* 4. Interactive Celestial Scent Matcher (Zodiac Finder) */}
      <section className="py-12 sm:py-20 md:py-24 bg-foreground text-background relative overflow-hidden">
        {/* Constellation Overlay Grid (Minimal) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-40" />

        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 flex flex-col gap-3">
            <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Celestial Scent Matcher
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-normal">Discover Your Zodiac Signature</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Every zodiac sign carries a unique energetic vibration. Explore our cosmic collection and find the exact fragrance profile written in the stars for you.
            </p>
          </div>

          {/* Zodiac Selector Horizontal Scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-6 lg:grid-cols-12 overflow-x-auto no-scrollbar gap-2 md:gap-3 mb-10 md:mb-16 pb-2">
            {ZODIAC_SIGNS.map((sign) => {
              const isActive = selectedSign.name === sign.name;
              return (
                <button
                  key={sign.name}
                  onClick={() => setSelectedSign(sign)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 border transition-all duration-300 group cursor-pointer shrink-0 min-w-[76px] md:min-w-0 md:w-auto ${
                    isActive 
                      ? "border-accent bg-accent/10 text-accent" 
                      : "border-gray-800 bg-black/20 text-gray-400 hover:border-gray-600 hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider mb-1">{sign.name.slice(0,3)}</span>
                  <span className="text-[8px] text-gray-500 font-medium group-hover:text-gray-300 transition-colors uppercase tracking-widest">{sign.name}</span>
                </button>
              );
            })}
          </div>

          {/* Zodiac Profile Panel */}
          <div className="bg-black/30 border border-gray-800 p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm rounded-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
              
              {/* Artwork Side */}
              <div className="lg:col-span-5 flex justify-center relative">
                <div className="relative aspect-square w-full max-w-[340px] border border-accent/20 p-2 overflow-hidden bg-black/40">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={`/assets/zodiacs/${selectedSign.slug}.jpeg`}
                      alt={`${selectedSign.name} Scent Match`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Detail Side */}
              <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-gray-800 pb-4">
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif text-white tracking-wide">{selectedSign.name}</h3>
                  <span className="text-xs text-gray-400 font-sans tracking-widest uppercase">({selectedSign.dates})</span>
                  <span className="text-xs text-accent font-semibold tracking-widest uppercase ml-auto">Element: {selectedSign.element}</span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Fragrance Profile</span>
                    <p className="text-accent text-sm md:text-base font-semibold tracking-wide">{selectedSign.notes}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cosmic Essence</span>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">{selectedSign.description}</p>
                  </div>
                </div>

                {/* Supabase Product Details & Quick Add */}
                <div className="border-t border-gray-800 pt-6 mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6">
                  {loadingZodiac ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-xs uppercase tracking-widest font-bold">Aligning Stars...</span>
                    </div>
                  ) : zodiacProduct ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Celestial Extract</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl md:text-2xl font-serif text-white">{formatPrice(zodiacProduct.sale_price || zodiacProduct.price)}</span>
                          {(zodiacProduct.sale_price || zodiacProduct.salePrice) && (
                            <span className="text-xs text-gray-500 line-through">{formatPrice(zodiacProduct.price)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Link href={`/products/${zodiacProduct.slug}`} className="w-full sm:w-auto">
                          <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:border-white hover:text-white uppercase tracking-widest text-[11px] h-12 rounded-none px-6">
                            View details
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleQuickAdd(zodiacProduct)}
                          className="w-full sm:w-auto bg-accent text-white hover:bg-white hover:text-black uppercase tracking-widest text-[11px] h-12 px-8 rounded-none font-bold"
                        >
                          Acquire Scent
                        </Button>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Scent unavailable</span>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. Trending Now */}
      <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-gray-200 pb-4">
          <div className="flex flex-col gap-2">
            <span className="text-accent uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">Curated Selections</span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-serif text-foreground font-normal">Trending Now</h2>
          </div>
          <Link href="/products" className="text-xs font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors self-end pb-1 border-b border-black hover:border-accent">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-y-12 md:gap-x-8 md:gap-y-16">
          {(trendingProducts.length > 0 ? trendingProducts : MOCK_PRODUCTS).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickAdd={() => handleQuickAdd(product)}
            />
          ))}
        </div>
      </section>

      {/* 6. Promo Banner (Artisanal Attars) */}
      <section className="py-6 sm:py-8 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="relative w-full min-h-[420px] sm:min-h-0 sm:aspect-[16/7] md:aspect-[21/9] overflow-hidden bg-foreground text-background flex items-center border border-black/5">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600"
            alt="Promo"
            fill
            unoptimized
            className="object-cover opacity-25"
          />
          <div className="relative z-10 p-6 sm:p-10 md:p-16 max-w-2xl text-left">
            <span className="bg-sale text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 mb-6 inline-block">Special Offer</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif mb-4 leading-tight font-normal">Buy 2 Get 1 Free on all Signature Attars</h2>
            <p className="text-gray-350 mb-8 max-w-md text-sm md:text-base leading-relaxed">Experience the rich heritage of Indian perfumery. Pure, hand-blended perfume oils that linger on the skin all day.</p>
            <Link href="/products?category=attar">
              <Button className="bg-accent text-white hover:bg-white hover:text-black rounded-none px-6 py-3.5 sm:px-10 sm:py-4 uppercase tracking-widest text-[10px] sm:text-xs font-bold transition-all">
                Shop Attars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Shop by Notes Section (Infinite Scrolling Marquee) */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="bg-gray-100 rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8 md:gap-12 overflow-hidden">
          
          {/* Left Block - Dark Theme Card */}
          <div className="w-full lg:w-[350px] bg-foreground text-background rounded-2xl p-8 md:p-10 flex flex-col justify-center min-h-[260px] shrink-0">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4 leading-snug">
              Shop by Notes
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Indulge in the enchanting world of perfumes with Jennyd, the best perfume.
            </p>
          </div>

          {/* Right Block - Infinite Marquee Container */}
          <div className="flex-1 w-full overflow-hidden relative">
            {/* Fade effect on borders for smooth transition */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none" />

            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="animate-marquee flex items-center gap-8 py-4">
                {/* Render the notes list multiple times to support seamless infinite loop */}
                {[...Array(3)].map((_, listIndex) => (
                  <div key={listIndex} className="flex items-center gap-8 shrink-0">
                    {[
                      { name: "Tobacco", tag: "tobacco", image: "/assets/product image 5.jpeg" },
                      { name: "Vanilla", tag: "vanilla", image: "/assets/product image 2.jpeg" },
                      { name: "Woody", tag: "woody", image: "/assets/product image 1.jpeg" },
                      { name: "Amber", tag: "amber", image: "/assets/product image 3.jpeg" },
                      { name: "Animalic", tag: "animalic", image: "/assets/product image 4.jpeg" },
                      { name: "Aquatic", tag: "aquatic", image: "/assets/product image 1.jpeg" },
                      { name: "Floral", tag: "floral", image: "/assets/product image 3.jpeg" },
                      { name: "Citrus", tag: "citrus", image: "/assets/product image 4.jpeg" },
                    ].map((note, noteIndex) => (
                      <Link
                        key={`${listIndex}-${noteIndex}-${note.name}`}
                        href={`/products?note=${note.tag}`}
                        className="flex flex-col items-center gap-3.5 group cursor-pointer shrink-0 w-24 sm:w-28"
                      >
                        {/* Circle Image with dashed border */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-gray-400/80 group-hover:border-accent group-hover:scale-105 transition-all duration-300 flex items-center justify-center p-1 bg-white">
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image
                              src={note.image}
                              alt={note.name}
                              fill
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                          </div>
                        </div>

                        {/* Label */}
                        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-700 group-hover:text-accent transition-colors duration-300 text-center">
                          {note.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Our Delivery Partners Section */}
      <section className="py-12 sm:py-16 md:py-20 border-t border-b border-gray-100 bg-white overflow-hidden w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 text-center mb-10">
          <span className="text-accent uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold block mb-3">Global Logistics</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-foreground">Our Delivery Partners</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Fast, secure, and reliable express shipping to over 220+ countries worldwide through our global networks.
          </p>
        </div>

        <div className="w-full relative overflow-hidden bg-gray-50/50 py-8 border-y border-gray-100">
          {/* Fade overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="animate-marquee flex items-center gap-10">
              {[...Array(3)].map((_, listIndex) => (
                <div key={listIndex} className="flex items-center gap-10 shrink-0">
                  {DELIVERY_PARTNERS.map((partner, idx) => (
                    <div
                      key={`${listIndex}-${idx}`}
                      className="flex flex-col items-center justify-center shrink-0 group"
                    >
                      {/* Logo Badge */}
                      <div className={`w-36 h-16 rounded-xl flex flex-col items-center justify-center p-3 transition-transform duration-300 group-hover:scale-105 shadow-sm hover:shadow-md ${partner.color} select-none`}>
                        {partner.short === "FedEx" ? (
                          <span className="text-xl tracking-tight">
                            Fed<span className="text-[#FF6600]">Ex</span>
                          </span>
                        ) : (
                          <span className="text-xl tracking-tight text-center">{partner.short}</span>
                        )}
                      </div>
                      {/* Subtext description below badge */}
                      <span className="text-[10px] text-gray-400 font-medium mt-2 max-w-[140px] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {partner.desc}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews */}
      <section className="py-16 sm:py-20 md:py-24 bg-secondary-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-12 md:mb-16 flex flex-col gap-3">
            <span className="text-accent uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">Endorsements</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-foreground">Loved By Thousands</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="bg-white p-7 sm:p-8 rounded-2xl border border-gray-200/60 shadow-xs hover:-translate-y-1 hover:shadow-md hover:border-accent/30 transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Stars + Verified Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-green-150">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified Buyer
                    </span>
                  </div>

                  {/* Scent Variant Purchased */}
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Purchased: {review.product}
                  </div>

                  {/* Review Title & Body */}
                  <h4 className="font-serif text-base font-semibold text-foreground mb-2.5 leading-snug">
                    {review.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light">
                    "{review.content}"
                  </p>
                </div>

                {/* Reviewer Meta Info */}
                <div className="flex items-center gap-3.5 border-t border-gray-150/70 pt-5 mt-auto">
                  {/* Initial Avatar */}
                  <div className="w-10 h-10 rounded-full bg-secondary-background border border-gray-100 flex items-center justify-center font-bold text-xs text-accent tracking-wider select-none shrink-0">
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-tight">{review.author}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {review.location} • {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

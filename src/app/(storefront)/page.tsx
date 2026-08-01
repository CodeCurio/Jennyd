"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { QuickViewModal } from "@/components/storefront/QuickViewModal";
import { VideoShowcase } from "@/components/storefront/VideoShowcase";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Award, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Loader2,
  ArrowRight,
  Flame,
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/lib/store/CurrencyContext";

const HERO_SLIDES = [
  {
    image: "/assets/jennyd-banner-1.webp",
    tabletImage: "/assets/jennyd-banner-1.webp",
    mobileImage: "/assets/jennyd-banner-mobile-1.webp",
    title: "Jennyd Luxury Scents",
    subtitle: "EXCLUSIVELY JENNYD",
    cta: "EXPLORE COLLECTION",
    link: "/products"
  },
  {
    image: "/assets/jennyd-banner-2.webp",
    tabletImage: "/assets/jennyd-banner-2.webp",
    mobileImage: "/assets/jennyd-banner-mobile-2.webp",
    title: "Signature Extrait De Parfum",
    subtitle: "PURE ARTISANAL SCENTS",
    cta: "SHOP NOW",
    link: "/products"
  },
  {
    image: "/assets/jennyd-banner-3.webp",
    tabletImage: "/assets/jennyd-banner-3.webp",
    mobileImage: "/assets/jennyd-banner-mobile-3.webp",
    title: "Artisanal Pure Attars",
    subtitle: "PURE ATTAR COLLECTION",
    cta: "DISCOVER ATTARS",
    link: "/products?category=attar"
  }
];

const VALUE_PROPOSITIONS = [
  {
    icon: Award,
    title: "Pure Extract Concentration",
    desc: "Long-lasting Extrait de Parfum formulas crafted with premium essential oils."
  },
  {
    icon: Flame,
    title: "Handcrafted Artisanal Attars",
    desc: "Traditional non-alcoholic attars blended by master Indian perfumers."
  },
  {
    icon: Truck,
    title: "Complimentary Shipping",
    desc: "Fast express dispatch across India with complimentary insurance."
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic Guarantee",
    desc: "Direct from our distillery with tamper-evident luxury packaging."
  }
];

const CATEGORY_TILES = [
  { name: "Best Sellers", image: "/assets/product image 1.jpeg", link: "/products?sort=best-selling", subtitle: "Most Loved Scents" },
  { name: "For Him",      image: "/assets/collection-men.webp", link: "/products?category=men",          subtitle: "Masculine Woods & Oud" },
  { name: "For Her",      image: "/assets/collection-women.webp", link: "/products?category=women",        subtitle: "Sensual Florals & Vanilla" },
  { name: "Unisex",       image: "/assets/collection-unisex.webp", link: "/products?category=unisex",       subtitle: "Universal Signature Scents" },
  { name: "Pure Attars",  image: "/assets/product image 5.jpeg", link: "/products?category=attar",        subtitle: "Pure Non-Alcoholic Concentrates" },
  { name: "Kids",         image: "/assets/product image 1.jpeg", link: "/products?category=kids",         subtitle: "Playful & Mild Scents" },
];

const DEFAULT_NOTES = [
  { id: "n1", name: "Oud", image_url: "/assets/product image 1.jpeg" },
  { id: "n2", name: "Vanilla", image_url: "/assets/product image 2.jpeg" },
  { id: "n3", name: "Amber", image_url: "/assets/product image 3.jpeg" },
  { id: "n4", name: "Citrus", image_url: "/assets/product image 4.jpeg" },
  { id: "n5", name: "Rose", image_url: "/assets/product image 3.jpeg" },
  { id: "n6", name: "Tobacco", image_url: "/assets/product image 5.jpeg" },
  { id: "n7", name: "Sandalwood", image_url: "/assets/product image 1.jpeg" },
  { id: "n8", name: "Jasmine", image_url: "/assets/product image 2.jpeg" },
  { id: "n9", name: "Leather", image_url: "/assets/product image 4.jpeg" },
  { id: "n10", name: "Musk", image_url: "/assets/product image 3.jpeg" },
];

const MOCK_PRODUCTS = [
  { id: "1", title: "Oud Royale Extrait", price: 2499, salePrice: 1999, image: "/assets/product image 1.jpeg", slug: "oud-royale", badge: "Best Seller" },
  { id: "2", title: "Velvet Rose & Vanilla", price: 1899, image: "/assets/product image 2.jpeg", slug: "velvet-rose" },
  { id: "3", title: "Midnight Amber Intense", price: 2999, salePrice: 2499, image: "/assets/product image 3.jpeg", slug: "midnight-amber", badge: "New" },
  { id: "4", title: "Citrus Breeze Eau De Parfum", price: 1499, image: "/assets/product image 4.jpeg", slug: "citrus-breeze" },
];

const BESTSELLER_TABS = [
  { id: "all", label: "ALL BESTSELLERS" },
  { id: "him", label: "FOR HIM" },
  { id: "her", label: "FOR HER" },
  { id: "attar", label: "PURE ATTAR" },
  { id: "kids", label: "KIDS" },
  { id: "unisex", label: "UNISEX & OUD" }
];

const MOCK_BEST_SELLERS = [
  { id: "b1", title: "Oud Royale Extrait", price: 2499, salePrice: 1999, image: "/assets/product image 1.jpeg", slug: "oud-royale", badge: "Best Seller", category: "WOODY OUD", rating: 4.88, reviewsCount: 51 },
  { id: "b2", title: "Midnight Amber Intense", price: 2999, salePrice: 2499, image: "/assets/product image 3.jpeg", slug: "midnight-amber", badge: "Best Seller", category: "AMBER SPICE", rating: 4.92, reviewsCount: 64 },
  { id: "b3", title: "Velvet Rose & Vanilla", price: 1899, salePrice: 1499, image: "/assets/product image 2.jpeg", slug: "velvet-rose", badge: "Best Seller", category: "FLORAL GOURMAND", rating: 4.85, reviewsCount: 47 },
  { id: "b4", title: "Citrus Breeze Eau De Parfum", price: 1499, salePrice: 1199, image: "/assets/product image 4.jpeg", slug: "citrus-breeze", badge: "Best Seller", category: "FRESH CITRUS", rating: 4.79, reviewsCount: 38 },
  { id: "b5", title: "Ruh Khus Pure Attar", price: 1996, salePrice: 499, image: "/assets/product image 5.jpeg", slug: "ruh-khus-attar", badge: "Pure Attar", category: "NON-ALCOHOLIC ATTAR", rating: 4.95, reviewsCount: 82 },
  { id: "b6", title: "Persian Oud Extrait", price: 12999, salePrice: 9099, image: "/assets/product image 1.jpeg", slug: "persian-oud", badge: "Luxury Oud", category: "ROYAL ORIENTAL OUD", rating: 4.98, reviewsCount: 112 },
  { id: "b7", title: "Vanilla Oud Signature", price: 2495, salePrice: 499, image: "/assets/product image 2.jpeg", slug: "vanilla-oud", badge: "Hot Seller", category: "WOODY VANILLA", rating: 4.87, reviewsCount: 54 },
  { id: "b8", title: "Black Musk Pure Attar", price: 1996, salePrice: 499, image: "/assets/product image 5.jpeg", slug: "black-musk-attar", badge: "Artisanal", category: "NON-ALCOHOLIC ATTAR", rating: 4.91, reviewsCount: 76 },
  { id: "b9", title: "Junior Berry Breeze", price: 2990, salePrice: 1499, image: "/assets/product image 3.jpeg", slug: "junior-berry-breeze", badge: "Kids Special", category: "KIDS COLLECTION", rating: 4.89, reviewsCount: 41 },
  { id: "b10", title: "Leather Oud Intense", price: 2495, salePrice: 499, image: "/assets/product image 4.jpeg", slug: "leather-oud", badge: "For Him", category: "SMOKY LEATHER OUD", rating: 4.86, reviewsCount: 39 }
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
    title: "Exceptional Sillage & Longevity",
    content: "Absolutely in love with Velvet Rose & Vanilla. The projection is fantastic without being overwhelming. I sprayed it in the morning, went out for dinner, and could still catch whiffs of warm vanilla late at night.",
    author: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    date: "July 12, 2026",
    product: "Velvet Rose & Vanilla",
    initial: "PS"
  },
  {
    title: "Identical to High-End Niche House Scents",
    content: "Smells exactly like a luxury niche perfume I bought in Dubai. The blend of rich oud and warm spice is incredibly rich and expensive. Everyone at my workplace asked me what I was wearing.",
    author: "Rahul Mehta",
    location: "Delhi",
    rating: 5,
    date: "July 08, 2026",
    product: "Oud Royale Extrait",
    initial: "RM"
  },
  {
    title: "Superb Packaging & Crisp Atomizer",
    content: "The heavy glass bottle and high-quality atomizer spray feel extremely luxurious. The scent itself is clean, zesty, and perfect for hot days. Will definitely purchase again!",
    author: "Ananya Kapoor",
    location: "Bangalore",
    rating: 5,
    date: "June 29, 2026",
    product: "Citrus Breeze",
    initial: "AK"
  }
];

const DELIVERY_PARTNERS = [
  { name: "FedEx Express", short: "FedEx", logoText: "FedEx", color: "bg-[#4D148C] text-white", desc: "Priority Express Shipping" },
  { name: "DHL Express", short: "DHL", logoText: "DHL", color: "bg-[#FFCC00] text-[#D40511] font-extrabold italic", desc: "Global Air Freight" },
  { name: "UPS Worldwide", short: "UPS", logoText: "UPS", color: "bg-[#351C15] text-[#FFB500] font-bold", desc: "Global Logistics Leader" },
  { name: "Aramex Express", short: "Aramex", logoText: "aramex", color: "bg-[#E31837] text-white font-bold tracking-tight", desc: "Middle East & Asia Express" },
  { name: "Blue Dart", short: "Blue Dart", logoText: "BLUE DART", color: "bg-[#003399] text-[#FFCC00] font-extrabold italic", desc: "South Asia Express" },
  { name: "India Post EMS", short: "India Post", logoText: "India Post", color: "bg-[#D2232A] text-white font-bold", desc: "Speed Post International" },
  { name: "Delhivery", short: "Delhivery", logoText: "DELHIVERY", color: "bg-[#111111] text-white font-bold tracking-wider", desc: "Express Surface & Air" },
  { name: "DTDC Express", short: "DTDC", logoText: "DTDC", color: "bg-[#0A2540] text-[#E31837] font-extrabold", desc: "Global Courier Network" }
];

export default function Home() {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  
  // Carousel States
  const [slides, setSlides] = useState<any[]>(HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [fragranceNotes, setFragranceNotes] = useState<any[]>([]);

  // Bestseller Ajmal-style Tab State
  const [activeBestsellerTab, setActiveBestsellerTab] = useState<string>("him");

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
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

  // Fetch Hero Slides
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
        // Fallback to static HERO_SLIDES
      }
    };
    fetchSlides();
  }, []);

  // Fetch Fragrance Notes from Supabase backend
  useEffect(() => {
    const fetchFragranceNotes = async () => {
      try {
        const { data, error } = await supabase
          .from("fragrance_notes")
          .select("*")
          .order("name", { ascending: true });
        
        if (data && data.length > 0 && !error) {
          setFragranceNotes(data);
        }
      } catch (err) {
        // Fallback to static DEFAULT_NOTES
      }
    };
    fetchFragranceNotes();
  }, []);

  // Fetch All Products for Bestseller Tabs & Trending Section
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

          setAllProducts(productsWithImages);

          const best = productsWithImages.filter(p => 
            p.metadata?.badge?.toLowerCase().includes("best") || 
            p.tags?.some((t: string) => t.toLowerCase().includes("best"))
          );

          setBestSellers(best.length > 0 ? best : productsWithImages);
          setTrendingProducts(productsWithImages.slice(0, 8));
        }
      } catch (err) {
        // Fallback to static MOCK_BEST_SELLERS
      }
    };
    fetchHomeProducts();
  }, []);

  // Filter products for Ajmal-style Bestseller tabs (HIM, HER, ATTAR, GIFTING, UNISEX, ALL)
  const getDisplayBestsellers = () => {
    const pool = allProducts.length > 0 ? allProducts : MOCK_BEST_SELLERS;

    if (activeBestsellerTab === "all") {
      return pool.slice(0, 12);
    }

    if (activeBestsellerTab === "him") {
      const filtered = pool.filter(p => {
        const title = (p.title || "").toUpperCase();
        const badge = (p.badge || p.metadata?.badge || "").toUpperCase();
        return (
          badge.includes("HIS") || badge.includes("HIM") || badge.includes("MEN") ||
          title.includes("PERSIAN") || title.includes("BLACK") || title.includes("VETIVER") ||
          title.includes("LEATHER") || title.includes("WHISKEY") || title.includes("COFFEE") ||
          title.includes("OLD GIN") || title.includes("TOBACCO") || title.includes("ROYAL") ||
          title.includes("FOR YOU") || title.includes("LONG DRIVE") || title.includes("MID NIGHT") ||
          title.includes("ONE AM") || title.includes("IMPERIAL")
        );
      });
      return filtered.length > 0 ? filtered.slice(0, 10) : pool.slice(0, 8);
    }

    if (activeBestsellerTab === "her") {
      const filtered = pool.filter(p => {
        const title = (p.title || "").toUpperCase();
        const badge = (p.badge || p.metadata?.badge || "").toUpperCase();
        return (
          badge.includes("HER") || badge.includes("DIVA") || badge.includes("WOMEN") ||
          title.includes("FLORAL") || title.includes("VANILLA") || title.includes("ROSE") ||
          title.includes("QUEEN") || title.includes("PRINCESS") || title.includes("GORGEOUS") ||
          title.includes("DREAMGIRL") || title.includes("VALENTINE") || title.includes("MISSYOU") ||
          title.includes("VICTORIA") || title.includes("HEARTBEAT") || title.includes("LOVEYOU") ||
          title.includes("HUGYOU") || title.includes("MYHONEY") || title.includes("BELOVED") ||
          title.includes("TRUELOVE") || title.includes("MYCRUSH") || title.includes("KISS") ||
          title.includes("DARLING") || title.includes("LOVEBITE") || title.includes("SOULMATE")
        );
      });
      return filtered.length > 0 ? filtered.slice(0, 10) : pool.slice(2, 10);
    }

    if (activeBestsellerTab === "attar") {
      const filtered = pool.filter(p => {
        const title = (p.title || "").toUpperCase();
        return title.includes("ATTAR");
      });
      return filtered.length > 0 ? filtered.slice(0, 10) : pool.filter(p => p.title.toUpperCase().includes("ATTAR"));
    }

    if (activeBestsellerTab === "kids") {
      const filtered = pool.filter(p => {
        const title = (p.title || "").toUpperCase();
        return (
          title.includes("KIDS") || title.includes("JUNIOR") || title.includes("BERRY") ||
          title.includes("SWEET") || title.includes("BABY") || title.includes("DIVA") || title.includes("DISNEY")
        );
      });
      return filtered.length > 0 ? filtered.slice(0, 10) : pool.slice(4, 10);
    }

    if (activeBestsellerTab === "unisex") {
      const filtered = pool.filter(p => {
        const title = (p.title || "").toUpperCase();
        return (
          title.includes("OUD") || title.includes("AMBER") || title.includes("CITRUS") ||
          title.includes("OCEAN") || title.includes("SAFFRON") || title.includes("SANDALWOOD")
        );
      });
      return filtered.length > 0 ? filtered.slice(0, 10) : pool.slice(0, 8);
    }

    return pool.slice(0, 10);
  };

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
        setZodiacProduct({
          id: selectedSign.slug,
          title: selectedSign.name,
          price: 1999,
          image: `/assets/zodiacs/${selectedSign.slug}.jpeg`,
          slug: selectedSign.slug,
          description: selectedSign.description
        });
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

  const displayNotes = fragranceNotes.length > 0 ? fragranceNotes : DEFAULT_NOTES;

  return (
    <div className="flex flex-col bg-[#FAF8F5] selection:bg-[#D4AF37] selection:text-white font-sans overflow-hidden">
      
      {/* ── Primary SEO Heading ── */}
      <h1 className="sr-only">Jennyd Scents — Luxury Extrait De Parfum &amp; Artisanal Pure Attars in India</h1>

      {/* ── 1. Hero Carousel (Mobile & Desktop Viewport Optimized) ── */}
      <section className="relative w-full h-[210px] min-h-[190px] sm:h-auto sm:aspect-[2007/784] overflow-hidden group bg-[#121212]">
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
                {/* Mobile Image (Visible on mobile < sm) */}
                <img
                  src={slide.mobileImage || slide.image}
                  alt={slide.title || "Jennyd Luxury Fragrance"}
                  className="w-full h-full object-cover object-center sm:hidden block"
                />
                {/* Desktop Image (Visible on desktop >= sm) */}
                <img
                  src={slide.image}
                  alt={slide.title || "Jennyd Luxury Fragrance"}
                  className="w-full h-full object-cover object-center hidden sm:block"
                />
              </motion.div>
            </Link>
          );
        })}

        {/* Carousel Controls */}
        <button 
          onClick={prevSlide} 
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 border border-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextSlide} 
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 border border-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Gold Line Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className="h-[2px] w-12 md:w-20 bg-white/30 relative overflow-hidden cursor-pointer"
            >
              {i === currentSlide && (
                <motion.div
                  key={i}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute top-0 left-0 h-full bg-[#D4AF37]"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── 2. Brand Value Proposition Bar (USPs - Ultra Luxury Mobile & Desktop) ── */}
      <section className="bg-white border-y border-[#EAE7E1]">
        {/* Mobile Layout: Infinite Auto-Scrolling Marquee Strip (Same Speed as Shop by Notes) */}
        <div className="sm:hidden w-full overflow-hidden bg-[#121212] py-2.5 shadow-sm relative flex">
          <div className="animate-marquee-medium flex items-center gap-6 shrink-0">
            {[...VALUE_PROPOSITIONS, ...VALUE_PROPOSITIONS, ...VALUE_PROPOSITIONS, ...VALUE_PROPOSITIONS].map((usp, idx) => {
              const Icon = usp.icon;
              return (
                <div key={idx} className="flex items-center gap-2 shrink-0">
                  <div className="w-5.5 h-5.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <Icon className="w-3 h-3" strokeWidth={2} />
                  </div>
                  <span className="font-serif font-bold text-[10.5px] text-white uppercase tracking-wider whitespace-nowrap">
                    {usp.title}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37]/60 ml-4 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop & Tablet Layout (Full Rich Cards) */}
        <div className="hidden sm:block max-w-[1440px] mx-auto px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {VALUE_PROPOSITIONS.map((usp, idx) => {
              const Icon = usp.icon;
              return (
                <div key={idx} className="flex flex-row items-start text-left gap-2.5 rounded-2xl bg-transparent border-none shadow-none group">
                  <div className="w-11 h-11 rounded-full bg-[#FAF8F5] border border-[#EAE7E1] flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300 shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#121212] uppercase tracking-wider mb-0.5">
                      {usp.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                      {usp.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Collections (Touch-Swipeable Carousel on Mobile) ── */}
      <section className="py-6 sm:py-12 md:py-24 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8 md:mb-16 flex flex-col gap-1.5 sm:gap-2">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold font-sans">
            Explore Collections
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#121212] tracking-wide">
            Curated Fragrance Families
          </h2>
          <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mt-1" />
        </div>

        {/* Mobile View: Sleek Horizontal Swipeable Touch Carousel (< md) */}
        <div className="md:hidden relative w-full overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-3.5 pb-3 pt-1 snap-x snap-mandatory scroll-smooth px-1">
            {CATEGORY_TILES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.link}
                className="group flex flex-col items-center cursor-pointer shrink-0 w-[140px] snap-start"
              >
                <div className="relative w-full aspect-[3/4] bg-white border border-[#EAE7E1] rounded-2xl overflow-hidden mb-2.5 shadow-2xs group-active:scale-98 transition-all">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2.5">
                    <span className="text-white text-[9px] uppercase font-bold tracking-wider flex items-center gap-0.5">
                      Explore <ArrowRight className="w-2.5 h-2.5 text-[#D4AF37]" />
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-xs font-bold text-[#121212] uppercase tracking-wider text-center line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[9px] text-neutral-400 font-sans text-center mt-0.5 line-clamp-1">
                  {cat.subtitle}
                </span>
              </Link>
            ))}
          </div>
          {/* Subtle swipe hint */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-sans mt-2">
            <span>Swipe to explore all collections</span>
            <ArrowRight className="w-3 h-3 text-[#D4AF37] animate-pulse" />
          </div>
        </div>

        {/* Desktop View: 6-Column Grid (>= md) */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.link}
              className="group flex flex-col items-center cursor-pointer"
            >
              {/* Portrait Editorial Image Container */}
              <div className="relative w-full aspect-[3/4] bg-white border border-[#EAE7E1] rounded-2xl overflow-hidden mb-3.5 shadow-2xs group-hover:shadow-md transition-all duration-300">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-serif text-sm font-bold text-[#121212] uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors duration-300 text-center">
                {cat.name}
              </h3>
              <span className="text-[10px] text-neutral-400 font-sans text-center mt-0.5">
                {cat.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Shop by Notes (Infinite Auto-Scrolling Marquee) ── */}
      <section className="py-7 sm:py-16 bg-white border-y border-[#EAE7E1] overflow-hidden w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-3 sm:mb-8">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold font-sans block mb-1">
            Olfactory Accords
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#121212]">
            Shop by Notes
          </h2>
          <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mt-1.5" />
        </div>

        {/* Infinite Auto-Scrolling Marquee Container (Mobile + Desktop) */}
        <div className="w-full relative overflow-hidden py-2 sm:py-4">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="animate-marquee-medium flex items-center gap-6 sm:gap-12">
              {[...Array(3)].map((_, listIdx) => (
                <div key={listIdx} className="flex items-center gap-6 sm:gap-12 shrink-0">
                  {displayNotes.map((note, noteIdx) => (
                    <Link
                      key={`${listIdx}-${noteIdx}-${note.id || note.name}`}
                      href={`/products?note=${encodeURIComponent(note.name.toLowerCase())}`}
                      className="flex flex-col items-center gap-2 sm:gap-3 group shrink-0 cursor-pointer w-[72px] sm:w-auto"
                    >
                      <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-[#EAE7E1] p-0.5 sm:p-1 bg-[#FAF8F5] group-hover:border-[#D4AF37] group-hover:scale-108 transition-all duration-300 shadow-2xs group-hover:shadow-md flex items-center justify-center">
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          {note.image_url ? (
                            <img
                              src={note.image_url}
                              alt={note.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#FAF8F5] flex items-center justify-center text-[#D4AF37] font-serif text-sm sm:text-base font-bold">
                              {note.name[0]}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="font-serif text-[11px] sm:text-sm font-bold uppercase tracking-wider text-[#121212] group-hover:text-[#D4AF37] transition-colors text-center line-clamp-1">
                        {note.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Ajmal-Inspired Multi-Category Bestsellers Showcase ── */}
      <section className="py-8 sm:py-16 md:py-24 max-w-[1440px] mx-auto w-full px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8 md:mb-12 flex flex-col gap-1 sm:gap-2">
          <span className="text-[#D4AF37] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-xs font-bold font-sans">
            Curated High-Performance Scents
          </span>
          <h2 className="text-xl sm:text-3xl md:text-5xl font-serif text-[#121212] tracking-tight uppercase">
            OUR BESTSELLERS
          </h2>
          <div className="w-12 sm:w-16 h-[2px] bg-[#D4AF37] mx-auto mt-0.5" />
        </div>

        {/* Mobile Tab Matrix (Zero Horizontal Scroll Required! 3x2 Pill Grid) */}
        <div className="sm:hidden grid grid-cols-3 gap-1.5 mb-5 px-0.5">
          {BESTSELLER_TABS.map((tab) => {
            const isActive = activeBestsellerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBestsellerTab(tab.id)}
                className={`py-2 px-1 text-[9.5px] font-bold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer border text-center ${
                  isActive
                    ? "bg-[#121212] text-[#D4AF37] border-[#121212] shadow-2xs font-serif font-semibold"
                    : "bg-white text-neutral-600 border-[#EAE7E1] hover:border-[#D4AF37]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Desktop & Tablet Tab Filters (Luxury Animated Capsule Segment Bar) */}
        <div className="hidden sm:flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#EAE7E1] p-1.5 rounded-full shadow-inner">
            {BESTSELLER_TABS.map((tab) => {
              const isActive = activeBestsellerTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveBestsellerTab(tab.id)}
                  className={`relative px-4 lg:px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer rounded-full z-10 ${
                    isActive
                      ? "text-[#D4AF37]"
                      : "text-neutral-500 hover:text-[#121212] hover:bg-white/80"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="bestseller-active-pill"
                      className="absolute inset-0 bg-[#121212] rounded-full -z-10 shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Product Grid (Showing 8 to 10 products per category tab in 2-col Mobile / 4-col/5-col Desktop) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBestsellerTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8"
          >
            {getDisplayBestsellers().map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={() => handleQuickAdd(product)}
                onQuickView={() => {
                  setQuickViewProduct(product);
                  setIsQuickViewOpen(true);
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA to explore full category */}
        <div className="mt-12 text-center">
          <Link
            href={`/products?category=${activeBestsellerTab === "all" ? "best-selling" : activeBestsellerTab}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#121212] hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-md group"
          >
            <span>Explore All {BESTSELLER_TABS.find(t => t.id === activeBestsellerTab)?.label}</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:text-white transition-colors" />
          </Link>
        </div>

      </section>

      {/* ── 6. Celestial Scent Matcher (Zodiac Finder - Mobile Optimized) ── */}
      <section className="py-10 md:py-24 bg-[#121212] text-white relative overflow-hidden">
        {/* Gold Radial Glow Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none opacity-50" />

        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16 flex flex-col gap-2">
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Celestial Scent Matcher
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif">Discover Your Zodiac Signature</h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans max-w-lg mx-auto">
              Every zodiac sign carries a unique energetic vibration. Explore our cosmic collection and find the exact fragrance profile written in the stars.
            </p>
          </div>

          {/* Zodiac Pills Horizontal Bar */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 sm:mb-10 pb-2 justify-start lg:justify-center">
            {ZODIAC_SIGNS.map((sign) => {
              const isActive = selectedSign.name === sign.name;
              return (
                <button
                  key={sign.name}
                  onClick={() => setSelectedSign(sign)}
                  className={`px-3.5 py-2 border rounded-xl transition-all duration-300 shrink-0 cursor-pointer flex flex-col items-center ${
                    isActive 
                      ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]" 
                      : "border-neutral-800 bg-black/40 text-neutral-400 hover:border-neutral-600 hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">{sign.name}</span>
                  <span className="text-[8px] text-neutral-500 uppercase tracking-widest">{sign.element}</span>
                </button>
              );
            })}
          </div>

          {/* Zodiac Details Panel */}
          <div className="bg-black/60 border border-[#D4AF37]/30 p-4 sm:p-8 md:p-10 rounded-2xl shadow-2xl backdrop-blur-md relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
              
              {/* Artwork */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative aspect-square w-full max-w-[260px] sm:max-w-[320px] border border-[#D4AF37]/30 p-2 bg-black/50 rounded-xl overflow-hidden">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src={`/assets/zodiacs/${selectedSign.slug}.jpeg`}
                      alt={`${selectedSign.name} Scent Match`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-7 flex flex-col gap-5 text-left">
                <div className="border-b border-neutral-800 pb-3">
                  <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                    <h3 className="text-2xl sm:text-4xl font-serif text-white tracking-wide">{selectedSign.name}</h3>
                    <span className="text-[11px] text-[#D4AF37] font-semibold tracking-widest uppercase">Element: {selectedSign.element}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-sans tracking-widest uppercase">{selectedSign.dates}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold block mb-0.5">Fragrance Profile</span>
                    <p className="text-[#D4AF37] text-xs sm:text-base font-semibold">{selectedSign.notes}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold block mb-0.5">Cosmic Essence</span>
                    <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-sans">{selectedSign.description}</p>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {loadingZodiac ? (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span className="text-xs uppercase tracking-widest font-bold">Aligning Stars...</span>
                    </div>
                  ) : zodiacProduct ? (
                    <>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold block mb-0.5">Celestial Extract</span>
                        <span className="text-xl sm:text-2xl font-serif text-white">{formatPrice(zodiacProduct.sale_price || zodiacProduct.price)}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                        <Link href={`/products/${zodiacProduct.slug}`} className="w-full sm:w-auto">
                          <Button variant="outline" className="w-full sm:w-auto border-neutral-700 text-neutral-300 hover:border-white hover:text-white uppercase tracking-wider text-xs min-h-[44px] py-2.5 px-5 rounded-xl font-bold whitespace-nowrap">
                            View Details
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleQuickAdd(zodiacProduct)}
                          className="w-full sm:w-auto bg-[#D4AF37] text-white hover:bg-white hover:text-black uppercase tracking-wider text-xs min-h-[44px] py-2.5 px-6 rounded-xl font-bold transition-colors whitespace-nowrap"
                        >
                          Acquire Scent
                        </Button>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">Scent unavailable</span>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 7. Trending Now (Expanded High Density Grid) ── */}
      <section className="py-16 md:py-24 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-[#EAE7E1] pb-5">
          <div>
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold font-sans block mb-1">
              Curated Selections
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#121212]">
              Trending Now
            </h2>
          </div>
          <Link 
            href="/products" 
            className="text-xs font-bold uppercase tracking-[0.2em] text-[#121212] hover:text-[#D4AF37] transition-colors flex items-center gap-1 border-b border-[#121212] pb-1 hover:border-[#D4AF37]"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {(trendingProducts.length > 0 ? trendingProducts.slice(0, 8) : MOCK_PRODUCTS).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickAdd={() => handleQuickAdd(product)}
              onQuickView={() => {
                setQuickViewProduct(product);
                setIsQuickViewOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      {/* ── 8. Signature Fragrance Offer Promo Banner (Original Jennyd Artwork) ── */}
      <section className="py-6 max-w-[1440px] mx-auto w-full px-3.5 sm:px-6 lg:px-8">
        <div className="relative w-full bg-[#121212] text-white border border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-xl">
          {/* Mobile Background Image & Overlay (< lg) */}
          <div className="lg:hidden absolute inset-0 z-0">
            <Image
              src="/assets/product image 1.jpeg"
              alt="Jennyd Signature Fragrance"
              fill
              unoptimized
              className="object-cover opacity-35 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-[#121212]/70" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center relative z-10">
            
            {/* Promo Content */}
            <div className="lg:col-span-7 p-6 sm:p-10 md:p-14 space-y-4">
              <span className="bg-[#D4AF37] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md inline-block shadow-2xs">
                Limited Time Special Offer
              </span>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight">
                Buy Your Signature Fragrance
              </h2>

              <div className="space-y-2">
                <p className="text-[#D4AF37] text-base sm:text-xl font-semibold tracking-wide">
                  Up to 90% OFF + Free delivery all over india
                </p>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-lg font-sans">
                  Elevate your presence with long-lasting Extrait de Parfum and artisanal pure attars. 
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[11px] text-neutral-300 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>* Free delivery offers valid in India only.</span>
                </div>
              </div>

              <div className="pt-3">
                <Link href="/products" className="inline-block w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-[#D4AF37] text-white hover:bg-white hover:text-black rounded-xl px-7 py-3.5 uppercase tracking-wider text-xs font-bold transition-all shadow-md">
                    Claim Offer & Shop Now →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Desktop Visual Image (Original Jennyd Product - >= lg) */}
            <div className="hidden lg:block lg:col-span-5 relative lg:h-full min-h-[380px] bg-black/40">
              <Image
                src="/assets/product image 1.jpeg"
                alt="Jennyd Luxury Signature Perfume"
                fill
                unoptimized
                className="object-cover object-center filter brightness-105 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent" />
            </div>

          </div>
        </div>
      </section>

      {/* ── Video Reel Showcase (Above Reviews Section) ── */}
      <VideoShowcase />

      {/* ── 9. Customer Endorsements & Reviews ── */}
      <section className="py-16 md:py-24 bg-white border-t border-[#EAE7E1]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-12 md:mb-16 flex flex-col gap-2">
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold font-sans">
              Endorsements
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#121212]">
              Loved By Perfume Connoisseurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="bg-[#FAF8F5] p-7 sm:p-8 border border-[#EAE7E1] flex flex-col justify-between hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-[#D4AF37] gap-0.5">
                      {[...Array(review.rating)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Buyer
                    </span>
                  </div>

                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">
                    Purchased: {review.product}
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#121212] mb-2 leading-snug">
                    {review.title}
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                    "{review.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-[#EAE7E1] pt-4 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0">
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#121212] leading-tight">{review.author}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 font-sans">
                      {review.location} • {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

    </div>
  );
}

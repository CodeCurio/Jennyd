"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "/assets/product image 1.jpeg",
    title: "The Golden Era",
    subtitle: "NEW ARRIVALS",
    cta: "SHOP NOW"
  },
  {
    image: "/assets/product image 2.jpeg",
    title: "Floral Fantasies",
    subtitle: "FOR HER",
    cta: "EXPLORE COLLECTION"
  },
  {
    image: "/assets/product image 3.jpeg",
    title: "Mystic Oud",
    subtitle: "LIMITED EDITION",
    cta: "DISCOVER OUD"
  }
];

const STORY_CIRCLES = [
  { name: "Best Sellers", image: "/assets/product image 1.jpeg", link: "/products?sort=best-selling" },
  { name: "For Him", image: "/assets/product image 2.jpeg", link: "/products?category=men" },
  { name: "For Her", image: "/assets/product image 3.jpeg", link: "/products?category=women" },
  { name: "Unisex", image: "/assets/product image 4.jpeg", link: "/products?category=unisex" },
  { name: "Combos", image: "/assets/product image 5.jpeg", link: "/products?category=combos" },
  { name: "Attars", image: "/assets/product image 1.jpeg", link: "/products?category=attar" },
];

const MOCK_PRODUCTS = [
  { id: "1", title: "Oud Royale Extrait", price: 2499, salePrice: 1999, image: "/assets/product image 1.jpeg", slug: "oud-royale", badge: "Best Seller" },
  { id: "2", title: "Velvet Rose & Vanilla", price: 1899, image: "/assets/product image 2.jpeg", slug: "velvet-rose" },
  { id: "3", title: "Midnight Amber Intense", price: 2999, salePrice: 2499, image: "/assets/product image 3.jpeg", slug: "midnight-amber", badge: "New" },
  { id: "4", title: "Citrus Breeze Eau De Parfum", price: 1499, image: "/assets/product image 4.jpeg", slug: "citrus-breeze" },
];

const REVIEWS = [
  {
    title: "My Signature Scent",
    content: "I've been searching for a scent like this for years. The Velvet Rose is perfectly balanced, not too sweet, and lasts my entire 10-hour shift. I get asked what I'm wearing daily.",
    author: "Priya S.",
    initial: "P",
    product: "Velvet Rose & Vanilla"
  },
  {
    title: "Absolutely Beautiful!",
    content: "I have been using Oud Royale for weeks now and the compliments never stop. It smells identical to a ₹15,000 niche perfume I used to buy. Incredible value.",
    author: "Rahul M.",
    initial: "R",
    product: "Oud Royale Extrait"
  },
  {
    title: "Perfect for Gifting",
    content: "Bought the Citrus Breeze for my husband and he loves it. The packaging is super premium and the fragrance projection is amazing. Will definitely be ordering the Oud series next.",
    author: "Ananya K.",
    initial: "A",
    product: "Citrus Breeze"
  }
];

import { supabase } from "@/lib/supabase";

export default function Home() {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(4);
      if (data && !error) {
        setTrendingProducts(data);
      }
    };
    fetchTrending();
  }, []);

  const handleQuickAdd = (product: any) => {
    const displayPrice = product.sale_price || product.price;
    const image = product.metadata?.images?.[0] || "/assets/placeholder.jpg";
    addItem({ productId: product.id, title: product.title, price: displayPrice, image, quantity: 1 });
    addToast({ title: "Added to cart", message: `${product.title} has been added.`, type: "success" });
  };

  return (
    <div className="flex flex-col bg-background selection:bg-accent selection:text-white overflow-hidden pb-20">
      
      {/* Hero Carousel */}
      <section className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:h-[80vh] overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-accent uppercase tracking-[0.3em] text-xs md:text-sm font-bold mb-4"
              >
                {HERO_SLIDES[currentSlide].subtitle}
              </motion.span>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8"
              >
                {HERO_SLIDES[currentSlide].title}
              </motion.h1>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/products">
                  <Button className="bg-white text-black hover:bg-accent hover:text-white rounded-none px-12 py-6 uppercase tracking-widest text-xs font-bold transition-all">
                    {HERO_SLIDES[currentSlide].cta}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? "bg-accent w-6" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Story Circles Navigation */}
      <section className="py-12 px-4 max-w-[1440px] mx-auto w-full overflow-x-auto no-scrollbar">
        <div className="flex justify-start md:justify-center gap-6 md:gap-12 min-w-max px-4">
          {STORY_CIRCLES.map((circle, i) => (
            <Link key={i} href={circle.link} className="flex flex-col items-center gap-3 group">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent transition-colors p-[2px]">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src={circle.image} alt={circle.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">{circle.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 px-6 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-4">
          <h2 className="text-2xl md:text-3xl font-serif">Trending Now</h2>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {(trendingProducts.length > 0 ? trendingProducts : MOCK_PRODUCTS).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickAdd={() => handleQuickAdd(product)}
            />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-10 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-foreground text-background flex items-center">
          <Image
            src="/assets/product image 5.jpeg"
            alt="Promo"
            fill
            className="object-cover opacity-30"
          />
          <div className="relative z-10 p-8 md:p-16 max-w-2xl">
            <span className="bg-sale text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-4 inline-block">Special Offer</span>
            <h2 className="text-3xl md:text-5xl font-serif mb-4 leading-tight">Buy 2 Get 1 Free on all Signature Attars</h2>
            <p className="text-gray-300 mb-8 max-w-md">Experience the rich heritage of Indian perfumery. Hand-blended oils that last all day.</p>
            <Link href="/products?category=attar">
              <Button className="bg-accent text-white hover:bg-white hover:text-black rounded-none px-10 py-6 uppercase tracking-widest text-xs font-bold">
                Shop Attars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop By Notes */}
      <section className="py-16 px-6 md:px-8 max-w-[1440px] mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-serif mb-10 text-center">Shop by Fragrance Notes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Woody & Earthy", image: "/assets/product image 5.jpeg" },
            { title: "Fresh Citrus", image: "/assets/product image 4.jpeg" },
            { title: "Floral", image: "/assets/product image 3.jpeg" },
            { title: "Oriental Spicy", image: "/assets/product image 2.jpeg" },
          ].map((note, i) => (
            <Link key={i} href={`/products?note=${note.title.toLowerCase().split(' ')[0]}`} className="relative aspect-square group overflow-hidden bg-gray-100">
              <Image src={note.image} alt={note.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-serif text-lg md:text-xl">{note.title}</h3>
                <span className="text-accent text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-secondary-background">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif mb-12">Loved By Thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
              <div key={i} className="bg-white p-8 border border-gray-100 shadow-sm text-left flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <h4 className="font-bold mb-2">{review.title}</h4>
                <p className="text-secondary-foreground text-sm flex-1 mb-6 italic">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-serif text-lg">
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{review.author}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Verified Buyer
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Purchased {review.product}</p>
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

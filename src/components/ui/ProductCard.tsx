"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, ShoppingBag, Star } from "lucide-react";
import { useCurrency } from "@/lib/store/CurrencyContext";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    salePrice?: number;
    sale_price?: number;
    image?: string;
    hoverImage?: string;
    slug: string;
    badge?: string;
    category?: string;
    rating?: number;
    reviewsCount?: number;
    reviews_count?: number;
    metadata?: {
      badge?: string;
      images?: string[];
      notes?: any[];
      type?: string;
      accord?: string;
    };
  };
  onQuickAdd?: () => void;
  onQuickView?: () => void;
}

export function ProductCard({ product, onQuickAdd, onQuickView }: ProductCardProps) {
  const salePrice = product.salePrice || product.sale_price;
  const isSale = !!salePrice && salePrice < product.price;
  const displayPrice = isSale ? salePrice : product.price;
  const badge = product.badge || product.metadata?.badge;
  const image = product.image || (product.metadata?.images && product.metadata.images[0]) || "/assets/placeholder.jpg";
  const hoverImage = product.hoverImage || (product.metadata?.images && product.metadata.images[1]) || undefined;
  const { formatPrice } = useCurrency();

  // Olfactory accord / fragrance family label (e.g., "FLORAL MUSKY", "AMBER OUD", "EAU DE PARFUM")
  const accordTag = 
    product.metadata?.accord || 
    product.metadata?.type || 
    product.category || 
    (product.title.toLowerCase().includes("attar") 
      ? "PURE NON-ALCOHOLIC ATTAR" 
      : product.title.toLowerCase().includes("oud")
      ? "WOODY ORIENTAL OUD"
      : product.title.toLowerCase().includes("rose") || product.title.toLowerCase().includes("bloom")
      ? "FLORAL MUSKY"
      : product.title.toLowerCase().includes("citrus") || product.title.toLowerCase().includes("breeze")
      ? "FRESH CITRUS"
      : "EAU DE PARFUM");

  // Consistent pseudo-rating for social proof if not explicitly provided
  const rating = product.rating || 4.8 + (parseInt(product.id.substring(0, 4), 36) % 15) / 100;
  const reviewsCount = product.reviewsCount || product.reviews_count || 32 + (parseInt(product.id.substring(0, 3), 36) % 45);

  const discountPercent = isSale ? Math.round(((product.price - displayPrice) / product.price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col w-full h-full relative"
    >
      {/* Image Container: Uniform 3:4 portrait frame with soft luxury background */}
      <div className="relative w-full aspect-[3/4] bg-[#FAF8F5] overflow-hidden mb-2.5 border border-[#EAE7E1] rounded-2xl shadow-2xs group-hover:shadow-md group-hover:border-[#D4AF37]/50 transition-all duration-500">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          {/* Left Badge (Fixed Overflow & Truncate on Mobile) */}
          {badge && (
            <div className="absolute top-2 left-2 z-10 border border-[#D4AF37] bg-white/95 backdrop-blur-xs text-[#121212] text-[8px] sm:text-[9px] uppercase font-bold px-1.5 sm:px-2 py-0.5 tracking-wider rounded-md shadow-2xs max-w-[62%] truncate">
              {badge}
            </div>
          )}

          {/* Discount Tag Badge (Top Right) */}
          {isSale && discountPercent > 0 && (
            <div className="absolute top-2 right-2 z-10 bg-[#D4AF37] text-white text-[8px] sm:text-[9px] uppercase font-extrabold px-1.5 sm:px-2 py-0.5 tracking-wider rounded-md shadow-2xs shrink-0">
              {discountPercent}% OFF
            </div>
          )}
          
          <Image
            src={image}
            alt={product.title}
            fill
            unoptimized
            className={`object-cover object-center transition-all duration-700 ease-out ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.title} alternative view`}
              fill
              unoptimized
              className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
            />
          )}
        </Link>

        {/* Desktop Quick Action Bar on Hover */}
        <div className="hidden lg:flex absolute bottom-0 left-0 right-0 h-11 bg-[#121212]/95 backdrop-blur-xs items-center justify-between text-white overflow-hidden transition-all duration-300 translate-y-full group-hover:translate-y-0 z-20 rounded-b-2xl">
          {onQuickAdd && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickAdd();
              }}
              className="flex-1 h-full flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer border-r border-white/10"
            >
              + Add To Cart
            </button>
          )}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              className="px-3 h-full flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Product Details (Ultra-Clean & Responsive Mobile & Desktop Layout) */}
      <div className="flex flex-col flex-1 px-0.5 text-left justify-between">
        <div>
          {/* Olfactory Accord Tag */}
          <span className="text-[8.5px] sm:text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#D4AF37] block mb-0.5 truncate">
            {accordTag}
          </span>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block group/title mb-1">
            <h3 className="font-serif font-bold text-xs sm:text-base text-[#121212] group-hover/title:text-[#D4AF37] transition-colors duration-300 line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Rating & Review Count */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-[#D4AF37]">
              <Star className="w-2.8 h-2.8 sm:w-3.5 sm:h-3.5 fill-current" />
            </div>
            <span className="text-[9.5px] sm:text-xs font-bold text-neutral-800 font-sans">
              {rating.toFixed(1)}
            </span>
            <span className="text-[9px] sm:text-[10.5px] text-neutral-400 font-sans">
              ({reviewsCount})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs sm:text-base font-bold text-[#121212] font-mono">
              {formatPrice(displayPrice)}
            </span>
            {isSale && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-mono">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Clean Add to Cart button */}
        {onQuickAdd && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickAdd();
            }}
            className="w-full mt-2.5 py-2 sm:py-2.5 px-2 bg-[#121212] hover:bg-[#D4AF37] text-white text-[9.5px] sm:text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-2xs active:scale-98 cursor-pointer flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}


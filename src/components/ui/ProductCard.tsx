"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "./Button";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
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
    metadata?: {
      badge?: string;
      images?: string[];
    };
  };
  onQuickAdd?: () => void;
  onQuickView?: () => void;
}

export function ProductCard({ product, onQuickAdd, onQuickView }: ProductCardProps) {
  const salePrice = product.salePrice || product.sale_price;
  const isSale = !!salePrice;
  const displayPrice = isSale ? salePrice : product.price;
  const badge = product.badge || product.metadata?.badge;
  const image = product.image || (product.metadata?.images && product.metadata.images[0]) || "/assets/placeholder.jpg";
  const hoverImage = product.hoverImage || (product.metadata?.images && product.metadata.images[1]) || undefined;
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col w-full h-full relative"
    >
      {/* Image Wrapper */}
      <div className="relative w-full aspect-[3/4] bg-[#F9F9F6] overflow-hidden mb-3.5 border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-shadow duration-300">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Elegant Sticker Badges (Only for special custom labels like BESTSELLER or NEW) */}
          {badge && (
            <div className="absolute top-3 left-3 z-10 border border-neutral-200 bg-white/95 backdrop-blur-xs text-[#1A1A1A] text-[9px] uppercase font-bold px-2.5 py-1 tracking-widest shadow-xs">
              {badge}
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

        {/* Premium bottom-sliding dual action bar on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-11 bg-[#1A1A1A]/95 backdrop-blur-xs flex items-center justify-between text-white overflow-hidden transition-all duration-300 translate-y-full group-hover:translate-y-0 z-20">
          {onQuickAdd && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickAdd();
              }}
              className="flex-1 h-full flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer border-r border-white/10"
            >
              Add To Cart
            </button>
          )}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              className="flex-1 h-full flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer"
            >
              Quick View
            </button>
          )}
        </div>
      </div>
      
      {/* Product Information */}
      <div className="flex flex-col flex-1 px-1 text-center sm:text-left">
        <Link href={`/products/${product.slug}`} className="block group/title">
          <h3 className="font-serif text-base sm:text-lg text-[#1A1A1A] group-hover/title:text-[#D4AF37] transition-colors duration-300 line-clamp-1">
            {product.title}
          </h3>
        </Link>
        
        {/* Rating stars and review count */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1 mb-2">
          <div className="flex gap-0.5 text-[#D4AF37]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-current text-current" />
            ))}
          </div>
          <span className="text-[11px] text-neutral-400 font-sans font-medium">(42)</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-1">
          <span className="text-base font-bold text-[#1A1A1A] font-sans">
            {formatPrice(displayPrice)}
          </span>
          {isSale && (
            <>
              <span className="text-xs text-neutral-400 line-through font-normal font-sans">
                {formatPrice(product.price)}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 font-sans">
                ({Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

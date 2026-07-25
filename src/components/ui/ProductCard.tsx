"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
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
      notes?: any[];
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
      {/* Image Container: Clean, un-obscured high-res display */}
      <div className="relative w-full aspect-[3/4] bg-[#FAF8F5] overflow-hidden mb-3 border border-[#EAE7E1] rounded-2xl shadow-2xs group-hover:shadow-md group-hover:border-[#D4AF37]/40 transition-all duration-500">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Badge */}
          {badge && (
            <div className="absolute top-2.5 left-2.5 z-10 border border-[#D4AF37] bg-white/95 backdrop-blur-xs text-[#121212] text-[8px] sm:text-[9px] uppercase font-bold px-2 py-0.5 tracking-wider rounded-md shadow-2xs">
              {badge}
            </div>
          )}
          
          <Image
            src={image}
            alt={product.title}
            fill
            unoptimized
            className={`object-cover object-center transition-all duration-700 ease-out ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-108'}`}
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.title} alternative view`}
              fill
              unoptimized
              className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-108"
            />
          )}
        </Link>

        {/* Desktop Hover Action Bar */}
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
              className="flex-1 h-full flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          )}
        </div>
      </div>
      
      {/* Product Details & Add to Cart button */}
      <div className="flex flex-col flex-1 px-0.5 text-center sm:text-left justify-between">
        <div>
          <Link href={`/products/${product.slug}`} className="block group/title mb-1">
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#121212] group-hover/title:text-[#D4AF37] transition-colors duration-300 line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline justify-center sm:justify-start gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-[#121212] font-mono">
              {formatPrice(displayPrice)}
            </span>
            {isSale && (
              <>
                <span className="text-[11px] text-neutral-400 line-through font-mono">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                  {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Clean, un-obscured Add to Cart button below details for Mobile & Desktop */}
        {onQuickAdd && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickAdd();
            }}
            className="w-full mt-2.5 py-2 px-3 bg-[#121212] hover:bg-[#D4AF37] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-2xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

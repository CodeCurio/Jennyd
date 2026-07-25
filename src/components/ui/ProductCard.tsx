"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
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
      {/* Image Wrapper: High resolution, prominent card frame */}
      <div className="relative w-full aspect-[3/4] bg-[#FAF8F5] overflow-hidden mb-3 border border-[#EAE7E1] rounded-2xl shadow-2xs group-hover:shadow-lg group-hover:border-[#D4AF37]/40 transition-all duration-500">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3 z-10 border border-[#D4AF37] bg-white/95 backdrop-blur-xs text-[#121212] text-[9px] uppercase font-bold px-2.5 py-1 tracking-widest rounded-md shadow-2xs">
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

        {/* Quick Add icon for mobile */}
        {onQuickAdd && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickAdd();
            }}
            className="lg:hidden absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-[#121212]/90 hover:bg-[#D4AF37] text-white flex items-center justify-center shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
            title="Quick Add"
            aria-label="Quick Add to Cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

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
              + Quick Add
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
      
      {/* Product Details */}
      <div className="flex flex-col flex-1 px-1 text-center sm:text-left">
        <Link href={`/products/${product.slug}`} className="block group/title mb-1">
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#121212] group-hover/title:text-[#D4AF37] transition-colors duration-300 line-clamp-1 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline justify-center sm:justify-start gap-2 flex-wrap">
          <span className="text-base sm:text-lg font-bold text-[#121212] font-mono">
            {formatPrice(displayPrice)}
          </span>
          {isSale && (
            <>
              <span className="text-xs text-neutral-400 line-through font-mono">
                {formatPrice(product.price)}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

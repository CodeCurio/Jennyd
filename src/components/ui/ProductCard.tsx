"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "./Button";
import Link from "next/link";
import { Star } from "lucide-react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col w-full h-full"
    >
      <Link href={`/products/${product.slug}`} className="block relative w-full aspect-[4/5] bg-secondary-background overflow-hidden mb-4">
        {isSale && (
          <div className="absolute top-2 left-2 z-10 bg-sale text-white text-[10px] uppercase font-bold px-3 py-1 tracking-wider">
            Sale
          </div>
        )}
        {badge && !isSale && (
          <div className="absolute top-2 left-2 z-10 bg-foreground text-background text-[10px] uppercase font-bold px-3 py-1 tracking-wider">
            {badge}
          </div>
        )}
        <Image
          src={image}
          alt={product.title}
          fill
          unoptimized
          className={`object-cover object-center transition-opacity duration-500 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform'}`}
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${product.title} alternative view`}
            fill
            unoptimized
            className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        {/* Quick View overlay button */}
        {onQuickView && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              className="bg-white/95 hover:bg-black hover:text-white text-black text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-2.5 shadow-md transition-all cursor-pointer transform translate-y-2 group-hover:translate-y-0 duration-300"
            >
              Quick View
            </button>
          </div>
        )}
      </Link>
      
      <div className="flex flex-col flex-1 px-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg md:text-xl text-foreground group-hover:text-foreground/70 transition-colors line-clamp-1">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-accent text-accent" />
          ))}
          <span className="text-xs text-secondary-foreground ml-1">(42)</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <p className={`text-sm ${isSale ? 'text-sale font-medium' : 'text-foreground'}`}>
            ₹{displayPrice}
          </p>
          {isSale && (
            <p className="text-sm text-secondary-foreground line-through">
              ₹{product.price}
            </p>
          )}
        </div>

        <div className="mt-auto">
          <Button 
            onClick={onQuickAdd}
            className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-none uppercase tracking-widest text-[11px] py-4 h-auto"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

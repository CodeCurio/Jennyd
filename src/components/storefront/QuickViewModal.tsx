"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Eye, ShoppingBag } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { useCurrency } from "@/lib/store/CurrencyContext";

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!product) return;
    const sizes = product.metadata?.sizes || [];
    if (sizes.length > 0) {
      setSelectedSize(sizes[0].size);
    } else if (product.title?.toLowerCase()?.includes("50ml")) {
      setSelectedSize("50ml");
    } else {
      setSelectedSize("100ml");
    }
  }, [product]);

  if (!product) return null;

  const basePrice = product.price;
  const baseSalePrice = product.sale_price || product.salePrice;

  // Compute price dynamically based on size selection
  const isBase50ml = product.title?.toLowerCase()?.includes("50ml");
  const customSizes = product.metadata?.sizes || [];
  const hasCustomSizes = customSizes.length > 0;

  let displayPrice = basePrice;
  let displaySalePrice = baseSalePrice;

  if (hasCustomSizes) {
    const matchedSize = customSizes.find((s: any) => s.size === selectedSize);
    if (matchedSize) {
      const sellingPrice = matchedSize.price;
      let mrpPrice = undefined;
      
      if (baseSalePrice && basePrice && basePrice > baseSalePrice) {
        const discountRatio = baseSalePrice / basePrice;
        mrpPrice = Math.round(sellingPrice / discountRatio);
      }
      
      displayPrice = mrpPrice || sellingPrice;
      displaySalePrice = sellingPrice;
    }
  } else {
    if (selectedSize === "50ml" && !isBase50ml) {
      displayPrice = Math.round(basePrice * 0.75);
      if (baseSalePrice) displaySalePrice = Math.round(baseSalePrice * 0.75);
    } else if (selectedSize === "100ml" && isBase50ml) {
      displayPrice = Math.round(basePrice * 1.4);
      if (baseSalePrice) displaySalePrice = Math.round(baseSalePrice * 1.4);
    }
  }

  const isSale = !!displaySalePrice && displaySalePrice < displayPrice;
  const finalPrice = isSale ? displaySalePrice : displayPrice;
  const badge = product.badge || product.metadata?.badge;
  
  const images = product.metadata?.images && product.metadata.images.length > 0 
    ? product.metadata.images 
    : [product.image || "/assets/placeholder.jpg"];

  const handleAddToCart = () => {
    addItem({
      productId: `${product.id}-${selectedSize}`,
      title: `${product.title} (${selectedSize})`,
      price: finalPrice,
      image: images[0],
      quantity
    });
    addToast({ 
      title: "Added to cart", 
      message: `${quantity}x ${product.title} (${selectedSize}) added to cart.`, 
      type: "success" 
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-lg border border-gray-100">
            <Image
              src={images[activeImageIndex]}
              alt={product.title}
              fill
              unoptimized
              className="object-cover object-center"
            />
            {isSale && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 tracking-widest">
                Discount
              </span>
            )}
            {badge && !isSale && (
              <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase font-bold px-2.5 py-1 tracking-widest">
                {badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 bg-gray-50 rounded border overflow-hidden flex-shrink-0 transition-all ${
                    idx === activeImageIndex ? "border-black ring-1 ring-black" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt="" className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col h-full">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block mb-1">
              {product.metadata?.type || "EAU DE PARFUM"}
            </span>
            <h2 className="text-2xl font-serif text-gray-900 leading-tight">{product.title}</h2>
            
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="text-xl font-bold font-mono">{formatPrice(finalPrice)}</span>
            {isSale && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(displayPrice)}</span>
            )}
          </div>

          {/* Description Snippet */}
          <p className="text-xs text-gray-600 leading-relaxed mb-6">
            {product.description || product.metadata?.accordion?.description || "An elegant, premium fragrance carefully curated to leave a lasting impression."}
          </p>

          {/* Size Variant Selector */}
          <div className="mb-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block">Select Size</span>
            <div className="flex gap-3">
              {(hasCustomSizes 
                ? customSizes.map((s: any) => s.size)
                : ["50ml", "100ml"]
              ).map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-xs px-5 py-2.5 border font-semibold tracking-wider transition-all rounded-none ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Action Button */}
          <div className="mt-auto space-y-4 pt-4 border-t border-gray-100">
            <div className="flex gap-4 items-stretch h-11">
              {/* Qty selector */}
              <div className="flex items-center justify-between border border-gray-300 w-28 px-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="text-gray-500 hover:text-black p-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-xs">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="text-gray-500 hover:text-black p-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
            </div>

            {/* View Full Product Details Link */}
            <Link 
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="text-xs font-bold uppercase tracking-widest text-black hover:text-gray-700 flex items-center justify-center gap-1.5 py-2.5 border border-black hover:bg-gray-50 transition-all text-center"
            >
              <Eye className="w-4 h-4" /> View Full Details
            </Link>
          </div>

        </div>

      </div>
    </Modal>
  );
}

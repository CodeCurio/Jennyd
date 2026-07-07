"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, Clock, HelpCircle, Share2, Plus, Minus, Loader2 } from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { ProductReviews } from "@/components/storefront/ProductReviews";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Transaction" },
  { icon: ShieldCheck, label: "Pay on Delivery" },
  { icon: Clock, label: "Easy Order Tracking" },
  { icon: Truck, label: "Free Delivery" },
];

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [productData, setProductData] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" });

  const [selectedSize, setSelectedSize] = useState<"50ml" | "100ml">("100ml");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const decodedSlug = decodeURIComponent(slug);
      const { data: pData, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", decodedSlug)
        .single();

      if (pData && !error) {
        setProductData(pData);
        // Default size based on product title
        if (pData.title?.toLowerCase()?.includes("50ml")) {
          setSelectedSize("50ml");
        }
        
        // Fetch related products
        const { data: rData } = await supabase
          .from("products")
          .select("*")
          .neq("id", pData.id)
          .limit(3);
        if (rData) setRelatedProducts(rData);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The product you're looking for doesn't exist.</p>
        <Link href="/collections/all">
          <Button className="bg-black text-white hover:bg-gray-800">Shop All Products</Button>
        </Link>
      </div>
    );
  }

  const m = productData.metadata || {};
  const rawImages = m.images && m.images.length > 0 ? m.images : ["/assets/product image 1.jpeg"];
  // De-duplicate images to fix screenshot layout bugs
  const uniqueImages = Array.from(new Set(rawImages)) as string[];

  const isBase50ml = productData.title?.toLowerCase()?.includes("50ml");

  // Determine stock availability for sizes
  const productStock = productData.stock_quantity || 0;
  const is50mlAvailable = productStock > 0;
  // If stock is low (e.g. < 30), let's mock 100ml out of stock to demonstrate swathes styling
  const is100mlAvailable = productStock >= 30;

  // Calculate pricing based on selection
  let displayPrice = productData.price;
  let displayMrp = productData.sale_price;

  if (selectedSize === "50ml" && !isBase50ml) {
    displayPrice = Math.round(productData.price * 0.75);
    if (productData.sale_price) displayMrp = Math.round(productData.sale_price * 0.75);
  } else if (selectedSize === "100ml" && isBase50ml) {
    displayPrice = Math.round(productData.price * 1.4);
    if (productData.sale_price) displayMrp = Math.round(productData.sale_price * 1.4);
  }

  const isSale = !!displayMrp;
  const finalPrice = isSale ? displayMrp : displayPrice;
  const originalPriceForDisplay = isSale ? displayPrice : undefined;

  const isSelectedSizeAvailable = selectedSize === "50ml" ? is50mlAvailable : is100mlAvailable;

  const PRODUCT = {
    id: productData.id,
    title: productData.title,
    badge: m.badge || "",
    type: m.type || "EAU DE PARFUM",
    categories: productData.tags || [],
    reviewsCount: 0,
    price: finalPrice,
    mrp: originalPriceForDisplay,
    discount: m.discountTag || (isSale ? `${Math.round(((displayPrice - displayMrp) / displayPrice) * 100)}% OFF` : ""),
    images: uniqueImages,
    notes: m.notes || [],
    description: m.accordion?.description || productData.description || "",
    accordion: m.accordion || {}
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${uniqueImages[activeImageIndex]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "220%" // Zoom power
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const handleAddToCart = () => {
    if (!isSelectedSizeAvailable) return;
    addItem({ 
      productId: `${PRODUCT.id}-${selectedSize}`, 
      title: `${PRODUCT.title} (${selectedSize})`, 
      price: PRODUCT.price, 
      quantity,
      image: PRODUCT.images[0]
    });
    addToast({ title: "Added to cart", message: `${quantity}x ${PRODUCT.title} (${selectedSize}) added.`, type: "success" });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: PRODUCT.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({ title: "Link Copied", message: "Product link copied to clipboard", type: "success" });
    }
  };

  const handleAskQuestion = () => {
    window.location.href = "mailto:support@jennyd.com?subject=Question about " + PRODUCT.title;
  };

  return (
    <div className="bg-background min-h-screen relative pb-24 font-sans">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 text-[10px] uppercase tracking-widest text-gray-500">
        <Link href="/" className="hover:text-black">Home</Link> / <Link href="/products" className="hover:text-black">Perfumes</Link> / {PRODUCT.title}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Column: Image Gallery (Sticky & Clean Thumbnails Layout) */}
          <div className="lg:sticky lg:top-24 h-fit flex flex-col gap-4">
            
            {/* Active primary large image container with Zoom on Hover */}
            <div 
              className="relative aspect-[4/5] bg-gray-50 overflow-hidden group cursor-crosshair border border-gray-150 rounded"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image 
                src={uniqueImages[activeImageIndex]} 
                alt={`${PRODUCT.title} - Main Image`} 
                fill 
                unoptimized
                className="object-cover transition-opacity duration-300"
                priority
              />
              {/* Custom Magnifier Zoom Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-200 hidden md:block border border-gray-200"
                style={{
                  ...zoomStyle,
                  opacity: zoomStyle.display === "block" ? 1 : 0
                }}
              />
            </div>

            {/* Clickable gallery thumbnails under the main view */}
            {uniqueImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {uniqueImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-18 h-18 bg-gray-50 rounded border overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                      idx === activeImageIndex ? "border-black ring-1 ring-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={img} alt="" className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Product Info & Swatches */}
          <div className="flex flex-col pt-4">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold uppercase tracking-wide flex items-center gap-2 md:gap-3">
                {PRODUCT.title}
                {PRODUCT.badge && (
                  <span className="bg-black text-white text-[9px] md:text-[10px] px-2 py-1 tracking-widest align-middle font-sans font-bold">
                    {PRODUCT.badge}
                  </span>
                )}
              </h1>
            </div>

            {/* Reviews & Type */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              <div className="flex gap-0.5 text-accent">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
              </div>
              <span className="text-gray-600">{PRODUCT.reviewsCount} reviews</span>
            </div>
            {PRODUCT.type && (
              <div className="text-sm font-bold tracking-widest uppercase mb-1">
                {PRODUCT.type}
              </div>
            )}
            {PRODUCT.categories.length > 0 && (
              <div className="text-sm text-gray-500 mb-8 tracking-wider">
                {PRODUCT.categories.join(" | ")}
              </div>
            )}

            {/* Visual Fragrance Notes */}
            {PRODUCT.notes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-500">Notes</h3>
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                  {PRODUCT.notes.map((note: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-2 min-w-[70px]">
                      <div className="w-16 h-16 rounded-full overflow-hidden relative border border-gray-200 shadow-sm bg-gray-50">
                        {note.image ? (
                          <img src={note.image} alt={note.name} className="object-cover w-full h-full" />
                        ) : null}
                      </div>
                      <span className="text-xs font-semibold text-center">{note.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-bold font-mono">₹ {PRODUCT.price.toLocaleString()}</span>
              {PRODUCT.mrp && (
                <span className="text-gray-400 line-through text-sm font-mono">MRP ₹ {PRODUCT.mrp.toLocaleString()}</span>
              )}
              {PRODUCT.discount && (
                <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                  {PRODUCT.discount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mb-6 font-medium">Tax included. Shipping computed at checkout.</p>

            {/* Variant Size Swatches (with out-of-stock disable style logic) */}
            <div className="mb-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block">Select Size</span>
              <div className="flex gap-3">
                {[
                  { size: "50ml" as const, isAvailable: is50mlAvailable },
                  { size: "100ml" as const, isAvailable: is100mlAvailable }
                ].map(({ size, isAvailable }) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`relative text-xs px-6 py-3 border font-bold uppercase tracking-widest transition-all rounded-none overflow-hidden ${
                        !isAvailable 
                          ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                          : isSelected
                            ? "border-black bg-black text-white cursor-pointer"
                            : "border-gray-300 bg-white text-black hover:border-black cursor-pointer"
                      }`}
                    >
                      {size}
                      
                      {/* Crossed Diagonal Out-Of-Stock Line */}
                      {!isAvailable && (
                        <svg className="absolute inset-0 w-full h-full text-red-500/25 pointer-events-none" preserveAspectRatio="none">
                          <line x1="0" y1="100%" x2="100%" y2="0" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Stock Indicator & Warnings */}
              <div className="text-xs mt-2">
                {!isSelectedSizeAvailable ? (
                  <span className="text-red-600 font-bold">Sold Out / Out of Stock</span>
                ) : productStock < 30 && selectedSize === "100ml" ? (
                  <span className="text-orange-600 font-bold">Only a few left in stock!</span>
                ) : (
                  <span className="text-green-700 font-bold">✓ In Stock</span>
                )}
              </div>
            </div>

            {/* Add to Cart / Quantity selection Area */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Full Width Premium Quantity Selector */}
              <div className="flex items-center justify-between border border-neutral-200 h-14 px-5 bg-white select-none">
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B]">Quantity</span>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={!isSelectedSizeAvailable}
                    className="text-neutral-400 hover:text-black p-1.5 transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`font-bold text-sm text-[#1A1A1A] min-w-[24px] text-center ${!isSelectedSizeAvailable ? "text-neutral-300" : ""}`}>
                    {quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)} 
                    disabled={!isSelectedSizeAvailable}
                    className="text-neutral-400 hover:text-black p-1.5 transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Full Width Stacked CTA Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!isSelectedSizeAvailable}
                  className={`w-full rounded-none uppercase tracking-widest font-bold h-14 text-xs transition-all duration-300 ${
                    !isSelectedSizeAvailable
                      ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                      : "bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] cursor-pointer"
                  }`}
                >
                  {isSelectedSizeAvailable ? "Add to cart" : "Sold Out"}
                </Button>
                <Button 
                  onClick={handleAddToCart}
                  disabled={!isSelectedSizeAvailable}
                  className={`w-full rounded-none uppercase tracking-widest font-bold h-14 text-xs transition-all duration-300 ${
                    !isSelectedSizeAvailable
                      ? "bg-[#FAF9F6] text-neutral-300 border border-neutral-150 cursor-not-allowed"
                      : "bg-[#F5F5F0] hover:bg-[#1A1A1A] border border-[#1a1a1a]/5 hover:border-black text-[#1A1A1A] hover:text-white cursor-pointer"
                  }`}
                >
                  {isSelectedSizeAvailable ? "Buy it Now" : "Out of Stock"}
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-2 mb-6">
              {TRUST_BADGES.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center gap-2">
                    <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                    <span className="text-[10px] leading-tight text-gray-600">{badge.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Accordions */}
            <div className="mb-8 border-t border-gray-100 pt-6">
              <Accordion>
                <AccordionItem title="Description" defaultOpen={true}>
                  <p>{PRODUCT.description || "No description provided."}</p>
                </AccordionItem>
                {PRODUCT.notes.length > 0 && (
                  <AccordionItem title="Fragrance Notes">
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>All Notes:</strong> {PRODUCT.notes.map((n:any)=>n.name).join(", ")}</li>
                    </ul>
                  </AccordionItem>
                )}
                {PRODUCT.accordion.feelings && (
                  <AccordionItem title="Feelings">
                    <p>{PRODUCT.accordion.feelings}</p>
                  </AccordionItem>
                )}
                {PRODUCT.accordion.occasions && (
                  <AccordionItem title="Occasions">
                    <p>{PRODUCT.accordion.occasions}</p>
                  </AccordionItem>
                )}
                {PRODUCT.accordion.behind_perfume && (
                  <AccordionItem title="Behind The Perfume">
                    <p>{PRODUCT.accordion.behind_perfume}</p>
                  </AccordionItem>
                )}
                <AccordionItem title="Shipping & Return">
                  <p>Free shipping on orders above ₹999. Easy 7-day returns for unopened products.</p>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Footer actions */}
            <div className="flex items-center gap-6 border-t border-gray-200 pt-4 text-sm font-medium text-gray-600">
              <button onClick={handleAskQuestion} className="flex items-center gap-2 hover:text-black">
                <HelpCircle className="w-4 h-4" /> Ask a question
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 hover:text-black">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Below the Fold: Rich Content */}
      <div className="w-full bg-[#fcfaf8] py-16 px-4 md:px-8 border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
            {PRODUCT.images.length > 0 ? (
              <Image src={PRODUCT.images[PRODUCT.images.length - 1]} alt="Ingredients" fill unoptimized className="object-cover" />
            ) : null}
          </div>
          <div className="md:px-12 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-serif mb-6 leading-relaxed">
              Discover the enchanting notes of {PRODUCT.title}. Crafted with premium ingredients to create a truly captivating experience.
            </h2>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <ProductReviews productId={PRODUCT.id} />
        </div>
      </div>

      {/* You Might Also Like */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1440px] mx-auto text-center pt-16 px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-serif mb-12">You Might Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 text-left">
            {relatedProducts.map((relProduct) => (
              <ProductCard 
                key={relProduct.id} 
                product={{
                  id: relProduct.id,
                  slug: relProduct.slug,
                  title: relProduct.title,
                  price: relProduct.price,
                  salePrice: relProduct.sale_price,
                  image: relProduct.metadata?.images?.[0] || "/assets/product image 1.jpeg",
                  badge: relProduct.metadata?.badge
                }} 
                onQuickAdd={() => {
                  addItem({ 
                    productId: relProduct.id, 
                    title: relProduct.title, 
                    price: relProduct.price,
                    quantity: 1,
                    image: relProduct.metadata?.images?.[0] || "/assets/product image 1.jpeg"
                  });
                  addToast({ title: "Added to cart", message: `${relProduct.title} has been added.`, type: "success" });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 transform transition-transform duration-300 border-t border-gray-100 py-3 px-4 md:px-8 ${
          showStickyBar ? "translate-y-0" : "translate-y-[150%]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          <div className="hidden md:flex items-center gap-4">
            <div className="w-12 h-12 relative bg-gray-100 rounded overflow-hidden">
              <Image src={PRODUCT.images[0]} alt={PRODUCT.title} fill unoptimized className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">{PRODUCT.title} ({selectedSize})</p>
              <p className="text-xs text-gray-500 font-mono">₹ {PRODUCT.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center justify-between border border-gray-300 w-28 h-10 px-3 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                disabled={!isSelectedSizeAvailable}
                className="text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className={`font-bold text-sm ${!isSelectedSizeAvailable ? "text-gray-300" : ""}`}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                disabled={!isSelectedSizeAvailable}
                className="text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <Button 
              onClick={handleAddToCart}
              disabled={!isSelectedSizeAvailable}
              className={`rounded-none uppercase tracking-widest font-bold h-10 px-8 text-xs flex-1 md:flex-none transition-colors ${
                !isSelectedSizeAvailable
                  ? "bg-gray-150 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900 cursor-pointer"
              }`}
            >
              {isSelectedSizeAvailable ? "Add to cart" : "Sold Out"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

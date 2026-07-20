"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, Clock, HelpCircle, Share2, Plus, Minus, Loader2, Sparkles, Award, PackageCheck } from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { ProductReviews } from "@/components/storefront/ProductReviews";
import { useCurrency } from "@/lib/store/CurrencyContext";

const TRUST_BADGES = [
  { icon: Award, label: "100% Authentic Fragrance" },
  { icon: Truck, label: "Complimentary Express Shipping" },
  { icon: PackageCheck, label: "Dispatched Within 24 Hrs" },
  { icon: ShieldCheck, label: "Secure & Encrypted Payment" },
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
  const { formatPrice } = useCurrency();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" });

  const [selectedSize, setSelectedSize] = useState<string>("");

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
        // Set default size based on metadata sizes or product title
        const sizes = pData.metadata?.sizes || [];
        if (sizes.length > 0) {
          setSelectedSize(sizes[0].size);
        } else if (pData.title?.toLowerCase()?.includes("50ml")) {
          setSelectedSize("50ml");
        } else {
          setSelectedSize("100ml");
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
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif font-bold mb-4 text-[#1A1A1A]">Product Not Found</h1>
        <p className="text-gray-500 mb-8 font-sans text-sm">The product you're looking for doesn't exist.</p>
        <Link href="/products">
          <Button className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] px-8 py-3 rounded-none uppercase tracking-widest text-xs font-bold transition-colors">
            Shop All Products
          </Button>
        </Link>
      </div>
    );
  }

  const m = productData.metadata || {};
  const rawImages = m.images && m.images.length > 0 ? m.images : ["/assets/product image 1.jpeg"];
  const uniqueImages = Array.from(new Set(rawImages)) as string[];

  const isBase50ml = productData.title?.toLowerCase()?.includes("50ml");
  const customSizes = m.sizes || [];
  const hasCustomSizes = customSizes.length > 0;

  // Determine stock and pricing based on selection
  let displayPrice = productData.price;
  let displayMrp = productData.sale_price;
  let isSelectedSizeAvailable = true;

  if (hasCustomSizes) {
    const matchedSize = customSizes.find((s: any) => s.size === selectedSize);
    if (matchedSize) {
      displayPrice = matchedSize.price;
      displayMrp = undefined;
      isSelectedSizeAvailable = (matchedSize.stock !== undefined) ? matchedSize.stock > 0 : (productData.stock_quantity > 0);
    }
  } else {
    const productStock = productData.stock_quantity || 0;
    const is50mlAvailable = productStock > 0;
    const is100mlAvailable = productStock >= 30;

    if (selectedSize === "50ml" && !isBase50ml) {
      displayPrice = Math.round(productData.price * 0.75);
      if (productData.sale_price) displayMrp = Math.round(productData.sale_price * 0.75);
    } else if (selectedSize === "100ml" && isBase50ml) {
      displayPrice = Math.round(productData.price * 1.4);
      if (productData.sale_price) displayMrp = Math.round(productData.sale_price * 1.4);
    }
    isSelectedSizeAvailable = selectedSize === "50ml" ? is50mlAvailable : is100mlAvailable;
  }

  const isSale = !!displayMrp;
  const finalPrice = isSale ? displayMrp : displayPrice;
  const originalPriceForDisplay = isSale ? displayPrice : undefined;

  const PRODUCT = {
    id: productData.id,
    title: productData.title,
    badge: m.badge || "",
    type: m.type || "EAU DE PARFUM",
    categories: productData.tags || [],
    reviewsCount: 42,
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
      backgroundSize: "220%"
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
    addToast({ title: "Added to cart", message: `${quantity}x ${PRODUCT.title} (${selectedSize}) added to your cart.`, type: "success" });
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

  // Helper to structure notes into Olfactory Pyramid
  const noteList = PRODUCT.notes.map((n: any) => typeof n === "string" ? { name: n } : n);
  const topNotes = noteList.slice(0, 2);
  const heartNotes = noteList.slice(2, 4);
  const baseNotes = noteList.slice(4);

  return (
    <div className="bg-background min-h-screen relative pb-24 font-sans text-[#1A1A1A]">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-5 text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2 text-neutral-300">/</span>
        <Link href="/products" className="hover:text-black transition-colors">Perfumes</Link>
        <span className="mx-2 text-neutral-300">/</span>
        <span className="text-neutral-800 font-semibold">{PRODUCT.title}</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-16">
        {/* 12-Column Grid Layout (7 cols Image Gallery, 5 cols Sticky Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left 7 Columns: Luxury Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Gallery Thumbnails Column */}
            {uniqueImages.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[620px] shrink-0">
                {uniqueImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    onMouseEnter={() => setActiveImageIndex(idx)}
                    className={`relative w-18 h-22 md:w-20 md:h-24 bg-[#F9F9F6] border overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                      idx === activeImageIndex 
                        ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A] opacity-100" 
                        : "border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400"
                    }`}
                  >
                    <img src={img} alt="" className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Primary Main Image Container with Magnifier Zoom */}
            <div className="flex-1 relative aspect-[4/5] bg-[#F9F9F6] overflow-hidden group cursor-crosshair border border-neutral-200/80 rounded-none shadow-xs">
              {PRODUCT.badge && (
                <div className="absolute top-4 left-4 z-20 bg-[#1A1A1A] text-white text-[9px] uppercase font-bold px-3 py-1 tracking-widest">
                  {PRODUCT.badge}
                </div>
              )}

              <Image 
                src={uniqueImages[activeImageIndex]} 
                alt={`${PRODUCT.title} - Main View`} 
                fill 
                unoptimized
                className="object-cover transition-opacity duration-300"
                priority
              />
              
              {/* Magnifier Zoom Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-200 hidden md:block border border-neutral-200"
                style={{
                  ...zoomStyle,
                  opacity: zoomStyle.display === "block" ? 1 : 0
                }}
              />
            </div>

          </div>

          {/* Right 5 Columns: Sticky Product Details & Purchase Actions */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit flex flex-col">
            
            {/* Header: Scent Type & Title */}
            <div className="mb-3">
              {PRODUCT.type && (
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase block mb-1.5">
                  {PRODUCT.type}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1A1A1A] uppercase tracking-wide leading-tight">
                {PRODUCT.title}
              </h1>
            </div>

            {/* Ratings & Categories */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current text-current" />)}
              </div>
              <span className="text-xs text-neutral-500 font-medium font-sans">
                4.9 ★ ({PRODUCT.reviewsCount} reviews)
              </span>
              {PRODUCT.categories.length > 0 && (
                <span className="text-xs text-neutral-300 font-sans">|</span>
              )}
              {PRODUCT.categories.length > 0 && (
                <span className="text-xs text-neutral-500 tracking-wider">
                  {PRODUCT.categories.join(" • ")}
                </span>
              )}
            </div>

            {/* Pricing Section (Clean Luxury Typography - No loud green boxes) */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-serif font-bold text-[#1A1A1A]">
                {formatPrice(PRODUCT.price)}
              </span>
              {PRODUCT.mrp && (
                <span className="text-sm text-neutral-400 line-through font-sans">
                  MRP {formatPrice(PRODUCT.mrp)}
                </span>
              )}
              {PRODUCT.discount && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                  {PRODUCT.discount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mb-8 font-medium">Inclusive of all taxes. Free shipping applied at checkout.</p>

            {/* Variant Size Swatches */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Bottle Size</span>
                <span className="text-xs font-semibold text-[#D4AF37] underline cursor-pointer hover:text-black transition-colors">Size Guide</span>
              </div>

              <div className="flex gap-3">
                {(hasCustomSizes 
                  ? customSizes.map((s: any) => ({
                      size: s.size,
                      isAvailable: s.stock !== undefined ? s.stock > 0 : (productData.stock_quantity > 0)
                    }))
                  : [
                      { size: "50ml", isAvailable: productData.stock_quantity > 0 },
                      { size: "100ml", isAvailable: productData.stock_quantity >= 30 }
                    ]
                ).map(({ size, isAvailable }: { size: string; isAvailable: boolean }) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`relative text-xs px-7 py-3 border font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        !isAvailable 
                          ? "border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                          : isSelected
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xs"
                            : "border-neutral-300 bg-white text-[#1A1A1A] hover:border-black"
                      }`}
                    >
                      {size}
                      {!isAvailable && (
                        <svg className="absolute inset-0 w-full h-full text-red-400/30 pointer-events-none" preserveAspectRatio="none">
                          <line x1="0" y1="100%" x2="100%" y2="0" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stock Indicator */}
              <div className="text-xs mt-2 font-medium">
                {!isSelectedSizeAvailable ? (
                  <span className="text-red-600 font-bold">Currently Out of Stock</span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                    In Stock • Ready to Ship
                  </span>
                )}
              </div>
            </div>

            {/* Streamlined Action Row (Quantity + Add to Cart) */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex gap-3 h-13">
                {/* Quantity Selector */}
                <div className="w-32 border border-neutral-300 flex items-center justify-between px-3 bg-white select-none shrink-0">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={!isSelectedSizeAvailable}
                    className="text-neutral-400 hover:text-black p-1 transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm text-[#1A1A1A] text-center min-w-[20px]">
                    {quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)} 
                    disabled={!isSelectedSizeAvailable}
                    className="text-neutral-400 hover:text-black p-1 transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary CTA Button */}
                <Button 
                  onClick={handleAddToCart}
                  disabled={!isSelectedSizeAvailable}
                  className={`flex-1 rounded-none uppercase tracking-widest font-bold h-full text-xs transition-all duration-300 ${
                    !isSelectedSizeAvailable
                      ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                      : "bg-[#1A1A1A] text-white hover:bg-[#D4AF37] cursor-pointer shadow-xs"
                  }`}
                >
                  {isSelectedSizeAvailable ? "Add to Cart" : "Sold Out"}
                </Button>
              </div>

              {/* Secondary Instant Checkout Button */}
              <Button 
                onClick={handleAddToCart}
                disabled={!isSelectedSizeAvailable}
                className={`w-full rounded-none uppercase tracking-widest font-bold h-13 text-xs transition-all duration-300 ${
                  !isSelectedSizeAvailable
                    ? "bg-[#FAF9F6] text-neutral-300 border border-neutral-150 cursor-not-allowed"
                    : "bg-[#F5F5F0] hover:bg-[#1A1A1A] hover:text-white border border-neutral-300 text-[#1A1A1A] cursor-pointer"
                }`}
              >
                {isSelectedSizeAvailable ? "Buy It Now" : "Out of Stock"}
              </Button>
            </div>

            {/* Minimalist Horizontal Trust Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-neutral-200 mb-8 bg-[#FAF9F6]/60 px-3">
              {TRUST_BADGES.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center gap-1.5 p-1">
                    <Icon className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.75} />
                    <span className="text-[10px] leading-tight font-medium text-neutral-600">{badge.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Olfactory Fragrance Pyramid Section */}
            {noteList.length > 0 && (
              <div className="mb-8 p-5 bg-[#FDFBF7] border border-[#EFECE6] rounded-none">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-[#1A1A1A] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Scent Pyramid & Fragrance Profile
                </h3>
                <div className="space-y-3 text-xs">
                  {topNotes.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="font-bold uppercase tracking-wider text-neutral-400 w-20 shrink-0">Top Notes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {topNotes.map((n: any, idx: number) => (
                          <span key={idx} className="bg-white border border-neutral-200 px-2.5 py-1 text-neutral-800 font-medium shadow-2xs">
                            {n.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {heartNotes.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="font-bold uppercase tracking-wider text-neutral-400 w-20 shrink-0">Heart Notes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {heartNotes.map((n: any, idx: number) => (
                          <span key={idx} className="bg-white border border-neutral-200 px-2.5 py-1 text-neutral-800 font-medium shadow-2xs">
                            {n.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {baseNotes.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="font-bold uppercase tracking-wider text-neutral-400 w-20 shrink-0">Base Notes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {baseNotes.map((n: any, idx: number) => (
                          <span key={idx} className="bg-white border border-neutral-200 px-2.5 py-1 text-neutral-800 font-medium shadow-2xs">
                            {n.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Accordions */}
            <div className="mb-6">
              <Accordion>
                <AccordionItem title="Product Story & Description" defaultOpen={true}>
                  <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm">{PRODUCT.description || "No description provided."}</p>
                </AccordionItem>
                {PRODUCT.accordion.feelings && (
                  <AccordionItem title="Sensory Mood & Feelings">
                    <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm">{PRODUCT.accordion.feelings}</p>
                  </AccordionItem>
                )}
                {PRODUCT.accordion.occasions && (
                  <AccordionItem title="Recommended Occasions">
                    <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm">{PRODUCT.accordion.occasions}</p>
                  </AccordionItem>
                )}
                <AccordionItem title="Shipping, Returns & Authenticity">
                  <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm">Free express shipping on all orders. Sealed perfume boxes are eligible for easy 7-day returns.</p>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Auxiliary actions */}
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-neutral-500">
              <button onClick={handleAskQuestion} className="flex items-center gap-1.5 hover:text-black cursor-pointer transition-colors">
                <HelpCircle className="w-4 h-4" /> Ask a Question
              </button>
              <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-black cursor-pointer transition-colors">
                <Share2 className="w-4 h-4" /> Share Product
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <ProductReviews productId={PRODUCT.id} />
        </div>
      </div>

      {/* You Might Also Like */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1440px] mx-auto text-center pt-12 px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="text-2xl sm:text-3xl font-serif mb-10 uppercase tracking-wide text-[#1A1A1A]">Complete Your Scent Wardrobe</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left">
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

      {/* Mobile-optimized Sticky Bottom Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 transform transition-transform duration-300 border-t border-neutral-200 py-3 px-4 sm:px-6 md:px-8 ${
          showStickyBar ? "translate-y-0" : "translate-y-[150%]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          <div className="hidden md:flex items-center gap-3.5">
            <div className="w-11 h-11 relative bg-neutral-100 border overflow-hidden">
              <Image src={PRODUCT.images[0]} alt={PRODUCT.title} fill unoptimized className="object-cover" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm leading-tight text-[#1A1A1A]">{PRODUCT.title} ({selectedSize})</p>
              <p className="text-xs text-neutral-600 font-sans font-bold">{formatPrice(PRODUCT.price)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center justify-between border border-neutral-300 w-24 h-10 px-2 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                disabled={!isSelectedSizeAvailable}
                className="text-neutral-500 hover:text-black disabled:opacity-30 cursor-pointer p-1"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className={`font-bold text-xs ${!isSelectedSizeAvailable ? "text-neutral-300" : ""}`}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                disabled={!isSelectedSizeAvailable}
                className="text-neutral-500 hover:text-black disabled:opacity-30 cursor-pointer p-1"
              >
                <Plus className="w-3-3" />
              </button>
            </div>
            <Button 
              onClick={handleAddToCart}
              disabled={!isSelectedSizeAvailable}
              className={`rounded-none uppercase tracking-widest font-bold h-10 px-6 text-[11px] flex-1 md:flex-none transition-colors ${
                !isSelectedSizeAvailable
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-[#1A1A1A] text-white hover:bg-[#D4AF37] cursor-pointer"
              }`}
            >
              {isSelectedSizeAvailable ? "Add to Cart" : "Sold Out"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

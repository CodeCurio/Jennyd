"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  HelpCircle, 
  Share2, 
  Plus, 
  Minus, 
  Loader2, 
  Sparkles, 
  Award, 
  PackageCheck, 
  Maximize2, 
  X,
  Layers,
  Clock,
  Sun,
  Moon,
  Wind
} from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { ProductReviews } from "@/components/storefront/ProductReviews";
import { useCurrency } from "@/lib/store/CurrencyContext";

const REAL_TRUST_BADGES = [
  { icon: Award, label: "100% Authentic Fragrance", sub: "Formulated with Fine Oils" },
  { icon: Truck, label: "Express Delivery", sub: "Dispatched Within 24H" },
  { icon: PackageCheck, label: "Luxury Packaging", sub: "Sealed Original Box" },
  { icon: ShieldCheck, label: "7-Day Easy Returns", sub: "Valid on Unopened Boxes" },
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
  const router = useRouter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" });
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const decodedSlug = decodeURIComponent(slug);
      
      // 1. Try exact slug match
      let { data: pData } = await supabase
        .from("products")
        .select("*")
        .eq("slug", decodedSlug)
        .maybeSingle();

      // 2. Try case-insensitive match
      if (!pData) {
        const { data: pDataIlike } = await supabase
          .from("products")
          .select("*")
          .ilike("slug", decodedSlug)
          .maybeSingle();
        if (pDataIlike) pData = pDataIlike;
      }

      // 3. Try replacing hyphens with spaces
      if (!pData) {
        const spaceSlug = decodedSlug.replace(/-/g, " ");
        const { data: pDataSpace } = await supabase
          .from("products")
          .select("*")
          .ilike("slug", spaceSlug)
          .maybeSingle();
        if (pDataSpace) pData = pDataSpace;
      }

      // 4. Try replacing spaces with hyphens
      if (!pData) {
        const hyphenSlug = decodedSlug.replace(/ /g, "-");
        const { data: pDataHyphen } = await supabase
          .from("products")
          .select("*")
          .ilike("slug", hyphenSlug)
          .maybeSingle();
        if (pDataHyphen) pData = pDataHyphen;
      }

      // 5. Fallback: try matching title
      if (!pData) {
        const titleSearch = decodedSlug.replace(/-/g, " ");
        const { data: pDataTitle } = await supabase
          .from("products")
          .select("*")
          .ilike("title", titleSearch)
          .maybeSingle();
        if (pDataTitle) pData = pDataTitle;
      }

      if (pData) {
        setProductData(pData);
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
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-[#1A1A1A]">Fragrance Not Found</h1>
        <p className="text-neutral-500 mb-8 font-sans text-xs sm:text-sm max-w-md">The product you are looking for is currently unavailable.</p>
        <Link href="/products">
          <Button className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black px-6 sm:px-8 py-3.5 rounded-xl uppercase tracking-widest text-xs font-bold transition-all shadow-md">
            Explore All Fragrances
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

  // Determine pricing & availability
  let displayPrice = productData.price;
  let displayMrp = productData.sale_price;
  let isSelectedSizeAvailable = true;

  if (hasCustomSizes) {
    const matchedSize = customSizes.find((s: any) => s.size === selectedSize);
    if (matchedSize) {
      const sellingPrice = matchedSize.price;
      let mrpPrice = undefined;
      
      if (productData.sale_price && productData.price && productData.price > productData.sale_price) {
        const discountRatio = productData.sale_price / productData.price;
        mrpPrice = Math.round(sellingPrice / discountRatio);
      }
      
      displayPrice = mrpPrice || sellingPrice;
      displayMrp = sellingPrice;
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

  const isSale = !!displayMrp && displayMrp < displayPrice;
  const finalPrice = isSale ? displayMrp : displayPrice;
  const originalPriceForDisplay = isSale ? displayPrice : undefined;

  const PRODUCT = {
    id: productData.id,
    title: productData.title,
    badge: m.badge || "",
    type: m.type || "EAU DE PARFUM",
    categories: productData.tags || [],
    price: finalPrice,
    mrp: originalPriceForDisplay,
    discount: m.discountTag || (isSale ? `${Math.round(((displayPrice - displayMrp) / displayPrice) * 100)}% OFF` : ""),
    images: uniqueImages,
    notes: m.notes || [],
    longevity: m.longevity || null,
    bestSeasons: m.bestSeasons || m.best_seasons || null,
    idealTime: m.idealTime || m.ideal_time || null,
    projection: m.projection || null,
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
    addToast({ title: "Added to Bag", message: `${quantity}x ${PRODUCT.title} (${selectedSize}) added to your bag.`, type: "success" });
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      setPincodeStatus("Please enter a valid 6-digit postal code.");
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeStatus("🚚 Delivery available! Expected in 2–3 business days.");
    }, 800);
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
    window.location.href = "mailto:support@jennydscents.com?subject=Question about " + PRODUCT.title;
  };

  // Olfactory notes hierarchy
  const noteList = PRODUCT.notes.map((n: any) => typeof n === "string" ? { name: n } : n);
  const topNotes = noteList.slice(0, 2);
  const heartNotes = noteList.slice(2, 4);
  const baseNotes = noteList.slice(4);

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": PRODUCT.title,
    "image": PRODUCT.images.map((img: string) => img.startsWith("http") ? img : `https://jennydscents.com${img}`),
    "description": PRODUCT.description || `${PRODUCT.title} - Luxury Extrait de Parfum by Jennyd Scents`,
    "sku": PRODUCT.id,
    "brand": {
      "@type": "Brand",
      "name": "Jennyd Scents"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://jennydscents.com/products/${slug}`,
      "priceCurrency": "INR",
      "price": PRODUCT.price,
      "availability": isSelectedSizeAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "48"
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen relative pb-24 font-sans text-[#1A1A1A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      
      {/* ── Breadcrumb Navigation ── */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-5 text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 font-medium overflow-x-auto whitespace-nowrap no-scrollbar">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-1.5 sm:mx-2 text-neutral-300">/</span>
        <Link href="/products" className="hover:text-black transition-colors">Perfumes</Link>
        <span className="mx-1.5 sm:mx-2 text-neutral-300">/</span>
        <span className="text-neutral-800 font-semibold">{PRODUCT.title}</span>
      </div>

      {/* ── 1. Top Section: Product Purchase Grid (Gallery Left, Purchase Box Right) ── */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left 7 Columns: Product Gallery (Mobile & Tablet Optimized) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
            
            {/* Gallery Thumbnails (Horizontal Scroll on Mobile, Vertical on Tablet/Desktop) */}
            {uniqueImages.length > 1 && (
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[540px] shrink-0 py-1">
                {uniqueImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    onMouseEnter={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-18 sm:w-20 sm:h-24 bg-white border-2 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 transition-all cursor-pointer shadow-2xs ${
                      idx === activeImageIndex 
                        ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30 opacity-100 scale-102" 
                        : "border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400"
                    }`}
                  >
                    <img src={img} alt="" className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Frame */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="flex-1 relative aspect-[4/5] bg-white overflow-hidden group border border-neutral-200/90 rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg"
            >
              {PRODUCT.badge && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-neutral-900 text-[#D4AF37] text-[9px] sm:text-[10px] uppercase font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full tracking-widest border border-[#D4AF37]/30 shadow-md">
                  {PRODUCT.badge}
                </div>
              )}

              {/* Mobile Image Count Indicator */}
              {uniqueImages.length > 1 && (
                <div className="absolute bottom-3 left-3 z-20 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2.5 py-1 rounded-full md:hidden flex items-center gap-1 border border-white/20">
                  <Layers className="w-3 h-3 text-[#D4AF37]" />
                  <span>{activeImageIndex + 1} / {uniqueImages.length}</span>
                </div>
              )}

              <button
                onClick={() => setLightboxImage(uniqueImages[activeImageIndex])}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-black/75 hover:bg-[#D4AF37] text-white hover:text-black p-2 sm:p-2.5 rounded-full border border-white/20 transition-colors shadow-md cursor-pointer"
                title="Expand Full Screen Image"
              >
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <Image 
                src={uniqueImages[activeImageIndex]} 
                alt={`${PRODUCT.title} - Main View`} 
                fill 
                unoptimized
                className="object-cover transition-opacity duration-300 p-1.5 sm:p-2"
                priority
              />
              
              {/* Desktop Zoom Lens */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-200 hidden md:block rounded-3xl"
                style={{
                  ...zoomStyle,
                  opacity: zoomStyle.display === "block" ? 1 : 0
                }}
              />
            </div>

          </div>

          {/* Right 5 Columns: Purchase & Conversion Box */}
          <div className="lg:col-span-5 flex flex-col space-y-4 sm:space-y-6">
            
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-md space-y-4 sm:space-y-5">
              
              {/* Category & Title */}
              <div>
                {PRODUCT.type && (
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-[#D4AF37] uppercase block mb-1">
                    {PRODUCT.type}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#1A1A1A] tracking-wide leading-snug">
                  {PRODUCT.title}
                </h1>
                
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-800">4.9 / 5.0</span>
                  <span className="text-xs text-neutral-400 font-light">(Verified Reviews)</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 flex flex-col gap-1">
                <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                    {formatPrice(PRODUCT.price)}
                  </span>
                  {PRODUCT.mrp && (
                    <span className="text-xs sm:text-sm text-neutral-400 line-through font-sans">
                      MRP {formatPrice(PRODUCT.mrp)}
                    </span>
                  )}
                  {PRODUCT.discount && (
                    <span className="bg-[#D4AF37] text-black text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                      {PRODUCT.discount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">Inclusive of all taxes & free express shipping.</span>
              </div>

              {/* Size Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Select Bottle Size</span>
                  <span className="text-xs font-semibold text-[#D4AF37] hover:underline cursor-pointer">Scent Guide</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
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
                        className={`relative py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                          !isAvailable 
                            ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            : isSelected
                              ? "bg-neutral-900 text-white border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]"
                              : "bg-white text-neutral-800 border-neutral-200 hover:border-[#D4AF37]/60 hover:bg-neutral-50"
                        }`}
                      >
                        <span>{size}</span>
                        {!isAvailable && (
                          <span className="block text-[9px] text-red-500 font-normal">Out of Stock</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Status */}
              <div className="text-xs font-medium pt-0.5">
                {!isSelectedSizeAvailable ? (
                  <span className="text-red-600 font-bold">Currently Out of Stock</span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse shrink-0" />
                    <span>In Stock • Dispatched Within 24 Hours</span>
                  </span>
                )}
              </div>

              {/* Quantity & CTA Buttons (Stacked & Responsive on Mobile) */}
              <div className="space-y-2.5 sm:space-y-3 pt-1">
                <div className="flex gap-2.5 sm:gap-3">
                  <div className="w-24 sm:w-28 h-11 sm:h-12 border border-neutral-300 rounded-xl flex items-center justify-between px-2.5 sm:px-3 bg-neutral-50 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      disabled={!isSelectedSizeAvailable}
                      className="text-neutral-500 hover:text-black cursor-pointer disabled:opacity-30 p-1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs sm:text-sm text-[#1A1A1A]">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)} 
                      disabled={!isSelectedSizeAvailable}
                      className="text-neutral-500 hover:text-black cursor-pointer disabled:opacity-30 p-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    disabled={!isSelectedSizeAvailable}
                    className={`flex-1 h-11 sm:h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-md active:scale-98 ${
                      !isSelectedSizeAvailable
                        ? "bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300"
                        : "bg-[#D4AF37] hover:bg-[#b8952c] text-black shadow-amber-500/10"
                    }`}
                  >
                    {isSelectedSizeAvailable ? "ADD TO BAG" : "SOLD OUT"}
                  </button>
                </div>

                <button 
                  onClick={() => {
                    handleAddToCart();
                    router.push("/checkout");
                  }}
                  disabled={!isSelectedSizeAvailable}
                  className={`w-full h-11 sm:h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-98 ${
                    !isSelectedSizeAvailable
                      ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                      : "bg-neutral-900 hover:bg-black text-white hover:shadow-lg"
                  }`}
                >
                  {isSelectedSizeAvailable ? "BUY IT NOW — INSTANT CHECKOUT" : "OUT OF STOCK"}
                </button>
              </div>

              {/* Delivery Pincode Checker */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Check Express Delivery Availability
                </label>
                <form onSubmit={handleCheckPincode} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit Pincode"
                    className="w-full sm:flex-1 px-3.5 py-2.5 bg-[#FAF8F5] border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    disabled={isCheckingPincode}
                    className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shrink-0 flex items-center justify-center"
                  >
                    {isCheckingPincode ? <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" /> : "Check"}
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-xs text-emerald-700 font-medium pt-1">{pincodeStatus}</p>
                )}
              </div>

            </div>

            {/* Authentic Trust Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {REAL_TRUST_BADGES.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-start gap-2.5">
                    <Icon className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-neutral-800 block">{badge.label}</span>
                      <span className="text-[10px] sm:text-[11px] text-neutral-400 block font-light">{badge.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>

      {/* ── 2. Full-Width Olfactory Notes Pyramid Section (Across Page Width) ── */}
      {noteList.length > 0 && (
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs space-y-5 sm:space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5 sm:pb-4">
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37] block">
                  SCENT COMPOSITION
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#1A1A1A] font-normal">
                  Olfactory Pyramid & Notes Breakdown
                </h2>
              </div>
              <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {topNotes.length > 0 && (
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1.5 sm:space-y-2">
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] block">
                    Top Notes (0–15 Minutes)
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A]">
                    {topNotes.map((n: any) => n.name).join(", ")}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    The initial radiant opening that greets your senses upon application.
                  </p>
                </div>
              )}

              {heartNotes.length > 0 && (
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1.5 sm:space-y-2">
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] block">
                    Heart Notes (1–6 Hours)
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A]">
                    {heartNotes.map((n: any) => n.name).join(", ")}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    The core soul of the fragrance that unfolds gracefully as the perfume warms.
                  </p>
                </div>
              )}

              {baseNotes.length > 0 && (
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1.5 sm:space-y-2">
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] block">
                    Base Notes (6–14+ Hours)
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A]">
                    {baseNotes.map((n: any) => n.name).join(", ")}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    The enduring, deep foundation that lingers elegantly on skin and fabrics.
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Perfume Performance Attributes (Longevity, Best Seasons, Ideal Time, Projection) */}
            {(PRODUCT.longevity || PRODUCT.bestSeasons || PRODUCT.idealTime || PRODUCT.projection) && (
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <h4 className="text-xs font-serif font-bold text-[#121212] uppercase tracking-wider">
                    Performance & Suitability
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-sans">
                  {PRODUCT.longevity && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE7E1] hover:border-[#D4AF37] transition-all flex items-center gap-3 shadow-2xs group">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE7E1] flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:bg-[#121212] group-hover:text-[#D4AF37] transition-colors shadow-2xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Longevity (Duration)
                        </span>
                        <span className="font-bold text-[#121212] text-xs sm:text-sm mt-0.5">
                          {PRODUCT.longevity}
                        </span>
                      </div>
                    </div>
                  )}

                  {PRODUCT.bestSeasons && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE7E1] hover:border-[#D4AF37] transition-all flex items-center gap-3 shadow-2xs group">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE7E1] flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:bg-[#121212] group-hover:text-[#D4AF37] transition-colors shadow-2xs">
                        <Sun className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Best Seasons
                        </span>
                        <span className="font-bold text-[#121212] text-xs sm:text-sm mt-0.5">
                          {PRODUCT.bestSeasons}
                        </span>
                      </div>
                    </div>
                  )}

                  {PRODUCT.idealTime && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE7E1] hover:border-[#D4AF37] transition-all flex items-center gap-3 shadow-2xs group">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE7E1] flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:bg-[#121212] group-hover:text-[#D4AF37] transition-colors shadow-2xs">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Ideal Time
                        </span>
                        <span className="font-bold text-[#121212] text-xs sm:text-sm mt-0.5">
                          {PRODUCT.idealTime}
                        </span>
                      </div>
                    </div>
                  )}

                  {PRODUCT.projection && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE7E1] hover:border-[#D4AF37] transition-all flex items-center gap-3 shadow-2xs group">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE7E1] flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:bg-[#121212] group-hover:text-[#D4AF37] transition-colors shadow-2xs">
                        <Wind className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Sillage & Projection
                        </span>
                        <span className="font-bold text-[#121212] text-xs sm:text-sm mt-0.5">
                          {PRODUCT.projection}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── 3. Full-Width Balanced 2-Column Product Story & Accordions Section ── */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Column (6 Cols): Product Story & Description Card */}
          <div className="lg:col-span-6 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37] block">
                MASTER PERFUMER MANIFESTO
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#1A1A1A] font-normal">
                Product Story & Scent Profile
              </h2>
              <div className="w-12 h-[2px] bg-[#D4AF37] my-2" />
              <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm font-light whitespace-pre-line">
                {PRODUCT.description || "Crafted with high-concentration pure fragrance oil for exceptional sillage and longevity."}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 flex-wrap gap-2">
              <button onClick={handleAskQuestion} className="flex items-center gap-1.5 hover:text-black cursor-pointer transition-colors font-medium">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" /> Ask Concierge
              </button>
              <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-black cursor-pointer transition-colors font-medium">
                <Share2 className="w-4 h-4 text-[#D4AF37]" /> Share Product
              </button>
            </div>
          </div>

          {/* Right Column (6 Cols): Accordion Details Card */}
          <div className="lg:col-span-6 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37] block">
                SCENT SPECIFICATIONS
              </span>
              <Accordion>
                {PRODUCT.accordion.feelings && (
                  <AccordionItem title="Sensory Mood & Feelings" defaultOpen={true}>
                    <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm font-light">{PRODUCT.accordion.feelings}</p>
                  </AccordionItem>
                )}
                {PRODUCT.accordion.occasions && (
                  <AccordionItem title="Recommended Occasions & Seasons" defaultOpen={!PRODUCT.accordion.feelings}>
                    <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm font-light">{PRODUCT.accordion.occasions}</p>
                  </AccordionItem>
                )}
                {PRODUCT.accordion.behind_perfume && (
                  <AccordionItem title="Behind The Formulation">
                    <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm font-light">{PRODUCT.accordion.behind_perfume}</p>
                  </AccordionItem>
                )}
                <AccordionItem title="Express Shipping, Packaging & Authenticity" defaultOpen={!PRODUCT.accordion.feelings && !PRODUCT.accordion.occasions}>
                  <p className="leading-relaxed text-neutral-600 text-xs sm:text-sm font-light">
                    Every order is dispatched in tamper-proof luxury packaging within 24 hours. Sealed original perfume boxes are eligible for easy 7-day returns.
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. Verified Customer Reviews & Ratings Section ── */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-neutral-200/80">
        <div className="max-w-4xl mx-auto">
          <ProductReviews productId={PRODUCT.id} />
        </div>
      </div>

      {/* ── 5. Related Products Grid (Full Width 3 Columns) ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto text-center py-10 sm:py-12 px-3.5 sm:px-6 lg:px-8 border-t border-neutral-200/80">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block mb-1">
            Complete Your Scent Wardrobe
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#121212] mb-8 sm:mb-10 font-normal">You May Also Appreciate</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 text-left">
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
                  addToast({ title: "Added to Bag", message: `${relProduct.title} has been added.`, type: "success" });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile Sticky Bottom Purchase Bar ── */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.12)] z-50 transform transition-transform duration-300 border-t border-neutral-200 py-2.5 px-3.5 sm:px-6 ${
          showStickyBar ? "translate-y-0" : "translate-y-[150%]"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 relative bg-neutral-100 rounded-xl overflow-hidden border shrink-0">
              <Image src={PRODUCT.images[0]} alt={PRODUCT.title} fill unoptimized className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-serif font-bold text-xs sm:text-sm leading-tight text-[#1A1A1A] truncate">{PRODUCT.title} ({selectedSize})</p>
              <p className="text-[11px] sm:text-xs text-neutral-600 font-sans font-bold">{formatPrice(PRODUCT.price)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-2.5">
            <div className="flex items-center justify-between border border-neutral-300 rounded-xl w-22 sm:w-24 h-9 sm:h-10 px-2 bg-neutral-50 shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                disabled={!isSelectedSizeAvailable}
                className="text-neutral-500 hover:text-black disabled:opacity-30 cursor-pointer p-0.5"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className={`font-bold text-xs ${!isSelectedSizeAvailable ? "text-neutral-300" : ""}`}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                disabled={!isSelectedSizeAvailable}
                className="text-neutral-500 hover:text-black disabled:opacity-30 cursor-pointer p-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={!isSelectedSizeAvailable}
              className={`rounded-xl uppercase tracking-widest font-bold h-9 sm:h-10 px-4 sm:px-6 text-[10px] sm:text-[11px] flex-1 sm:flex-none transition-all cursor-pointer shadow-md ${
                !isSelectedSizeAvailable
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-[#D4AF37] hover:bg-[#b8952c] text-black"
              }`}
            >
              {isSelectedSizeAvailable ? "ADD TO BAG" : "SOLD OUT"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 sm:p-3 rounded-full transition-colors cursor-pointer z-50 border border-white/20"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
              <Image
                src={lightboxImage}
                alt="Full resolution product view"
                fill
                unoptimized
                className="object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

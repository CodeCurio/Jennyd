import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ProductListing } from "@/components/storefront/ProductListing";
import Image from "next/image";
import { Suspense } from "react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Luxury Perfumes & Pure Attars | Jennyd Scents",
  description: "Browse the complete collection of Jennyd Scents. High-concentration Extrait de Parfum, artisanal non-alcoholic pure attars, zodiac scents, and luxury unisex fragrances with 24-hour sillage.",
  alternates: {
    canonical: "https://jennydscents.com/products",
  },
  openGraph: {
    title: "All Luxury Perfumes & Pure Attars | Jennyd Scents",
    description: "Browse the complete collection of Jennyd Scents. High-concentration Extrait de Parfum & artisanal attars.",
    url: "https://jennydscents.com/products",
  },
};

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  const initialProducts = products || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] w-full max-w-full overflow-x-hidden font-sans">
      
      {/* Hero Section for Shop */}
      <section className="relative w-full h-[32vh] sm:h-[40vh] flex items-center justify-center overflow-hidden border-b border-[#EAE7E1]">
        <Image
          src="/assets/product image 3.jpeg"
          alt="Shop Our Luxury Collection"
          fill
          className="object-cover object-center brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-2">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs sm:text-sm font-bold block font-sans">
            Crafted Perfection
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-wide">
            Our Luxury Fragrances
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm font-sans max-w-lg mx-auto leading-relaxed hidden sm:block">
            Discover artisanal attars, long-lasting extraits de parfum, and opulent oriental blends formulated for extraordinary projection.
          </p>
        </div>
      </section>

      {/* Product Listing */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs uppercase tracking-widest text-neutral-400">Loading products...</div>}>
        <ProductListing initialProducts={initialProducts} />
      </Suspense>
      
    </div>
  );
}

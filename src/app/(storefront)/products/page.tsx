import { supabase } from "@/lib/supabase";
import { ProductListing } from "@/components/storefront/ProductListing";
import Image from "next/image";
import { Suspense } from "react";

export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function ProductsPage() {
  // Fetch active products from Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    // If you only want active products:
    // .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  const initialProducts = products || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Hero Section for Shop */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/product image 3.jpeg"
          alt="Shop Our Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
            Discover Your Signature
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
            Our Collection
          </h1>
        </div>
      </section>

      {/* Product Listing (Client Component with Filtering) */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading products...</div>}>
        <ProductListing initialProducts={initialProducts} />
      </Suspense>
      
    </div>
  );
}

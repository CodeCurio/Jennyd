import { supabase } from "@/lib/supabase";
import { ProductListing } from "@/components/storefront/ProductListing";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const revalidate = 60; 

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(slug);

  // Fetch Category
  const { data: category, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", decodedSlug)
    .single();

  if (catError || !category) {
    return (
      <div className="py-32 text-center bg-background min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-serif mb-4">Category Not Found</h1>
        <p className="text-gray-500 mb-8">The collection you're looking for doesn't exist or has been removed.</p>
        <Link href="/products" className="text-white bg-black px-6 py-3 rounded-md hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm font-bold">
          Shop All Products
        </Link>
      </div>
    );
  }

  // Fetch Products in this category
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  const initialProducts = products || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Category Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        {/* We can use the category image if it exists, else fallback */}
        <Image
          src={category.image_url || "/assets/product image 3.jpeg"}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <Link href="/products" className="inline-flex items-center text-white/70 hover:text-white uppercase tracking-[0.2em] text-xs font-bold mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to All Products
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/80 text-lg md:text-xl font-light">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Product Listing */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading products...</div>}>
        <ProductListing initialProducts={initialProducts} />
      </Suspense>
      
    </div>
  );
}

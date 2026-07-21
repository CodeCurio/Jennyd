import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Fragrance Categories | Jennyd Perfumes",
  description: "Explore luxury perfume collections by Jennyd, including Woody, Oriental, Floral, Fresh, and Attar fragrances.",
};

export default async function CategoriesPage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  const catList = categories || [];

  return (
    <div className="bg-background min-h-screen pb-20 font-sans text-[#1A1A1A]">
      {/* Hero */}
      <section className="relative w-full h-[35vh] md:h-[45vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/product image 1.jpeg"
          alt="Fragrance Categories"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-3 block">
            Olfactory Families
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white uppercase tracking-wide">
            Fragrance Collections
          </h1>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        {catList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-6 font-serif text-lg">Explore our complete catalog of luxury perfumes.</p>
            <Link
              href="/products"
              className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] px-8 py-3.5 uppercase tracking-widest text-xs font-bold transition-colors inline-block"
            >
              Shop All Perfumes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catList.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-500 block"
              >
                <Image
                  src={category.image_url || "/assets/product image 2.jpeg"}
                  alt={category.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-[0.25em] mb-2">
                    Olfactory Category
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide mb-2">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-white/80 text-xs sm:text-sm font-light line-clamp-2 mb-4">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs uppercase font-bold tracking-widest text-[#D4AF37] group-hover:translate-x-1.5 transition-transform duration-300">
                    Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

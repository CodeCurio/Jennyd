import Link from "next/link";
import { Compass, ShoppingBag, ArrowLeft, Home, HelpCircle } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | Jennyd Perfumes",
  description: "The page you are looking for does not exist or has moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] bg-background flex items-center justify-center px-4 py-20 font-sans text-[#1A1A1A]">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* Large Decorative 404 Header */}
        <div className="relative inline-block">
          <span className="text-8xl sm:text-9xl font-serif font-extrabold text-neutral-100 select-none tracking-widest">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="w-12 h-12 text-[#D4AF37] animate-pulse" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] block">
            Lost Your Way?
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold uppercase tracking-wide text-[#1A1A1A]">
            Page Not Found
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            The page or fragrance link you are searching for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Call-to-action Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" /> Back To Home
          </Link>
          
          <Link
            href="/products"
            className="bg-white text-[#1A1A1A] border border-neutral-300 hover:border-black px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Explore Perfumes
          </Link>
        </div>

        {/* Helpful Links Bar */}
        <div className="pt-8 border-t border-neutral-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
          <Link href="/categories" className="hover:text-black transition-colors">
            Categories
          </Link>
          <span>•</span>
          <Link href="/faq" className="hover:text-black transition-colors flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-black transition-colors">
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}

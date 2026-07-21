"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/store/CartContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/store/AuthContext";
import { SearchModal } from "./SearchModal";
import { useCurrency } from "@/lib/store/CurrencyContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop All", hasMegaMenu: true },
  { href: "/products?category=men", label: "Men" },
  { href: "/products?category=women", label: "Women" },
  { href: "/products?category=unisex", label: "Unisex" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { setIsDrawerOpen, itemCount } = useCart();
  const { user, profile } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [currentAnnIndex, setCurrentAnnIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1);
        if (data && data.length > 0 && !error) {
          setSettings(data[0]);
        }
      } catch (e) {
        console.error("Error fetching site settings:", e);
      }
    };
    fetchSettings();
  }, []);

  // Slide announcements interval
  useEffect(() => {
    const list = settings?.announcements || [];
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentAnnIndex((p) => (p + 1) % list.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [settings?.announcements]);

  return (
    <>
      {/* ── Announcement Bar ── */}
      {(!settings || settings.announcement_bar_active !== false) && (
        <div
          className="w-full h-8 flex items-center justify-center relative z-50 overflow-hidden"
          style={{
            backgroundColor: settings?.announcement_bar_color || "#000000",
            color: settings?.announcement_bar_text_color || "#ffffff",
          }}
        >
          <p className="text-[11px] tracking-[0.18em] uppercase font-medium">
            {Array.isArray(settings?.announcements) &&
            settings.announcements.length > 1 ? (
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentAnnIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="inline-block"
                >
                  {settings.announcements[currentAnnIndex].link ? (
                    <Link
                      href={settings.announcements[currentAnnIndex].link}
                      className="hover:underline underline-offset-2"
                    >
                      {settings.announcements[currentAnnIndex].text}
                    </Link>
                  ) : (
                    settings.announcements[currentAnnIndex].text
                  )}
                </motion.span>
              </AnimatePresence>
            ) : settings?.announcement_bar_link ? (
              <Link
                href={settings.announcement_bar_link}
                className="hover:underline underline-offset-2"
              >
                {settings.announcement_bar_text ||
                  `Free Shipping on all orders above ${formatPrice(999)} | COD Available`}
              </Link>
            ) : (
              settings?.announcement_bar_text ||
              `Free Shipping on all orders above ${formatPrice(999)} | COD Available`
            )}
          </p>
        </div>
      )}

      {/* ── Main Header ── */}
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        {/* ── Row 1: Logo | Search | Icons ── */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-[80px] hidden md:flex items-center gap-6 lg:gap-10">

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <div className="relative w-[175px] h-[62px] lg:w-[200px] lg:h-[68px]">
                <Image
                  src={settings?.logo_url || "/logo.png"}
                  alt={settings?.site_name || "Jennyd"}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Search Bar */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="flex-1 max-w-2xl mx-auto relative cursor-pointer group"
            >
              <div className="flex items-center gap-3 border border-gray-200 rounded-full px-5 py-2.5 bg-gray-50 group-hover:border-[#D4AF37] group-hover:bg-white transition-all duration-200">
                <Search className="w-[18px] h-[18px] text-gray-400 shrink-0" strokeWidth={1.8} />
                <span className="text-sm text-gray-400 flex-1 select-none">
                  Search your Perfume...
                </span>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Preferences */}
              <button
                onClick={() => window.showLanguageSelector?.()}
                title="Select Preferences"
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/8 transition-all duration-200 cursor-pointer"
              >
                <Globe className="w-[22px] h-[22px]" strokeWidth={1.6} />
              </button>

              {/* Account */}
              <Link
                href={user ? "/account" : "/account/login"}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/8 transition-all duration-200"
              >
                {user && profile?.full_name ? (
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-sm font-semibold">
                    {profile.full_name[0].toUpperCase()}
                  </div>
                ) : (
                  <User className="w-[22px] h-[22px]" strokeWidth={1.6} />
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/8 transition-all duration-200 relative"
              >
                <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={1.6} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D4AF37] text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 leading-none">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Row 2: Navigation Strip ── */}
        <div className="hidden md:block border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <nav className="flex items-center justify-center h-12">
              {NAV_LINKS.map((link, index) => (
                <div
                  key={link.label}
                  className="flex items-center group/nav relative"
                >
                  {link.hasMegaMenu ? (
                    <>
                      <Link
                        href={link.href}
                        className="px-5 lg:px-7 py-2 text-[14px] font-medium text-gray-700 hover:text-[#D4AF37] tracking-wide transition-colors duration-150 whitespace-nowrap relative after:absolute after:bottom-0 after:left-5 after:right-5 after:h-[2px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-center"
                      >
                        {link.label}
                      </Link>

                      {/* Mega Menu */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-[900px] bg-white shadow-2xl border-t-2 border-[#D4AF37] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 pointer-events-none group-hover/nav:pointer-events-auto z-50 rounded-b-lg">
                        <div className="grid grid-cols-4 gap-8 p-8">
                          <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1 pb-2 border-b border-gray-100">By Category</h3>
                            <Link href="/products?category=men" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Men's Perfumes</Link>
                            <Link href="/products?category=women" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Women's Perfumes</Link>
                            <Link href="/products?category=unisex" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Unisex Perfumes</Link>
                            <Link href="/products?category=attar" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Attars & Oils</Link>
                            <Link href="/products?category=gifts" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Gift Sets</Link>
                          </div>
                          <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1 pb-2 border-b border-gray-100">By Collection</h3>
                            <Link href="/products?collection=signature" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Signature Series</Link>
                            <Link href="/products?collection=oud" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Oud Collection</Link>
                            <Link href="/products?collection=floral" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Floral Series</Link>
                            <Link href="/products?collection=woody" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Woody Series</Link>
                            <Link href="/products?collection=premium" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Premium Line</Link>
                          </div>
                          <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1 pb-2 border-b border-gray-100">By Price</h3>
                            <Link href="/products?price=under-999" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Under {formatPrice(999)}</Link>
                            <Link href="/products?price=1000-1999" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">{formatPrice(1000)} to {formatPrice(1999)}</Link>
                            <Link href="/products?price=2000-2999" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">{formatPrice(2000)} to {formatPrice(2999)}</Link>
                            <Link href="/products?price=above-3000" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">Above {formatPrice(3000)}</Link>
                          </div>
                          <div className="relative rounded-lg overflow-hidden">
                            <Image
                              src="/assets/product image 1.jpeg"
                              alt="Featured"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-end p-5">
                              <Link href="/products/royal-oud">
                                <button className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-colors rounded-sm">
                                  View
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="px-5 lg:px-7 py-2 text-[14px] font-medium text-gray-700 hover:text-[#D4AF37] tracking-wide transition-colors duration-150 whitespace-nowrap relative after:absolute after:bottom-0 after:left-5 after:right-5 after:h-[2px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-center"
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Divider between links */}
                  {index < NAV_LINKS.length - 1 && (
                    <span className="w-px h-3 bg-gray-200 mx-0.5 shrink-0" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Mobile Layout ── */}
        <div className="flex md:hidden items-center justify-between px-4 h-16 border-b border-gray-100">
          <button
            className="p-2 -ml-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <div className="relative w-[130px] h-[44px]">
              <Image
                src={settings?.logo_url || "/logo.png"}
                alt={settings?.site_name || "Jennyd"}
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => window.showLanguageSelector?.()}
              className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-[#D4AF37] transition-colors cursor-pointer"
              title="Select Preferences"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-[#D4AF37] transition-colors relative"
              onClick={() => setIsDrawerOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4AF37] text-white text-[9px] font-bold min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5 leading-none">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Drawer ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.28 }}
                className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-50 flex flex-col md:hidden shadow-2xl"
              >
                <div className="px-5 h-16 flex items-center justify-between border-b border-gray-100">
                  <span className="font-serif text-base tracking-[0.2em] uppercase text-gray-800">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col overflow-y-auto flex-1 py-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-gray-700 hover:text-[#D4AF37] hover:bg-amber-50 transition-colors border-b border-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50">
                  <Link
                    href={user ? "/account" : "/account/login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-gray-700 hover:text-[#D4AF37] transition-colors"
                  >
                    {user && profile?.full_name ? (
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {profile.full_name[0].toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    {user ? profile?.full_name?.split(" ")[0] || "My Account" : "Sign In"}
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

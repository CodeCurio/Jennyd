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
      setCurrentAnnIndex(p => (p + 1) % list.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [settings?.announcements]);

  return (
    <>
      {/* Top Announcement Bar */}
      {(!settings || settings.announcement_bar_active !== false) && (
        <div 
          className="text-[10px] md:text-xs text-center tracking-widest uppercase relative z-50 transition-colors overflow-hidden h-9 md:h-10 flex items-center justify-center"
          style={{
            backgroundColor: settings?.announcement_bar_color || "#000000",
            color: settings?.announcement_bar_text_color || "#ffffff"
          }}
        >
          {Array.isArray(settings?.announcements) && settings.announcements.length > 1 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAnnIndex}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center px-4"
                >
                  {settings.announcements[currentAnnIndex].link ? (
                    <Link href={settings.announcements[currentAnnIndex].link} className="hover:underline">
                      {settings.announcements[currentAnnIndex].text}
                    </Link>
                  ) : (
                    <span>{settings.announcements[currentAnnIndex].text}</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="px-4">
              {settings?.announcement_bar_link ? (
                <Link href={settings.announcement_bar_link} className="hover:underline">
                  {settings.announcement_bar_text || "Free Shipping on all orders above ₹999 | COD Available"}
                </Link>
              ) : (
                <span>{settings?.announcement_bar_text || "Free Shipping on all orders above ₹999 | COD Available"}</span>
              )}
            </div>
          )}
        </div>
      )}

      <header
        className={`sticky top-0 z-40 bg-white w-full transition-all duration-300 border-b border-gray-100 ${
          isScrolled ? "py-1 shadow-sm" : "py-1.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12 w-full">
            {/* Left: Logo */}
            <Link href="/" className="shrink-0">
              <div className="relative w-[160px] h-[48px] lg:w-[185px] lg:h-[56px]">
                <Image
                  src={settings?.logo_url || "/logo.png"}
                  alt={settings?.site_name || "Jennyd"}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Right: Search + Icons (Row 1) & Nav Links (Row 2) */}
            <div className="flex flex-col flex-1 gap-1">
              
              {/* Row 1: Search & Icons */}
              <div className="flex items-center justify-between gap-8 w-full">
                {/* Search Bar */}
                <div 
                  onClick={() => setIsSearchOpen(true)}
                  className="flex-1 relative max-w-xl cursor-pointer"
                >
                  <input 
                    type="text" 
                    readOnly
                    placeholder="Search your Perfume..." 
                    className="w-full border border-gray-350 rounded-full py-2 pl-6 pr-12 text-sm text-gray-400 bg-transparent cursor-pointer focus:outline-none"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Icons */}
                <div className="flex items-center gap-6 shrink-0">
                  {/* Globe Language Selector */}
                  <button
                    onClick={() => window.showLanguageSelector?.()}
                    className="hover:text-accent text-gray-800 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                    title="Select Language"
                  >
                    <Globe className="w-5 h-5" strokeWidth={1.5} />
                  </button>

                  <Link href={user ? "/account" : "/account/login"} className="hover:text-accent transition-colors flex flex-col items-center gap-1 relative">
                    {user && profile?.full_name ? (
                      <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-xs font-bold">
                        {profile.full_name[0].toUpperCase()}
                      </div>
                    ) : (
                      <User className="w-5 h-5" strokeWidth={1.5} />
                    )}
                  </Link>
                  <button 
                    className="hover:text-accent transition-colors relative flex flex-col items-center gap-1"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Row 2: Nav Links */}
              <nav className="flex items-center justify-center gap-4 lg:gap-6 text-base font-medium text-foreground mr-16">
                {NAV_LINKS.map((link, index) => (
                  <div key={link.label} className="flex items-center gap-4 lg:gap-6 group/nav">
                    {link.hasMegaMenu ? (
                      <>
                        <Link 
                          href={link.href}
                          className="hover:text-accent transition-colors whitespace-nowrap"
                        >
                          {link.label}
                        </Link>
                        
                        {/* Mega Menu Dropdown */}
                        <div className="absolute left-0 right-0 top-full bg-white shadow-xl border-t border-gray-100 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 pointer-events-none group-hover/nav:pointer-events-auto z-50">
                          <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                            <div className="grid grid-cols-4 gap-8">
                              {/* Column 1 */}
                              <div className="flex flex-col gap-4">
                                <h3 className="font-bold text-lg mb-2 border-b border-gray-100 pb-2">By Category</h3>
                                <Link href="/products?category=men" className="text-secondary-foreground hover:text-accent transition-colors">Men's Perfumes</Link>
                                <Link href="/products?category=women" className="text-secondary-foreground hover:text-accent transition-colors">Women's Perfumes</Link>
                                <Link href="/products?category=unisex" className="text-secondary-foreground hover:text-accent transition-colors">Unisex Perfumes</Link>
                                <Link href="/products?category=attar" className="text-secondary-foreground hover:text-accent transition-colors">Attars & Oils</Link>
                                <Link href="/products?category=gifts" className="text-secondary-foreground hover:text-accent transition-colors">Gift Sets</Link>
                              </div>
                              {/* Column 2 */}
                              <div className="flex flex-col gap-4">
                                <h3 className="font-bold text-lg mb-2 border-b border-gray-100 pb-2">By Collection</h3>
                                <Link href="/products?collection=signature" className="text-secondary-foreground hover:text-accent transition-colors">Signature Series</Link>
                                <Link href="/products?collection=oud" className="text-secondary-foreground hover:text-accent transition-colors">Oud Collection</Link>
                                <Link href="/products?collection=floral" className="text-secondary-foreground hover:text-accent transition-colors">Floral Series</Link>
                                <Link href="/products?collection=woody" className="text-secondary-foreground hover:text-accent transition-colors">Woody Series</Link>
                                <Link href="/products?collection=premium" className="text-secondary-foreground hover:text-accent transition-colors">Premium Line</Link>
                              </div>
                              {/* Column 3 */}
                              <div className="flex flex-col gap-4">
                                <h3 className="font-bold text-lg mb-2 border-b border-gray-100 pb-2">By Price</h3>
                                <Link href="/products?price=under-999" className="text-secondary-foreground hover:text-accent transition-colors">Under ₹999</Link>
                                <Link href="/products?price=1000-1999" className="text-secondary-foreground hover:text-accent transition-colors">₹1000 to ₹1999</Link>
                                <Link href="/products?price=2000-2999" className="text-secondary-foreground hover:text-accent transition-colors">₹2000 to ₹2999</Link>
                                <Link href="/products?price=above-3000" className="text-secondary-foreground hover:text-accent transition-colors">Above ₹3000</Link>
                              </div>
                              {/* Column 4: Featured Image */}
                              <div className="relative aspect-square w-full">
                                <Image src="/assets/product image 1.jpeg" alt="Featured" fill className="object-cover rounded-sm" />
                                <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                                  <Link href="/products/oud-royale">
                                    <button className="bg-white text-black px-10 py-3 text-sm font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors border border-transparent">
                                      View
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link 
                        href={link.href}
                        className="hover:text-accent transition-colors whitespace-nowrap"
                      >
                        {link.label}
                      </Link>
                    )}
                    {index < NAV_LINKS.length - 1 && (
                      <span className="text-gray-300">|</span>
                    )}
                  </div>
                ))}
              </nav>

            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between w-full">
            <button 
              className="p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex-1 flex justify-center">
              <div className="relative w-[135px] h-[40px]">
                <Image
                  src={settings?.logo_url || "/logo.png"}
                  alt={settings?.site_name || "Jennyd"}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {/* Globe Language Selector */}
              <button
                onClick={() => window.showLanguageSelector?.()}
                className="p-1 hover:text-accent text-gray-800 transition-colors cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1 hover:text-accent transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                className="p-1 hover:text-accent transition-colors relative"
                onClick={() => setIsDrawerOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-background z-50 flex flex-col md:hidden shadow-2xl"
              >
                <div className="p-5 flex items-center justify-between border-b border-gray-100">
                  <span className="font-serif text-xl tracking-widest">MENU</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col p-6 gap-6 overflow-y-auto">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium hover:text-accent transition-colors uppercase tracking-widest"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto p-6 bg-secondary-background/50 border-t border-gray-100">
                  <Link
                    href={user ? "/account" : "/account/login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full py-3 text-sm uppercase tracking-widest font-medium hover:text-accent transition-colors"
                  >
                    {user && profile?.full_name ? (
                      <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-[10px] font-bold">
                        {profile.full_name[0].toUpperCase()}
                      </div>
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    {user ? (profile?.full_name?.split(" ")[0] || "My Account") : "Sign In"}
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

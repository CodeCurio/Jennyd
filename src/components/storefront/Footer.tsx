import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FooterLanguageSelector, FooterCurrencySelector } from "./FooterLanguageSelector";
import { NewsletterForm } from "./NewsletterForm";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Lock, Award, Heart, Truck } from "lucide-react";

const DELIVERY_PARTNERS = [
  { name: "FedEx Express", short: "FedEx", logoText: "FedEx", color: "bg-[#4D148C] text-white font-sans font-bold", desc: "Priority Express" },
  { name: "DHL Express", short: "DHL", logoText: "DHL", color: "bg-[#FFCC00] text-[#D40511] font-sans font-extrabold italic", desc: "Global Air Freight" },
  { name: "UPS Worldwide", short: "UPS", logoText: "UPS", color: "bg-[#351C15] text-[#FFB500] font-sans font-bold", desc: "Global Logistics" },
  { name: "Aramex Express", short: "Aramex", logoText: "aramex", color: "bg-[#E31837] text-white font-sans font-bold", desc: "Middle East & Asia" },
  { name: "Blue Dart", short: "Blue Dart", logoText: "BLUE DART", color: "bg-[#003399] text-[#FFCC00] font-sans font-extrabold italic", desc: "South Asia Express" },
  { name: "India Post EMS", short: "India Post", logoText: "India Post", color: "bg-[#D2232A] text-white font-sans font-bold", desc: "Speed Post Int'l" },
  { name: "Delhivery", short: "Delhivery", logoText: "DELHIVERY", color: "bg-[#111111] text-white font-sans font-bold", desc: "Express Air" },
  { name: "DTDC Express", short: "DTDC", logoText: "DTDC", color: "bg-[#0A2540] text-[#E31837] font-sans font-extrabold", desc: "Global Network" }
];

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
);

const TiktokIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);

// Payment Method Badges
const RazorpayLogo = () => (
  <div className="flex items-center gap-1.5 bg-[#0C2340] text-white px-2.5 py-1 rounded-md border border-white/10 shadow-xs">
    <svg className="w-4 h-4 text-[#0066FF]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.436 0l-11.91 7.773-1.174 4.276 4.66-3.039-2.348 8.552 10.772-17.562zM1.564 24l11.91-7.773 1.174-4.276-4.66 3.039 2.348-8.552-10.772 17.562z"/>
    </svg>
    <span className="text-[11px] font-bold tracking-tight font-sans">Razorpay</span>
  </div>
);

const UPILogo = () => (
  <div className="flex items-center gap-1 bg-[#1A1A1A] text-white px-2.5 py-1 rounded-md border border-white/10 shadow-xs">
    <span className="text-[11px] font-extrabold tracking-tight text-[#00B9F1] font-sans">UPI</span>
    <span className="text-[9px] font-bold text-amber-400">BHIM</span>
  </div>
);

const VisaLogo = () => (
  <div className="flex items-center bg-[#1A1A1A] px-2.5 py-1 rounded-md border border-white/10 shadow-xs">
    <span className="text-[11px] font-extrabold italic text-[#1A1F71] font-sans bg-white px-1 rounded-xs">VISA</span>
  </div>
);

const MastercardLogo = () => (
  <div className="flex items-center gap-0.5 bg-[#1A1A1A] px-2.5 py-1 rounded-md border border-white/10 shadow-xs">
    <div className="w-2.5 h-2.5 rounded-full bg-[#EB001B]" />
    <div className="-ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F79E1B] opacity-90" />
    <span className="text-[10px] font-bold text-white ml-1 font-sans">card</span>
  </div>
);

const RuPayLogo = () => (
  <div className="flex items-center bg-[#1A1A1A] px-2.5 py-1 rounded-md border border-white/10 shadow-xs">
    <span className="text-[10px] font-extrabold italic text-[#00A859] font-sans">RuPay</span>
  </div>
);

export async function Footer() {
  let settings = null;
  try {
    const { data } = await supabase.from("site_settings").select("*").limit(1);
    if (data && data.length > 0) {
      settings = data[0];
    }
  } catch (e) {
    console.error("Error fetching site settings in footer:", e);
  }

  const logoUrl = settings?.logo_inverted_url || settings?.logo_url || "/logo.png";
  const siteName = settings?.site_name || "Jennyd Scents";
  const tagline = settings?.tagline || "Crafting evocative luxury Extrait de Parfum and artisanal pure attars that define your personal presence.";
  
  const instagram = settings?.social_instagram || "#";
  const facebook = settings?.social_facebook || "#";
  const twitter = settings?.social_twitter || "#";
  const youtube = settings?.social_youtube;
  const tiktok = settings?.social_tiktok;

  const address = settings?.business_address || "4B, Fawn Break Apartment, Sarojini Naidu Road, Lucknow, UP 226001, India";
  const phone = settings?.contact_phone || "+91 9682899765";
  const email = settings?.contact_email || "support@jennydscents.com";

  return (
    <footer className="bg-[#0A0A0A] text-neutral-300 pt-16 pb-10 border-t-2 border-[#D4AF37]/50 relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── 1. Top Newsletter Section ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pb-10 sm:pb-14 border-b border-neutral-800/80 relative z-10">
        <div className="bg-[#121212] border border-[#D4AF37]/25 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 shadow-2xl">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-[#D4AF37] uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-bold font-sans block">
              Private Fragrance Circle
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white font-normal leading-snug">
              Unlock Exclusive Offers & New Launches
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm font-sans leading-relaxed font-light">
              Subscribe to receive private invitations to limited-edition perfume drops, bespoke scent recommendations, and special promotions.
            </p>
          </div>

          <div className="w-full lg:w-auto shrink-0">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ── 2. Main Footer Grid ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 relative z-10">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          {/* Prominent Large Brand Logo */}
          <Link href="/" className="inline-block">
            <div className="relative w-48 sm:w-56 lg:w-64 h-16 sm:h-20 shrink-0">
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="w-full h-full object-contain object-left filter contrast-125 brightness-110 drop-shadow-[0_2px_8px_rgba(212,175,55,0.2)]" 
              />
            </div>
          </Link>

          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans">
            {tagline}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-2">
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
                <InstagramIcon size={18} />
              </a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
                <FacebookIcon size={18} />
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
                <TwitterIcon size={18} />
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
                <YoutubeIcon size={18} />
              </a>
            )}
            {tiktok && (
              <a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300">
                <TiktokIcon size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Fragrance Collections */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-serif text-white font-medium text-base tracking-wide border-b border-[#D4AF37]/30 pb-2 inline-block max-w-fit">
            Fragrance Collections
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-neutral-400 font-sans mt-1">
            <li>
              <Link href="/products" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                All Extrait de Parfum
              </Link>
            </li>
            <li>
              <Link href="/products?category=best-sellers" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Best Sellers & Top Rated
              </Link>
            </li>
            <li>
              <Link href="/products?category=men" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Men's Luxury Line
              </Link>
            </li>
            <li>
              <Link href="/products?category=women" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Women's Signature Floral
              </Link>
            </li>
            <li>
              <Link href="/products?category=unisex" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Unisex Universals
              </Link>
            </li>
            <li>
              <Link href="/products?category=attar" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Artisanal Pure Attars
              </Link>
            </li>
            <li>
              <Link href="/products?category=kids" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Kids Perfumes Collection
              </Link>
            </li>
            <li>
              <Link href="/social-impact" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block text-[#D4AF37] font-semibold">
                Social Reforms & Impact ❤️
              </Link>
            </li>
            <li>
              <Link href="/join-grow" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block text-[#D4AF37] font-semibold">
                Join & Grow Business 🚀
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care & Policies */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-serif text-white font-medium text-base tracking-wide border-b border-[#D4AF37]/30 pb-2 inline-block max-w-fit">
            Customer Care
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs text-neutral-400 font-sans mt-1">
            <li>
              <Link href="/account/orders" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Shipping & Express Delivery
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Cancellation & No-Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Frequently Asked Questions (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Privacy & Data Security
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#D4AF37] hover:translate-x-1 transition-all inline-block">
                Contact Concierge
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Luxury Assurance & Guarantees */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-serif text-white font-medium text-base tracking-wide border-b border-[#D4AF37]/30 pb-2 inline-block max-w-fit">
            Luxury Assurance
          </h4>
          
          <div className="flex flex-col gap-3.5 text-xs text-neutral-400 font-sans mt-1">
            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">100% Extrait Concentration</span>
                <span className="text-[11px] text-neutral-400 leading-relaxed block mt-0.5">Formulated with 30%+ pure perfume oils for 12+ hours projection.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">IFRA Certified & Cruelty-Free</span>
                <span className="text-[11px] text-neutral-400 leading-relaxed block mt-0.5">Crafted with ethically sourced, skin-safe botanical extracts.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold block">Private Concierge Desk</span>
                <a href={`mailto:${email}`} className="text-[11px] text-[#D4AF37] hover:underline block mt-0.5">
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── 3. Razorpay & Payment Gateways Row ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-6 border-t border-neutral-800/80 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#121212]/60 border border-white/5 rounded-xl p-4 sm:p-5">
          {/* Razorpay Trust Badge */}
          <div className="flex items-center gap-3 text-xs text-neutral-300">
            <Lock className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-white text-xs">100% Secure & Encrypted Checkout</span>
              <span className="text-[11px] text-neutral-400">Processed safely via Razorpay PCI-DSS Security</span>
            </div>
          </div>

          {/* Payment Method Badges (Razorpay, UPI, Visa, Mastercard, RuPay) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <RazorpayLogo />
            <UPILogo />
            <VisaLogo />
            <MastercardLogo />
            <RuPayLogo />
          </div>
        </div>
      </div>

      {/* ── 3.5 Global Delivery Partners Auto-Scrolling Marquee (Below Razorpay) ── */}
      <div className="w-full py-6 border-t border-neutral-800/80 relative z-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-300">
            <Truck className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-semibold text-white uppercase tracking-widest text-xs font-sans">Global Fulfillment & Express Delivery Partners</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-sans block mt-1">
            Fast, insured, and trackable express shipping to over 220+ countries worldwide through our trusted courier networks.
          </span>
        </div>

        {/* Continuous Auto-Scrolling Infinite Marquee Slider */}
        <div className="w-full relative overflow-hidden bg-[#121212]/80 py-4 border-y border-white/5">
          {/* Fade overlays for smooth edge transition in dark footer theme */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-36 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-36 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none" />

          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="animate-marquee-medium flex items-center gap-4 sm:gap-10 md:gap-12">
              {[...Array(3)].map((_, listIdx) => (
                <div key={listIdx} className="flex items-center gap-4 sm:gap-10 md:gap-12 shrink-0">
                  {DELIVERY_PARTNERS.map((partner, idx) => (
                    <div
                      key={`${listIdx}-${idx}-${partner.short}`}
                      className="flex flex-col items-center justify-center shrink-0 group cursor-pointer w-28 sm:w-36 md:w-44"
                    >
                      {/* Logo Card Badge */}
                      <div className={`w-28 sm:w-36 md:w-44 h-11 sm:h-14 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center p-2 sm:p-3.5 transition-all duration-300 group-hover:scale-105 shadow-2xs group-hover:shadow-lg ${partner.color} border border-black/10`}>
                        {partner.short === "FedEx" ? (
                          <span className="text-sm sm:text-lg md:text-xl tracking-tight font-extrabold font-sans">
                            Fed<span className="text-[#FF6600]">Ex</span>
                          </span>
                        ) : (
                          <span className="text-xs sm:text-base md:text-lg tracking-tight font-extrabold text-center font-sans line-clamp-1">
                            {partner.logoText}
                          </span>
                        )}
                      </div>

                      {/* Subtext description below badge */}
                      <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium font-sans mt-1.5 text-center group-hover:text-[#D4AF37] transition-colors truncate max-w-[100px] sm:max-w-none">
                        {partner.desc}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Bottom Copyright & Preferences Row ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 relative z-10">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} <span className="text-neutral-300 font-semibold">{siteName}</span>. All Rights Reserved. Crafted for perfume connoisseurs.
        </p>

        {/* Language & Currency Preferences Selector */}
        <div className="flex items-center gap-3">
          <FooterLanguageSelector />
          <FooterCurrencySelector />
        </div>
      </div>
    </footer>
  );
}

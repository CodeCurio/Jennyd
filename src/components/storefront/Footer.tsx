import Link from "next/link";
import { supabase } from "@/lib/supabase";

const Instagram = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Facebook = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Twitter = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Youtube = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
);

const Tiktok = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
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
  const tagline = settings?.tagline || "Crafting premium, evocative scents that linger long after you leave the room. Experience the essence of luxury.";
  const instagram = settings?.social_instagram || "#";
  const facebook = settings?.social_facebook || "#";
  const twitter = settings?.social_twitter || "#";
  const youtube = settings?.social_youtube;
  const tiktok = settings?.social_tiktok;

  const address = settings?.business_address || "4B, Fawn Break Apartment, Sarojini Naidu Road, Lucknow, Uttar Pradesh 226001, India";
  const addressLines = address.split(",").map((line: string) => line.trim());
  const phone = settings?.contact_phone || "+91 9682899765";

  return (
    <footer className="bg-secondary-background pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="relative w-40 h-12">
            <img src={logoUrl} alt={settings?.site_name || "Jennyd Logo"} className="w-full h-full object-contain object-left" />
          </div>
          <p className="text-secondary-foreground text-sm leading-relaxed max-w-sm">
            {tagline}
          </p>
          <div className="flex items-center gap-4 text-foreground mt-2">
            {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Instagram size={20} /></a>}
            {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Facebook size={20} /></a>}
            {twitter && <a href={twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Twitter size={20} /></a>}
            {youtube && <a href={youtube} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Youtube size={20} /></a>}
            {tiktok && <a href={tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Tiktok size={20} /></a>}
          </div>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans font-medium text-sm tracking-widest uppercase text-foreground">Shop</h4>
          <Link href="/products" className="text-secondary-foreground text-sm hover:text-accent transition-colors">All Perfumes</Link>
          <Link href="/products?category=best-sellers" className="text-secondary-foreground text-sm hover:text-accent transition-colors">Best Sellers</Link>
          <Link href="/products?category=new-arrivals" className="text-secondary-foreground text-sm hover:text-accent transition-colors">New Arrivals</Link>
          <Link href="/products?category=gift-sets" className="text-secondary-foreground text-sm hover:text-accent transition-colors">Gift Sets</Link>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans font-medium text-sm tracking-widest uppercase text-foreground">Support</h4>
          <Link href="/faq" className="text-secondary-foreground text-sm hover:text-accent transition-colors">FAQ</Link>
          <Link href="/shipping" className="text-secondary-foreground text-sm hover:text-accent transition-colors">Shipping & Returns</Link>
          <Link href="/privacy" className="text-secondary-foreground text-sm hover:text-accent transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-secondary-foreground text-sm hover:text-accent transition-colors">Terms of Service</Link>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans font-medium text-sm tracking-widest uppercase text-foreground">Contact</h4>
          <p className="text-secondary-foreground text-sm">
            {addressLines.map((line: string, index: number) => (
              <span key={index}>
                {line}
                {index < addressLines.length - 1 && <br />}
              </span>
            ))}
          </p>
          <p className="text-secondary-foreground text-sm mt-2">
            <a href={`tel:${phone}`} className="hover:text-accent transition-colors">{phone}</a>
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 mt-20 pt-6 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-secondary-foreground">
          &copy; {new Date().getFullYear()} {settings?.site_name || "Jennyd Scents"}. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-secondary-foreground">
          <span>Secure Payments by Razorpay</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

const Instagram = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Facebook = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Twitter = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

export function Footer() {
  return (
    <footer className="bg-secondary-background pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="relative w-40 h-12">
            <img src="/logo.png" alt="Jennyd Logo" className="w-full h-full object-contain object-left" />
          </div>
          <p className="text-secondary-foreground text-sm leading-relaxed max-w-sm">
            Crafting premium, evocative scents that linger long after you leave the room. Experience the essence of luxury.
          </p>
          <div className="flex items-center gap-4 text-foreground mt-2">
            <a href="#" className="hover:text-accent transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-accent transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
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
            4B, Fawn Break Apartment,<br />
            Sarojini Naidu Road,<br />
            Lucknow, Uttar Pradesh 226001,<br />
            India
          </p>
          <p className="text-secondary-foreground text-sm mt-2">
            <a href="tel:+919682899765" className="hover:text-accent transition-colors">+91 9682899765</a>
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 mt-20 pt-6 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-secondary-foreground">
          &copy; {new Date().getFullYear()} Jennyd Scents. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-secondary-foreground">
          <span>Secure Payments by Razorpay</span>
        </div>
      </div>
    </footer>
  );
}

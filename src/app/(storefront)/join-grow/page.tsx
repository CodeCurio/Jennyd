"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Maximize2, 
  X, 
  Send, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  MessageSquare,
  Award,
  ShieldCheck,
  Compass,
  Target,
  Zap,
  Heart
} from "lucide-react";

// Images from public/assets/join-grow/
const IMAGES = {
  hero: "/assets/join-grow/join-grow-hero.png",
  leader: "/assets/join-grow/join-grow-leader.jpeg", // "I AM THE LEADER of my business"
  world: "/assets/join-grow/join-grow-world.jpeg", // "WORLD IS OURS - ONE TEAM. ONE DREAM."
  mentor: "/assets/join-grow/join-grow-mentor.jpeg", // "IT'S MY BUSINESS AND I AM THE MENTOR"
  ceo: "/assets/join-grow/join-grow-ceo.jpeg", // "HERE I AM THE CEO OF MY LIFE"
  boss: "/assets/join-grow/join-grow-boss.jpeg", // "HERE I AM THE BOSS AND I WILL DECIDE MY INCOME"
  family: "/assets/join-grow/join-grow-family.jpeg", // "MY BUSINESS IS the future of my family"
  brandBoss: "/assets/join-grow/join-grow-brand-boss.jpeg", // "ITS MY BRAND AND I AM THE BOSS"
  together: "/assets/join-grow/join-grow-together.jpeg", // "WE ARE TOGETHER"
  earn: "/assets/join-grow/join-grow-earn.jpeg", // "LETS EARN TOGETHER"
  homeBiz: "/assets/join-grow/join-grow-home-biz.jpeg", // "MAKING MONEY FROM HOME"
  team: "/assets/join-grow/join-grow-team.jpeg", // "WE ARE A TEAM - WE ARE GROWING TOGETHER"
  portrait: "/assets/join-grow/join-grow-portrait.jpeg", // Jennyd Scents branded portrait
};

const BRAND_POSTERS = [
  {
    title: "Leadership & Income Control",
    subtitle: "I WILL DECIDE MY INCOME",
    image: IMAGES.boss,
    quote: "Here I am the boss and I will decide my income."
  },
  {
    title: "Ownership & Pride",
    subtitle: "ITS MY BRAND",
    image: IMAGES.brandBoss,
    quote: "Scent your story. Leave your mark."
  },
  {
    title: "Self Determination",
    subtitle: "CEO OF MY LIFE",
    image: IMAGES.ceo,
    quote: "Here I am the CEO of my life."
  },
  {
    title: "Unity & Diversity",
    subtitle: "WE ARE TOGETHER",
    image: IMAGES.together,
    quote: "Together we create. Together we inspire."
  },
  {
    title: "Global Collaboration",
    subtitle: "WORLD IS OURS",
    image: IMAGES.world,
    quote: "One team. One dream. One world."
  },
  {
    title: "Empowered Teamwork",
    subtitle: "GROWING TOGETHER",
    image: IMAGES.team,
    quote: "Finest ingredients, made with love, inspired by connection."
  }
];

const JOURNEY_INCLUDES = [
  "Representing premium Jennyd Scents fragrances",
  "Building your own customer network",
  "Developing your digital and social-media business",
  "Growing through product sales and repeat customers",
  "Exploring international business opportunities",
  "Learning fragrance, sales, marketing and entrepreneurial skills",
  "Developing leadership and business-building capabilities",
  "Qualifying for applicable rewards, incentives and recognition"
];

const FINANCIAL_STEPS = [
  { step: "01", title: "Start with a customer", desc: "Introduce luxury Extrait de Parfum to individuals who appreciate fine scents." },
  { step: "02", title: "Build relationships", desc: "Foster trust, offer personalized scent consultations, and deliver authentic value." },
  { step: "03", title: "Create consistent sales", desc: "Generate recurring revenue through repeat customers and fragrance re-orders." },
  { step: "04", title: "Develop your business", desc: "Expand your reach into retail counters, online platforms, and corporate gifting." },
  { step: "05", title: "Grow your opportunity", desc: "Unlock higher reward tiers, team leadership incentives, and global business scope." }
];

const PARTNER_TYPES = [
  "Independent Business Owner (IBO)",
  "Retail Store / Boutique Owner",
  "Wholesaler / Regional Distributor",
  "Digital & Social Media Reseller",
  "Corporate & Luxury Gifting Partner",
  "Brand Affiliate & Influencer"
];

export default function JoinGrowPage() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Application Form State
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    city: "",
    partnerType: PARTNER_TYPES[0],
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newApp = {
      id: `app-${Date.now()}`,
      full_name: formData.name,
      business_name: formData.businessName || null,
      phone: formData.phone,
      email: formData.email || null,
      city: formData.city,
      partner_type: formData.partnerType,
      message: formData.message || null,
      status: "Pending" as const,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from("partner_applications").insert([
        {
          full_name: formData.name,
          business_name: formData.businessName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          partner_type: formData.partnerType,
          message: formData.message,
          status: "Pending",
          created_at: newApp.created_at
        }
      ]);
    } catch (err) {
      console.log("Submitted partner inquiry:", formData);
    }

    // Save to local storage fallback
    try {
      const existing = localStorage.getItem("jennyd_partner_applications");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newApp);
      localStorage.setItem("jennyd_partner_applications", JSON.stringify(list));
    } catch (e) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello Jennyd Team! I want to Join & Grow as an Independent Business Owner.\n\n*Name:* ${formData.name || "N/A"}\n*Business:* ${formData.businessName || "N/A"}\n*Phone:* ${formData.phone || "N/A"}\n*City:* ${formData.city || "N/A"}\n*Partner Type:* ${formData.partnerType}\n*Message:* ${formData.message || "Interested in Join & Grow business collaboration."}`;
    const url = `https://wa.me/919682899765?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const joinGrowJsonLd = {
    "@context": "https://schema.org",
    "@type": "BusinessAudience",
    "name": "Jennyd Scents — Join & Grow Business Collaboration",
    "url": "https://jennydscents.com/join-grow",
    "description": "Become an Independent Business Owner with Jennyd Scents. Step into international fragrance entrepreneurship and build a business around luxury Extrait de Parfum.",
    "publisher": {
      "@type": "Organization",
      "name": "Jennyd Scents"
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans text-neutral-800 selection:bg-[#D4AF37] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(joinGrowJsonLd) }}
      />

      {/* ── 0. HERO SECTION (2 Parts: Text + Image) ── */}
      <section className="relative w-full py-10 sm:py-14 lg:py-16 bg-[#0A0A0A] text-white border-b border-[#D4AF37]/40 overflow-hidden">
        {/* Ambient Gold Radial Backlight Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[#D4AF37]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Part: Text Content (7 Cols on desktop) */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] shadow-md backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>JENNYD SCENTS • GLOBAL BUSINESS COLLABORATION</span>
              </div>

              {/* Main Title */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white font-normal tracking-wide leading-tight">
                  JOIN &amp; GROW WITH <span className="bg-gradient-to-r from-[#F4E0A5] via-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent font-medium">JENNYD SCENTS</span>
                </h1>
                <p className="text-[#D4AF37] text-xs sm:text-base font-serif italic">
                  Your Independent Business. Your Global Opportunity. Your Future.
                </p>
              </div>

              <p className="text-neutral-300 text-xs font-sans font-light leading-relaxed max-w-xl">
                Welcome to <strong className="text-white font-semibold">Jennyd Scents — Join &amp; Grow</strong>, an exclusive business collaboration created for ambitious leaders and entrepreneurs who want to build a thriving business with India's luxury fragrance brand.
              </p>

              {/* Quick Key Highlights / Stats Strip */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10 max-w-lg">
                <div>
                  <span className="block text-base sm:text-xl font-serif text-[#D4AF37] font-bold">50%+</span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-sans">Retail Margins</span>
                </div>
                <div>
                  <span className="block text-base sm:text-xl font-serif text-[#D4AF37] font-bold">100+</span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-sans">Active Partners</span>
                </div>
                <div>
                  <span className="block text-base sm:text-xl font-serif text-[#D4AF37] font-bold">Global</span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-sans">Business Reach</span>
                </div>
              </div>

              {/* Action CTAs - Compact & Sleek */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <a 
                  href="#section-1" 
                  className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-4 py-2 sm:py-2.5 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#D4AF37]/20 cursor-pointer flex items-center gap-1.5 active:scale-98"
                >
                  <span>Explore Opportunity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="#apply-section" 
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 sm:py-2.5 rounded-lg text-[11px] uppercase tracking-wider border border-white/20 shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span>Become a Partner</span>
                </a>
              </div>
            </div>

            {/* Right Part: Landscape Hero Image (5 Cols on desktop) */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                onClick={() => setLightboxImage(IMAGES.hero)}
                className="relative w-full aspect-[16/10] max-w-md sm:max-w-lg lg:max-w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/40 bg-[#121212] group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
              >
                <Image
                  src={IMAGES.hero}
                  alt="Join and Grow with Jennyd Scents Leadership Team"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Label */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg">
                  Leadership &amp; Business
                </div>

                {/* Expand Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(IMAGES.hero);
                  }}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-lg flex items-center gap-1 text-[11px] font-semibold"
                  title="View Full Screen Image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 1: BECOME AN INDEPENDENT BUSINESS OWNER ── */}
      <section 
        id="section-1" 
        className="w-full py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-[#EAE7E1]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">
          
          {/* Borderless Large Image (Left on desktop - 5 Cols) */}
          <div className="lg:col-span-5 order-1 lg:order-1 flex justify-center">
            <div 
              onClick={() => setLightboxImage(IMAGES.leader)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.leader}
                alt="I am the leader of my business"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.leader);
                }}
                className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                title="View Full Screen Image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand</span>
              </button>
            </div>
          </div>

          {/* Text Side (Right on desktop - 7 Cols) */}
          <div className="lg:col-span-7 order-2 lg:order-2 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>INDEPENDENT BUSINESS OPPORTUNITY</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#121212] font-normal leading-tight">
                BECOME AN INDEPENDENT BUSINESS OWNER
              </h2>
              <div className="w-10 h-[2px] bg-[#D4AF37]" />
            </div>

            <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed font-sans font-light">
              With Jennyd Scents, you can build your own independent business around a premium fragrance portfolio while benefiting from the support of an established luxury fragrance brand.
            </p>

            {/* 3 Core Value Statements Box */}
            <div className="bg-white p-4.5 sm:p-5 rounded-xl border border-[#EAE7E1] shadow-md space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                THE COLLABORATION FORMULA:
              </h4>

              <div className="space-y-2.5 font-sans text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF8F5] border border-neutral-200/80">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-[#121212]">You bring the ambition.</h5>
                    <p className="text-xs text-neutral-500 font-light">Your passion, goal-setting, and drive to create a lasting presence.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF8F5] border border-neutral-200/80">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-[#121212]">We provide the platform.</h5>
                    <p className="text-xs text-neutral-500 font-light">Premium fragrance catalog, world-class formulations, packaging, and business guidance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF8F5] border border-neutral-200/80">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-[#121212]">Together, we create the opportunity.</h5>
                    <p className="text-xs text-neutral-500 font-light">A shared path to retail growth, recurring sales, and global reach.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <a
                href="#apply-section"
                className="inline-flex items-center gap-1.5 bg-[#121212] hover:bg-[#D4AF37] text-white hover:text-black font-bold px-4 py-2 sm:py-2.5 rounded-lg text-[11px] uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer active:scale-98"
              >
                <span>Start Your Business Today</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 2: YOUR JOURNEY CAN INCLUDE ── */}
      <section 
        className="w-full py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-[#FAF8F5] border-b border-[#EAE7E1]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">
          
          {/* Text & Grid Side (Left on desktop - 7 Cols) */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#121212] text-[#D4AF37] px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>GROWTH ROADMAP</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#121212] font-normal leading-tight">
                YOUR JOURNEY CAN INCLUDE
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-sans font-light">
                Discover the multifaceted opportunities available when you partner with Jennyd Scents.
              </p>
              <div className="w-10 h-[2px] bg-[#D4AF37]" />
            </div>

            {/* 8 Bullet Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {JOURNEY_INCLUDES.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-[#EAE7E1] shadow-xs flex items-start gap-2.5 hover:border-[#D4AF37] transition-colors group">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-neutral-800 leading-snug">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-neutral-700 flex items-center gap-2.5">
              <Award className="w-4.5 h-4.5 text-[#D4AF37] shrink-0" />
              <span>Qualify for recognition, exclusive product masterclasses, and international brand incentives as your network grows.</span>
            </div>

          </div>

          {/* Borderless Large Image (Right on desktop - 5 Cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div 
              onClick={() => setLightboxImage(IMAGES.mentor)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.mentor}
                alt="It's my business and I am the mentor"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.mentor);
                }}
                className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                title="View Full Screen Image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: BUILD TOWARD FINANCIAL INDEPENDENCE ── */}
      <section 
        className="w-full py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-[#EAE7E1]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">
          
          {/* Borderless Large Image (Left on desktop - 5 Cols) */}
          <div className="lg:col-span-5 order-1 lg:order-1 flex justify-center">
            <div 
              onClick={() => setLightboxImage(IMAGES.earn)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.earn}
                alt="Let's Earn Together"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.earn);
                }}
                className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                title="View Full Screen Image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand</span>
              </button>
            </div>
          </div>

          {/* Text Side (Right on desktop - 7 Cols) */}
          <div className="lg:col-span-7 order-2 lg:order-2 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>FINANCIAL INDEPENDENCE</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#121212] font-normal leading-tight">
                BUILD TOWARD FINANCIAL INDEPENDENCE
              </h2>
              <div className="w-10 h-[2px] bg-[#D4AF37]" />
            </div>

            <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed font-sans font-light">
              Your business can become an additional source of income and a platform for long-term entrepreneurial growth.
            </p>

            {/* 5-Step Progress Steps */}
            <div className="space-y-2">
              {FINANCIAL_STEPS.map((s, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-[#EAE7E1] shadow-xs flex items-center justify-between gap-3 hover:border-[#D4AF37] transition-all">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-[#D4AF37] w-7 text-center shrink-0">{s.step}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">{s.title}</h4>
                      <p className="text-[11px] text-neutral-500 font-light leading-normal">{s.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0 hidden sm:block" />
                </div>
              ))}
            </div>

            {/* Success Formula Box */}
            <div className="p-3.5 rounded-xl bg-[#121212] text-white space-y-1 text-xs">
              <span className="text-[#D4AF37] font-bold uppercase tracking-wider block text-[11px]">KEY FOUNDATION FOR SUCCESS</span>
              <p className="text-neutral-300 font-light leading-relaxed">
                Your success will depend on your effort, skills, sales, customer demand, business practices and consistency.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 4: BUILD A BETTER FUTURE & FAMILY LEGACY ── */}
      <section 
        className="w-full py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-[#FAF8F5] border-b border-[#EAE7E1]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">
          
          {/* Text Side (Left on desktop - 7 Cols) */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#121212] text-[#D4AF37] px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>VISION &amp; LEGACY</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#121212] font-normal leading-tight">
                BUILD A BETTER FUTURE FOR YOUR FAMILY
              </h2>
              <p className="text-[#D4AF37] text-sm sm:text-base font-serif italic border-l-2 border-[#D4AF37] pl-2.5 py-0.5">
                "My business is the future of my family."
              </p>
              <div className="w-10 h-[2px] bg-[#D4AF37]" />
            </div>

            <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed font-sans font-light">
              Build an enterprise that can help you pursue your personal goals, create greater financial flexibility and work toward the future you envision for yourself and your family.
            </p>

            {/* 3 Pillars Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#EAE7E1] shadow-xs space-y-1">
                <Heart className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">Personal Goals</h4>
                <p className="text-[11px] text-neutral-500 font-light leading-normal">Turn your passion for luxury fragrances into a rewarding business career.</p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#EAE7E1] shadow-xs space-y-1">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">Financial Flexibility</h4>
                <p className="text-[11px] text-neutral-500 font-light leading-normal">Diversify your income streams with high retail margins and repeat sales.</p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#EAE7E1] shadow-xs space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">Family Future</h4>
                <p className="text-[11px] text-neutral-500 font-light leading-normal">Build a long-term enterprise that creates lasting value for generations.</p>
              </div>
            </div>

          </div>

          {/* Borderless Large Image (Right on desktop - 5 Cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div 
              onClick={() => setLightboxImage(IMAGES.family)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.family}
                alt="My business is the future of my family"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.family);
                }}
                className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                title="View Full Screen Image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 5: EXPERIENCE THE INTERNATIONAL BUSINESS LIFESTYLE ── */}
      <section 
        className="w-full py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-[#EAE7E1]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">
          
          {/* Borderless Large Image (Left on desktop - 5 Cols) */}
          <div className="lg:col-span-5 order-1 lg:order-1 flex justify-center">
            <div 
              onClick={() => setLightboxImage(IMAGES.homeBiz)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.homeBiz}
                alt="Making money from home"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.homeBiz);
                }}
                className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                title="View Full Screen Image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand</span>
              </button>
            </div>
          </div>

          {/* Text Side (Right on desktop - 7 Cols) */}
          <div className="lg:col-span-7 order-2 lg:order-2 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>GLOBAL LIFESTYLE</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#121212] font-normal leading-tight">
                EXPERIENCE THE INTERNATIONAL BUSINESS LIFESTYLE
              </h2>
              <div className="w-10 h-[2px] bg-[#D4AF37]" />
            </div>

            <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed font-sans font-light">
              Imagine building your business from home or wherever you are, connecting with customers and entrepreneurs, discovering new markets and becoming part of an international fragrance community.
            </p>

            {/* High Impact Quote Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#121212] to-[#1A1A1A] text-white border border-[#D4AF37]/40 shadow-lg space-y-1.5 relative overflow-hidden">
              <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-bold block">GLOBAL PHILOSOPHY</span>
              <p className="text-base sm:text-xl font-serif font-normal text-[#F4E0A5] leading-snug">
                "Your location doesn't have to define the size of your ambition."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 rounded-lg bg-white border border-[#EAE7E1] shadow-xs">
                <span className="font-bold text-[#121212] block mb-0.5">Work From Anywhere</span>
                <span className="text-neutral-500 font-light leading-relaxed">Manage client relationships and sales via digital &amp; social platforms.</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#EAE7E1] shadow-xs">
                <span className="font-bold text-[#121212] block mb-0.5">Global Network</span>
                <span className="text-neutral-500 font-light leading-relaxed">Connect with fragrance enthusiasts and entrepreneurs worldwide.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 6 CORE BRAND VISION & LEADERSHIP PILLARS SECTIONS ── */}
      <section className="w-full py-12 sm:py-16 bg-[#FAF8F5] border-b border-[#EAE7E1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 lg:space-y-16">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>CORE LEADERSHIP &amp; BRAND PILLARS</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif text-[#121212] font-normal">
              OUR BRAND VISION &amp; EMPOWERMENT PILLARS
            </h2>

            <p className="text-neutral-600 text-xs sm:text-sm font-sans font-light leading-relaxed">
              Explore the core values, leadership philosophy, and empowering culture behind the Jennyd Scents Independent Business opportunity.
            </p>

            <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mt-2" />
          </div>

          {/* ── PILLAR 1: EMPOWERED TEAMWORK ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] shadow-xl">
            {/* Image (Left on Desktop - 5 Cols) */}
            <div className="lg:col-span-5 order-1 flex justify-center">
              <div 
                onClick={() => setLightboxImage(IMAGES.team)}
                className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30 group cursor-pointer"
              >
                <Image
                  src={IMAGES.team}
                  alt="Empowered Teamwork - Jennyd Scents"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(IMAGES.team);
                  }}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </button>
              </div>
            </div>

            {/* Text Content (Right on Desktop - 7 Cols) */}
            <div className="lg:col-span-7 order-2 space-y-3.5 text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <User className="w-3 h-3 text-[#D4AF37]" />
                <span>PILLAR 01 • EMPOWERED TEAMWORK</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#121212] font-semibold leading-tight">
                Empowered People. Stronger Teams. Bigger Dreams.
              </h3>

              <p className="text-neutral-700 text-xs sm:text-sm font-sans font-light leading-relaxed">
                At Jennyd Scents, empowered teamwork is the foundation of a strong and successful independent business. When passionate individuals come together, support one another, share ideas, and grow together, everyone achieves more.
              </p>

              <div className="space-y-2 text-xs font-sans text-neutral-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Building Community:</strong> You are building a network of motivated people who inspire and encourage each other.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Core Values:</strong> Built on trust, leadership, continuous learning, collaboration, and mutual support.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Shared Success:</strong> Developing confidence and leadership so that when one person grows, the whole team grows.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121212] text-[#F4E0A5] border border-[#D4AF37]/30 text-xs font-serif italic">
                "Jennyd Scents — Empowered People. Stronger Teams. Bigger Dreams."
              </div>
            </div>
          </div>

          {/* ── PILLAR 2: GLOBAL COLLABORATION ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] shadow-xl">
            {/* Text Content (Left on Desktop - 7 Cols) */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-3.5 text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <Globe className="w-3 h-3 text-[#D4AF37]" />
                <span>PILLAR 02 • GLOBAL COLLABORATION</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#121212] font-semibold leading-tight">
                Think Global. Build Your Business. Create Your Success Story.
              </h3>

              <p className="text-neutral-700 text-xs sm:text-sm font-sans font-light leading-relaxed">
                Jennyd Scents opens the door to a global business opportunity where Independent Business Owners can build their own journey, connect with people, and introduce premium fragrance products to customers beyond geographical boundaries.
              </p>

              <div className="space-y-2 text-xs font-sans text-neutral-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Beyond Boundaries:</strong> Think beyond your local market with digital tools and international reach.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Brand Presence:</strong> Develop your personal brand and build meaningful business relationships across regions.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Unlimited Ambition:</strong> Your ambition should never be limited by your location.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121212] text-[#F4E0A5] border border-[#D4AF37]/30 text-xs font-serif italic">
                "Jennyd Scents — Think Global. Build Your Business. Create Your Own Success Story."
              </div>
            </div>

            {/* Image (Right on Desktop - 5 Cols) */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
              <div 
                onClick={() => setLightboxImage(IMAGES.world)}
                className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30 group cursor-pointer"
              >
                <Image
                  src={IMAGES.world}
                  alt="Global Collaboration - World is Ours"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(IMAGES.world);
                  }}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── PILLAR 3: WE ARE TOGETHER (UNITY & DIVERSITY) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] shadow-xl">
            {/* Image (Left on Desktop - 5 Cols) */}
            <div className="lg:col-span-5 order-1 flex justify-center">
              <div 
                onClick={() => setLightboxImage(IMAGES.together)}
                className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30 group cursor-pointer"
              >
                <Image
                  src={IMAGES.together}
                  alt="We Are Together - Unity and Diversity"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(IMAGES.together);
                  }}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </button>
              </div>
            </div>

            {/* Text Content (Right on Desktop - 7 Cols) */}
            <div className="lg:col-span-7 order-2 space-y-3.5 text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <Heart className="w-3 h-3 text-[#D4AF37]" />
                <span>PILLAR 03 • UNITY &amp; DIVERSITY</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#121212] font-semibold leading-tight">
                WE ARE TOGETHER — Unity in Diversity, Strength in Togetherness.
              </h3>

              <p className="text-neutral-700 text-xs sm:text-sm font-sans font-light leading-relaxed">
                At Jennyd Scents, we believe that our greatest strength comes from being together. Our Independent Business Owners come from diverse backgrounds, cultures, and perspectives, united by one common vision.
              </p>

              <div className="space-y-2 text-xs font-sans text-neutral-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Celebrating Differences:</strong> Unity means standing together while embracing unique talents and perspectives.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Inclusive Community:</strong> An environment respecting inclusion, collaboration, and mutual encouragement.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Shared Purpose:</strong> When diverse people unite, possibilities become greater and dreams become stronger.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121212] text-[#F4E0A5] border border-[#D4AF37]/30 text-xs font-serif italic">
                "WE ARE TOGETHER — Different People. One Community. One Vision. One Journey."
              </div>
            </div>
          </div>

          {/* ── PILLAR 4: SELF DETERMINATION (CEO OF MY LIFE) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] shadow-xl">
            {/* Text Content (Left on Desktop - 7 Cols) */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-3.5 text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <Award className="w-3 h-3 text-[#D4AF37]" />
                <span>PILLAR 04 • SELF DETERMINATION</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#121212] font-semibold leading-tight">
                CEO OF MY LIFE — Empower Yourself. Lead Your Life. Build Your Future.
              </h3>

              <p className="text-neutral-700 text-xs sm:text-sm font-sans font-light leading-relaxed">
                Being an Independent Business Owner with Jennyd Scents means taking ownership of your goals, your decisions, your time, and your personal growth. Become the CEO of your own life and direction.
              </p>

              <div className="space-y-2 text-xs font-sans text-neutral-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Skill Development:</strong> Build confidence, leadership, communication, discipline, and entrepreneurial skills.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Own Your Potential:</strong> Set meaningful goals, take consistent action, and learn from every challenge.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Personal Growth:</strong> "I choose my direction. I own my decisions. I believe in my potential. I lead my journey."</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121212] text-[#F4E0A5] border border-[#D4AF37]/30 text-xs font-serif italic">
                "I AM THE CEO OF MY LIFE — My Vision. My Decisions. My Journey. My Growth."
              </div>
            </div>

            {/* Image (Right on Desktop - 5 Cols) */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
              <div 
                onClick={() => setLightboxImage(IMAGES.ceo)}
                className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30 group cursor-pointer"
              >
                <Image
                  src={IMAGES.ceo}
                  alt="Self Determination - CEO of My Life"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(IMAGES.ceo);
                  }}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── PILLAR 5: IT'S MY BRAND (OWNERSHIP & PRIDE) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] shadow-xl">
            {/* Image (Left on Desktop - 5 Cols) */}
            <div className="lg:col-span-5 order-1 flex justify-center">
              <div 
                onClick={() => setLightboxImage(IMAGES.brandBoss)}
                className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30 group cursor-pointer"
              >
                <Image
                  src={IMAGES.brandBoss}
                  alt="It's My Brand - Ownership and Pride"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(IMAGES.brandBoss);
                  }}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </button>
              </div>
            </div>

            {/* Text Content (Right on Desktop - 7 Cols) */}
            <div className="lg:col-span-7 order-2 space-y-3.5 text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>PILLAR 05 • OWNERSHIP &amp; PRIDE</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#121212] font-semibold leading-tight">
                IT'S MY BRAND — Own Your Journey. Represent With Pride.
              </h3>

              <p className="text-neutral-700 text-xs sm:text-sm font-sans font-light leading-relaxed">
                Being a Jennyd Scents Independent Business Owner means taking pride in building something that reflects your vision, effort, and entrepreneurial spirit. Proudly say: *I am building my own business and creating my identity.*
              </p>

              <div className="space-y-2 text-xs font-sans text-neutral-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Professional Pride:</strong> Represent Jennyd Scents with confidence and shape how people experience your brand.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Responsibility for Growth:</strong> Celebrate achievements, learn from challenges, and build with purpose.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Values in Action:</strong> Attitude, action, and dedication define your personal business story.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121212] text-[#F4E0A5] border border-[#D4AF37]/30 text-xs font-serif italic">
                "IT'S MY BRAND — My Business. My Identity. My Effort. My Pride."
              </div>
            </div>
          </div>

          {/* ── PILLAR 6: I WILL DECIDE MY INCOME (LEADERSHIP & INCOME CONTROL) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] shadow-xl">
            {/* Text Content (Left on Desktop - 7 Cols) */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-3.5 text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <TrendingUp className="w-3 h-3 text-[#D4AF37]" />
                <span>PILLAR 06 • LEADERSHIP &amp; INCOME CONTROL</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#121212] font-semibold leading-tight">
                I WILL DECIDE MY INCOME — Take the Lead. Build With Purpose.
              </h3>

              <p className="text-neutral-700 text-xs sm:text-sm font-sans font-light leading-relaxed">
                Take an active role in your business journey. "I WILL DECIDE MY INCOME" represents personal responsibility, ambition, and determination to build your business through consistent effort and purposeful leadership.
              </p>

              <div className="space-y-2 text-xs font-sans text-neutral-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Entrepreneurial Mindset:</strong> Take initiative, develop confidence, embrace learning, and lead by example.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Action-Oriented Leadership:</strong> Set clear goals, create plans, measure progress, and continuously improve.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Growth &amp; Responsibility:</strong> Your business growth reflects your choices, customer service, and leadership.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121212] text-[#F4E0A5] border border-[#D4AF37]/30 text-xs font-serif italic">
                "I WILL DECIDE MY INCOME — My Goals. My Actions. My Leadership. My Responsibility."
              </div>
            </div>

            {/* Image (Right on Desktop - 5 Cols) */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
              <div 
                onClick={() => setLightboxImage(IMAGES.boss)}
                className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30 group cursor-pointer"
              >
                <Image
                  src={IMAGES.boss}
                  alt="I Will Decide My Income - Leadership and Income Control"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(IMAGES.boss);
                  }}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 7: JOIN • BUILD • GROW • ACHIEVE (APPLICATION FORM) ── */}
      <section 
        id="apply-section" 
        className="w-full py-12 sm:py-16 lg:py-20 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto bg-[#0A0A0A] text-white border-b border-[#D4AF37]/40 relative overflow-hidden"
      >
        {/* Ambient Gold Radial Glows */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#D4AF37]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full space-y-6 sm:space-y-8">
          
          {/* Centered Luxury Header & Tagline */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOIN • BUILD • GROW • ACHIEVE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white font-normal leading-tight">
              BECOME AN INDEPENDENT BUSINESS OWNER
            </h2>

            <p className="text-[#D4AF37] text-xs sm:text-base font-serif italic">
              Partner with Jennyd Scents — Where Every Scent Tells a Story.
            </p>

            <p className="text-neutral-300 text-xs sm:text-sm font-sans font-light max-w-2xl mx-auto leading-relaxed">
              Fill out your details below. Our partnership director will review your application and connect with you within 24 hours.
            </p>

            {/* 4 Feature Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] sm:text-xs font-sans">
              <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 text-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>50%+ High Margins</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 text-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Low MOQ Starter Kits</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 text-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Express 24-48h Dispatch</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 text-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Dedicated Account Manager</span>
              </div>
            </div>
          </div>

          {/* Full-Width Landscape Form Box */}
          <div className="bg-gradient-to-b from-[#161616] via-[#111111] to-[#0A0A0A] p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-[#D4AF37]/40 shadow-2xl space-y-6">
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Row 1: Full Name, Phone, City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <User className="w-4 h-4 text-neutral-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-3.5 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Rahul Sharma"
                        className="w-full bg-white/[0.04] border border-white/12 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-black/60 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative group">
                      <Phone className="w-4 h-4 text-neutral-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-3.5 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/[0.04] border border-white/12 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-black/60 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">
                      City &amp; State / Country *
                    </label>
                    <div className="relative group">
                      <MapPin className="w-4 h-4 text-neutral-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-3.5 transition-colors" />
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai, Maharashtra"
                        className="w-full bg-white/[0.04] border border-white/12 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-black/60 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email, Business Name, Collaboration Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-neutral-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-3.5 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="partner@example.com"
                        className="w-full bg-white/[0.04] border border-white/12 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-black/60 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">
                      Business / Store Name (Optional)
                    </label>
                    <div className="relative group">
                      <Building2 className="w-4 h-4 text-neutral-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-3.5 transition-colors" />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Royal Fragrances & Co."
                        className="w-full bg-white/[0.04] border border-white/12 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-black/60 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">
                      Partnership Category *
                    </label>
                    <div className="relative group">
                      <Briefcase className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3.5 z-10 pointer-events-none" />
                      <select
                        name="partnerType"
                        value={formData.partnerType}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-white/12 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition-all appearance-none"
                      >
                        {PARTNER_TYPES.map((pt, i) => (
                          <option key={i} value={pt} className="bg-[#1A1A1A] text-white">
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 3: Additional Requirements Textarea */}
                <div>
                  <label className="block text-[11px] text-neutral-300 font-medium mb-1.5">
                    Additional Requirements / Business Goals
                  </label>
                  <div className="relative group">
                    <MessageSquare className="w-4 h-4 text-neutral-400 group-focus-within:text-[#D4AF37] absolute left-3.5 top-3.5 transition-colors" />
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us briefly about your boutique, store location, or wholesale expectations..."
                      className="w-full bg-white/[0.04] border border-white/12 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:bg-black/60 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none resize-none transition-all"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#F4E0A5] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Business Inquiry"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="sm:w-auto px-6 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs sm:text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    <span>Direct WhatsApp Connect</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="py-8 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-serif text-white font-bold">Application Received!</h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans font-light">
                  Thank you <span className="text-[#D4AF37] font-semibold">{formData.name}</span>. Our partnership director will review your details and contact you within 24 hours.
                </p>
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    onClick={handleWhatsAppDirect}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    Instant Connect on WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        businessName: "",
                        phone: "",
                        email: "",
                        city: "",
                        partnerType: PARTNER_TYPES[0],
                        message: ""
                      });
                    }}
                    className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ── 8. IMPORTANT LEGAL DISCLOSURE / DISCLAIMER SECTION ── */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/30 shadow-md text-left max-w-3xl mx-auto space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#121212]">
              Official Business Collaboration &amp; Earnings Notice
            </span>
          </div>

          <p className="text-neutral-600 text-xs font-sans leading-relaxed font-light">
            <strong className="text-neutral-800 font-semibold">Important:</strong> Jennyd Scents does not guarantee financial freedom or a specific level of income. Earnings and rewards, where applicable, depend on actual qualifying sales, customer activity, eligibility, effort and the official compensation plan. Independent Business Owners are not employees of Jennyd Scents. All applicable terms and conditions must be followed.
          </p>
        </div>
      </section>

      {/* ── LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-2"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-full transition-all cursor-pointer z-20 shadow-xl"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={lightboxImage}
                  alt="Full Screen Poster"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

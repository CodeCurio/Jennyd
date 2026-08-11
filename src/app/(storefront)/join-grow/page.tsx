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
  section1: "/assets/join-grow/join-grow-1.jpeg",
  section2: "/assets/join-grow/join-grow-2.jpeg",
  section3: "/assets/join-grow/join-grow-3.jpeg",
  section4: "/assets/join-grow/join-grow-4.jpeg",
  section5: "/assets/join-grow/join-grow-5.jpeg",
  section6: "/assets/join-grow/join-grow-6.jpeg",
};

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
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.log("Submitted partner inquiry:", formData);
    }

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

      {/* ── 0. HERO SECTION ── */}
      <section className="relative w-full py-10 sm:py-14 lg:py-16 bg-[#0A0A0A] text-white border-b border-[#D4AF37]/40 overflow-hidden">
        {/* Ambient Gold Radial Backlight Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#D4AF37]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] shadow-md backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>JENNYD SCENTS • GLOBAL BUSINESS COLLABORATION</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white font-normal tracking-wide leading-tight">
            JOIN &amp; GROW WITH JENNYD SCENTS
          </h1>

          <p className="text-[#D4AF37] text-sm sm:text-lg font-serif italic max-w-2xl mx-auto">
            Your Independent Business. Your Global Opportunity. Your Future.
          </p>

          <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl mx-auto font-sans font-light leading-relaxed">
            Welcome to <strong className="text-white font-semibold">Jennyd Scents — Join &amp; Grow</strong>, a business collaboration created for ambitious individuals who want to become Independent Business Owners and Partners with Jennyd Scents.
          </p>

          <p className="text-neutral-400 text-xs max-w-xl mx-auto font-sans font-light leading-relaxed italic">
            Step into the world of international fragrance entrepreneurship and build a business that can grow with your vision, effort, customer relationships, and entrepreneurial spirit.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a 
              href="#section-1" 
              className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-6 py-2.5 sm:py-3 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2 active:scale-98"
            >
              <span>Explore Opportunity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a 
              href="#apply-section" 
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 sm:py-3 rounded-lg text-xs uppercase tracking-wider border border-white/20 shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Become a Partner</span>
            </a>
          </div>

          <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mt-4" />
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
              onClick={() => setLightboxImage(IMAGES.section1)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.section1}
                alt="Become An Independent Business Owner"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.section1);
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
              With Jennyd Scents, you can build your own independent business around a premium fragrance portfolio while benefiting from the support of an established fragrance brand.
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
                className="inline-flex items-center gap-2 bg-[#121212] hover:bg-[#D4AF37] text-white hover:text-black font-bold px-6 py-2.5 sm:py-3 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer active:scale-98"
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
              onClick={() => setLightboxImage(IMAGES.section2)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.section2}
                alt="Your Journey Can Include"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.section2);
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
              onClick={() => setLightboxImage(IMAGES.section3)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.section3}
                alt="Build Toward Financial Independence"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.section3);
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

      {/* ── SECTION 4: BUILD A BETTER FUTURE ── */}
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
                BUILD A BETTER FUTURE
              </h2>
              <p className="text-[#D4AF37] text-sm sm:text-base font-serif italic border-l-2 border-[#D4AF37] pl-2.5 py-0.5">
                "Dream beyond today."
              </p>
              <div className="w-10 h-[2px] bg-[#D4AF37]" />
            </div>

            <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed font-sans font-light">
              Build something that can help you pursue your personal goals, create greater financial flexibility and work toward the future you envision for yourself and your family.
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
              onClick={() => setLightboxImage(IMAGES.section4)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.section4}
                alt="Build A Better Future"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.section4);
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
              onClick={() => setLightboxImage(IMAGES.section5)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.section5}
                alt="Experience The International Business Lifestyle"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.section5);
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
              Imagine building your business from wherever you are, connecting with customers and entrepreneurs, discovering new markets and becoming part of an international fragrance community.
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

      {/* ── SECTION 6: JOIN • BUILD • GROW • ACHIEVE (APPLICATION FORM) ── */}
      <section 
        id="apply-section" 
        className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-[#0A0A0A] text-white border-b border-[#D4AF37]/40 relative overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">
          
          {/* Left Column: Form & Details (7 Cols) */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-4 text-left">
            
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-black px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-md">
                <span>JOIN • BUILD • GROW • ACHIEVE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white font-normal leading-tight">
                JENNYD SCENTS
              </h2>
              <p className="text-[#D4AF37] text-sm sm:text-base font-serif italic">
                Where Every Scent Tells a Story.
              </p>
            </div>

            {/* Core Action Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Become an Independent Business Owner</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Partner with Jennyd Scents</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Build Your Business</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Grow Your Future</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-center">
              <span className="text-xs sm:text-sm font-serif font-bold text-[#F4E0A5] tracking-wider uppercase">
                YOUR DREAM. YOUR BUSINESS. YOUR JOURNEY.
              </span>
            </div>

            {/* Application Form Box */}
            <div className="bg-[#121212] p-5 sm:p-6 rounded-2xl border border-white/15 shadow-xl space-y-3">
              <h3 className="text-lg font-serif font-bold text-white">
                Submit Your Business Collaboration Application
              </h3>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-300 font-medium mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Full Name"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-300 font-medium mb-1">Business Name (Optional)</label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="Store / Company Name"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-300 font-medium mb-1">Phone / WhatsApp *</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 Phone Number"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-300 font-medium mb-1">City &amp; Country *</label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City, Country"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@example.com"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1">Collaboration Type</label>
                    <select
                      name="partnerType"
                      value={formData.partnerType}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {PARTNER_TYPES.map((pt, i) => (
                        <option key={i} value={pt} className="bg-[#1A1A1A] text-white">{pt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-300 font-medium mb-1">Tell us about your business goals</label>
                    <div className="relative">
                      <MessageSquare className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                      <textarea
                        name="message"
                        rows={2.5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Share your experience, location, or partnership expectations..."
                        className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none resize-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-1.5 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold uppercase tracking-wider text-xs py-2.5 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs py-2.5 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>Direct WhatsApp Inquiry</span>
                    </button>
                  </div>

                </form>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-serif text-white font-bold">Application Received!</h4>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                    Thank you <span className="text-[#D4AF37] font-semibold">{formData.name}</span>. Our partnership representative will contact you within 24 hours.
                  </p>
                  <button
                    onClick={handleWhatsAppDirect}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    Chat Directly on WhatsApp
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* Borderless Large Image (Right on desktop - 5 Cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center items-center h-full">
            <div 
              onClick={() => setLightboxImage(IMAGES.section6)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md lg:max-w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
            >
              <Image
                src={IMAGES.section6}
                alt="Join Build Grow Achieve"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(IMAGES.section6);
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

      {/* ── 7. IMPORTANT LEGAL DISCLOSURE / DISCLAIMER SECTION ── */}
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

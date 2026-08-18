"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, 
  Sparkles, 
  Briefcase, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Send, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  MessageSquare,
  ShieldCheck,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const PARTNERSHIP_BENEFITS = [
  {
    icon: TrendingUp,
    title: "High Margin Profits",
    description: "Up to 50%+ profit margins & exclusive wholesale rates.",
    tag: "High ROI"
  },
  {
    icon: Sparkles,
    title: "Artisanal Luxury",
    description: "Pure Extrait de Parfums & non-alcoholic attars.",
    tag: "Premium"
  },
  {
    icon: Briefcase,
    title: "Marketing Support",
    description: "Free counter displays, tester kits & digital assets.",
    tag: "Full Support"
  },
  {
    icon: Truck,
    title: "Express Logistics",
    description: "Priority dispatch, low MOQs & B2B account support.",
    tag: "Fast Delivery"
  }
];

const PARTNER_TYPES = [
  "Retail Store / Boutique Owner",
  "Wholesaler / Distributor",
  "Online Reseller / E-commerce",
  "Franchise Inquiry",
  "Corporate Gifting Partner",
  "Affiliate & Influencer"
];

export function JoinGrowSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    city: "",
    partnerType: PARTNER_TYPES[0],
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      status: "Pending",
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

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello Jennyd Team! I want to Join & Grow as a Partner.\n\n*Name:* ${formData.name || "N/A"}\n*Business:* ${formData.businessName || "N/A"}\n*Phone:* ${formData.phone || "N/A"}\n*City:* ${formData.city || "N/A"}\n*Partner Type:* ${formData.partnerType}\n*Message:* ${formData.message || "Interested in partnership details."}`;
    const url = `https://wa.me/919682899765?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setSubmitted(false);
    setFormData({
      name: "",
      businessName: "",
      phone: "",
      email: "",
      city: "",
      partnerType: PARTNER_TYPES[0],
      message: ""
    });
  };

  return (
    <section className="py-4 sm:py-6 lg:py-8 max-w-[1440px] mx-auto w-full px-3 sm:px-6 lg:px-8">
      {/* Outer Banner Box with Dark Luxury Theme & Gold Accents */}
      <div className="relative w-full bg-gradient-to-br from-[#181818] via-[#121212] to-[#0A0A0A] text-white border border-[#D4AF37]/35 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 lg:p-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Partnership & Business Growth</span>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-white leading-tight">
                Join & Grow <span className="bg-gradient-to-r from-[#F4E0A5] via-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent font-medium">With Jennyd</span>
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-lg font-sans">
                Partner with India&apos;s luxury fragrance brand. Expand your business with high retail margins (up to 50%+), low MOQs, and complete marketing support.
              </p>
            </div>

            {/* Quick Stats Counter */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 py-2 border-y border-white/10 my-2">
              <div>
                <span className="block text-base sm:text-xl font-serif text-[#D4AF37] font-bold">50%+</span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-sans">Retail Margins</span>
              </div>
              <div>
                <span className="block text-base sm:text-xl font-serif text-[#D4AF37] font-bold">100+</span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-sans">Active Partners</span>
              </div>
              <div>
                <span className="block text-base sm:text-xl font-serif text-[#D4AF37] font-bold">24-48h</span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-sans">Fast Dispatch</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center gap-2 pt-1">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-white hover:to-white text-black font-bold uppercase tracking-wider text-[10.5px] sm:text-[11px] px-4 py-2 rounded-lg transition-all duration-300 shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 group min-h-[36px]"
              >
                <span>Become a Partner</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Button>

              <a
                href={`https://wa.me/919682899765?text=${encodeURIComponent("Hello Jennyd Team, I would like to inquire about Join & Grow business partnership options.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none bg-white/5 hover:bg-white/15 border border-white/15 hover:border-[#D4AF37]/50 text-white font-semibold text-[10.5px] sm:text-[11px] px-3.5 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 min-h-[36px]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>WhatsApp Chat</span>
              </a>
            </div>

          </div>

          {/* Right Column: 4 Compact Benefit Grid Cards */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {PARTNERSHIP_BENEFITS.map((benefit, idx) => {
              const IconComp = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#D4AF37]/40 rounded-xl p-3 sm:p-4 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform">
                      <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded border border-[#D4AF37]/20">
                      {benefit.tag}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-serif font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-neutral-400 font-sans leading-normal">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── PARTNERSHIP APPLICATION MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#141414] border border-[#D4AF37]/40 text-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={resetForm}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <>
                  <div className="mb-6 space-y-1">
                    <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest block">
                      Join & Grow Partner Application
                    </span>
                    <h3 className="text-2xl font-serif font-semibold text-white">
                      Partner With Jennyd Scents
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Fill out your details below and our partnership manager will contact you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Rahul Sharma"
                            className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                          Business / Store Name
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Royal Perfumes & Co."
                            className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                          Phone / WhatsApp *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                          City & State *
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Mumbai, Maharashtra"
                            className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="partner@example.com"
                          className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                        Partnership Interest *
                      </label>
                      <select
                        name="partnerType"
                        value={formData.partnerType}
                        onChange={handleChange}
                        className="w-full bg-[#1F1F1F] border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                      >
                        {PARTNER_TYPES.map((type, idx) => (
                          <option key={idx} value={type} className="bg-[#1F1F1F] text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                        Additional Message / Requirements
                      </label>
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <textarea
                          name="message"
                          rows={2}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us briefly about your store or wholesale expectations..."
                          className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit Partnership Inquiry
                      </Button>

                      <button
                        type="button"
                        onClick={handleWhatsAppDirect}
                        className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <span>Send Details Directly via WhatsApp</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif text-white font-bold">
                    Application Received!
                  </h3>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                    Thank you <span className="text-[#D4AF37] font-semibold">{formData.name}</span>. Our partnership representative will review your request and get back to you within 24 hours.
                  </p>

                  <div className="pt-4 flex flex-col gap-2">
                    <Button
                      onClick={handleWhatsAppDirect}
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      Instant Connect on WhatsApp
                    </Button>
                    <button
                      onClick={resetForm}
                      className="text-xs text-neutral-400 hover:text-white underline pt-2"
                    >
                      Back to Homepage
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

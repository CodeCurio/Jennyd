"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Mail, Phone, MapPin, Send, Loader2, Building, Plane, 
  FlaskConical, Factory, MessageCircle, HelpCircle, 
  ShoppingBag, Briefcase, HeartHandshake, Award, ShieldCheck, CheckCircle2
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      addToast({ 
        title: "Inquiry Submitted", 
        message: "Thank you for reaching out to Jennyd Scents Concierge. We will reply within 24 hours.", 
        type: "success" 
      });
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      
      {/* ── 1. Luxury Dark Hero Header ── */}
      <section className="relative w-full py-16 sm:py-24 bg-[#0F0F0F] text-white overflow-hidden border-b-2 border-[#D4AF37]/40">
        {/* Background Ambient Radial Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-3">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[11px] font-bold block font-sans">
            Concierge & Client Experience
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white font-normal tracking-wide">
            How May We Assist You?
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Whether seeking bespoke perfume recommendations, order assistance, or international trade inquiries, our dedicated team is at your service.
          </p>
          <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mt-4" />
        </div>
      </section>

      {/* ── 2. Main Contact Grid (2 Columns: Left Directory, Right Form) ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Concierge & Department Directory (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Title */}
            <div className="space-y-1">
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest block">Direct Channels</span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#121212]">Contact Department Directory</h2>
            </div>

            {/* Department Email Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#121212]">EMAIL DIRECTORY</h3>
                  <p className="text-[11px] text-neutral-400 font-sans">Reach out directly to your target department</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-sans">
                
                {/* Support */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE7E1] space-y-1 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Customer Support</span>
                  </div>
                  <a href="mailto:support@jennydscents.com" className="font-bold text-[#121212] hover:text-[#D4AF37] transition-colors block break-all text-xs">
                    support@jennydscents.com
                  </a>
                </div>

                {/* Orders */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE7E1] space-y-1 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Orders & Purchasing</span>
                  </div>
                  <a href="mailto:purchase@jennydscents.com" className="font-bold text-[#121212] hover:text-[#D4AF37] transition-colors block break-all text-xs">
                    purchase@jennydscents.com
                  </a>
                </div>

                {/* Business */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE7E1] space-y-1 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Business & Trade</span>
                  </div>
                  <a href="mailto:business@jennydscents.com" className="font-bold text-[#121212] hover:text-[#D4AF37] transition-colors block break-all text-xs">
                    business@jennydscents.com
                  </a>
                </div>

                {/* Careers */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE7E1] space-y-1 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Careers & Hiring</span>
                  </div>
                  <a href="mailto:Career@jennydscents.com" className="font-bold text-[#121212] hover:text-[#D4AF37] transition-colors block break-all text-xs">
                    Career@jennydscents.com
                  </a>
                </div>

                {/* Donations */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE7E1] space-y-1 sm:col-span-2 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">CSR & Donations</span>
                  </div>
                  <a href="mailto:donation@jennydscents.com" className="font-bold text-[#121212] hover:text-[#D4AF37] transition-colors block break-all text-xs">
                    donation@jennydscents.com
                  </a>
                </div>

              </div>
            </div>

            {/* WhatsApp Line Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#121212]">WHATSAPP CONCIERGE</h3>
                <a 
                  href="https://wa.me/919682899765" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-lg font-bold text-[#121212] hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                >
                  <span>+91 9682899765</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">(WhatsApp Only)</span>
                </a>
                <p className="text-xs text-neutral-500 font-sans">We aim to reply within 24 hours.</p>
              </div>
            </div>

            {/* Head Office & R&D Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Head Office Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Building className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#121212]">HEAD OFFICE</h4>
                    <span className="text-[10px] text-[#D4AF37] font-semibold uppercase">Lucknow HQ</span>
                  </div>
                </div>
                <div className="text-xs text-neutral-600 leading-relaxed font-sans pt-2 border-t border-neutral-100 space-y-0.5">
                  <p className="font-bold text-[#121212]">JENNYD SCENTS</p>
                  <p>4B, Fawn Break Apartment</p>
                  <p>Sarojini Naidu Road</p>
                  <p>Lucknow, UP 226001, India</p>
                </div>
              </div>

              {/* R&D Center Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#121212]">R&D CENTER</h4>
                    <span className="text-[10px] text-[#D4AF37] font-semibold uppercase">Distillery & Lab</span>
                  </div>
                </div>
                <div className="text-xs text-neutral-600 leading-relaxed font-sans pt-2 border-t border-neutral-100 space-y-0.5">
                  <p className="font-bold text-[#121212]">JENNYD SCENTS</p>
                  <p className="text-[10px] text-neutral-500 italic">A Unit of Bharat fragrance</p>
                  <p>Chambaghat Industrial Area</p>
                  <p>Solan - 173213, HP, India</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Sleek Luxury Form Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#EAE7E1] shadow-xl space-y-6">
            <div className="space-y-1 border-b border-neutral-100 pb-4">
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest block">Online Message</span>
              <h3 className="text-2xl font-serif text-[#121212]">Send a Private Inquiry</h3>
              <p className="text-xs text-neutral-500 font-sans">Fill in the details below and our team will get back to you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="font-bold uppercase tracking-wider text-neutral-600 text-[10px]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE7E1] px-4 py-3 rounded-xl text-xs text-[#121212] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="font-bold uppercase tracking-wider text-neutral-600 text-[10px]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#FAF8F5] border border-[#EAE7E1] px-4 py-3 rounded-xl text-xs text-[#121212] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  placeholder="e.g. name@example.com"
                />
              </div>

              {/* Reason Dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="font-bold uppercase tracking-wider text-neutral-600 text-[10px]">
                  Inquiry Topic <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#FAF8F5] border border-[#EAE7E1] px-4 py-3 rounded-xl text-xs text-[#121212] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all cursor-pointer font-medium"
                >
                  <option value="General Inquiry">General Concierge Inquiry</option>
                  <option value="Order Tracking">Order Status & Delivery Tracking</option>
                  <option value="Product Recommendation">Perfume & Note Recommendation</option>
                  <option value="Business & Trade">Business, Wholesale & Trade</option>
                  <option value="CSR & Donations">CSR & Press Inquiries</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="font-bold uppercase tracking-wider text-neutral-600 text-[10px]">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-[#FAF8F5] border border-[#EAE7E1] px-4 py-3 rounded-xl text-xs text-[#121212] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
                  placeholder="How can we assist your fragrance journey today?"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#121212] hover:bg-[#D4AF37] text-white hover:text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] disabled:opacity-70 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Send Private Inquiry
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* ── 3. French Establishments ("Jennyd Scents en France") Section ── */}
      <section className="bg-[#0B0B0B] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-2 border-[#D4AF37]/40 w-full text-white">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center mb-12 sm:mb-16 flex flex-col items-center space-y-2">
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold block font-sans">
              Nos Établissements & Parfumerie de Grasse
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-normal tracking-wide">
              Jennyd Scents en France
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto font-sans leading-relaxed mt-1">
              Discover our French headquarters, international export distribution hubs, and perfume formulation laboratories in Grasse.
            </p>
            <div className="h-[2px] w-16 bg-[#D4AF37] mt-3 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* 1. Siège social */}
            <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 hover:border-[#D4AF37]/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)] transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] font-sans">Siège social</span>
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                    <Building className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">JENNYD SCENTS</h3>
                  <span className="text-xs text-neutral-400">France HQ</span>
                </div>
                <div className="border-t border-neutral-800 pt-4 text-xs text-neutral-400 leading-relaxed font-sans space-y-1">
                  <p>18 Avenue des Parfums</p>
                  <p>06130 Grasse</p>
                  <p className="font-semibold text-white">France</p>
                </div>
              </div>
            </div>

            {/* 2. Division Export */}
            <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 hover:border-[#D4AF37]/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)] transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] font-sans">Division Export</span>
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                    <Plane className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">JENNYD SCENTS</h3>
                  <span className="text-xs text-neutral-400">International Logistics</span>
                </div>
                <div className="border-t border-neutral-800 pt-4 text-xs text-neutral-400 leading-relaxed font-sans space-y-1">
                  <p>Entrepôt de Distribution</p>
                  <p>Zone de Fret Aéroportuaire</p>
                  <p>95700 Roissy-en-France</p>
                  <p className="font-semibold text-white">Île-de-France, France</p>
                </div>
              </div>
            </div>

            {/* 3. Site de fabrication */}
            <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 hover:border-[#D4AF37]/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)] transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] font-sans">Site de fabrication</span>
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">JENNYD SCENTS</h3>
                  <span className="text-xs text-neutral-400">Perfume Lab</span>
                </div>
                <div className="border-t border-neutral-800 pt-4 text-xs text-neutral-400 leading-relaxed font-sans space-y-1">
                  <p>Parc des Parfumeurs</p>
                  <p>145 Boulevard de la Création</p>
                  <p>06130 Grasse</p>
                  <p className="font-semibold text-white">Provence-Alpes-Côte d'Azur, France</p>
                </div>
              </div>
            </div>

            {/* 4. Usine de fabrication n°01 */}
            <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 hover:border-[#D4AF37]/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)] transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] font-sans">Usine n°01</span>
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                    <Factory className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">JENNYD SCENTS</h3>
                  <span className="text-xs text-neutral-400">Production Unit</span>
                </div>
                <div className="border-t border-neutral-800 pt-4 text-xs text-neutral-400 leading-relaxed font-sans space-y-1">
                  <p>Parc des Parfumeurs</p>
                  <p>145 Boulevard de la Création</p>
                  <p>06130 Grasse</p>
                  <p className="font-semibold text-white">Provence-Alpes-Côte d'Azur, France</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

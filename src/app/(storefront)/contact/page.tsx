"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for form submission
    setTimeout(() => {
      setIsSubmitting(false);
      addToast({ 
        title: "Message Sent", 
        message: "Thank you for reaching out. We will get back to you shortly.", 
        type: "success" 
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/product image 1.jpeg" // Using a premium product image as background
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="text-white/70 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">
            We're Here to Help
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif mb-6">Get in Touch</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Whether you have a question about our exquisite fragrances, need assistance with your order, or simply want to explore our signature collections, our dedicated team is at your service.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-background flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Email Us</h3>
                  <a href="mailto:support@jennyd.com" className="text-gray-600 hover:text-black transition-colors">
                    support@jennyd.com
                  </a>
                  <p className="text-sm text-gray-500 mt-1">We aim to reply within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-background flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Call Us</h3>
                  <a href="tel:+919876543210" className="text-gray-600 hover:text-black transition-colors">
                    +91 98765 43210
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri, 10am to 6pm (IST)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-background flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Visit Our Boutique</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Jennyd Flagship Store<br />
                    123 Fragrance Avenue, Luxury District<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl border border-gray-100">
            <h3 className="text-2xl font-serif mb-8">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-gray-500">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder="How can we help you?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
      
    </div>
  );
}

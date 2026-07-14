"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Heart, Compass, CheckCircle2, Eye, Award, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-background overflow-hidden pb-20 font-sans text-gray-800">
      
      {/* 1. Elegant Hero Section */}
      <section className="relative w-full h-[45vh] md:h-[55vh] bg-black flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/about_hero_bg.png"
          alt="Jennyd Scents Luxury Hero"
          fill
          priority
          className="object-cover opacity-60 animate-fade-in"
        />
        {/* Gold-infused dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center gap-4">
          <span className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs sm:text-sm font-bold">
            Jennyd Scents
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white tracking-wide font-normal leading-tight px-2">
            Luxury with a Purpose
          </h1>
          <div className="h-[1.5px] w-24 bg-[#D4AF37] mt-1" />
        </div>
      </section>

      {/* 2. Editorial Section: Introduction */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Image Column */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] bg-gray-150 border border-black/5 overflow-hidden shadow-2xl group rounded-2xl">
            <Image
              src="/assets/product image 1.jpeg"
              alt="Jennyd Premium Perfume"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Text Narrative Column */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 text-left">
            <div className="flex flex-col gap-2">
              <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs sm:text-sm font-bold">Our Essence</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight font-normal text-foreground">
                More Than Niche Fragrances
              </h2>
            </div>
            
            <p className="text-gray-650 text-base sm:text-lg leading-relaxed font-light">
              At Jennyd Scents, we believe that true success is measured not only by the fragrances we create but also by the positive impact we leave on society. We are more than a premium non-alcoholic & alcoholic fragrance company—we are a purpose-driven organization committed to blending luxury, compassion, sustainability, and social responsibility into everything we do.
            </p>
            
            <p className="text-gray-650 text-base sm:text-lg leading-relaxed font-light">
              Inspired by the timeless beauty of nature, spirituality, and the uniqueness of every individual, Jennyd Scents creates exceptional fragrances that celebrate identity, confidence, and self-expression. Every bottle is carefully crafted using premium ingredients to deliver an elegant, long-lasting fragrance experience while remaining gentle on the skin and suitable for everyday wear.
            </p>

            <p className="text-gray-650 text-base sm:text-lg leading-relaxed font-light">
              Our vision extends far beyond the perfume industry. We believe that every business has a responsibility to contribute to society, empower communities, and create opportunities for people to live with dignity and hope. Profit alone is never our destination—it is a resource that enables us to serve humanity.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Section: Our Responsibility (Beauty with a Purpose) */}
      <section className="py-12 sm:py-16 md:py-24 bg-secondary-background border-y border-gray-150">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Text Narrative Column */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 text-left order-2 lg:order-1">
              <div className="flex flex-col gap-2">
                <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs sm:text-sm font-bold">Our Responsibility</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight font-normal text-foreground">
                  Beauty with a Purpose
                </h2>
              </div>
              
              <p className="text-gray-650 text-base sm:text-lg leading-relaxed font-light">
                Jennyd Scents is committed to creating meaningful social impact. A portion of the profits generated from our products is dedicated to supporting humanitarian initiatives that improve lives and restore hope.
              </p>
              
              <p className="text-gray-650 text-base sm:text-lg leading-relaxed font-light">
                One of our primary missions is to support organizations working toward the reconstructive surgery, rehabilitation, counseling, education, skill development, and social reintegration of acid attack survivors. Through responsible partnerships and charitable initiatives, we aim to help survivors rebuild their confidence, independence, and future.
              </p>

              <p className="text-gray-650 text-base sm:text-lg leading-relaxed font-light">
                We recognize that healing extends beyond medical treatment. Emotional support, education, financial empowerment, and community acceptance are equally important. Our mission is to contribute wherever meaningful assistance can make a lasting difference.
              </p>
            </div>

            {/* Image Column */}
            <div className="lg:col-span-5 relative w-full aspect-[4/5] bg-gray-150 border border-black/5 overflow-hidden shadow-2xl group rounded-2xl order-1 lg:order-2">
              <Image
                src="/assets/product image 3.jpeg"
                alt="Jennyd Scents Commitment"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section: Social Commitments */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 flex flex-col gap-3">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs sm:text-sm font-bold">Our Commitments</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-foreground">Our Social Commitments</h2>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">
            We are dedicated to building a sustainable, ethical, and inclusive brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 sm:gap-y-6 max-w-4xl mx-auto px-2">
          {[
            "Supporting rehabilitation and empowerment initiatives for acid attack/ burn survivors through responsible charitable partnerships.",
            "Promoting dignity, equality, and inclusion for every individual.",
            "Encouraging women empowerment through employment, entrepreneurship, and leadership opportunities.",
            "Supporting education and skill development initiatives for underprivileged communities.",
            "Promoting environmentally responsible manufacturing and sustainable business practices.",
            "Encouraging recycling and responsible packaging.",
            "Following cruelty-free practices and respecting animal welfare.",
            "Supporting ethical sourcing wherever possible.",
            "Creating business opportunities that help individuals become financially independent.",
            "Inspiring customers to become part of a movement where every purchase contributes toward positive social impact."
          ].map((commitment, idx) => (
            <div key={idx} className="flex gap-4 items-start text-left">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="text-gray-650 text-sm sm:text-base leading-relaxed font-light">
                {commitment}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Section: Vision, Mission & Promise (Three Cards) */}
      <section className="py-12 sm:py-16 bg-secondary-background border-y border-gray-150 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Vision */}
            <div className="bg-white p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col items-center text-center gap-4 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary-background flex items-center justify-center text-[#D4AF37]">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-foreground uppercase tracking-wide">Our Vision</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                To become one of the world's most trusted fragrance brands by creating luxurious products that inspire confidence while making a meaningful and lasting contribution to society.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col items-center text-center gap-4 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary-background flex items-center justify-center text-[#D4AF37]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-foreground uppercase tracking-wide">Our Mission</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                To craft premium, non-alcoholic fragrances of exceptional quality while building a socially responsible company that transforms lives through compassion, sustainability, ethical business practices, and community empowerment.
              </p>
            </div>

            {/* Promise */}
            <div className="bg-white p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col items-center text-center gap-4 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-secondary-background flex items-center justify-center text-[#D4AF37]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-foreground uppercase tracking-wide">Our Promise</h3>
              <p className="text-xs sm:text-sm text-[#D4AF37] font-semibold tracking-wider uppercase mb-1">
                Wear Luxury. Share Hope. Inspire Change.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light">
                Jennyd Scents — Where Every Fragrance Carries a Purpose.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Section: Philosophy & Call To Action */}
      <section className="py-8 px-4 md:px-8 max-w-[1280px] mx-auto w-full mt-8 sm:mt-12">
        <div className="relative w-full rounded-3xl overflow-hidden bg-foreground text-background flex items-center border border-black/5 py-12 sm:py-16 md:py-20 px-4 sm:px-10 md:px-16 text-center justify-center shadow-lg">
          <Image
            src="/assets/about_cta_bg.png"
            alt="Jennyd Scents Philosophy background"
            fill
            className="object-cover opacity-20 object-center"
          />
          {/* Subtle vignette layer */}
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-4">
            <span className="text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] px-4 py-1.5 bg-white/10 rounded-full flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" /> Our Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight font-normal text-white max-w-xl">
              Luxury should inspire more than admiration—it should inspire kindness.
            </h2>
            <p className="text-gray-350 font-light text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mb-4">
              Every fragrance tells a story. Every purchase creates opportunity. Every customer becomes a partner in creating hope. When you choose Jennyd Scents, you are supporting a vision that believes businesses should uplift communities, empower lives, and create a better future for generations to come. Together, we can prove that compassion and luxury can exist side by side.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products">
                <Button className="bg-[#D4AF37] text-white hover:bg-white hover:text-black rounded-none px-8 py-3.5 uppercase tracking-widest text-[10px] font-bold transition-all shadow-md">
                  Explore Shop
                </Button>
              </Link>
              <Link href="/#zodiac">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none px-8 py-3.5 uppercase tracking-widest text-[10px] font-bold transition-all">
                  Zodiac Matcher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Utensils, 
  GraduationCap, 
  Droplet, 
  Activity, 
  Trees, 
  Compass, 
  Home as HomeIcon, 
  ChevronRight, 
  X, 
  Eye, 
  Maximize2, 
  Share2, 
  Building2, 
  FileText,
  UserPlus,
  HeartHandshake,
  ShoppingBag,
  Send,
  Loader2
} from "lucide-react";

// Helper to render ampersand (&) in crisp sans-serif font across titles and headings
const renderCleanText = (text: string) => {
  if (!text) return "";
  if (typeof text !== "string" || !text.includes("&")) return text;
  const parts = text.split("&");
  return (
    <>
      {parts.map((part, idx) => (
        <span key={idx}>
          {part}
          {idx < parts.length - 1 && (
            <span className="font-sans font-medium text-[#D4AF37] px-0.5 inline-block">&amp;</span>
          )}
        </span>
      ))}
    </>
  );
};

// Social Reforms Data Array
const MOVEMENTS_DATA = [
  {
    id: "acid-attack",
    code: "SR-001",
    isFeatured: true,
    title: "Acid Attack & Burn Survivors Rehabilitation Reform",
    motto: "Every Fragrance Creates Hope. Scars Never Define Human Worth.",
    image: "/assets/acid-attack.jpeg",
    category: "Survivor Healing & Dignity",
    filterGroup: "survivor",
    icon: Heart,
    summary: "Dedicated to supporting acid attack and burn survivors with emergency medical care, reconstructive surgeries, psychological healing, and vocational confidence.",
    targetImpact: "10,000+ Survivor Surgeries & Restorative Procedures Funded",
    partnerScope: "Partnering with Apex Burn Centers, AIIMS Plastic Surgery Wings, & Registered Survivor Trusts",
    content: `At JENNYD SCENTS, we believe that true human dignity is not defined by appearance—it is forged through courage, resilience, and the strength to overcome life's greatest adversities. Every fragrance we create is more than a luxury statement; it is a corporate promise to stand beside survivors of acid violence and severe burns.

The Acid Attack & Burn Survivors Rehabilitation Reform is dedicated to restoring health, confidence, and independence. Behind every survivor is a story of extraordinary bravery and an unwavering resolve to rebuild their future.

Recovery from severe burn trauma requires extensive medical intervention spanning reconstructive surgeries, skin grafting, physical therapy, pain management, ocular support, specialized psychological counseling, and long-term vocational retraining.

Through the JENNYD GLOBAL FOUNDATION, a dedicated portion of proceeds directly funds partner hospital burn units, reconstructive surgical teams, and community reintegration programs.`,
    initiatives: [
      "Reconstructive and restorative surgical procedures",
      "Specialized burn treatment & skin grafting care",
      "Emergency medical assistance & pain management",
      "Psychological counseling & emotional trauma therapy",
      "Vision, hearing, and physical mobility rehabilitation",
      "Educational scholarships & vocational skill training",
      "Livelihood grants and self-employment startup aid",
      "Legal advocacy, survivor protection & social inclusion"
    ]
  },
  {
    id: "food-for-all",
    code: "SR-002",
    title: "Food Security & Hunger Relief Reform",
    motto: "Wear a Fragrance. Share a Meal. Feed a Life. Drive Change.",
    image: "/assets/beauty-with-purpose.jpeg",
    category: "Hunger Relief & Nutrition",
    filterGroup: "health-meals",
    icon: Utensils,
    summary: "Providing nutritious daily meals, supporting community kitchens, food banks, and school feeding initiatives for vulnerable families.",
    targetImpact: "50,000+ Fresh Nutritious Meals Distributed Annually",
    partnerScope: "Partnering with Akshaya Patra, Robin Hood Army, & Verified Food Banks",
    content: `At JENNYD SCENTS, we believe that access to wholesome food is a fundamental human right. Malnutrition affects childhood development, school attendance, and adult productivity.

The Food Security & Hunger Relief Reform was established to eliminate hunger in underprivileged communities. We believe that no child should go to bed hungry and no family should face nutritional deprivation.

A portion of proceeds from every bottle sold funds daily meals at community kitchens, emergency food distribution in crisis zones, and school meal programs.`,
    initiatives: [
      "Community kitchen operations & daily meal distribution",
      "School meal programs for underprivileged children",
      "Emergency food packet supply in disaster zones",
      "Essential nutrition kits for expectant mothers & seniors",
      "Sustainable agricultural support for rural farming families"
    ]
  },
  {
    id: "education-for-all",
    code: "SR-003",
    title: "Education & Digital Literacy Reform",
    motto: "Wear a Fragrance. Fund Education. Empower Tomorrow's Leaders.",
    image: "/assets/education-for-all.jpeg",
    category: "Education & Literacy",
    filterGroup: "education",
    icon: GraduationCap,
    summary: "Funding scholarships, school supplies, computer labs, teacher training, and modern classroom development for children in need.",
    targetImpact: "15,000+ Students Supported with Scholarships & Digital Labs",
    partnerScope: "Partnering with Pratham, Teach For India, & Rural School Trusts",
    content: `At JENNYD SCENTS, we view education as the single most powerful tool for breaking cycles of poverty. When a child learns to read, write, and think critically, an entire generation transforms.

Millions of children face educational barriers due to poverty, lack of school infrastructure, or social inequality. The Education & Digital Literacy Reform ensures that every child receives quality schooling regardless of background.

Proceeds fund merit-and-need scholarships, textbooks, uniforms, computer labs, and teacher empowerment workshops in underserved regions.`,
    initiatives: [
      "Scholarship funds for underprivileged students",
      "Distribution of textbooks, uniforms, and learning kits",
      "Solar-powered computer labs & digital classrooms",
      "School building repairs & sanitation facility construction",
      "Vocational & technical training programs for youth"
    ]
  },
  {
    id: "fresh-water",
    code: "SR-004",
    title: "Clean Water & Environmental Sanitation Reform",
    motto: "Protect Every Drop, Refresh Every Life, Build a Healthier World.",
    image: "/assets/fresh-water-movement.jpeg",
    category: "Clean Water & Sanitation",
    filterGroup: "environment",
    icon: Droplet,
    summary: "Constructing clean water borewells, rainwater harvesting systems, water purification plants, and sanitation facilities in drought-prone villages.",
    targetImpact: "100+ Clean Water Wells & Purification Plants Installed",
    partnerScope: "Partnering with WaterAid, Frank Water, & Village Panchayats",
    content: `Clean drinking water gives life, prevents waterborne diseases, and frees women and children from spending hours fetching water daily.

The Clean Water & Environmental Sanitation Reform constructs deep water wells, installs filtration plants, and implements rainwater harvesting systems in water-scarce villages.

We ensure that every water installation is community-managed, sustainable, and regularly tested for safety.`,
    initiatives: [
      "Deep borewell drilling & solar water pump installation",
      "Community RO water purification plant setups",
      "Rainwater harvesting & groundwater recharge units",
      "School sanitation blocks & hygiene education camps",
      "Water testing & community maintenance training"
    ]
  },
  {
    id: "blood-for-all",
    code: "SR-005",
    title: "Blood Donation & Emergency Healthcare Reform",
    motto: "Wear a Fragrance. Donate Blood. Save Lives.",
    image: "/assets/blood-movement.jpeg",
    category: "Emergency Medical Care",
    filterGroup: "health-meals",
    icon: Activity,
    summary: "Organizing voluntary blood donation drives, supporting mobile blood collection vans, and strengthening regional blood bank infrastructure.",
    targetImpact: "25,000+ Voluntary Blood Units Collected & Donated",
    partnerScope: "Partnering with Red Cross Blood Banks & Rotary Blood Centers",
    content: `In medical emergencies—trauma accidents, major surgeries, childbirth complications, and cancer treatments—timely blood transfusions are the difference between life and death.

The Blood Donation & Emergency Healthcare Reform mobilizes voluntary donors, funds air-conditioned mobile blood collection vans, and supports cold-chain storage facilities for blood banks.

We operate 24/7 donor helplines to connect critical patients with verified voluntary donors.`,
    initiatives: [
      "Voluntary blood donation camps in corporate & university hubs",
      "Mobile blood collection vans equipped with modern storage",
      "24/7 emergency blood helpline & rare-group donor networks",
      "Blood bank refrigeration & testing equipment funding",
      "Public awareness drives on regular voluntary blood donation"
    ]
  },
  {
    id: "green-earth",
    code: "SR-006",
    title: "Reforestation & Climate Stewardship Reform",
    motto: "Wear a Fragrance. Plant Hope. Grow a Greener Earth.",
    image: "/assets/green-earth.jpeg",
    category: "Environment & Reforestation",
    filterGroup: "environment",
    icon: Trees,
    summary: "Planting native trees, restoring degraded forest corridors, funding river cleanups, and reducing plastic waste across supply chains.",
    targetImpact: "100,000+ Native Trees Planted & Nurtured",
    partnerScope: "Partnering with SankalpTaru, Isha Agroforestry, & Forest Departments",
    content: `Our commitment to luxury includes an uncompromising responsibility toward environmental sustainability and biodiversity protection.

The Reforestation & Climate Stewardship Reform funds large-scale tree plantation drives, restores native forest ecosystems, cleans river basins, and enforces eco-friendly glass and recyclable packaging.

Every tree planted is geo-tagged and nurtured until maturity to ensure 95%+ survival rates.`,
    initiatives: [
      "Miyawaki urban forest creation & native tree planting",
      "Reforestation of degraded forest corridors & catchment areas",
      "River bank cleanup & plastic waste recycling initiatives",
      "Zero-plastic packaging transition across corporate supply chains",
      "Youth environmental workshops & eco-club funding"
    ]
  },
  {
    id: "tribal-support",
    code: "SR-007",
    title: "Tribal Community & Indigenous Heritage Reform",
    motto: "Wear a Fragrance. Support Tribes. Preserve Heritage.",
    image: "/assets/tribal-support.jpeg",
    category: "Indigenous Empowerment",
    filterGroup: "education",
    icon: Compass,
    summary: "Empowering indigenous tribal communities with mobile healthcare, school support, artisan skill development, and traditional craft promotion.",
    targetImpact: "30+ Tribal Villages Empowered with Healthcare & Artisan Aid",
    partnerScope: "Partnering with Ekal Abhiyan, TRIFED, & Tribal Welfare Trusts",
    content: `Indigenous tribal communities have preserved nature, ancient herbal wisdom, and traditional crafts for centuries, yet often lack basic medical care and schooling.

The Tribal Community & Indigenous Heritage Reform delivers mobile healthcare clinics, establishes community learning centers, and creates fair-market avenues for traditional tribal handicrafts.

We honor their heritage while helping families achieve economic independence and dignity.`,
    initiatives: [
      "Mobile healthcare vans & free medicines for remote tribal belts",
      "Tribal children learning centers & textbook distribution",
      "Artisan skill enhancement & fair-trade handicraft marketing",
      "Organic wild-herb harvesting & sustainable forest produce aid",
      "Indigenous culture & traditional art preservation funds"
    ]
  },
  {
    id: "women-empowerment",
    code: "SR-008",
    title: "Women Empowerment & Gender Equality Reform",
    motto: "Wear a Fragrance. Empower Women. Inspire Change.",
    image: "/assets/women-empowerment.jpeg",
    category: "Gender Equality",
    filterGroup: "education",
    icon: Users,
    summary: "Fostering financial independence, vocational training, micro-entrepreneurship grants, menstrual health hygiene, and leadership for women.",
    targetImpact: "20,000+ Women Trained in Vocational & Financial Skills",
    partnerScope: "Partnering with SEWA, Mann Deshi Foundation, & Women Self-Help Groups",
    content: `When a woman becomes financially independent, she invests in her family's health, education, and community well-being.

The Women Empowerment & Gender Equality Reform provides vocational training, micro-grants for female entrepreneurs, financial literacy workshops, and free sanitary product distribution.

We empower women to become self-reliant business owners, skilled artisans, and community leaders.`,
    initiatives: [
      "Vocational training in tailoring, handicrafts & digital skills",
      "Micro-entrepreneurship seed grants for women-led startups",
      "Menstrual hygiene awareness & free sanitary kit distribution",
      "Financial literacy & digital banking workshops",
      "Legal awareness, safety, and self-defense training programs"
    ]
  },
  {
    id: "medical-support",
    code: "SR-009",
    title: "Universal Medical Support & Surgical Aid Reform",
    motto: "Wear a Fragrance. Support Healthcare. Save Lives.",
    image: "/assets/medical-support.jpeg",
    category: "Universal Healthcare",
    filterGroup: "health-meals",
    icon: ShieldCheck,
    summary: "Organizing free rural medical camps, funding critical surgeries for low-income patients, providing lifesaving medicines, and upgrading rural clinics.",
    targetImpact: "5,000+ Free Patient Surgeries & Diagnosis Camps Executed",
    partnerScope: "Partnering with Narayana Hrudayalaya, Tata Memorial, & Rural Clinics",
    content: `No family should face financial catastrophe or lose a loved one simply because they cannot afford essential medical diagnosis or surgery.

The Universal Medical Support & Surgical Aid Reform organizes free medical checkup camps, funds cardiac, pediatric, and oncological surgeries for underprivileged patients, and donates equipment to rural clinics.

Our dedicated medical review panel ensures swift fund disbursement for life-critical cases.`,
    initiatives: [
      "Free medical diagnostic & specialist health camps in rural areas",
      "Surgical assistance funds for low-income cardiac & oncology cases",
      "Essential lifesaving medicine distribution to needy patients",
      "Maternal healthcare, child vaccination & infant nutrition drives",
      "Oxygen concentrator & diagnostic machine donations to rural clinics"
    ]
  },
  {
    id: "shelter-creation",
    code: "SR-010",
    title: "Dignified Housing & Emergency Shelter Reform",
    motto: "Wear a Fragrance. Build Shelters. Create Better Tomorrows.",
    image: "/assets/shelter-creation.jpeg",
    category: "Housing & Dignity",
    filterGroup: "survivor",
    icon: HomeIcon,
    summary: "Constructing low-cost durable homes, waterproofing unsafe living spaces, and setting up emergency disaster relief shelters during floods.",
    targetImpact: "1,000+ Safe Weatherproof Homes & Disaster Shelters Built",
    partnerScope: "Partnering with Habitat for Humanity & Disaster Relief Forces",
    content: `A safe, clean home provides the security, privacy, and health foundation necessary for families to thrive with dignity.

The Dignified Housing & Emergency Shelter Reform constructs low-cost, durable homes for underprivileged families, repairs dilapidated shelters, and deploys emergency relief tents during natural disasters.

Every housing unit is integrated with clean water access, solar lighting, and proper sanitation.`,
    initiatives: [
      "Low-cost, durable house construction for homeless families",
      "Roof repair & waterproofing for dilapidated informal shelters",
      "Emergency disaster relief shelter setup during floods & cyclones",
      "Solar home lighting & clean sanitation unit installation",
      "Community center development for children & senior citizens"
    ]
  }
];

export default function SocialImpactPage() {
  const [selectedMovement, setSelectedMovement] = useState<any>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedLink, setCopiedLink] = useState(false);

  // Volunteer Modal State
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isVolunteerSubmitting, setIsVolunteerSubmitting] = useState(false);
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [volunteerAppId, setVolunteerAppId] = useState("");
  const [volunteerForm, setVolunteerForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    reformInterest: "Acid Attack & Burn Survivors Rehabilitation Reform",
    availability: "Weekend Drives",
    message: ""
  });

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVolunteerSubmitting(true);

    const appId = `VOL-${Math.floor(100000 + Math.random() * 900000)}`;
    setVolunteerAppId(appId);

    try {
      await supabase.from("volunteer_applications").insert([
        {
          application_id: appId,
          full_name: volunteerForm.fullName,
          email: volunteerForm.email,
          phone: volunteerForm.phone,
          city: volunteerForm.city,
          reform_interest: volunteerForm.reformInterest,
          availability: volunteerForm.availability,
          message: volunteerForm.message,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      // Gracefully continue to show success modal
    }

    setTimeout(() => {
      setIsVolunteerSubmitting(false);
      setVolunteerSubmitted(true);
    }, 800);
  };

  const featuredMovement = MOVEMENTS_DATA[0]; // Acid attack survivors reform

  const filteredMovements = activeFilter === "all" 
    ? MOVEMENTS_DATA 
    : MOVEMENTS_DATA.filter(m => m.filterGroup === activeFilter);

  const handleShare = (movementTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: movementTitle,
        text: `Explore ${movementTitle} at Jennyd Scents Social Reforms Foundation.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans text-neutral-800 selection:bg-[#D4AF37] selection:text-black">
      
      {/* ── 1. Hero Section ── */}
      <section className="relative w-full py-20 sm:py-24 bg-[#0A0A0A] text-white border-b-2 border-[#D4AF37]/50 overflow-hidden">
        {/* Ambient Gold Radial Backlight Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Corporate Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>JENNYD GLOBAL FOUNDATION • CORPORATE SOCIAL REFORMS</span>
          </div>

          {/* Page Title with Standardized High-End Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white font-normal tracking-wide leading-tight">
            {renderCleanText("Social Reforms & Global Impact")}
          </h1>

          <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-sans font-light leading-relaxed">
            Driving measurable, transparent social transformation worldwide. Every luxury fragrance bottle directly funds survivor surgeries, education, food security, clean water, and environmental restoration.
          </p>

          {/* Impact Metric Cards Bar */}
          <div className="pt-3 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center shadow-lg">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">100%</span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1 block">Direct Impact Pledged</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center shadow-lg">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">10,000+</span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1 block">Surgeries & Medical Aid</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center shadow-lg">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">50,000+</span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1 block">Meals & Education Kits</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center shadow-lg">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">100+</span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1 block">Clean Water Borewells</span>
            </div>
          </div>

          {/* Unified Button Styling */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#featured-movement" 
              className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-2 active:scale-98"
            >
              Explore Flagship Reform
            </a>
            <a 
              href="#all-movements" 
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest border border-white/20 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-98"
            >
              View All 10 Social Reforms
            </a>
          </div>

          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-4" />
        </div>
      </section>

      {/* ── 2. Corporate Governance & CSR Pledge Section ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white p-6 sm:p-12 rounded-2xl border border-[#EAE7E1] shadow-xl text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
            Corporate Social Responsibility (CSR) Pledge
          </span>

          <h2 className="text-2xl sm:text-4xl font-serif text-[#121212] leading-snug font-normal">
            Luxury Beyond Scent — A Pledge to Humanity
          </h2>

          <p className="text-neutral-600 text-xs sm:text-sm md:text-base leading-relaxed font-sans max-w-3xl mx-auto font-light">
            At JENNYD SCENTS, our business governance is anchored in social accountability. Profit is not our final destination; it is a resource deployed toward human dignity. A pre-allocated percentage of proceeds from every bottle sold is directly committed toward survivor surgeries, clean drinking water, education, emergency medical care, and environmental stewardship.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">100% Pledged Allocation</h4>
              <p className="text-[11px] text-neutral-500 font-light leading-relaxed">Direct deployment to healthcare, surgeries, and verified NGO projects without administrative deductions.</p>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1.5">
              <Building2 className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">Apex Medical Partners</h4>
              <p className="text-[11px] text-neutral-500 font-light leading-relaxed">Collaborating directly with AIIMS Plastic Surgery Wings, Apex Burn Centers, and Red Cross Blood Banks.</p>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 space-y-1.5">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="text-xs font-bold text-[#121212] uppercase tracking-wider">Audited Impact Reports</h4>
              <p className="text-[11px] text-neutral-500 font-light leading-relaxed">Fully audited, transparent case files and beneficiary tracking metrics for every initiative.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ⭐ Flagship Social Reform Spotlight ── */}
      <section id="featured-movement" className="py-16 sm:py-24 bg-[#0A0A0A] text-white border-y-2 border-[#D4AF37]/50 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-black font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>⭐ FLAGSHIP SOCIAL REFORM • CODE: SR-001</span>
            </div>
            <span className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase font-sans">
              JENNYD GLOBAL FOUNDATION
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: High-Res Poster Display Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-[#121212] p-4 rounded-2xl border-2 border-[#D4AF37]/50 shadow-2xl group">
                <div className="relative w-full h-[380px] sm:h-[450px] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-neutral-800">
                  <Image
                    src={featuredMovement.image}
                    alt={featuredMovement.title}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-103"
                    priority
                  />
                  <button
                    onClick={() => setLightboxImage(featuredMovement.image)}
                    className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-xl border border-white/20 transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                    title="View Full Screen Poster"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Expand Poster</span>
                  </button>
                </div>
                
                <div className="mt-3 flex items-center justify-between px-1 text-xs font-sans">
                  <span className="text-[#D4AF37] font-bold uppercase tracking-widest text-[10px]">SURVIVOR REHABILITATION</span>
                  <button 
                    onClick={() => setSelectedMovement(featuredMovement)}
                    className="text-white hover:text-[#D4AF37] flex items-center gap-1 font-semibold transition-colors cursor-pointer text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Case Study</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative & Initiatives */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] block">
                  FLAGSHIP INITIATIVE
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-normal leading-tight">
                  {renderCleanText("Acid Attack & Burn Survivors Rehabilitation Reform")}
                </h2>
                <p className="text-[#D4AF37] text-sm sm:text-base font-serif italic border-l-2 border-[#D4AF37] pl-3 py-0.5">
                  "{featuredMovement.motto}"
                </p>
              </div>

              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-sans font-light">
                At JENNYD SCENTS, we believe that true human beauty is defined by courage, resilience, and compassion. Every fragrance we create is a corporate promise to stand beside survivors of acid attacks and severe burns as they undergo reconstructive surgeries, medical rehabilitation, psychological counseling, and social reintegration.
              </p>

              {/* Scope Box */}
              <div className="bg-[#141414] p-5 sm:p-6 rounded-xl border border-neutral-800 space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  Key Medical & Livelihood Scope Supported:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-neutral-300 font-sans">
                  {featuredMovement.initiatives.slice(0, 8).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href="/products">
                  <button className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg active:scale-98">
                    <span>Shop & Support This Reform</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button 
                  onClick={() => setSelectedMovement(featuredMovement)}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest border border-white/20 transition-all duration-300 cursor-pointer active:scale-98"
                >
                  Read Full Reform Case Study
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── 4. All 10 Social Reform Initiatives Grid ── */}
      <section id="all-movements" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
            Comprehensive Impact Portfolio
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#121212] font-normal">
            Our 10 Social Reform Initiatives
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm font-sans leading-relaxed">
            Select an initiative below to inspect its scope, target metrics, and case study details.
          </p>
          <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mt-3" />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-sans text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "all" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            All Reforms (10)
          </button>
          <button
            onClick={() => setActiveFilter("survivor")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "survivor" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            Survivor & Housing
          </button>
          <button
            onClick={() => setActiveFilter("health-meals")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "health-meals" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            Health & Nutrition
          </button>
          <button
            onClick={() => setActiveFilter("education")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "education" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            Education & Women
          </button>
          <button
            onClick={() => setActiveFilter("environment")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "environment" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            Water & Environment
          </button>
        </div>

        {/* Alternating Image & Content Row Sections (Clean Crystal-Clear Posters) */}
        <div className="space-y-12 sm:space-y-16">
          {filteredMovements.map((movement, index) => {
            const isEven = index % 2 === 0;
            const IconComp = movement.icon;
            return (
              <div 
                key={movement.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-5 sm:p-8 lg:p-10 rounded-3xl border border-[#EAE7E1] shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Poster Image Column (5 Cols - Clean Unobscured Image) */}
                <div className={`lg:col-span-5 relative w-full ${isEven ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}>
                  <div 
                    onClick={() => setLightboxImage(movement.image)}
                    className="relative w-full aspect-[4/5] bg-[#FAF8F5] p-2.5 sm:p-3 rounded-2xl border border-[#EAE7E1] shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden"
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-neutral-200">
                      <Image
                        src={movement.image}
                        alt={movement.title}
                        fill
                        className="object-contain p-1 group-hover:scale-103 transition-transform duration-500"
                      />
                      
                      {/* Floating Expand Poster Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImage(movement.image);
                        }}
                        className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-xl border border-white/20 transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                        title="View Full Screen Poster"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span className="hidden sm:inline text-[11px]">View Poster</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text Narrative Column (7 Cols) */}
                <div className={`lg:col-span-7 flex flex-col gap-4 sm:gap-5 text-left ${
                  isEven ? "order-2 lg:order-2" : "order-2 lg:order-1"
                }`}>
                  
                  {/* Category & Flagship Badges Header */}
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="bg-[#121212] text-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs border border-[#D4AF37]/30">
                        <IconComp className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{renderCleanText(movement.category)}</span>
                      </div>
                      {movement.isFeatured && (
                        <div className="bg-[#D4AF37] text-black px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                          ★ Flagship Reform
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-mono text-neutral-400 font-bold">CODE: {movement.code}</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-tight font-normal text-[#121212]">
                      {renderCleanText(movement.title)}
                    </h3>
                    <p className="text-[#D4AF37] text-xs sm:text-sm font-serif italic font-semibold">
                      "{renderCleanText(movement.motto)}"
                    </p>
                  </div>

                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-light font-sans">
                    {renderCleanText(movement.summary)}
                  </p>

                  {/* Core Initiatives List */}
                  {movement.initiatives && (
                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                        Core Reform Directives:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                        {movement.initiatives.slice(0, 4).map((init, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                            <span className="font-light">{renderCleanText(init)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Impact Metric */}
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE7E1] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-sans gap-1">
                    <span className="font-bold text-neutral-800">Target Impact Goal:</span>
                    <span className="text-[#D4AF37] font-semibold">{renderCleanText(movement.targetImpact)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setSelectedMovement(movement)}
                      className="bg-[#121212] hover:bg-[#D4AF37] text-white hover:text-black font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md active:scale-98"
                    >
                      <span>Read Case Study</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <Link href="/products">
                      <button className="bg-white hover:bg-neutral-100 text-neutral-800 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest border border-neutral-300 transition-all duration-300 cursor-pointer active:scale-98">
                        Shop & Support
                      </button>
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ── 5. Philanthropy Architecture Section ── */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-y border-[#EAE7E1] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
              Transparent Philanthropy Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#121212] font-normal">
              How Your Purchase Drives Social Reforms
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-sans">
              Four seamless steps from perfume selection to verifiable community transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-serif">
                01
              </div>
              <h3 className="text-base font-serif font-bold text-[#121212]">Select Fragrance</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Choose your signature Extrait de Parfum or pure attar oil from our curated luxury collections.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-serif">
                02
              </div>
              <h3 className="text-base font-serif font-bold text-[#121212]">Automated Allocation</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                A fixed percentage of proceeds is automatically transferred to the Jennyd Social Reforms Fund.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-serif">
                03
              </div>
              <h3 className="text-base font-serif font-bold text-[#121212]">Direct Partner Fund</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Pledged funds disburse directly to partner hospital burn units, blood banks, and verified school trusts.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-serif">
                04
              </div>
              <h3 className="text-base font-serif font-bold text-[#121212]">Impact Verification</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Survivors receive medical care, children eat & learn, and communities rebuild with restored dignity.
              </p>
            </div>

          </div>

          {/* Corporate Commitment Statement Box */}
          <div className="bg-[#121212] text-white p-8 sm:p-12 rounded-2xl border border-[#D4AF37]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[#D4AF37] uppercase tracking-[0.25em] text-xs font-bold font-sans block">
                {renderCleanText("CORPORATE GOVERNANCE & TRANSPARENCY")}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif text-white font-normal">
                {renderCleanText("100% Direct Allocation to Verified Hospital & NGO Partners")}
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm font-sans leading-relaxed font-light">
                We work exclusively with registered hospital burn care units, food distribution trusts, blood donor networks, and accredited non-governmental organizations. Every rupee pledged directly funds patient surgeries, school meals, clean water wells, and environmental drives without administrative deductions.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link href="/products">
                <button className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg active:scale-98">
                  <span>Shop With Purpose</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5.5 Join Our Team & Volunteer Network Section ── */}
      <section id="join-team" className="py-16 sm:py-24 bg-white border-t border-[#EAE7E1] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
              <UserPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>JOIN THE MOVEMENT • VOLUNTEER & PARTNER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#121212] font-normal">
              Join Our Team as a Social Reform Volunteer
            </h2>
            <p className="text-neutral-600 text-xs sm:text-sm font-sans leading-relaxed max-w-2xl mx-auto font-light">
              Want to contribute your time, professional skills, or passion directly on the ground? Join the Jennyd Global Foundation volunteer network across India.
            </p>
            <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-3" />
          </div>

          {/* 4 Volunteer Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EAE7E1] space-y-3 hover:border-[#D4AF37] transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-2xl bg-[#121212] text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#121212]">Medical & Survivor Care</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed font-light">
                Plastic surgeons, nurses, counselors & burn rehab specialists aiding survivor recovery.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EAE7E1] space-y-3 hover:border-[#D4AF37] transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-2xl bg-[#121212] text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#121212]">Food & Meal Drives</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed font-light">
                Distributing daily fresh meals & managing community kitchen operations in local hubs.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EAE7E1] space-y-3 hover:border-[#D4AF37] transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-2xl bg-[#121212] text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#121212]">Education & Mentorship</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed font-light">
                Mentoring children, teaching digital literacy, and helping build computer labs.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EAE7E1] space-y-3 hover:border-[#D4AF37] transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-2xl bg-[#121212] text-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#121212]">Eco & Tree Stewards</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed font-light">
                Leading native tree planting drives, Miyawaki forests, & river cleanups.
              </p>
            </div>
          </div>

          {/* Banner CTA Box with Join As Volunteer & Shop To Help Buttons */}
          <div className="bg-[#0A0A0A] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] block font-sans">
                READY TO MAKE A DIRECT IMPACT?
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                Become a Jennyd Social Reform Volunteer Today
              </h3>
              <p className="text-neutral-300 text-xs sm:text-sm font-sans max-w-xl font-light leading-relaxed">
                Fill out our quick volunteer application or support our reforms directly by shopping our luxury fragrance collection.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
              <button
                onClick={() => {
                  setVolunteerSubmitted(false);
                  setIsVolunteerModalOpen(true);
                }}
                className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-extrabold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xl active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join As Volunteer</span>
              </button>

              <Link href="/products">
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest border border-white/20 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-98">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Shop to Help & Support</span>
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── 6. Foundational Philosophy & CTA Section ── */}
      <section className="py-20 sm:py-24 bg-[#0A0A0A] text-white text-center border-t-2 border-[#D4AF37]/50 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-4 border-b border-neutral-800 pb-10">
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
              Our Foundational Belief
            </span>
            <blockquote className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white leading-relaxed italic font-normal">
              "Success is most valuable when it is shared, and true luxury is measured not only by what we create, but by the positive social impact we leave behind."
            </blockquote>
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] pt-2 font-sans">
              — JENNYD GLOBAL FOUNDATION BOARD
            </p>
          </div>

          <div className="space-y-6 pt-2">
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
              Join The Social Reforms Movement
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
              Wear a Fragrance. Empower a Life.
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-sans leading-relaxed font-light">
              Every perfume bottle you purchase becomes an act of compassion, hope, and social transformation. Explore our luxury Extrait de Parfum and artisanal attars today.
            </p>
            <div className="pt-2">
              <Link href="/products">
                <button className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-extrabold px-9 py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-98">
                  EXPLORE LUXURY PERFUMES & MAKE AN IMPACT →
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── MNC Enhanced Case Study Modal Popup ── */}
      <AnimatePresence>
        {selectedMovement && (
          <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              className="bg-[#121212] max-w-5xl w-full rounded-3xl border border-[#D4AF37]/50 overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col lg:flex-row text-white font-sans"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMovement(null)}
                className="absolute top-4 right-4 bg-black/80 text-white p-2.5 rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer z-30 shadow-lg border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side (42%): Poster Art Gallery Display */}
              <div className="lg:w-[42%] bg-[#050505] p-6 sm:p-8 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-neutral-800 shrink-0">
                <div className="relative w-full h-[320px] sm:h-[420px] lg:h-full min-h-[350px] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 group">
                  <Image
                    src={selectedMovement.image}
                    alt={selectedMovement.title}
                    fill
                    className="object-contain p-2"
                  />
                  <button
                    onClick={() => setLightboxImage(selectedMovement.image)}
                    className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black p-2.5 rounded-xl border border-white/20 transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>View High-Res Lightbox</span>
                  </button>
                </div>
                
                <div className="mt-4 text-center space-y-1">
                  <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] block font-sans">
                    JENNYD GLOBAL FOUNDATION
                  </span>
                  <span className="text-neutral-400 text-xs font-mono block">
                    CODE: {selectedMovement.code} • {selectedMovement.category}
                  </span>
                </div>
              </div>

              {/* Right Side (58%): Story Manifesto & Initiatives */}
              <div className="lg:w-[58%] p-6 sm:p-10 overflow-y-auto space-y-6 text-white text-xs sm:text-sm leading-relaxed">
                
                <div className="space-y-2 border-b border-neutral-800 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>{selectedMovement.category}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">CASE REPORT: {selectedMovement.code}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white leading-snug pt-1">
                    {selectedMovement.title}
                  </h3>
                </div>

                <p className="text-[#D4AF37] font-serif font-semibold text-sm sm:text-base italic border-l-2 border-[#D4AF37] pl-3 py-0.5">
                  "{selectedMovement.motto}"
                </p>

                {/* Target & Partner Scope Metrics */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/30 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                    <TargetIcon className="w-4 h-4" />
                    <span>Target Impact Metric:</span>
                  </div>
                  <p className="text-neutral-200 font-medium pl-6">{selectedMovement.targetImpact}</p>
                  <p className="text-neutral-400 text-[11px] pl-6 italic">{selectedMovement.partnerScope}</p>
                </div>

                <div className="whitespace-pre-line text-neutral-300 leading-relaxed font-sans text-xs sm:text-sm space-y-3 font-light">
                  {selectedMovement.content}
                </div>

                {selectedMovement.initiatives && selectedMovement.initiatives.length > 0 && (
                  <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-neutral-800 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#D4AF37]" />
                      <span>Key Reform Initiatives & Scope:</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5 text-xs text-neutral-300">
                      {selectedMovement.initiatives.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href="/products" className="flex-1">
                    <button className="w-full bg-[#D4AF37] hover:bg-[#b8952c] text-black font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg">
                      <span>Support This Reform</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleShare(selectedMovement.title)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-5 rounded-xl text-xs uppercase tracking-widest border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>{copiedLink ? "Link Copied!" : "Share"}</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Volunteer Application Popup Form Modal ── */}
      <AnimatePresence>
        {isVolunteerModalOpen && (
          <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              className="bg-[#121212] max-w-2xl w-full rounded-3xl border border-[#D4AF37]/50 overflow-hidden shadow-2xl relative my-auto p-6 sm:p-10 text-white font-sans"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsVolunteerModalOpen(false)}
                className="absolute top-4 right-4 bg-black/80 text-white p-2.5 rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer z-30 shadow-lg border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {volunteerSubmitted ? (
                /* Success View */
                <div className="text-center py-8 space-y-5">
                  <div className="w-20 h-20 rounded-full bg-[#D4AF37]/15 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <span className="bg-[#D4AF37] text-black font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                      APPLICATION RECEIVED • {volunteerAppId}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                      Welcome to Jennyd Foundation!
                    </h3>
                    <p className="text-neutral-300 text-xs sm:text-sm font-sans leading-relaxed max-w-md mx-auto font-light">
                      Thank you, <strong className="text-white font-semibold">{volunteerForm.fullName}</strong>, for volunteering to make a real difference! Our volunteer coordinator will connect with you on WhatsApp / Email within 24 hours.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setIsVolunteerModalOpen(false)}
                      className="bg-[#121212] hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest border border-white/20 transition-all cursor-pointer"
                    >
                      Close Window
                    </button>

                    <Link href="/products">
                      <button 
                        onClick={() => setIsVolunteerModalOpen(false)}
                        className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Shop & Support Reforms</span>
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Form View */
                <div className="space-y-6">
                  
                  {/* Modal Header */}
                  <div className="space-y-2 border-b border-neutral-800 pb-4">
                    <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>JENNYD VOLUNTEER NETWORK</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
                      Join Our Social Reform Team
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans font-light">
                      Fill in your details below to volunteer for our healthcare, survivor rehab, food drive, or environmental initiatives.
                    </p>
                  </div>

                  {/* Volunteer Form */}
                  <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-xs font-sans">
                    
                    {/* Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ananya Sharma"
                          value={volunteerForm.fullName}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, fullName: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. ananya@example.com"
                          value={volunteerForm.email}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={volunteerForm.phone}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                          City & State *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mumbai, Maharashtra"
                          value={volunteerForm.city}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, city: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Reform Interest Dropdown */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                        Primary Social Reform Interest *
                      </label>
                      <select
                        value={volunteerForm.reformInterest}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, reformInterest: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white outline-none transition-all cursor-pointer"
                      >
                        <option value="Acid Attack & Burn Survivors Rehabilitation Reform">Acid Attack & Burn Survivors Rehab (SR-001)</option>
                        <option value="Food Security & Hunger Relief Reform">Food Security & Meal Drives (SR-002)</option>
                        <option value="Education & Digital Literacy Reform">Education & Digital Literacy (SR-003)</option>
                        <option value="Clean Water & Environmental Sanitation Reform">Clean Water & Borewell Setup (SR-004)</option>
                        <option value="Blood Donation & Emergency Healthcare Reform">Voluntary Blood Donation Drives (SR-005)</option>
                        <option value="Reforestation & Climate Stewardship Reform">Tree Planting & Reforestation (SR-006)</option>
                        <option value="Tribal Community & Indigenous Heritage Reform">Tribal Healthcare & Learning Aid (SR-007)</option>
                        <option value="Women Empowerment & Gender Equality Reform">Women Entrepreneurship & Hygiene (SR-008)</option>
                        <option value="Universal Medical Support & Surgical Aid Reform">Rural Medical Camps & Surgeries (SR-009)</option>
                        <option value="Dignified Housing & Emergency Shelter Reform">Housing & Disaster Shelters (SR-010)</option>
                        <option value="General Volunteer Support">General Volunteer Support (Where Needed Most)</option>
                      </select>
                    </div>

                    {/* Availability Dropdown */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                        Your Availability *
                      </label>
                      <select
                        value={volunteerForm.availability}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, availability: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white outline-none transition-all cursor-pointer"
                      >
                        <option value="Weekend Drives">Weekend Drives & Events</option>
                        <option value="Full-Time Volunteer">Full-Time Volunteer / Field Work</option>
                        <option value="Part-Time / Remote">Part-Time / Remote Mentorship & Tech Aid</option>
                        <option value="Emergency & Disaster Response">Emergency & Disaster Medical Response</option>
                      </select>
                    </div>

                    {/* Brief Note */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                        Why would you like to volunteer with us? (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us a little bit about your background, skills, or why this reform matters to you..."
                        value={volunteerForm.message}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, message: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-neutral-800 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isVolunteerSubmitting}
                        className="w-full bg-[#D4AF37] hover:bg-[#b8952c] text-black font-extrabold py-4 px-6 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                      >
                        {isVolunteerSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Volunteer Application</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Lightbox Full Screen Image Viewer Modal ── */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black p-3 rounded-full transition-colors cursor-pointer z-50 border border-white/20"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
              <Image
                src={lightboxImage}
                alt="Full resolution poster"
                fill
                className="object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" strokeWidth="2" />
  </svg>
);

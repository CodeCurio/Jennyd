"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, Sparkles, ShieldCheck, Award, ArrowRight, 
  CheckCircle2, Users, Utensils, GraduationCap, Droplet, 
  Activity, Trees, Compass, Home as HomeIcon, ChevronRight, X, Eye, Filter
} from "lucide-react";

// Social Movements Data Array
const MOVEMENTS_DATA = [
  {
    id: "acid-attack",
    isFeatured: true,
    title: "Beauty with a Purpose — Acid Attack & Burn Survivors",
    motto: "Every Fragrance Creates Hope. Scars Never Define a Person's Value.",
    image: "/assets/acid-attack.jpeg",
    category: "Survivor Healing",
    filterGroup: "survivor",
    icon: Heart,
    summary: "Dedicated to supporting acid attack and burn survivors as they rebuild their lives with dignity, medical care, surgeries, and vocational confidence.",
    content: `At JENNYD SCENTS, we believe that true beauty is not defined by appearance—it is defined by courage, compassion, resilience, and the strength to rise above life's greatest challenges. Every fragrance we create is more than a symbol of luxury; it is a promise to stand beside those who need hope, healing, and a second chance.

The Beauty with a Purpose Movement is dedicated to supporting acid attack and burn survivors as they rebuild their lives with dignity, confidence, and renewed hope. Behind every survivor is a story of unimaginable pain, extraordinary courage, and an unwavering determination to move forward. Their journey reminds us that true beauty lives in the human spirit and that kindness has the power to transform lives.

Recovery from severe burns and acid attacks is often a long and difficult process. Survivors may require emergency medical care, multiple reconstructive and restorative surgeries, skin grafting, specialized burn treatment, rehabilitation, physical therapy, pain management, psychological counseling, vision and hearing support, prosthetic assistance where needed, education, vocational training, legal guidance, and long-term emotional care. The road to recovery can take years, and no one should have to walk that path alone.

Through the JENNYD SCENTS Beauty with a Purpose Movement, we are committed to supporting charitable organizations, hospitals, healthcare professionals, rehabilitation centers, and community initiatives that help survivors regain their health, confidence, independence, and quality of life.`,
    initiatives: [
      "Reconstructive and restorative surgeries",
      "Burn treatment and specialized medical care",
      "Skin grafting and reconstructive procedures",
      "Emergency medical assistance & pain management",
      "Rehabilitation and physical therapy",
      "Psychological counseling and emotional support",
      "Vision, hearing, and mobility rehabilitation",
      "Educational opportunities and scholarships",
      "Skill development and vocational training",
      "Employment and livelihood support",
      "Legal awareness and survivor advocacy",
      "Social inclusion and community reintegration programs"
    ]
  },
  {
    id: "food-for-all",
    title: "Food for All Movement",
    motto: "Wear a Fragrance. Share a Meal. Feed a Life. Inspire Change.",
    image: "/assets/beauty-with-purpose.jpeg",
    category: "Hunger Relief",
    filterGroup: "health-meals",
    icon: Utensils,
    summary: "Providing nutritious meals, supporting food banks, community kitchens, and school meal programs for vulnerable children and families.",
    content: `At JENNYD SCENTS, we believe that true beauty is found in compassion, generosity, and the willingness to care for others. A beautiful fragrance can uplift the senses, but an act of kindness can uplift a life. That is why every JENNYD SCENTS fragrance is created with a purpose—to spread hope, nourish lives, and inspire meaningful change.

Millions of people around the world, especially children, continue to face hunger and malnutrition every day. For many families, securing even one nutritious meal is a daily struggle. Hunger affects health, education, opportunities, and the ability to dream of a better future. We believe that no child should go to bed hungry and no family should have to choose between survival and hope.

The JENNYD SCENTS Food for All Movement was established with a simple yet powerful mission: to help ensure that everyone has access to nutritious food and the dignity that comes with it. We believe that food is not just a necessity—it is a fundamental human right and the foundation of healthy communities.`,
    initiatives: [
      "Community kitchens and food distribution centers",
      "School meal programs for underprivileged children",
      "Emergency hunger relief in crisis zones",
      "Nutrition packages for vulnerable elderly and families",
      "Sustainable food security initiatives"
    ]
  },
  {
    id: "education-for-all",
    title: "Education for All Movement",
    motto: "Wear a Fragrance. Support Education. Empower Futures.",
    image: "/assets/education-for-all.jpeg",
    category: "Education & Literacy",
    filterGroup: "education",
    icon: GraduationCap,
    summary: "Funding scholarships, school supplies, digital learning resources, teacher support, and classroom development for children in need.",
    content: `At JENNYD SCENTS, we believe that true beauty is found not only in the fragrance we wear but in the opportunities we create for others. Education is one of the greatest gifts a child can receive. It opens minds, builds confidence, nurtures dreams, and creates the foundation for a brighter, stronger, and more compassionate world.

Millions of children around the world still face barriers to education due to poverty, lack of resources, limited access to schools, conflict, natural disasters, or social inequality. Every child deserves the opportunity to learn, discover their potential, and build a future filled with hope and possibilities. We believe that education is not a privilege—it is a fundamental right.

The JENNYD SCENTS Education for All Movement was established to ensure that every child has access to quality education. Through this initiative, a portion of proceeds is dedicated to supporting educational institutions, scholarships, books, digital resources, teacher training, and classroom infrastructure.`,
    initiatives: [
      "Educational scholarships for underprivileged students",
      "Distribution of school supplies, uniforms, and textbooks",
      "Digital learning infrastructure and computer labs",
      "Classroom construction and school repairs",
      "Vocational training programs for young adults"
    ]
  },
  {
    id: "fresh-water",
    title: "Fresh Water Movement",
    motto: "Protect Every Drop, Refresh Every Life, Build a Healthier World.",
    image: "/assets/fresh-water-movement.jpeg",
    category: "Clean Water & Sanitation",
    filterGroup: "environment",
    icon: Droplet,
    summary: "Building clean water wells, rainwater harvesting systems, water purification units, and sanitation facilities for underserved villages.",
    content: `At JENNYD SCENTS, we believe that true beauty begins with care—for people, for communities, and for our planet. Just as a beautiful fragrance refreshes the spirit, clean and safe water gives life, restores health, and creates opportunities for a brighter future. Every drop of water carries the power to nourish, protect, and transform lives.

Water is one of the world's most precious resources, yet millions of people still struggle every day without reliable access to safe drinking water, sanitation, and hygiene. Families travel long distances to collect water, children miss school, and communities face preventable diseases simply because clean water is not available.

The JENNYD SCENTS Fresh Water Movement supports clean drinking water projects, rainwater harvesting, water purification systems, well construction, sanitation facilities, and river conservation.`,
    initiatives: [
      "Construction of clean drinking water wells & pumps",
      "Installation of community water purification systems",
      "Rainwater harvesting & watershed conservation",
      "Sanitation facility construction in rural schools",
      "Hygiene awareness and health workshops"
    ]
  },
  {
    id: "blood-for-all",
    title: "Blood for All Movement",
    motto: "Wear a Fragrance. Donate Blood. Save Lives.",
    image: "/assets/blood-movement.jpeg",
    category: "Healthcare & Blood Drives",
    filterGroup: "health-meals",
    icon: Activity,
    summary: "Organizing voluntary blood donation camps, mobile collection units, blood bank infrastructure, and emergency donor networks.",
    content: `At JENNYD SCENTS, we believe that true beauty is measured not only by how we look, but by the lives we touch and the hope we give to others. Every act of kindness has the power to save a life, and among the greatest gifts a person can give is the gift of blood. A single donation can mean a second chance for someone fighting illness, recovering from surgery, surviving an accident, or facing a medical emergency.

Every day, hospitals and healthcare centers depend on voluntary blood donors. Patients undergoing major surgeries, cancer treatments, childbirth complications, organ transplants, severe burns, and emergency trauma care rely on timely blood transfusions to survive.

The JENNYD SCENTS Blood for All Movement promotes voluntary blood donation awareness, supports blood collection drives, funds mobile collection units, and assists blood bank infrastructure to ensure no patient waits for lifesaving blood.`,
    initiatives: [
      "Voluntary community blood donation drives",
      "Mobile blood collection units & equipment",
      "Emergency blood assistance helpline support",
      "Blood bank storage and testing infrastructure",
      "Donor education and awareness campaigns"
    ]
  },
  {
    id: "green-earth",
    title: "Green Earth Movement",
    motto: "Wear a Fragrance. Plant Hope. Grow a Greener Earth.",
    image: "/assets/green-earth.jpeg",
    category: "Environment & Reforestation",
    filterGroup: "environment",
    icon: Trees,
    summary: "Planting trees, restoring ecosystems, funding river cleanups, reducing plastic waste, and promoting environmental stewardship.",
    content: `At JENNYD SCENTS, we believe that true beauty extends far beyond fragrance. It is reflected in the way we care for our planet, protect nature, and leave a healthier world for future generations. Every tree planted, every river protected, every forest restored, and every sustainable choice we make is an investment in the future of humanity.

The Earth is our shared home, yet it faces growing challenges from deforestation, pollution, climate change, biodiversity loss, and the depletion of natural resources.

The JENNYD SCENTS Green Earth Movement funds tree plantation drives, forest restoration projects, river cleanups, wildlife habitat protection, plastic waste reduction campaigns, and environmental education.`,
    initiatives: [
      "Tree plantation and urban afforestation drives",
      "Reforestation of degraded forest corridors",
      "River cleanup and lake restoration projects",
      "Plastic waste reduction & recycling programs",
      "Environmental education in rural & urban schools"
    ]
  },
  {
    id: "tribal-support",
    title: "Tribal Support Movement",
    motto: "Wear a Fragrance. Support Tribes. Preserve Heritage.",
    image: "/assets/tribal-support.jpeg",
    category: "Indigenous Empowerment",
    filterGroup: "education",
    icon: Compass,
    summary: "Empowering indigenous tribal communities with healthcare, education, artisan skill training, clean water, and cultural preservation.",
    content: `At Jennyd Scents, we believe that true beauty is not only found in the fragrance you wear but also in the lives you help transform. Every purchase becomes a symbol of compassion, respect, and responsibility toward the tribal communities who have preserved nature, culture, and ancient traditions for generations.

They are the guardians of our forests, the keepers of indigenous knowledge, and an invaluable part of our shared heritage. Yet many tribal families continue to face challenges in accessing quality education, healthcare, safe housing, clean drinking water, sustainable livelihoods, and equal opportunities.

Through the Jennyd Scents Tribal Support Movement, we support educational scholarships, mobile medical camps, artisan skill development, sustainable farming, and traditional craft preservation in remote tribal belts.`,
    initiatives: [
      "Mobile healthcare camps & essential medicine in remote tribal belts",
      "Scholarships, books, and learning centers for tribal children",
      "Artisan skill development & promotion of traditional crafts",
      "Support for sustainable organic farming & non-timber produce",
      "Forest conservation & indigenous heritage preservation"
    ]
  },
  {
    id: "women-empowerment",
    title: "Women Empowerment Movement",
    motto: "Wear a Fragrance. Empower Women. Inspire Change.",
    image: "/assets/women-empowerment.jpeg",
    category: "Gender Equality",
    filterGroup: "education",
    icon: Users,
    summary: "Fostering financial independence, vocational training, self-employment programs, menstrual health, and leadership for women.",
    content: `At Jennyd Scents, we believe that when a woman rises, her family rises, her community grows stronger, and the future becomes brighter. Every woman deserves the freedom to dream, the opportunity to learn, the confidence to lead, and the ability to build a life filled with dignity, respect, and purpose.

Through the Jennyd Scents Women Empowerment Movement, we support women from all walks of life by providing access to education, skill development, entrepreneurship grants, financial literacy, healthcare, and community leadership.

A portion of proceeds from every purchase supports scholarships for girls, vocational training in artisan crafts, micro-entrepreneurship assistance, menstrual hygiene awareness, and legal awareness programs.`,
    initiatives: [
      "Vocational skill training & self-employment grants for women",
      "Micro-entrepreneurship & handicraft production support",
      "Menstrual hygiene awareness & free sanitary kit distribution",
      "Digital literacy & financial education workshops",
      "Legal awareness, safety, and community leadership training"
    ]
  },
  {
    id: "medical-support",
    title: "Medical Support Movement",
    motto: "Wear a Fragrance. Support Healthcare. Save Lives.",
    image: "/assets/medical-support.jpeg",
    category: "Universal Healthcare",
    filterGroup: "health-meals",
    icon: ShieldCheck,
    summary: "Organizing free medical camps, funding surgeries, providing lifesaving medicines, and supporting maternal and child health.",
    content: `At Jennyd Scents, we believe that good health is the foundation of a happy, productive, and meaningful life. Every person deserves access to quality healthcare, timely medical treatment, life-saving medicines, and compassionate care, regardless of their financial background.

Through the Jennyd Scents Medical Support Movement, we bring hope, healing, and dignity to individuals facing critical medical challenges. We organize free medical diagnosis camps, fund essential surgeries for underprivileged patients, supply lifesaving medicines, improve rural clinic infrastructure, and support maternal and child health programs.`,
    initiatives: [
      "Free medical checkup & diagnostic camps in rural areas",
      "Surgical assistance funds for low-income patients",
      "Provision of essential lifesaving medicines & equipment",
      "Maternal care, infant nutrition & vaccination drives",
      "Rural health clinic infrastructure enhancement"
    ]
  },
  {
    id: "shelter-creation",
    title: "Shelter Creation Movement",
    motto: "Wear a Fragrance. Build Shelters. Create Better Tomorrows.",
    image: "/assets/shelter-creation.jpeg",
    category: "Housing & Dignity",
    filterGroup: "survivor",
    icon: HomeIcon,
    summary: "Constructing safe homes, emergency disaster shelters, and renovating unsafe living spaces for vulnerable families.",
    content: `At Jennyd Scents, we believe that every person deserves more than just a roof over their head—they deserve a place they can truly call home. A safe and secure home is the foundation of a healthy, dignified, and hopeful life. It provides protection, stability, comfort, and the opportunity for families to dream and grow.

Through the Jennyd Scents Shelter Creation Movement, we assist vulnerable families in securing safe, weather-proof, and dignified housing.

Proceeds fund home construction for underprivileged families, house repairs, emergency disaster relief shelters, sanitation facilities, and safe community spaces.`,
    initiatives: [
      "Construction of low-cost, durable homes for families in need",
      "Repair and waterproofing of dilapidated shelters",
      "Emergency disaster relief shelter setup during floods & crises",
      "Integration of clean water & sanitation in housing projects",
      "Creation of safe community centers for children & elderly"
    ]
  }
];

export default function SocialImpactPage() {
  const [selectedMovement, setSelectedMovement] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const featuredMovement = MOVEMENTS_DATA[0]; // Acid attack survivors

  const filteredMovements = activeFilter === "all" 
    ? MOVEMENTS_DATA 
    : MOVEMENTS_DATA.filter(m => m.filterGroup === activeFilter);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans text-neutral-800">
      
      {/* ── 1. Luxury Hero Banner ── */}
      <section className="relative w-full py-20 sm:py-28 bg-[#0B0B0B] text-white overflow-hidden border-b-2 border-[#D4AF37]/50">
        {/* Ambient Radial Backlight Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[400px] bg-[#D4AF37]/14 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Social Impact & Philanthropy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white font-normal tracking-wide leading-tight">
            Beauty with a Purpose
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Every Fragrance Creates Hope. Wear a Fragrance. Share a Meal. Educate a Child. Transform a Life.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <a 
              href="#featured-movement" 
              className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer hover:scale-105"
            >
              Explore Flagship Movement
            </a>
            <a 
              href="#all-movements" 
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest border border-white/20 transition-all duration-300 cursor-pointer"
            >
              View All 10 Movements
            </a>
          </div>

          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6" />
        </div>
      </section>

      {/* ── 2. Our Corporate Pledge Section ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full">
        <div className="bg-white p-8 sm:p-14 rounded-3xl border border-[#EAE7E1] shadow-xl text-center max-w-4xl mx-auto space-y-5 relative overflow-hidden">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
            Our Corporate Pledge
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#121212] leading-snug">
            Luxury Beyond Scent — A Pledge to Humanity
          </h2>
          <p className="text-neutral-600 text-xs sm:text-sm md:text-base leading-relaxed font-sans max-w-3xl mx-auto">
            At JENNYD SCENTS, we believe that true luxury is measured not only by the evocative fragrances we create, but by the positive impact we leave behind in the world. A dedicated portion of proceeds from every single bottle sold is directly committed toward healthcare, survivor rehabilitation, education, clean water, hunger relief, and environmental conservation.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-6 text-xs font-semibold text-neutral-800 border-t border-neutral-100">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> 100% Pledged Impact Allocation
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Partnering with Verified Hospitals & NGOs
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Transparent & Traceable Philanthropy
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. ⭐ Featured Movement Spotlight (Acid Attack & Burn Survivors) ── */}
      <section id="featured-movement" className="py-16 sm:py-24 bg-[#0A0A0A] text-white border-y-2 border-[#D4AF37]/50 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-black font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>⭐ FLAGSHIP IMPACT MOVEMENT</span>
            </div>
            <span className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase font-sans">
              JENNYD SCENTS FOUNDATION
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Poster Display in Gallery Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-[#121212] p-3 sm:p-4 rounded-3xl border-2 border-[#D4AF37]/40 shadow-2xl group">
                <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#000] flex items-center justify-center">
                  <Image
                    src={featuredMovement.image}
                    alt={featuredMovement.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-103"
                    priority
                  />
                </div>
                
                {/* Poster Caption */}
                <div className="mt-3.5 flex items-center justify-between px-2 text-xs font-sans">
                  <span className="text-[#D4AF37] font-bold uppercase tracking-widest text-[10px]">SURVIVOR REHABILITATION</span>
                  <button 
                    onClick={() => setSelectedMovement(featuredMovement)}
                    className="text-white hover:text-[#D4AF37] flex items-center gap-1 font-semibold transition-colors cursor-pointer text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Poster</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative & Initiatives */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] block">
                  BEAUTY WITH A PURPOSE
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-normal leading-tight">
                  Acid Attack & Burn Survivors Support
                </h2>
                <p className="text-[#D4AF37] text-sm sm:text-base font-serif italic border-l-2 border-[#D4AF37] pl-3 py-0.5">
                  "{featuredMovement.motto}"
                </p>
              </div>

              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-sans">
                At JENNYD SCENTS, we believe that true beauty is defined by courage, compassion, resilience, and the strength to rise above life's greatest challenges. Every fragrance we create is more than a symbol of luxury; it is a promise to stand beside survivors of acid attacks and severe burns as they rebuild their lives with dignity and hope.
              </p>

              {/* Scope Box */}
              <div className="bg-[#141414] p-5 sm:p-6 rounded-2xl border border-neutral-800 space-y-3.5">
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
                  <button className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105">
                    <span>Shop & Support This Cause</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button 
                  onClick={() => setSelectedMovement(featuredMovement)}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest border border-white/20 transition-all cursor-pointer"
                >
                  Read Full Survivor Manifesto
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── 4. All 10 Impact Movements Grid ── */}
      <section id="all-movements" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full space-y-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
            Explore All Initiatives
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#121212]">
            Our 10 Social Impact Movements
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm font-sans leading-relaxed">
            Every bottle of JENNYD SCENTS carries a purpose. Select a cause below to read its story and scope of impact.
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
            All Movements (10)
          </button>
          <button
            onClick={() => setActiveFilter("survivor")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "survivor" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            Survivor & Dignity
          </button>
          <button
            onClick={() => setActiveFilter("health-meals")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "health-meals" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            Health & Meals
          </button>
          <button
            onClick={() => setActiveFilter("education")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "education" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            Education & Empowerment
          </button>
          <button
            onClick={() => setActiveFilter("environment")}
            className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === "environment" 
                ? "bg-[#121212] text-white shadow-md" 
                : "bg-white text-neutral-600 border border-[#EAE7E1] hover:border-[#D4AF37]"
            }`}
          >
            Water & Planet
          </button>
        </div>

        {/* Movements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovements.map((movement) => {
            const IconComp = movement.icon;
            return (
              <div 
                key={movement.id}
                className="bg-white rounded-3xl border border-[#EAE7E1] shadow-md hover:shadow-2xl hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Poster Image Container (Uncropped) */}
                  <div className="relative w-full h-72 sm:h-80 bg-[#070707] p-2 overflow-hidden flex items-center justify-center">
                    <Image
                      src={movement.image}
                      alt={movement.title}
                      fill
                      className="object-contain group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3.5 left-3.5 bg-black/85 backdrop-blur-md text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/40 flex items-center gap-1.5 shadow-md">
                      <IconComp className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{movement.category}</span>
                    </div>

                    {movement.isFeatured && (
                      <div className="absolute top-3.5 right-3.5 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-md">
                        ★ Flagship
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <h3 className="text-lg font-serif font-bold text-[#121212] group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {movement.title}
                    </h3>
                    <p className="text-xs text-[#D4AF37] font-semibold font-serif italic">
                      "{movement.motto}"
                    </p>
                    <p className="text-neutral-600 text-xs leading-relaxed font-sans line-clamp-3">
                      {movement.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Button */}
                <div className="p-6 pt-0 sm:p-7 sm:pt-0 mt-auto">
                  <button
                    onClick={() => setSelectedMovement(movement)}
                    className="w-full bg-[#FAF8F5] hover:bg-[#121212] text-[#121212] hover:text-white border border-[#EAE7E1] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span>Explore Full Story</span>
                    <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ── 5. How Your Purchase Helps ── */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-y border-[#EAE7E1] w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
              Transparent Philanthropy Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#121212]">
              How Your Purchase Creates Impact
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-sans">
              Four seamless steps from luxury fragrance selection to real-world community transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-serif">
                01
              </div>
              <h3 className="text-base font-serif font-bold text-[#121212]">Choose Your Scent</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Select your favorite Extrait de Parfum or artisanal pure attar oil from our signature collections.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-serif">
                02
              </div>
              <h3 className="text-base font-serif font-bold text-[#121212]">Automatic Pledge</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                A dedicated percentage of every purchase proceeds is automatically committed into our social impact fund.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-serif">
                03
              </div>
              <h3 className="text-base font-serif font-bold text-[#121212]">Direct Allocation</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Funds are deployed to partner hospitals, surgeries, food kitchens, blood drives, and schools without deduction.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center font-bold text-sm font-serif">
                04
              </div>
              <h3 className="text-base font-serif font-bold text-[#121212]">Lives Transformed</h3>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Survivors receive medical care, children eat & learn, and communities thrive with restored dignity and hope.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 6. Transparency & Impact Commitment ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full">
        <div className="bg-[#121212] text-white p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[#D4AF37] uppercase tracking-[0.25em] text-xs font-bold font-sans block">
              UNCOMPROMISED TRANSPARENCY
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-white font-normal">
              100% Direct Allocation to Verified Partners
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm font-sans leading-relaxed">
              We partner directly with registered hospitals, burn care units, food distribution trusts, blood banks, and verified non-governmental organizations. Every rupee pledged directly funds patient surgeries, school meals, clean water wells, and environmental drives.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link href="/products">
              <button className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-7 py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105">
                <span>Shop With Purpose</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ── 7. Why We Do This (Philosophy Quote) ── */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#EAE7E1] w-full text-center px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
            Our Foundational Belief
          </span>
          <blockquote className="text-xl sm:text-3xl font-serif text-[#121212] leading-relaxed italic">
            "Success is most valuable when it is shared, and true luxury is measured not only by what we create, but by the positive impact we leave behind."
          </blockquote>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] pt-2">
            — JENNYD SCENTS FOUNDATION
          </p>
        </div>
      </section>

      {/* ── 8. Shop Now CTA Banner ── */}
      <section className="py-20 sm:py-28 bg-[#0F0F0F] text-white text-center border-t-2 border-[#D4AF37]/50 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-6">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold block">
            Join The Movement Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
            Wear a Fragrance. Empower a Life.
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-sans leading-relaxed">
            Every fragrance bottle you purchase becomes an act of compassion, hope, and social transformation. Explore our luxury Extrait de Parfum and artisanal attars today.
          </p>
          <div className="pt-2">
            <Link href="/products">
              <button className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-extrabold px-9 py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer hover:scale-105">
                EXPLORE LUXURY PERFUMES & MAKE AN IMPACT →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Split-Screen Luxury Story Modal Popup ── */}
      {selectedMovement && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-[#121212] max-w-5xl w-full rounded-3xl border border-[#D4AF37]/50 overflow-hidden shadow-2xl relative my-6 max-h-[92vh] flex flex-col lg:flex-row">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMovement(null)}
              className="absolute top-4 right-4 bg-black/80 text-white p-2.5 rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer z-30 shadow-lg border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side (40%): Poster Art Gallery Display */}
            <div className="lg:w-[42%] bg-[#050505] p-6 sm:p-8 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-neutral-800 shrink-0">
              <div className="relative w-full h-[320px] sm:h-[420px] lg:h-full min-h-[350px] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <Image
                  src={selectedMovement.image}
                  alt={selectedMovement.title}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] block font-sans">
                  JENNYD SCENTS PHILANTHROPY
                </span>
                <span className="text-neutral-400 text-xs font-sans mt-0.5 block">
                  {selectedMovement.category}
                </span>
              </div>
            </div>

            {/* Right Side (58%): Story Manifesto & Initiatives */}
            <div className="lg:w-[58%] p-6 sm:p-10 overflow-y-auto space-y-6 text-white font-sans text-xs sm:text-sm leading-relaxed">
              
              <div className="space-y-2 border-b border-neutral-800 pb-4">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>{selectedMovement.category}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white leading-snug">
                  {selectedMovement.title}
                </h3>
              </div>

              <p className="text-[#D4AF37] font-serif font-semibold text-sm sm:text-base italic border-l-2 border-[#D4AF37] pl-3 py-0.5">
                "{selectedMovement.motto}"
              </p>

              <div className="whitespace-pre-line text-neutral-300 leading-relaxed font-sans text-xs sm:text-sm space-y-3">
                {selectedMovement.content}
              </div>

              {selectedMovement.initiatives && selectedMovement.initiatives.length > 0 && (
                <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-neutral-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-[#D4AF37]">
                    Supported Initiatives & Scope of Impact:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-sans">
                    {selectedMovement.initiatives.map((init: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span className="leading-snug">{init}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400 font-sans text-center sm:text-left">
                  100% of pledged funds directly empower this movement.
                </span>
                <Link href="/products" onClick={() => setSelectedMovement(null)}>
                  <button className="bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap shadow-lg">
                    Shop & Contribute Now
                  </button>
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

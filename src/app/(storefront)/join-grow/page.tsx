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
  ArrowLeft,
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
  Heart,
  CreditCard,
  Landmark,
  FileText,
  UserCheck,
  Calendar,
  AlertCircle,
  Check
} from "lucide-react";

// Images from public/assets/join-grow/
const IMAGES = {
  hero: "/assets/join-grow/join-grow-hero.png",
  leader: "/assets/join-grow/join-grow-leader.jpeg",
  world: "/assets/join-grow/join-grow-world.jpeg",
  mentor: "/assets/join-grow/join-grow-mentor.jpeg",
  ceo: "/assets/join-grow/join-grow-ceo.jpeg",
  boss: "/assets/join-grow/join-grow-boss.jpeg",
  family: "/assets/join-grow/join-grow-family.jpeg",
  brandBoss: "/assets/join-grow/join-grow-brand-boss.jpeg",
  together: "/assets/join-grow/join-grow-together.jpeg",
  earn: "/assets/join-grow/join-grow-earn.jpeg",
  homeBiz: "/assets/join-grow/join-grow-home-biz.jpeg",
  team: "/assets/join-grow/join-grow-team.jpeg",
  portrait: "/assets/join-grow/join-grow-portrait.jpeg",
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

const HEAR_ABOUT_OPTIONS = [
  "Mentor",
  "Social Media",
  "Website",
  "Referral",
  "Exhibition",
  "Other"
];

const FORM_STEPS = [
  { id: 1, title: "Personal & KYC", desc: "Name, DOB & Govt IDs" },
  { id: 2, title: "Contact & Address", desc: "Phone, Email & Location" },
  { id: 3, title: "Sponsor & Bank", desc: "Referral & Payout info" },
  { id: 4, title: "PO & Consent", desc: "PO No & Declaration" },
];

export default function JoinGrowPage() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // IBO Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Identity
    fullName: "",
    motherName: "",
    fatherName: "",
    dob: "",
    gender: "Male" as "Male" | "Female" | "Other" | "",
    occupation: "",
    maritalStatus: "Single" as "Single" | "Married" | "Other" | "",
    panTaxNumber: "",
    aadhaarNationalId: "",
    otherGovId: "",
    drivingLicense: "",
    passportNumber: "",
    nationalIdNumber: "",
    voterCardNumber: "",

    // Step 2: Contact & Address
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    alternateContact: "",
    houseFlatNo: "",
    street: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    country: "India",
    sameAsPermanent: true,
    permHouseFlatNo: "",
    permStreet: "",
    permLandmark: "",
    permCity: "",
    permDistrict: "",
    permState: "",
    permPinCode: "",
    permCountry: "India",

    // Step 3: Sponsor & Bank
    sponsorName: "",
    sponsorIboId: "",
    sponsorMobile: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",

    // Step 4: Business & Consent & PO
    hearAboutUs: [] as string[],
    hearAboutOther: "",
    consentAgreement: false,
    consentIncomeDisclosure: false,
    purchaseOrderNo: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    let formattedValue = value;

    // 1. Aadhaar Card Formatting (Numeric Only, 12 digits, XXXX XXXX XXXX auto-spaced)
    if (name === "aadhaarNationalId") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
      formattedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    }

    // 2. PAN Number (Auto-uppercase, Alpha-Numeric, Max 10 chars)
    else if (name === "panTaxNumber") {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    }

    // 3. Mobile Number, WhatsApp Number, Sponsor Mobile, Alternate Contact (Numeric Only, Max 10 digits)
    else if (name === "mobileNumber" || name === "whatsappNumber" || name === "sponsorMobile" || name === "alternateContact") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // 4. PIN Code (Numeric Only, Max 6 digits)
    else if (name === "pinCode" || name === "permPinCode") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    // 5. Bank Account Number (Numeric Only, Max 18 digits)
    else if (name === "accountNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 18);
    }

    // 6. IFSC Code (Auto-uppercase, Max 11 characters)
    else if (name === "ifscCode") {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    }

    // 7. Driving License / Passport / Voter Card / Sponsor IBO ID
    else if (name === "drivingLicense" || name === "passportNumber" || name === "voterCardNumber" || name === "sponsorIboId") {
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const copyMobileToWhatsApp = () => {
    if (formData.mobileNumber) {
      setFormData(prev => ({ ...prev, whatsappNumber: prev.mobileNumber }));
    }
  };

  const toggleHearAboutOption = (option: string) => {
    setFormData(prev => {
      const exists = prev.hearAboutUs.includes(option);
      if (exists) {
        return { ...prev, hearAboutUs: prev.hearAboutUs.filter(o => o !== option) };
      } else {
        return { ...prev, hearAboutUs: [...prev.hearAboutUs, option] };
      }
    });
  };

  // Step Validation
  const validateStep = (step: number) => {
    setFormError(null);
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setFormError("Please enter your Full Name.");
        return false;
      }
      const rawAadhaar = formData.aadhaarNationalId.replace(/\s/g, "");
      if (rawAadhaar && rawAadhaar.length !== 12) {
        setFormError("Aadhaar Number must be exactly 12 numeric digits.");
        return false;
      }
      if (formData.panTaxNumber && formData.panTaxNumber.length !== 10) {
        setFormError("PAN Number must be exactly 10 alphanumeric characters (e.g. ABCDE1234F).");
        return false;
      }
    } else if (step === 2) {
      if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
        setFormError("Please enter a valid 10-digit Mobile Number.");
        return false;
      }
      if (!formData.whatsappNumber || formData.whatsappNumber.length !== 10) {
        setFormError("Please enter a valid 10-digit WhatsApp Number.");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setFormError("Please enter a valid Email Address.");
        return false;
      }
      if (!formData.city.trim()) {
        setFormError("Please enter your City.");
        return false;
      }
      if (formData.pinCode && formData.pinCode.length !== 6) {
        setFormError("PIN Code must be exactly 6 digits.");
        return false;
      }
    } else if (step === 3) {
      if (formData.ifscCode && formData.ifscCode.length !== 11) {
        setFormError("IFSC Code must be exactly 11 characters (e.g. SBIN0001234).");
        return false;
      }
      if (formData.sponsorMobile && formData.sponsorMobile.length !== 10) {
        setFormError("Sponsor Mobile Number must be 10 digits.");
        return false;
      }
    } else if (step === 4) {
      if (!formData.purchaseOrderNo.trim()) {
        setFormError("Purchase Order No is Mandatory. Please provide your PO number.");
        return false;
      }
      if (!formData.consentAgreement || !formData.consentIncomeDisclosure) {
        setFormError("Please accept both Declaration & Consent checkboxes.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setFormError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    const payload = {
      full_name: formData.fullName,
      mother_name: formData.motherName,
      father_name: formData.fatherName,
      dob: formData.dob || null,
      gender: formData.gender,
      occupation: formData.occupation,
      marital_status: formData.maritalStatus,

      pan_tax_number: formData.panTaxNumber,
      aadhaar_national_id: formData.aadhaarNationalId,
      other_gov_id: formData.otherGovId,
      driving_license: formData.drivingLicense,
      passport_number: formData.passportNumber,
      national_id_number: formData.nationalIdNumber,
      voter_card_number: formData.voterCardNumber,

      mobile_number: formData.mobileNumber,
      whatsapp_number: formData.whatsappNumber,
      email: formData.email,
      alternate_contact: formData.alternateContact,

      house_flat_no: formData.houseFlatNo,
      street: formData.street,
      landmark: formData.landmark,
      city: formData.city,
      district: formData.district,
      state: formData.state,
      pin_code: formData.pinCode,
      country: formData.country,
      same_as_permanent: formData.sameAsPermanent,

      perm_house_flat_no: formData.sameAsPermanent ? formData.houseFlatNo : formData.permHouseFlatNo,
      perm_street: formData.sameAsPermanent ? formData.street : formData.permStreet,
      perm_landmark: formData.sameAsPermanent ? formData.landmark : formData.permLandmark,
      perm_city: formData.sameAsPermanent ? formData.city : formData.permCity,
      perm_district: formData.sameAsPermanent ? formData.district : formData.permDistrict,
      perm_state: formData.sameAsPermanent ? formData.state : formData.permState,
      perm_pin_code: formData.sameAsPermanent ? formData.pinCode : formData.permPinCode,
      perm_country: formData.sameAsPermanent ? formData.country : formData.permCountry,

      sponsor_name: formData.sponsorName,
      sponsor_ibo_id: formData.sponsorIboId,
      sponsor_mobile: formData.sponsorMobile,

      account_holder_name: formData.accountHolderName,
      bank_name: formData.bankName,
      account_number: formData.accountNumber,
      ifsc_code: formData.ifscCode,
      upi_id: formData.upiId,

      hear_about_us: formData.hearAboutUs,
      hear_about_other: formData.hearAboutOther,

      consent_agreement: formData.consentAgreement,
      consent_income_disclosure: formData.consentIncomeDisclosure,
      purchase_order_no: formData.purchaseOrderNo,

      status: "Pending",
      created_at: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/ibo/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Submission failed. Please check mandatory fields.");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.warn("API call exception:", err);
    }

    try {
      const existing = localStorage.getItem("jennyd_ibo_registrations");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift({ ...payload, id: `ibo-${Date.now()}` });
      localStorage.setItem("jennyd_ibo_registrations", JSON.stringify(list));
    } catch (e) {}

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello Jennyd Team! I have submitted my IBO Registration Form.\n\n*Name:* ${formData.fullName || "N/A"}\n*PO No:* ${formData.purchaseOrderNo || "N/A"}\n*Phone:* ${formData.mobileNumber || "N/A"}\n*Email:* ${formData.email || "N/A"}\n*City:* ${formData.city || "N/A"}\n*Sponsor ID:* ${formData.sponsorIboId || "None"}\n*Status:* Pending Verification`;
    const url = `https://wa.me/919682899765?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormError(null);
    setFormData({
      fullName: "",
      motherName: "",
      fatherName: "",
      dob: "",
      gender: "Male",
      occupation: "",
      maritalStatus: "Single",
      panTaxNumber: "",
      aadhaarNationalId: "",
      otherGovId: "",
      drivingLicense: "",
      passportNumber: "",
      nationalIdNumber: "",
      voterCardNumber: "",
      mobileNumber: "",
      whatsappNumber: "",
      email: "",
      alternateContact: "",
      houseFlatNo: "",
      street: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      country: "India",
      sameAsPermanent: true,
      permHouseFlatNo: "",
      permStreet: "",
      permLandmark: "",
      permCity: "",
      permDistrict: "",
      permState: "",
      permPinCode: "",
      permCountry: "India",
      sponsorName: "",
      sponsorIboId: "",
      sponsorMobile: "",
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      hearAboutUs: [],
      hearAboutOther: "",
      consentAgreement: false,
      consentIncomeDisclosure: false,
      purchaseOrderNo: ""
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans text-neutral-800 selection:bg-[#D4AF37] selection:text-black">
      
      {/* ── 0. HERO SECTION ── */}
      <section className="relative w-full py-10 sm:py-14 lg:py-16 bg-[#0A0A0A] text-white border-b border-[#D4AF37]/40 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[#D4AF37]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>JENNYD SCENTS • GLOBAL BUSINESS COLLABORATION</span>
              </div>

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
                  <span>Register as IBO</span>
                </a>
              </div>
            </div>

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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg">
                  Leadership &amp; Business
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 1: BECOME AN INDEPENDENT BUSINESS OWNER ── */}
      <section id="section-1" className="w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-[#EAE7E1]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">
          <div className="lg:col-span-5 flex justify-center">
            <div 
              onClick={() => setLightboxImage(IMAGES.leader)}
              className="relative w-full aspect-[3/4.4] max-w-sm sm:max-w-md rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
            >
              <Image src={IMAGES.leader} alt="I am the leader of my business" fill className="object-cover" />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#916b08] border border-[#D4AF37]/30 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>INDEPENDENT BUSINESS OPPORTUNITY</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-[#121212] font-normal leading-tight">
              BECOME AN INDEPENDENT BUSINESS OWNER
            </h2>

            <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed font-sans font-light">
              With Jennyd Scents, you can build your own independent business around a premium fragrance portfolio while benefiting from the support of an established luxury fragrance brand.
            </p>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#EAE7E1] shadow-xs space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#916b08] font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <div><strong className="text-black">You bring the ambition.</strong> Your passion, goal-setting, and drive.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#916b08] font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <div><strong className="text-black">We provide the platform.</strong> Luxury formulations, marketing assets, and inventory support.</div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#916b08] font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <div><strong className="text-black">Together, we create the opportunity.</strong> Consistent retail growth and long-term brand legacy.</div>
              </div>
            </div>

            <div className="pt-1">
              <a
                href="#apply-section"
                className="inline-flex items-center gap-1.5 bg-[#121212] hover:bg-[#D4AF37] text-white hover:text-black font-bold px-4 py-2 sm:py-2.5 rounded-lg text-[11px] uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span>Complete IBO Registration</span>
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
                &ldquo;My business is the future of my family.&rdquo;
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
                &ldquo;Your location doesn&apos;t have to define the size of your ambition.&rdquo;
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

      {/* ── SECTION 6: BRAND VISION & EMPOWERMENT POSTER SHOWCASE (ALL 12 BRAND POSTERS) ── */}
      <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-[#FAF8F5] border-b border-[#EAE7E1]">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>JENNYD SCENTS BRAND GALLERY</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif text-[#121212] font-normal">
            OUR BRAND VISION &amp; LEADERSHIP GALLERY
          </h2>

          <p className="text-neutral-600 text-xs sm:text-sm font-sans font-light leading-relaxed">
            Every scent tells a story. Explore our inspirational campaign posters celebrating leadership, independence, family values, and global collaboration.
          </p>

          <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mt-2" />
        </div>

        {/* 6-Card Interactive Brand Poster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRAND_POSTERS.map((poster, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              onClick={() => setLightboxImage(poster.image)}
              className="bg-white rounded-2xl border border-[#EAE7E1] overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-neutral-950">
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Click to Expand Full Poster
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                    {poster.subtitle}
                  </span>
                  <h3 className="text-base font-serif font-semibold text-[#121212]">
                    {poster.title}
                  </h3>
                </div>

                <p className="text-xs text-neutral-500 font-serif italic border-l-2 border-[#D4AF37] pl-2 py-0.5">
                  &ldquo;{poster.quote}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: LUXURY COMPACT MULTI-STEP IBO REGISTRATION FORM ── */}
      <section 
        id="apply-section" 
        className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Partnership Perks, Editorial & Trust Matrix (4 Cols on desktop) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 text-left">
            {/* Header Badge */}
            <div className="bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#242424] text-white p-6 sm:p-7 rounded-2xl border border-[#D4AF37]/30 shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>IBO PARTNERSHIP HUB</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-serif text-white font-medium leading-tight">
                Why Join Jennyd Scents?
              </h3>
              
              <p className="text-neutral-300 text-xs mt-2 leading-relaxed font-sans font-light">
                Establish your independent luxury perfumery business backed by genuine French & Middle Eastern formulations.
              </p>
            </div>

            {/* 4 Partnership Perks Cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white border border-[#EAE7E1] shadow-xs flex items-start gap-3.5 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#916b08] shrink-0 font-bold">
                  💎
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Exceptional Profit Margins</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Direct distributor wholesale pricing on all full-size bottles and collection discovery sets.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EAE7E1] shadow-xs flex items-start gap-3.5 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#916b08] shrink-0 font-bold">
                  📦
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Zero Inventory Risk</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Optional drop-ship fulfillment with temperature-regulated air courier dispatch across India.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EAE7E1] shadow-xs flex items-start gap-3.5 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#916b08] shrink-0 font-bold">
                  🎓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Sales Mentorship & Assets</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">High-resolution catalogs, fragrance pyramid layering guides, and marketing assets.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EAE7E1] shadow-xs flex items-start gap-3.5 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#916b08] shrink-0 font-bold">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Fast-Track KYC Activation</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Your official IBO code and Starter Kit allotment are confirmed within 24 hours.</p>
                </div>
              </div>
            </div>

            {/* Assistance & Privacy Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-amber-100/40 border border-amber-200/80 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#916b08]" />
                <span>256-Bit SSL Encrypted Registration</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Need registration assistance? Connect directly with our IBO Onboarding Desk via WhatsApp at <strong>+91 9892644788</strong>.
              </p>
            </div>
          </div>

          {/* Right Column: Multi-Step Registration Form (8 Cols on desktop) */}
          <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-[#EAE7E1] shadow-xl overflow-hidden text-left">
          
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#121212] via-[#1a1a1a] to-[#222222] text-white p-6 sm:p-8 border-b border-[#D4AF37]/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>OFFICIAL REGISTRATION PORTAL</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif text-white font-medium">
                  Independent Business Owner (IBO) Registration
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  Complete the 4 simple steps below to establish your official IBO code and starter kit allotment.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-right shrink-0">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Progress</span>
                <span className="text-sm font-serif font-bold text-[#D4AF37]">{currentStep * 25}% Completed</span>
              </div>
            </div>

            {/* Stepper Navigation Bar */}
            <div className="grid grid-cols-4 gap-2 pt-6 mt-2 border-t border-white/10">
              {FORM_STEPS.map((s) => {
                const isDone = currentStep > s.id;
                const isCurrent = currentStep === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (s.id < currentStep || validateStep(currentStep)) {
                        setCurrentStep(s.id);
                      }
                    }}
                    className={`text-left p-2 rounded-xl transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-white/15 border border-[#D4AF37]/60"
                        : isDone
                        ? "bg-white/5 border border-emerald-500/30 text-emerald-300"
                        : "opacity-40 hover:opacity-75"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone ? "bg-emerald-500 text-black" : isCurrent ? "bg-[#D4AF37] text-black" : "bg-neutral-700 text-white"
                      }`}>
                        {isDone ? <Check className="w-2.5 h-2.5" /> : s.id}
                      </span>
                      <span className="text-[11px] font-bold text-white truncate hidden sm:inline">{s.title}</span>
                    </div>
                    <p className="text-[9.5px] text-neutral-400 truncate hidden sm:block">{s.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 bg-[#FAF8F5]">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-medium">{formError}</span>
                  </div>
                )}

                {/* ── STEP 1: PERSONAL INFORMATION & KYC ── */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#916b08]" />
                        <span>Step 1: Personal Details &amp; Government ID</span>
                      </h3>
                      <p className="text-xs text-gray-500">Provide official identity details for legal registration compliance.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          1. Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="As per official ID"
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Mother's Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          2. Mother’s Name
                        </label>
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                          placeholder="Mother's name"
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Father's Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          3. Father’s Name
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          placeholder="Father's name"
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          4. Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          5. Gender
                        </label>
                        <div className="flex items-center gap-3 pt-1.5">
                          {["Male", "Female", "Other"].map((g) => (
                            <label key={g} className="flex items-center gap-1 text-xs text-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                value={g}
                                checked={formData.gender === g}
                                onChange={handleInputChange}
                                className="accent-[#D4AF37]"
                              />
                              <span>{g}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Occupation */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          6. Occupation
                        </label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          placeholder="Business, Professional..."
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Marital Status */}
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          7. Marital Status
                        </label>
                        <div className="flex items-center gap-4 pt-1">
                          {["Single", "Married", "Other"].map((m) => (
                            <label key={m} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                              <input
                                type="radio"
                                name="maritalStatus"
                                value={m}
                                checked={formData.maritalStatus === m}
                                onChange={handleInputChange}
                                className="accent-[#D4AF37]"
                              />
                              <span>{m}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* KYC Document Sub-section */}
                    <div className="pt-3 border-t border-gray-200 space-y-3">
                      <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#916b08] shrink-0 mt-0.5" />
                        <span><strong>Privacy Compliance:</strong> Aadhaar / National ID details are collected and stored securely only for official KYC compliance.</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-gray-700">
                              8. PAN Number / Tax Number
                            </label>
                            {formData.panTaxNumber && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                formData.panTaxNumber.length === 10 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                              }`}>
                                {formData.panTaxNumber.length}/10 {formData.panTaxNumber.length === 10 ? "✓" : ""}
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            name="panTaxNumber"
                            maxLength={10}
                            autoCapitalize="characters"
                            value={formData.panTaxNumber}
                            onChange={handleInputChange}
                            placeholder="ABCDE1234F"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 uppercase font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-gray-700">
                              9. Aadhaar Number / National ID
                            </label>
                            {formData.aadhaarNationalId && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                formData.aadhaarNationalId.replace(/\s/g, "").length === 12 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                              }`}>
                                {formData.aadhaarNationalId.replace(/\s/g, "").length}/12 {formData.aadhaarNationalId.replace(/\s/g, "").length === 12 ? "✓" : ""}
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={14}
                            name="aadhaarNationalId"
                            value={formData.aadhaarNationalId}
                            onChange={handleInputChange}
                            placeholder="XXXX XXXX XXXX"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs tracking-wider"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            10. Other Government ID (Optional)
                          </label>
                          <input
                            type="text"
                            name="otherGovId"
                            value={formData.otherGovId}
                            onChange={handleInputChange}
                            placeholder="ID details"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            11. Driving License Number (Optional)
                          </label>
                          <input
                            type="text"
                            name="drivingLicense"
                            maxLength={20}
                            autoCapitalize="characters"
                            value={formData.drivingLicense}
                            onChange={handleInputChange}
                            placeholder="DL Number"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none transition-all shadow-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            12. Passport Number (Optional)
                          </label>
                          <input
                            type="text"
                            name="passportNumber"
                            maxLength={15}
                            autoCapitalize="characters"
                            value={formData.passportNumber}
                            onChange={handleInputChange}
                            placeholder="Passport Number"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none transition-all shadow-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            13. Voter Card Number (Optional)
                          </label>
                          <input
                            type="text"
                            name="voterCardNumber"
                            maxLength={15}
                            autoCapitalize="characters"
                            value={formData.voterCardNumber}
                            onChange={handleInputChange}
                            placeholder="Voter ID"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 uppercase placeholder:text-gray-400 focus:outline-none transition-all shadow-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: CONTACT & ADDRESS ── */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#916b08]" />
                        <span>Step 2: Contact Information &amp; Residential Address</span>
                      </h3>
                      <p className="text-xs text-gray-500">Provide verified contact channels for logistics dispatch and updates.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-gray-700">
                            Mobile Number *
                          </label>
                          {formData.mobileNumber && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                              formData.mobileNumber.length === 10 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                            }`}>
                              {formData.mobileNumber.length}/10 {formData.mobileNumber.length === 10 ? "✓" : ""}
                            </span>
                          )}
                        </div>
                        <input
                          type="tel"
                          inputMode="tel"
                          maxLength={10}
                          name="mobileNumber"
                          required
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-gray-700">
                            WhatsApp Number *
                          </label>
                          <div className="flex items-center gap-1.5">
                            {formData.mobileNumber && formData.whatsappNumber !== formData.mobileNumber && (
                              <button
                                type="button"
                                onClick={copyMobileToWhatsApp}
                                className="text-[9.5px] font-bold text-[#916b08] hover:underline cursor-pointer bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                              >
                                Same as Mobile
                              </button>
                            )}
                            {formData.whatsappNumber && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                formData.whatsappNumber.length === 10 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                              }`}>
                                {formData.whatsappNumber.length}/10 {formData.whatsappNumber.length === 10 ? "✓" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <input
                          type="tel"
                          inputMode="tel"
                          maxLength={10}
                          name="whatsappNumber"
                          required
                          value={formData.whatsappNumber}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ibo@example.com"
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Alternate Contact (Optional)
                        </label>
                        <input
                          type="tel"
                          inputMode="tel"
                          maxLength={10}
                          name="alternateContact"
                          value={formData.alternateContact}
                          onChange={handleInputChange}
                          placeholder="10-digit number"
                          className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200 space-y-3">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        Residential Address
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">House / Flat No</label>
                          <input
                            type="text"
                            name="houseFlatNo"
                            value={formData.houseFlatNo}
                            onChange={handleInputChange}
                            placeholder="Flat / House No"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Street / Area</label>
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            placeholder="Street"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Landmark</label>
                          <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleInputChange}
                            placeholder="Near landmark"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">District</label>
                          <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder="District"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-gray-700">PIN Code</label>
                            {formData.pinCode && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                formData.pinCode.length === 6 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                              }`}>
                                {formData.pinCode.length}/6 {formData.pinCode.length === 6 ? "✓" : ""}
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleInputChange}
                            placeholder="6-digit PIN"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="India"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="flex items-center gap-2 text-xs text-gray-800 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            name="sameAsPermanent"
                            checked={formData.sameAsPermanent}
                            onChange={handleInputChange}
                            className="accent-[#D4AF37] w-3.5 h-3.5 rounded"
                          />
                          <span>Current address same as permanent address</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: SPONSOR & BANKING ── */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#916b08]" />
                        <span>Step 3: Sponsor &amp; Bank Details</span>
                      </h3>
                      <p className="text-xs text-gray-500">Enter sponsor details if referred, and bank account for commission payouts.</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-xs">
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wide block">
                        Sponsor / Referral Details
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Sponsor / Referral Name</label>
                          <input
                            type="text"
                            name="sponsorName"
                            value={formData.sponsorName}
                            onChange={handleInputChange}
                            placeholder="Sponsor's name"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Sponsor IBO ID</label>
                          <input
                            type="text"
                            name="sponsorIboId"
                            maxLength={20}
                            autoCapitalize="characters"
                            value={formData.sponsorIboId}
                            onChange={handleInputChange}
                            placeholder="IBO-XXXXXX"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 uppercase font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-gray-700">Sponsor Mobile Number</label>
                            {formData.sponsorMobile && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                formData.sponsorMobile.length === 10 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                              }`}>
                                {formData.sponsorMobile.length}/10 {formData.sponsorMobile.length === 10 ? "✓" : ""}
                              </span>
                            )}
                          </div>
                          <input
                            type="tel"
                            inputMode="tel"
                            maxLength={10}
                            name="sponsorMobile"
                            value={formData.sponsorMobile}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-xs">
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wide block">
                        Bank &amp; Payment Details
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Account Holder Name <span className="text-[#916b08] font-normal">(As Per PAN)</span>
                          </label>
                          <input
                            type="text"
                            name="accountHolderName"
                            value={formData.accountHolderName}
                            onChange={handleInputChange}
                            placeholder="Name as on PAN"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Bank Name</label>
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            placeholder="Bank Name"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-gray-700">Account Number</label>
                            {formData.accountNumber && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded font-mono bg-emerald-100 text-emerald-700">
                                {formData.accountNumber.length} Digits
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={18}
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            placeholder="Bank Account No"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs tracking-wider"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-gray-700">IFSC Code</label>
                            {formData.ifscCode && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                formData.ifscCode.length === 11 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                              }`}>
                                {formData.ifscCode.length}/11 {formData.ifscCode.length === 11 ? "✓" : ""}
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            name="ifscCode"
                            maxLength={11}
                            autoCapitalize="characters"
                            value={formData.ifscCode}
                            onChange={handleInputChange}
                            placeholder="SBIN0001234"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 uppercase font-mono placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">UPI ID (Optional)</label>
                          <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleInputChange}
                            placeholder="mobile@upi / bank@okhdfc"
                            className="w-full bg-white border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 4: PO & CONSENT DECLARATION ── */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#916b08]" />
                        <span>Step 4: Purchase Order Verification &amp; Declaration</span>
                      </h3>
                      <p className="text-xs text-gray-500">Confirm your Purchase Order and accept the official IBO compliance agreement.</p>
                    </div>

                    {/* How heard about us */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-gray-700">
                        How did you hear about us?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {HEAR_ABOUT_OPTIONS.map((opt) => {
                          const isChecked = formData.hearAboutUs.includes(opt);
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => toggleHearAboutOption(opt)}
                              className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                isChecked
                                  ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-xs"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <span>{isChecked ? "✓" : "+"}</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mandatory PO Box */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-1.5">
                      <label className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#916b08]" />
                        <span>PURCHASE ORDER NO (MANDATORY) *</span>
                      </label>
                      <p className="text-[11px] text-amber-800">
                        Enter the Purchase Order number for your starter package / inventory allotment.
                      </p>
                      <input
                        type="text"
                        name="purchaseOrderNo"
                        required
                        value={formData.purchaseOrderNo}
                        onChange={handleInputChange}
                        placeholder="PO-2026-XXXXXX"
                        className="w-full bg-white border border-amber-400 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-3.5 py-2.5 text-xs text-gray-900 font-mono font-bold placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>

                    {/* Declaration & Consent */}
                    <div className="space-y-3 p-4 bg-white rounded-xl border border-gray-200">
                      <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="consentAgreement"
                          required
                          checked={formData.consentAgreement}
                          onChange={handleInputChange}
                          className="accent-[#D4AF37] w-4 h-4 rounded mt-0.5 shrink-0"
                        />
                        <span className="leading-relaxed">
                          I hereby declare that the information provided by me is true and correct. I agree to comply with the company’s IBO Agreement, Code of Conduct, Terms &amp; Conditions, and policies. <span className="text-red-500 font-bold">*</span>
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="consentIncomeDisclosure"
                          required
                          checked={formData.consentIncomeDisclosure}
                          onChange={handleInputChange}
                          className="accent-[#D4AF37] w-4 h-4 rounded mt-0.5 shrink-0"
                        />
                        <span className="leading-relaxed">
                          I understand that registration as an IBO does not guarantee any particular income or financial return. Any income will depend on actual sales and business activity. <span className="text-red-500 font-bold">*</span>
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Form Action Controls */}
                <div className="pt-3 flex items-center justify-between border-t border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2.5 bg-[#121212] hover:bg-[#D4AF37] hover:text-black text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Continue to Step {currentStep + 1}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#F4E0A5] via-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Submitting..." : "Submit Registration"}</span>
                    </button>
                  )}
                </div>

              </form>
            ) : (
              <div className="py-8 text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <h4 className="text-xl font-serif text-gray-900 font-bold">
                  Registration Received!
                </h4>
                
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  Thank you <strong className="text-black">{formData.fullName}</strong>. Your IBO registration and Purchase Order (<span className="font-mono text-[#916b08] font-bold">{formData.purchaseOrderNo}</span>) have been received. We will verify and connect with you within 24 hours.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                  <button
                    onClick={handleWhatsAppDirect}
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Confirm on WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                  >
                    New Registration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

      {/* ── 8. LEGAL NOTICE ── */}
      <section className="py-6 px-4 max-w-4xl mx-auto w-full text-left">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-[#916b08]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-900">
              Official Business Collaboration &amp; Earnings Notice
            </span>
          </div>
          <p className="text-gray-500 text-[11px] font-light leading-relaxed">
            Jennyd Scents does not guarantee financial freedom or a specific level of income. Earnings depend on actual sales, customer activity, effort, and the official compensation rules. Independent Business Owners are not employees of Jennyd Scents.
          </p>
        </div>
      </section>

      {/* ── LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />
            <div className="relative z-10 max-w-3xl max-h-[85vh] w-full h-full flex items-center justify-center p-2">
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-2 right-2 bg-white/20 hover:bg-[#D4AF37] text-white hover:text-black p-2 rounded-full cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image src={lightboxImage} alt="Poster" fill className="object-contain rounded-xl" />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

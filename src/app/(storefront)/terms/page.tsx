"use client";

import { 
  UserPlus, TrendingUp, CheckCircle2, Users, Scale, Briefcase, MessageSquare, 
  Fingerprint, Share2, DollarSign, Tag, BookOpen, FileText, Globe, Lock, 
  XOctagon, UserX, Activity, Edit3, ShieldAlert, CheckSquare, Gavel, Mail, MapPin 
} from "lucide-react";

export default function TermsAndConditionsPage() {
  const sections = [
    {
      id: "registration",
      num: "1",
      title: "Distributor Registration",
      icon: <UserPlus className="w-4 h-4 text-[#D4AF37]" />,
      content: "Every applicant must complete the official registration process. The company reserves the right to approve or reject any distributor application without assigning any reason."
    },
    {
      id: "sales-requirement",
      num: "2",
      title: "Minimum Direct Sales Requirement",
      icon: <TrendingUp className="w-4 h-4 text-[#D4AF37]" />,
      content: "Every Direct Distributor must personally complete a minimum of 5 direct retail sales during each qualification period to remain an Active Distributor. Personal sales must be genuine sales made directly by the distributor to retail customers. Self-purchases or fictitious orders made solely to qualify are strictly prohibited."
    },
    {
      id: "active-status",
      num: "3",
      title: "Active Distributor Status",
      icon: <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />,
      content: "Only Active Distributors are eligible for commissions, incentives, bonuses, rank advancements, promotional rewards, and recognition. Failure to maintain the minimum direct sales requirement may result in the distributor being classified as Inactive."
    },
    {
      id: "downline-support",
      num: "4",
      title: "Downline Support Obligation",
      icon: <Users className="w-4 h-4 text-[#D4AF37]" />,
      content: "Every distributor is responsible for supporting, guiding, and mentoring the distributors who join under their Business ID. Support includes product knowledge, business training, sales guidance, ethical conduct, and motivation. Failure to provide reasonable support to the downline may result in disciplinary action if complaints are verified."
    },
    {
      id: "ethical-practices",
      num: "5",
      title: "Ethical Business Practices",
      icon: <Scale className="w-4 h-4 text-[#D4AF37]" />,
      content: "Distributors must conduct business honestly and professionally. Misleading income claims, false product claims, or deceptive marketing practices are strictly prohibited. Distributors must comply with all applicable laws and regulations."
    },
    {
      id: "independent-relationship",
      num: "6",
      title: "Independent Business Relationship",
      icon: <Briefcase className="w-4 h-4 text-[#D4AF37]" />,
      content: "A Direct Distributor is an independent business owner and not an employee, partner, or legal representative of JENNYD SCENTS. Distributors are not authorized to make commitments or promises on behalf of the company."
    },
    {
      id: "customer-service",
      num: "7",
      title: "Customer Service Responsibility",
      icon: <MessageSquare className="w-4 h-4 text-[#D4AF37]" />,
      content: "Distributors must provide prompt and courteous service to customers. Customer complaints should be addressed professionally and reported to the company when necessary."
    },
    {
      id: "business-id",
      num: "8",
      title: "Business ID Usage",
      icon: <Fingerprint className="w-4 h-4 text-[#D4AF37]" />,
      content: "Each distributor is entitled to only one Business ID unless otherwise approved by the company. Sharing, selling, transferring, or misusing a Business ID is prohibited."
    },
    {
      id: "sponsorship",
      num: "9",
      title: "Sponsorship Rules",
      icon: <Share2 className="w-4 h-4 text-[#D4AF37]" />,
      content: "A distributor may sponsor new distributors only through their own registered Business ID. Changing sponsors after registration is not permitted except under exceptional circumstances approved by the company."
    },
    {
      id: "commission-eligibility",
      num: "10",
      title: "Commission Eligibility",
      icon: <DollarSign className="w-4 h-4 text-[#D4AF37]" />,
      content: "Commissions will be paid only on verified and successfully completed sales. Returned, cancelled, or fraudulent orders will not qualify for commissions."
    },
    {
      id: "pricing",
      num: "11",
      title: "Product Pricing",
      icon: <Tag className="w-4 h-4 text-[#D4AF37]" />,
      content: "Products must be sold at the company's approved retail prices. Unauthorized discounting or price manipulation may result in disciplinary action."
    },
    {
      id: "training",
      num: "12",
      title: "Training Responsibility",
      icon: <BookOpen className="w-4 h-4 text-[#D4AF37]" />,
      content: "Every distributor is expected to attend company training sessions and encourage their downline to participate in official business and product training."
    },
    {
      id: "marketing-standards",
      num: "13",
      title: "Marketing Standards",
      icon: <FileText className="w-4 h-4 text-[#D4AF37]" />,
      content: "Only company-approved promotional materials may be used. Unauthorized modifications to company logos, trademarks, brochures, or presentations are prohibited."
    },
    {
      id: "online-promotion",
      num: "14",
      title: "Online Promotion",
      icon: <Globe className="w-4 h-4 text-[#D4AF37]" />,
      content: "Distributors may promote products through social media and digital platforms only in accordance with company guidelines. False reviews, fake testimonials, and misleading advertisements are prohibited."
    },
    {
      id: "confidentiality",
      num: "15",
      title: "Confidentiality",
      icon: <Lock className="w-4 h-4 text-[#D4AF37]" />,
      content: "Customer information, distributor data, business strategies, and compensation details are confidential and must not be disclosed without written authorization."
    },
    {
      id: "prohibited-activities",
      num: "16",
      title: "Prohibited Activities",
      icon: <XOctagon className="w-4 h-4 text-[#D4AF37]" />,
      content: "Fake registrations, multiple Business IDs without approval, fraudulent transactions, money laundering, misrepresentation of products or income, harassment or unethical conduct, and cross-recruiting distributors from within the network are strictly prohibited."
    },
    {
      id: "suspension-termination",
      num: "17",
      title: "Suspension or Termination",
      icon: <UserX className="w-4 h-4 text-[#D4AF37]" />,
      content: "JENNYD SCENTS reserves the right to suspend or terminate a distributor for: violation of company policies, fraudulent activities, unethical behavior, repeated customer complaints, non-compliance with legal requirements, or activities that damage the reputation of the company."
    },
    {
      id: "continuity",
      num: "18",
      title: "Business Continuity",
      icon: <Activity className="w-4 h-4 text-[#D4AF37]" />,
      content: "Distributor status may lapse if minimum activity requirements are not maintained. Reactivation shall be subject to the company's prevailing policies."
    },
    {
      id: "amendments",
      num: "19",
      title: "Amendments",
      icon: <Edit3 className="w-4 h-4 text-[#D4AF37]" />,
      content: "JENNYD SCENTS reserves the right to modify, update, or revise these Terms & Conditions, the compensation plan, qualification criteria, incentives, and business policies at any time. Updated policies shall become effective immediately upon publication."
    },
    {
      id: "limitation-liability",
      num: "20",
      title: "Limitation of Liability",
      icon: <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />,
      content: "The company shall not be liable for any personal business losses, indirect damages, or loss of profits incurred by distributors. Earnings depend entirely on individual effort, sales performance, customer service, leadership, and compliance with company policies. No income is guaranteed."
    },
    {
      id: "compliance-laws",
      num: "21",
      title: "Compliance with Laws",
      icon: <Gavel className="w-4 h-4 text-[#D4AF37]" />,
      content: "All distributors must comply with applicable direct selling laws, consumer protection regulations, tax laws, and other legal requirements in the countries where they operate."
    },
    {
      id: "acceptance",
      num: "22",
      title: "Acceptance of Terms",
      icon: <CheckSquare className="w-4 h-4 text-[#D4AF37]" />,
      content: "By registering as a JENNYD SCENTS Direct Distributor, the applicant confirms that they have read, understood, and agreed to abide by these Terms & Conditions and all future amendments issued by the company."
    },
    {
      id: "governing-law",
      num: "23",
      title: "Governing Law & Jurisdiction",
      icon: <MapPin className="w-4 h-4 text-[#D4AF37]" />,
      content: "These Terms & Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any dispute, claim, or legal proceeding arising out of or relating to the JENNYD SCENTS Direct Distributor Program, product purchase, business activities, or these Terms & Conditions shall be subject to the exclusive jurisdiction of the competent courts located in Lucknow, Uttar Pradesh, India. Both the Company and the Distributor expressly agree that only the courts at Lucknow shall have exclusive jurisdiction over any legal proceedings, and no other court or tribunal shall have jurisdiction, except where otherwise required by applicable law. Before initiating any legal proceedings, the parties shall make reasonable efforts to resolve the dispute amicably through mutual discussions. If an amicable settlement cannot be reached, the matter shall be referred to the competent courts at Lucknow, Uttar Pradesh, whose decision shall be binding, subject to applicable law. This clause should be read together with all other terms and policies of JENNYD SCENTS."
    }
  ];

  const handleScrollTo = (id: string) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      const offset = 90; // height of header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Header Section */}
      <div className="bg-neutral-50/50 border-b border-neutral-100 py-10 sm:py-14">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 text-center space-y-2 sm:space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
            Jennyd Scents
          </span>
          <h1 className="text-xl sm:text-2.5xl md:text-3.5xl font-serif font-normal text-gray-900 tracking-wide max-w-2xl mx-auto leading-snug">
            Direct Distributor Terms & Conditions
          </h1>
          <div className="h-[1.5px] w-10 bg-[#D4AF37] mx-auto my-3 sm:my-4" />
          <p className="text-[10px] sm:text-xs text-gray-400 font-sans tracking-wide">
            Effective Date: July 16, 2026
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 flex flex-col lg:flex-row gap-8 lg:gap-10">
        
        {/* Left Sticky Sidebar Index (Desktop Only) */}
        <aside className="hidden lg:block w-1/4">
          <div className="sticky top-28 space-y-5 p-5 border border-neutral-100 rounded-2xl bg-white shadow-2xs">
            <h4 className="font-serif text-base font-semibold text-gray-900 border-b border-neutral-100 pb-2.5 tracking-wide">
              Terms Navigation
            </h4>
            <nav className="flex flex-col gap-2.5 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className="flex items-center gap-2.5 text-left text-xs font-sans text-gray-655 hover:text-[#D4AF37] transition-all duration-300 group cursor-pointer"
                >
                  <span className="w-5.5 h-5.5 rounded-full bg-neutral-50 flex items-center justify-center text-[9px] font-bold text-gray-600 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-all shrink-0">
                    {sec.num}
                  </span>
                  <span className="truncate max-w-[180px] text-gray-650 group-hover:text-[#D4AF37] transition-all">{sec.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Content Column */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 sm:gap-8">
          
          {/* Quick Jump Selector Dropdown (Visible on Mobile & Tablet only) */}
          <div className="lg:hidden w-full border border-neutral-100 rounded-xl p-3.5 sm:p-4 bg-neutral-50/50">
            <label className="block text-[9px] font-bold text-gray-455 uppercase tracking-widest mb-1.5 font-sans">
              Jump to Section
            </label>
            <select 
              onChange={(e) => handleScrollTo(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-xl py-2 px-3 text-xs font-sans text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10 focus:border-[#D4AF37] transition-all duration-300 cursor-pointer"
            >
              <option value="">Select a section...</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  Section {sec.num}: {sec.title}
                </option>
              ))}
            </select>
          </div>

          {/* Introduction block */}
          <div className="prose prose-neutral max-w-none">
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
              The following Terms & Conditions govern the JENNYD SCENTS Direct Distributor Program. By registering as a Direct Distributor, you acknowledge that you have read, understood, and agreed to comply with all the policies outlined below.
            </p>
          </div>

          {/* Important Notice Callout Box */}
          <div className="bg-[#D4AF37]/5 border-l-4 border-[#D4AF37] rounded-r-2xl p-4 sm:p-5 lg:p-6">
            <div className="flex gap-3">
              <ShieldAlert className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-sans">
                  Important Notice
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                  Maintaining a minimum of five (5) direct retail sales and actively supporting distributors sponsored under your Business ID are mandatory requirements for remaining an Active Distributor and for eligibility to receive commissions, bonuses, incentives, and other company benefits. Failure to meet these requirements may result in inactive status or suspension of benefits, as determined by JENNYD SCENTS.
                </p>
              </div>
            </div>
          </div>

          {/* Section details */}
          <div className="space-y-4 sm:space-y-5">
            {sections.map((sec) => (
              <div 
                key={sec.id} 
                id={sec.id}
                className="p-4 sm:p-5 lg:p-6 rounded-2xl border border-neutral-100 hover:border-neutral-150 transition-all duration-300 bg-white hover:shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="w-8.5 h-8.5 rounded-xl bg-[#D4AF37]/5 flex items-center justify-center shrink-0">
                    {sec.icon}
                  </div>
                  {/* Text contents */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-[#D4AF37] font-sans tracking-wider">
                        SECTION {sec.num}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-serif font-medium text-gray-900">
                      {sec.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                      {sec.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Banner Callout */}
          <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 mt-4">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-base sm:text-lg font-serif text-gray-900 font-medium">Contact Program Support</h3>
              <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                For questions regarding the distributor program, registrations, or business accounts, please contact support.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
              <a 
                href="mailto:support@jennydscents.com" 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-[0.98]"
              >
                <Mail className="w-3.5 h-3.5" /> Email Program Support
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

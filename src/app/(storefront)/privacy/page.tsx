"use client";

import { Globe, Mail, ShieldAlert, Package, CreditCard, Clock, Truck, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "sales-final",
      num: "1",
      title: "All Sales Are Final",
      icon: <CreditCard className="w-4 h-4 text-[#D4AF37]" />,
      content: "All purchases made from Jennyd Scents are considered final. We do not accept returns, exchanges, refunds, or cancellations once an order has been confirmed, processed, or shipped, except where required by applicable law."
    },
    {
      id: "product-nature",
      num: "2",
      title: "Nature of Fragrance Products",
      icon: <Package className="w-4 h-4 text-[#D4AF37]" />,
      content: "Perfumes, attars, essential oils, and other fragrance products are personal-use items. For reasons of hygiene, health, safety, and product integrity, we do not accept returns or exchanges after delivery."
    },
    {
      id: "no-refunds",
      num: "3",
      title: "No Refunds",
      icon: <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />,
      content: "Jennyd Scents does not provide refunds for: Change of mind, personal preference regarding fragrance, color, or packaging, incorrect product selection by the customer, failure to read the product description before purchase, orders placed by mistake, business kit or promotional package purchases, membership or enrollment fees (where applicable), and shipping or handling charges."
    },
    {
      id: "cancellation",
      num: "4",
      title: "Order Cancellation",
      icon: <Clock className="w-4 h-4 text-[#D4AF37]" />,
      content: "Orders cannot be canceled after payment has been successfully processed or after the order enters fulfillment. Please review your order carefully before completing your purchase."
    },
    {
      id: "damaged-products",
      num: "5",
      title: "Damaged or Incorrect Products",
      icon: <Package className="w-4 h-4 text-[#D4AF37]" />,
      content: "If you receive a product that is damaged during transit, defective upon arrival, or different from the item ordered, you must notify Jennyd Scents within 48 hours of receiving the shipment. Please provide your order number, clear photographs of the product and packaging, and a description of the issue. Eligible claims will be reviewed by our Quality Assurance team. At our discretion, we may offer a replacement or another appropriate resolution where applicable."
    },
    {
      id: "shipments",
      num: "6",
      title: "Lost or Delayed Shipments",
      icon: <Truck className="w-4 h-4 text-[#D4AF37]" />,
      content: "Jennyd Scents is not responsible for delivery delays caused by courier or postal services, customs clearance, weather conditions, natural disasters, government actions, or events beyond our reasonable control."
    },
    {
      id: "business-purchases",
      num: "7",
      title: "Business Partner Purchases",
      icon: <Globe className="w-4 h-4 text-[#D4AF37]" />,
      content: "Products purchased by Independent Business Partners, distributors, or affiliates for business purposes are also subject to this policy unless otherwise required by local law or specified in a separate written agreement."
    },
    {
      id: "refusal",
      num: "8",
      title: "Refusal of Delivery",
      icon: <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />,
      content: "Refusing delivery or failing to accept a shipment does not entitle the purchaser to a refund. Any additional costs incurred as a result of refused deliveries may be deducted from any amount payable where permitted by law."
    },
    {
      id: "decline-claims",
      num: "9",
      title: "Right to Decline Claims",
      icon: <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />,
      content: "Jennyd Scents reserves the right to reject any return, refund, replacement, or exchange request where: the claim is fraudulent or misleading, the product has been used, altered, or damaged after delivery, required evidence is not provided, the request falls outside the applicable reporting period, or the request does not meet the terms of this policy."
    },
    {
      id: "consumer-rights",
      num: "10",
      title: "Consumer Rights",
      icon: <Globe className="w-4 h-4 text-[#D4AF37]" />,
      content: "Nothing in this policy is intended to exclude or limit any mandatory consumer rights that cannot legally be excluded under the laws of the country where the purchase was made. Where applicable law provides additional rights, those rights will prevail."
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
      {/* Hero / Header Section */}
      <div className="bg-neutral-50/50 border-b border-neutral-100 py-10 sm:py-14">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 text-center space-y-2 sm:space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
            Jennyd Scents
          </span>
          <h1 className="text-xl sm:text-2.5xl md:text-3.5xl font-serif font-normal text-gray-900 tracking-wide max-w-2xl mx-auto leading-snug">
            No Refund, No Return & Cancellation Policy
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
              Policy Sections
            </h4>
            <nav className="flex flex-col gap-2.5">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className="flex items-center gap-2.5 text-left text-xs font-sans text-gray-650 hover:text-[#D4AF37] transition-all duration-300 group cursor-pointer"
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
            <label className="block text-[9px] font-bold text-gray-450 uppercase tracking-widest mb-1.5 font-sans">
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
              At Jennyd Scents, we are committed to delivering premium-quality fragrance products and ensuring that every order is carefully inspected before dispatch. By placing an order through our website, authorized distributors, or business partners, you acknowledge and agree to the following policy.
            </p>
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
              <h3 className="text-base sm:text-lg font-serif text-gray-900 font-medium">Have Questions?</h3>
              <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                For questions regarding this policy or to submit product damage reports, please get in touch with our customer service team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
              <a 
                href="mailto:support@jennydscents.com" 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-[0.98]"
              >
                <Mail className="w-3.5 h-3.5" /> Email Support
              </a>
              <a 
                href="/" 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-neutral-300 hover:border-neutral-450 bg-white text-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98]"
              >
                <Globe className="w-3.5 h-3.5" /> Visit Website
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

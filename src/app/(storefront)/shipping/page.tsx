"use client";

import { 
  Clock, MapPin, CreditCard, Calendar, Globe, Eye, Package, 
  AlertTriangle, AlertCircle, ClipboardList, ShieldAlert, XCircle, 
  Zap, RefreshCw, Mail 
} from "lucide-react";

export default function ShippingPolicyPage() {
  const sections = [
    {
      id: "processing",
      num: "1",
      title: "Order Processing",
      icon: <Clock className="w-4 h-4 text-[#D4AF37]" />,
      content: "Orders are processed only after successful payment confirmation. Standard processing time is 1–3 business days, excluding weekends and public holidays. During peak seasons, promotions, or product launches, processing times may be extended. Jennyd Scents reserves the right to verify orders before dispatch to prevent fraud or unauthorized transactions."
    },
    {
      id: "destinations",
      num: "2",
      title: "Shipping Destinations",
      icon: <MapPin className="w-4 h-4 text-[#D4AF37]" />,
      content: "Jennyd Scents ships to selected domestic and international destinations. Shipping availability may vary depending on local regulations, customs requirements, and courier service coverage. If delivery to your location is unavailable, we will notify you before processing your order."
    },
    {
      id: "charges",
      num: "3",
      title: "Shipping Charges",
      icon: <CreditCard className="w-4 h-4 text-[#D4AF37]" />,
      content: "Shipping charges are calculated based on your delivery destination, order weight and dimensions, shipping method selected, and any applicable taxes, duties, or surcharges (where applicable). Shipping costs will be displayed during checkout before payment is completed."
    },
    {
      id: "delivery-time",
      num: "4",
      title: "Estimated Delivery Time",
      icon: <Calendar className="w-4 h-4 text-[#D4AF37]" />,
      content: "Estimated delivery times are as follows: Domestic Orders take 3–7 business days; International Orders take 7–21 business days. Delivery times are estimates only and are not guaranteed."
    },
    {
      id: "international",
      num: "5",
      title: "International Shipping",
      icon: <Globe className="w-4 h-4 text-[#D4AF37]" />,
      content: "For international shipments: Customers are responsible for ensuring that imported products comply with their country's laws and regulations. Customs duties, import taxes, VAT, brokerage fees, or other governmental charges are the responsibility of the customer unless otherwise stated. Delivery may be delayed due to customs inspections or clearance procedures."
    },
    {
      id: "tracking",
      num: "6",
      title: "Order Tracking",
      icon: <Eye className="w-4 h-4 text-[#D4AF37]" />,
      content: "Once your order has been dispatched, you will receive a shipping confirmation along with tracking information, where available. Tracking updates are provided by the shipping carrier and may not always reflect real-time movement."
    },
    {
      id: "delivery",
      num: "7",
      title: "Delivery",
      icon: <Package className="w-4 h-4 text-[#D4AF37]" />,
      content: "Orders will be delivered to the shipping address provided during checkout. Customers are responsible for ensuring that all shipping information is complete and accurate. Jennyd Scents is not responsible for delays or failed deliveries resulting from incorrect or incomplete address details."
    },
    {
      id: "failed-attempts",
      num: "8",
      title: "Failed Delivery Attempts",
      icon: <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />,
      content: "If delivery cannot be completed due to an incorrect address, recipient unavailability, refusal to accept delivery, or failure to collect from the courier, the shipment may be returned or disposed of according to the courier's policy. Additional shipping charges for reshipment shall be the responsibility of the customer."
    },
    {
      id: "lost-damaged",
      num: "9",
      title: "Lost, Delayed, or Damaged Shipments",
      icon: <AlertCircle className="w-4 h-4 text-[#D4AF37]" />,
      content: "While Jennyd Scents carefully packages every order, we are not liable for delays caused by weather conditions, customs clearance, transportation disruptions, government restrictions, natural disasters, carrier delays, or other events beyond our reasonable control. If your shipment arrives visibly damaged, please notify us within 48 hours of delivery with photographs of the package and product."
    },
    {
      id: "incorrect-missing",
      num: "10",
      title: "Incorrect or Missing Items",
      icon: <ClipboardList className="w-4 h-4 text-[#D4AF37]" />,
      content: "If you receive an incorrect product or if an item is missing from your shipment, please contact our customer support within 48 hours of receiving your order. Claims submitted after this period may not be eligible for review."
    },
    {
      id: "risk-of-loss",
      num: "11",
      title: "Risk of Loss",
      icon: <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />,
      content: "Ownership and risk of loss transfer to the customer upon delivery of the products to the shipping address or to the carrier, where permitted by applicable law."
    },
    {
      id: "restrictions",
      num: "12",
      title: "Shipping Restrictions",
      icon: <XCircle className="w-4 h-4 text-[#D4AF37]" />,
      content: "Jennyd Scents reserves the right to: refuse shipment to restricted locations, cancel orders where shipping is prohibited by law, modify available shipping methods without prior notice, or limit quantities for specific destinations."
    },
    {
      id: "force-majeure",
      num: "13",
      title: "Force Majeure",
      icon: <Zap className="w-4 h-4 text-[#D4AF37]" />,
      content: "Jennyd Scents shall not be liable for any delay or failure in delivery caused by circumstances beyond its reasonable control, including but not limited to natural disasters, pandemics, labor disputes, acts of government, war, civil unrest, transportation interruptions, or courier service disruptions."
    },
    {
      id: "updates",
      num: "14",
      title: "Policy Updates",
      icon: <RefreshCw className="w-4 h-4 text-[#D4AF37]" />,
      content: "Jennyd Scents reserves the right to modify or update this Shipping Policy at any time without prior notice. Any changes will become effective immediately upon publication on our website."
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
            Shipping Policy
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
              Shipping Sections
            </h4>
            <nav className="flex flex-col gap-2.5 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className="flex items-center gap-2.5 text-left text-xs font-sans text-gray-650 hover:text-[#D4AF37] transition-all duration-300 group cursor-pointer"
                >
                  <span className="w-5.5 h-5.5 rounded-full bg-neutral-50 flex items-center justify-center text-[9px] font-bold text-gray-600 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-all shrink-0">
                    {sec.num}
                  </span>
                  <span className="truncate max-w-[180px] text-gray-655 group-hover:text-[#D4AF37] transition-all">{sec.title}</span>
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
              At Jennyd Scents, we are committed to delivering your orders safely, efficiently, and on time. This Shipping Policy outlines the terms and conditions governing the shipment and delivery of products purchased through our website, authorized distributors, or independent business partners.
            </p>
          </div>

          {/* Section Details */}
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
              <h3 className="text-base sm:text-lg font-serif text-gray-900 font-medium">Contact Shipping Support</h3>
              <p className="text-xs text-gray-505 max-w-md leading-relaxed">
                For shipping-related inquiries, delivery updates, or address corrections, please contact our logistics support team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
              <a 
                href="mailto:support@jennydscents.com" 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-[0.98]"
              >
                <Mail className="w-3.5 h-3.5" /> Email Shipping Support
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

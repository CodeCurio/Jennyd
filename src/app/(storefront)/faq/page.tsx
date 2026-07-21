import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import Link from "next/link";
import { HelpCircle, Mail, Phone, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions | Jennyd Perfumes",
  description: "Find answers to common questions about Jennyd luxury fragrances, orders, shipping, returns, and scent longevity.",
};

const FAQ_CATEGORIES = [
  {
    category: "Orders & Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit & debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD) across India via Razorpay."
      },
      {
        question: "Can I modify or cancel my order after placing it?",
        answer: "Orders are processed rapidly to ensure prompt dispatch. If you need to make changes or cancel, please contact us within 2 hours of placing your order at support@jennyd.com or +91 9682899765."
      },
      {
        question: "How can I track my order status?",
        answer: "Once your order is dispatched, you will receive an SMS and email notification containing your courier tracking link. You can also view your live order status in your Account dashboard under 'My Orders'."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        question: "What are your shipping charges and delivery timelines?",
        answer: "We offer complimentary Express Shipping on all orders above ₹999 across India. Standard delivery typically takes 3–5 business days depending on your location."
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently we deliver across all pin codes in India. We are working on expanding our international shipping soon."
      }
    ]
  },
  {
    category: "Fragrances & Longevity",
    items: [
      {
        question: "How long do Jennyd perfumes last on skin & clothing?",
        answer: "Our Eau de Parfums feature high concentration fragrance oils formulated for exceptional longevity. Expect 8 to 12+ hours of performance on skin, and up to 24+ hours on fabrics."
      },
      {
        question: "Are your perfumes 100% authentic and cruelty-free?",
        answer: "Yes, all Jennyd creations are 100% authentic, crafted with ethically sourced premium oils, and are strictly 100% cruelty-free and dermatologically tested."
      },
      {
        question: "How should I store my perfume to maintain its quality?",
        answer: "Store your fragrance bottles in a cool, dry place away from direct sunlight and heat variations. Avoid storing perfumes in humid bathrooms to preserve the delicate olfactory top notes."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        question: "What is your return & replacement policy?",
        answer: "Unopened and factory-sealed perfume boxes are eligible for returns or replacements within 7 days of delivery. If you receive a damaged or defective item, please contact our support team immediately with unboxing proof for an instant hassle-free replacement."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] block mb-3">
            Help & Guidance
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-4 uppercase">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about our luxury fragrance collections, order fulfillment, shipping details, and returns.
          </p>
        </div>

        {/* FAQ Accordions by Section */}
        <div className="space-y-12 mb-16">
          {FAQ_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-serif font-bold uppercase tracking-wide text-[#1A1A1A] pb-4 border-b border-neutral-100 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#D4AF37]" /> {cat.category}
              </h2>
              <Accordion>
                {cat.items.map((item, iIdx) => (
                  <AccordionItem key={iIdx} title={item.question} defaultOpen={idx === 0 && iIdx === 0}>
                    <p className="text-neutral-600 leading-relaxed text-xs sm:text-sm pt-1 pb-2">
                      {item.answer}
                    </p>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="bg-[#FAF9F6] border border-neutral-200 p-8 sm:p-10 text-center">
          <h3 className="text-2xl font-serif font-bold uppercase tracking-wide text-[#1A1A1A] mb-2">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-md mx-auto">
            Our fragrance specialists are available to assist you with order inquiries, scent recommendations, or custom gifting needs.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest">
            <Link 
              href="/contact"
              className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] px-6 py-3 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Contact Us
            </Link>
            <a 
              href="tel:+919682899765"
              className="bg-white text-[#1A1A1A] border border-neutral-300 hover:border-black px-6 py-3 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> +91 9682899765
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

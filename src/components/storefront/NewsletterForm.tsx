"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="w-full">
      {subscribed ? (
        <div className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-3 rounded-xl text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#D4AF37]" />
          <span>Thank you! You are now subscribed to private offers.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            required
            className="w-full bg-[#1A1A1A] text-white text-xs px-4 py-3.5 pr-28 rounded-xl border border-white/10 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-neutral-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#D4AF37] hover:bg-[#b8952c] text-black font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Join</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      )}
    </div>
  );
}

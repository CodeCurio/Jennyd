"use client";

import { Globe, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/lib/store/CurrencyContext";

export function FooterLanguageSelector() {
  const [langName, setLangName] = useState("English");

  useEffect(() => {
    // Read preference on load
    const savedLang = localStorage.getItem("user-language-pref") || "en";
    const names: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      es: "Spanish",
      fr: "French",
      ar: "Arabic",
      de: "German",
      it: "Italian",
      ru: "Russian"
    };
    setLangName(names[savedLang] || "English");

    // Listen for storage change events to keep footers updated
    const handleStorageChange = () => {
      const lang = localStorage.getItem("user-language-pref") || "en";
      setLangName(names[lang] || "English");
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Add custom window event listener for in-app changes
    window.addEventListener("languageChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChanged", handleStorageChange);
    };
  }, []);

  const handleClick = () => {
    if (window.showLanguageSelector) {
      window.showLanguageSelector();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-xs text-secondary-foreground hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors cursor-pointer border border-neutral-350/50 rounded-full px-3.5 py-1.5 hover:border-[#D4AF37]/35 shadow-2xs"
    >
      <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
      <span className="font-light">Language: <span className="font-medium text-foreground">{langName}</span></span>
    </button>
  );
}

export function FooterCurrencySelector() {
  const { currency } = useCurrency();
  const activeCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];

  const handleClick = () => {
    if (window.showCurrencySelector) {
      window.showCurrencySelector();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-xs text-secondary-foreground hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors cursor-pointer border border-neutral-350/50 rounded-full px-3.5 py-1.5 hover:border-[#D4AF37]/35 shadow-2xs animate-fade-in"
    >
      <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
      <span className="font-light">Currency: <span className="font-medium text-foreground">{activeCurrency.code} ({activeCurrency.symbol.trim()})</span></span>
    </button>
  );
}

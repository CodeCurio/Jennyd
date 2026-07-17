"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe, X, Loader2 } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
    showLanguageSelector?: () => void;
  }
}

export function LanguageSelectorPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);

  // Helper to set cookie for Google Translate (keeps state preserved on hard refreshes)
  const setLanguageCookie = (langCode: string) => {
    const value = `/en/${langCode}`;
    document.cookie = `googtrans=${value}; path=/;`;
    document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname};`;
    
    // Set cookie on base domain for subdomain support
    const hostParts = window.location.hostname.split(".");
    if (hostParts.length > 2) {
      const domain = "." + hostParts.slice(-2).join(".");
      document.cookie = `googtrans=${value}; path=/; domain=${domain};`;
    }
  };

  // Helper to programmatically apply saved language via select box trigger
  const applySavedLanguage = (langCode: string, retries = 30) => {
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (retries > 0) {
      setTimeout(() => applySavedLanguage(langCode, retries - 1), 100);
    }
  };

  useEffect(() => {
    // 1. Register global trigger callback for header and footer icons
    window.showLanguageSelector = () => {
      setIsOpen(true);
    };

    // 2. Initialize Google Translate callback targeting the modal's container
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false
          }, 'google_translate_element');
          setIsTranslateLoaded(true);
        }
      } catch (e) {
        console.error("Google Translate Init error:", e);
      }
    };

    // 3. Inject script dynamically if missing
    const scriptId = "google-translate-script-element";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit();
      }
      setIsTranslateLoaded(true);
    }

    // 4. Open the modal on first load or browser refresh
    setIsOpen(true);
    
    // Auto-apply saved language preference on load if it exists
    const savedLang = localStorage.getItem("user-language-pref");
    if (savedLang && savedLang !== "en") {
      applySavedLanguage(savedLang);
    }
  }, []);

  // 5. On page transitions (route changes), translate silently in the background (DO NOT open popup)
  useEffect(() => {
    const savedLang = localStorage.getItem("user-language-pref");
    if (savedLang && savedLang !== "en") {
      applySavedLanguage(savedLang);
    }
  }, [pathname]);

  // 6. Listen for changes in Google's native dropdown selector
  useEffect(() => {
    const handleNativeChange = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      if (target && target.classList.contains("goog-te-combo")) {
        const selectedLang = target.value;
        localStorage.setItem("user-language-pref", selectedLang);
        setLanguageCookie(selectedLang);
        
        // Notify other trigger components (like the footer language button) to update their label
        window.dispatchEvent(new Event("languageChanged"));
        
        // Close modal automatically after selection
        setTimeout(() => {
          setIsOpen(false);
        }, 800);
      }
    };

    document.addEventListener("change", handleNativeChange);
    return () => document.removeEventListener("change", handleNativeChange);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[999] flex items-center justify-center px-4 transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Card Dialog */}
      <div 
        className={`relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#D4AF37]/35 shadow-2xl flex flex-col items-center gap-6 transition-all duration-300 transform ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-2">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-normal text-gray-900 tracking-wide text-center">Select Language</h3>
          <p className="text-xs text-gray-400 font-light max-w-[280px] leading-relaxed text-center">
            Choose your preferred language from the dropdown menu to translate the page.
          </p>
        </div>

        {/* Dropdown Container */}
        <div className="w-full flex flex-col items-center justify-center min-h-[70px] border border-neutral-100 rounded-2xl p-4 bg-neutral-50/50">
          {!isTranslateLoaded && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-light animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
              Configuring translation options...
            </div>
          )}
          {/* Mount point for Google Translate dropdown */}
          <div 
            id="google_translate_element" 
            className={`w-full flex justify-center transition-opacity duration-300 ${
              isTranslateLoaded ? "opacity-100" : "opacity-0 pointer-events-none h-0"
            }`} 
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-3 bg-black hover:bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-[0.98] shadow-xs cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

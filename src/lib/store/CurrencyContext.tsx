"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// List of supported currencies
export const SUPPORTED_CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee (INR)" },
  { code: "USD", symbol: "$", name: "US Dollar (USD)" },
  { code: "EUR", symbol: "€", name: "Euro (EUR)" },
  { code: "GBP", symbol: "£", name: "British Pound (GBP)" },
  { code: "AED", symbol: "AED ", name: "UAE Dirham (AED)" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar (CAD)" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar (AUD)" },
];

export const FALLBACK_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012, // 1 INR = ~0.012 USD
  EUR: 0.011, // 1 INR = ~0.011 EUR
  GBP: 0.0092, // 1 INR = ~0.0092 GBP
  AED: 0.044, // 1 INR = ~0.044 AED
  CAD: 0.0165, // 1 INR = ~0.0165 CAD
  AUD: 0.0185, // 1 INR = ~0.0185 AUD
};

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => void;
  rates: Record<string, number>;
  formatPrice: (amountInINR: number) => string;
  convertPrice: (amountInINR: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<string>("INR");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage on client and fetch rates
  useEffect(() => {
    setIsMounted(true);
    const savedCurrency = localStorage.getItem("user-currency-pref");
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    }

    const fetchRates = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/INR");
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates) {
            setRates(data.rates);
          }
        }
      } catch (err) {
        console.error("Failed to fetch exchange rates, using fallbacks:", err);
      }
    };
    fetchRates();
  }, []);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    localStorage.setItem("user-currency-pref", code);
    window.dispatchEvent(new Event("currencyChanged"));
  };

  const convertPrice = (amountInINR: number): number => {
    const rate = rates[currency] || FALLBACK_RATES[currency] || 1;
    return amountInINR * rate;
  };

  const formatPrice = (amountInINR: number): string => {
    if (!isMounted) {
      return `₹${Math.round(amountInINR).toLocaleString("en-IN")}`;
    }
    const activeCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];
    const converted = convertPrice(amountInINR);
    
    if (currency === "INR") {
      return `₹${Math.round(converted).toLocaleString("en-IN")}`;
    }
    
    const formattedValue = converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return `${activeCurrency.symbol}${formattedValue}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

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
  { code: "SAR", symbol: "SR ", name: "Saudi Riyal (SAR)" },
  { code: "QAR", symbol: "QR ", name: "Qatari Riyal (QAR)" },
  { code: "OMR", symbol: "OMR ", name: "Omani Rial (OMR)" },
  { code: "KWD", symbol: "KD ", name: "Kuwaiti Dinar (KWD)" },
  { code: "BHD", symbol: "BD ", name: "Bahraini Dinar (BHD)" },
  { code: "JOD", symbol: "JD ", name: "Jordanian Dinar (JOD)" },
  { code: "EGP", symbol: "EGP ", name: "Egyptian Pound (EGP)" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar (SGD)" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar (NZD)" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen (JPY)" },
  { code: "CNY", symbol: "CN¥", name: "Chinese Yuan (CNY)" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar (HKD)" },
  { code: "CHF", symbol: "CHF ", name: "Swiss Franc (CHF)" },
  { code: "ZAR", symbol: "R ", name: "South African Rand (ZAR)" },
  { code: "MYR", symbol: "RM ", name: "Malaysian Ringgit (MYR)" },
  { code: "THB", symbol: "฿", name: "Thai Baht (THB)" },
  { code: "IDR", symbol: "Rp ", name: "Indonesian Rupiah (IDR)" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso (PHP)" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong (VND)" },
  { code: "PKR", symbol: "Rs ", name: "Pakistani Rupee (PKR)" },
  { code: "LKR", symbol: "SLRs ", name: "Sri Lankan Rupee (LKR)" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka (BDT)" },
  { code: "NPR", symbol: "NPRs ", name: "Nepalese Rupee (NPR)" },
  { code: "MVR", symbol: "Rf ", name: "Maldivian Rufiyaa (MVR)" },
  { code: "AFN", symbol: "Af ", name: "Afghan Afghani (AFN)" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble (RUB)" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira (TRY)" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real (BRL)" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso (MXN)" },
  { code: "SEK", symbol: "kr ", name: "Swedish Krona (SEK)" },
  { code: "NOK", symbol: "kr ", name: "Norwegian Krone (NOK)" },
  { code: "DKK", symbol: "kr ", name: "Danish Krone (DKK)" },
  { code: "PLN", symbol: "zł ", name: "Polish Zloty (PLN)" },
  { code: "ILS", symbol: "₪", name: "Israeli New Shekel (ILS)" },
  { code: "KRW", symbol: "₩", name: "South Korean Won (KRW)" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira (NGN)" },
  { code: "KES", symbol: "KSh ", name: "Kenyan Shilling (KES)" },
  { code: "MAD", symbol: "MAD ", name: "Moroccan Dirham (MAD)" },
];

export const FALLBACK_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0092,
  AED: 0.044,
  CAD: 0.016,
  AUD: 0.018,
  SAR: 0.045,
  QAR: 0.044,
  OMR: 0.0046,
  KWD: 0.0037,
  BHD: 0.0045,
  JOD: 0.0085,
  EGP: 0.58,
  SGD: 0.016,
  NZD: 0.020,
  JPY: 1.90,
  CNY: 0.087,
  HKD: 0.093,
  CHF: 0.011,
  ZAR: 0.22,
  MYR: 0.056,
  THB: 0.43,
  IDR: 190,
  PHP: 0.68,
  VND: 300,
  PKR: 3.35,
  LKR: 3.60,
  BDT: 1.40,
  NPR: 1.60,
  MVR: 0.18,
  AFN: 0.85,
  RUB: 1.10,
  TRY: 0.40,
  BRL: 0.065,
  MXN: 0.21,
  SEK: 0.13,
  NOK: 0.13,
  DKK: 0.082,
  PLN: 0.048,
  ILS: 0.045,
  KRW: 16.5,
  NGN: 18.0,
  KES: 1.55,
  MAD: 0.12,
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

const DEFAULT_CURRENCY_CONTEXT: CurrencyContextType = {
  currency: "INR",
  setCurrency: () => {},
  rates: FALLBACK_RATES,
  formatPrice: (amountInINR: number) => `₹${Math.round(amountInINR).toLocaleString("en-IN")}`,
  convertPrice: (amountInINR: number) => amountInINR,
};

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return DEFAULT_CURRENCY_CONTEXT;
  }
  return context;
}

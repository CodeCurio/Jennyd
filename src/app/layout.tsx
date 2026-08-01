import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jennydscents.com";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jennyd Scents | Luxury Extrait De Parfum & Artisanal Pure Attars",
    template: "%s | Jennyd Scents",
  },
  description:
    "Discover Jennyd Scents — India's premier luxury perfume house. Crafting high-concentration Extrait de Parfum, artisanal non-alcoholic pure attars, and bespoke signature scents with 24-hour longevity. Free shipping across India.",
  keywords: [
    "Jennyd Scents",
    "Luxury Perfumes India",
    "Extrait De Parfum",
    "Pure Attar Oils",
    "Non Alcoholic Perfume",
    "Long Lasting Perfumes",
    "Oud Perfume India",
    "Artisanal Fragrances",
    "Ajmal Style Scents",
    "Zodiac Fragrance Match",
    "Buy Perfume Online",
    "Luxury Scents India"
  ],
  authors: [{ name: "Jennyd Scents", url: SITE_URL }],
  creator: "Jennyd Scents",
  publisher: "Jennyd Scents",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Jennyd Scents",
    title: "Jennyd Scents | Luxury Extrait De Parfum & Artisanal Pure Attars",
    description:
      "Crafting high-concentration Extrait de Parfum and artisanal pure attars with unmatched projection and 24-hour sillage. Shop luxury fragrances online with free express shipping across India.",
    images: [
      {
        url: `${SITE_URL}/assets/Banner-1.jpeg`,
        width: 1200,
        height: 630,
        alt: "Jennyd Scents - Luxury Perfumes Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jennyd Scents | Luxury Extrait De Parfum & Artisanal Attars",
    description:
      "Crafting high-concentration Extrait de Parfum and artisanal pure attars with 24-hour longevity. Free shipping across India.",
    images: [`${SITE_URL}/assets/Banner-1.jpeg`],
    creator: "@jennydscents",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  category: "Perfume & Luxury Fragrance",
};

// Global Organization & WebSite Structured Data (JSON-LD)
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Jennyd Scents",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
        "caption": "Jennyd Scents Logo"
      },
      "sameAs": [
        "https://instagram.com/jennydscents",
        "https://facebook.com/jennydscents"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@jennydscents.com",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Jennyd Scents",
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/products?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

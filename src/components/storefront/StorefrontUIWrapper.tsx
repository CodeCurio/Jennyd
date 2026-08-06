"use client";

import { usePathname } from "next/navigation";

export function StorefrontUIWrapper({
  children,
  header,
  footer,
  cartDrawer,
  languageSelector,
  whatsAppButton
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  cartDrawer: React.ReactNode;
  languageSelector: React.ReactNode;
  whatsAppButton: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout" || pathname.startsWith("/checkout/");

  return (
    <div className="flex flex-col min-h-screen">
      {header}
      
      <main className="flex-1">
        {children}
      </main>
      
      <>
        {footer}
        {cartDrawer}
        {languageSelector}
        {whatsAppButton}
      </>
    </div>
  );
}

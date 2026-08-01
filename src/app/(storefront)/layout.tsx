import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { CartProvider } from "@/lib/store/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/lib/store/AuthContext";
import { LanguageSelectorPopup } from "@/components/storefront/LanguageSelectorPopup";
import { CurrencyProvider } from "@/lib/store/CurrencyContext";
import { WhatsAppButton } from "@/components/storefront/WhatsAppButton";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <CartDrawer />
              <LanguageSelectorPopup />
              <WhatsAppButton />
            </div>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}



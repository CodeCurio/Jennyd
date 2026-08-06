import { CartProvider } from "@/lib/store/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/lib/store/AuthContext";
import { CurrencyProvider } from "@/lib/store/CurrencyContext";
import { StorefrontUIWrapper } from "@/components/storefront/StorefrontUIWrapper";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { LanguageSelectorPopup } from "@/components/storefront/LanguageSelectorPopup";
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
            <StorefrontUIWrapper
              header={<Header />}
              footer={<Footer />}
              cartDrawer={<CartDrawer />}
              languageSelector={<LanguageSelectorPopup />}
              whatsAppButton={<WhatsAppButton />}
            >
              {children}
            </StorefrontUIWrapper>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}



"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store/AuthContext";
import { LayoutDashboard, Package, MapPin, UserCircle, LogOut, Loader2, ChevronRight } from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "Address Book", icon: MapPin },
  { href: "/account/profile", label: "Profile Settings", icon: UserCircle },
];

// These routes don't need the protected layout (they have their own UI)
const PUBLIC_ACCOUNT_ROUTES = ["/account/login", "/account/signup", "/account/forgot-password", "/account/reset-password"];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ACCOUNT_ROUTES.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users to login (only for protected routes)
  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      router.push("/account/login");
    }
  }, [isLoading, user, router, isPublicRoute]);

  // If logged in user visits login/signup, redirect to dashboard
  useEffect(() => {
    if (!isLoading && user && isPublicRoute) {
      router.push("/account");
    }
  }, [isLoading, user, router, isPublicRoute]);

  // For public routes (login, signup), render children directly
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Loading your account...</span>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="bg-[#fcfaf8] min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 md:py-16">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">My Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-900">{profile?.full_name || user.email}</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {SIDEBAR_LINKS.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all border-b border-gray-50 last:border-b-0 group ${
                      isActive
                        ? "bg-gray-50 text-gray-900 border-l-[3px] border-l-[#D4AF37]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-l-transparent"
                    }`}
                  >
                    <link.icon className={`w-4.5 h-4.5 ${isActive ? "text-[#D4AF37]" : "text-gray-400 group-hover:text-gray-600"}`} />
                    <span className="flex-1">{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? "text-gray-400" : "text-gray-300"}`} />
                  </Link>
                );
              })}

              {/* Logout */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full text-left border-l-[3px] border-l-transparent"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

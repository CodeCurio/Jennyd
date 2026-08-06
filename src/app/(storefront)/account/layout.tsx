"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  UserCircle, 
  LogOut, 
  Loader2, 
  ChevronRight,
  Camera,
  ShieldCheck
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile", icon: UserCircle },
];

const PUBLIC_ACCOUNT_ROUTES = ["/account/login", "/account/signup", "/account/forgot-password", "/account/reset-password"];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ACCOUNT_ROUTES.some(route => pathname.startsWith(route));

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      const timer = setTimeout(() => {
        router.push("/account/login");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, router, isPublicRoute]);

  useEffect(() => {
    if (!isLoading && user && isPublicRoute) {
      const nextUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
      const timer = setTimeout(() => {
        router.push(nextUrl || "/account");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, router, isPublicRoute]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Loading your account...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="bg-[#FAF9F6] min-h-[85vh] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Luxury Profile Header Hero ── */}
        <div className="bg-[#1A1A1A] text-white rounded-2xl p-5 sm:p-7 shadow-md mb-6 border border-[#D4AF37]/30 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 relative z-10 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Preview & Upload shortcut */}
              <Link href="/account/profile" className="relative group shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="User Avatar"
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-[#D4AF37] shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-neutral-800 text-[#D4AF37] flex items-center justify-center text-xl font-serif font-bold border-2 border-[#D4AF37]/40 shadow-sm">
                    {(profile?.full_name || user.email || "?")[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </Link>

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-serif font-semibold tracking-wide text-white">
                    {profile?.full_name || "Valued Client"}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> VIP Member
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ── Mobile Segmented Tab Navigation ── */}
        <div className="md:hidden mb-6">
          <nav className="grid grid-cols-4 bg-white rounded-xl p-1.5 border border-neutral-200 shadow-2xs">
            {SIDEBAR_LINKS.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-center transition-all ${
                    isActive
                      ? "bg-[#1A1A1A] text-white shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  <link.icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-[#D4AF37]" : "text-neutral-500"}`} />
                  <span className="text-[10px] font-bold tracking-tight">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Main Layout Container ── */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <nav className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden p-2 space-y-1">
              {SIDEBAR_LINKS.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-[#1A1A1A] text-white shadow-xs"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-neutral-400"}`} />
                    <span className="flex-1">{link.label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-[#D4AF37]" : "text-neutral-300"}`} />
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-neutral-100 mt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Page Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
}

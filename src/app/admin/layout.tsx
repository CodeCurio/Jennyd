"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, FlaskConical, Tags, MessageSquare, Ticket, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ToastProvider } from "@/components/ui/Toast";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Notes", href: "/admin/notes", icon: FlaskConical },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAuthorized(true);
      } else {
        router.push("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading admin panel...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  // Bypass layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin">
            <span className="font-serif text-xl font-bold tracking-widest uppercase">Jennyd Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-gray-100 text-black" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Mobile */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden shrink-0">
          <span className="font-serif text-lg font-bold tracking-widest uppercase">Jennyd Admin</span>
          {/* Mobile menu toggle would go here */}
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </main>

    </div>
  );
}

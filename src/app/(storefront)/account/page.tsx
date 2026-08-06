"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Package, 
  MapPin, 
  UserCircle, 
  ArrowRight, 
  Loader2, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { useCurrency } from "@/lib/store/CurrencyContext";

export default function AccountDashboardPage() {
  const { user, profile } = useAuth();
  const { formatPrice } = useCurrency();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [addressCount, setAddressCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);

      // Fetch recent orders
      const { data: orders, count } = await supabase
        .from("orders")
        .select("id, order_number, created_at, total, payment_status, fulfillment_status, shipping_method", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (orders && orders.length > 0) {
        setRecentOrders(orders);
        // Find most recent non-delivered active order, or default to latest
        const latest = orders.find(o => o.fulfillment_status !== "delivered") || orders[0];
        setActiveOrder(latest);
      }
      setTotalOrders(count || 0);

      // Fetch address count
      const { count: addrCount } = await supabase
        .from("addresses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      setAddressCount(addrCount || 0);

      setIsLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  // Active Stepper helper
  const getStepProgress = (status: string) => {
    switch (status) {
      case "pending": return 1;
      case "processing": return 2;
      case "shipped": return 3;
      case "delivered": return 4;
      default: return 1;
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 bg-white rounded-2xl border border-neutral-200/90 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  const stepLevel = activeOrder ? getStepProgress(activeOrder.fulfillment_status) : 0;

  return (
    <div className="space-y-6">

      {/* ── Active Order Tracker Card ── */}
      {activeOrder && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                Active Order Tracker
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-neutral-900 font-mono">
                  {activeOrder.order_number}
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs font-medium text-neutral-500">
                  {format(new Date(activeOrder.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            <Link
              href="/account/orders"
              className="text-xs font-bold text-neutral-900 hover:text-[#D4AF37] flex items-center gap-1 uppercase tracking-wider cursor-pointer"
            >
              View Order Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stepper Progress Bar */}
          <div className="pt-2 pb-1">
            <div className="relative flex items-center justify-between">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-100 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-[#D4AF37] -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${((stepLevel - 1) / 3) * 100}%` }}
              />

              {/* Step 1: Placed */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  stepLevel >= 1 ? "bg-[#1A1A1A] text-white ring-4 ring-[#D4AF37]/20" : "bg-neutral-100 text-neutral-400"
                }`}>
                  1
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mt-1.5">Placed</span>
              </div>

              {/* Step 2: Packed */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  stepLevel >= 2 ? "bg-[#1A1A1A] text-white ring-4 ring-[#D4AF37]/20" : "bg-neutral-100 text-neutral-400"
                }`}>
                  2
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mt-1.5">Packed</span>
              </div>

              {/* Step 3: Shipped */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  stepLevel >= 3 ? "bg-[#1A1A1A] text-white ring-4 ring-[#D4AF37]/20" : "bg-neutral-100 text-neutral-400"
                }`}>
                  3
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mt-1.5">Shipped</span>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  stepLevel >= 4 ? "bg-emerald-600 text-white ring-4 ring-emerald-100" : "bg-neutral-100 text-neutral-400"
                }`}>
                  4
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 mt-1.5">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Action Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link 
          href="/account/orders" 
          className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs hover:border-black transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-mono text-neutral-900">{totalOrders}</span>
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">My Orders</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">Track, review & re-order items</p>
          </div>
        </Link>

        <Link 
          href="/account/addresses" 
          className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs hover:border-black transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-mono text-neutral-900">{addressCount}</span>
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Address Book</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">Manage shipping destinations</p>
          </div>
        </Link>

        <Link 
          href="/account/profile" 
          className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs hover:border-black transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
              <UserCircle className="w-5 h-5" />
            </div>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="mt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Profile Settings</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">Update photo, name & security</p>
          </div>
        </Link>
      </div>

      {/* ── Recent Orders Section ── */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" /> Recent Purchase History
          </h2>
          {totalOrders > 3 && (
            <Link 
              href="/account/orders" 
              className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <Package className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-xs font-medium text-neutral-500">You haven&apos;t placed any orders yet.</p>
            <Link 
              href="/products" 
              className="inline-block text-xs font-bold text-white bg-[#1A1A1A] px-5 py-2.5 rounded-xl uppercase tracking-wider hover:bg-black transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">
                      {order.order_number}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      order.fulfillment_status === "delivered" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}>
                      {order.fulfillment_status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Placed on {format(new Date(order.created_at), "MMM d, yyyy")}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="font-mono text-sm font-bold text-neutral-900">
                    {formatPrice(Number(order.total))}
                  </span>

                  <Link href="/account/orders">
                    <button className="text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer">
                      Track Order
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

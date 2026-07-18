"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store/AuthContext";
import { supabase } from "@/lib/supabase";
import { Package, MapPin, UserCircle, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useCurrency } from "@/lib/store/CurrencyContext";

export default function AccountDashboardPage() {
  const { user, profile } = useAuth();
  const { formatPrice } = useCurrency();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
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
        .select("id, order_number, created_at, total, payment_status, fulfillment_status", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      setRecentOrders(orders || []);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "processing": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/account/orders" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Orders</p>
            </div>
          </div>
        </Link>

        <Link href="/account/addresses" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{addressCount}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Saved Addresses</p>
            </div>
          </div>
        </Link>

        <Link href="/account/profile" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{profile?.full_name || "Set up profile"}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Profile</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5 text-gray-400" /> Recent Orders
          </h2>
          {totalOrders > 3 && (
            <Link href="/account/orders" className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 uppercase tracking-wider">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-sm font-medium">No orders yet</p>
            <Link href="/products" className="inline-block mt-4 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 font-mono">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusColor(order.fulfillment_status)}`}>
                    {order.fulfillment_status === "processing" ? "packed" : order.fulfillment_status}
                  </span>
                  <span className="font-bold text-sm text-gray-900 font-mono">{formatPrice(Number(order.total))}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

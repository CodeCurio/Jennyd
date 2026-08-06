"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { OrdersTableClient } from "@/components/admin/OrdersTableClient";
import { Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, created_at, email, total, payment_status, fulfillment_status, shipping_address, metadata, order_items(id, title, quantity, variant_info, products(slug, metadata))")
        .order("created_at", { ascending: false });

      if (data && !error) {
        setOrders(data);
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="h-80 flex flex-col items-center justify-center gap-3 bg-white border border-neutral-200 rounded-xl shadow-2xs">
        <Loader2 className="w-7 h-7 animate-spin text-[#D4AF37]" strokeWidth={2} />
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading Orders Catalog...</span>
      </div>
    );
  }

  return (
    <div className="pb-10 max-w-7xl mx-auto">
      <OrdersTableClient initialOrders={orders} />
    </div>
  );
}

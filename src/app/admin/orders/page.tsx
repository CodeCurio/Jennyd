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
        .select("id, order_number, created_at, email, total, payment_status, fulfillment_status, shipping_address")
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
      <div className="h-96 flex flex-col items-center justify-center gap-3 bg-white border border-gray-150 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Loading orders catalog...</span>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <OrdersTableClient initialOrders={orders} />
    </div>
  );
}

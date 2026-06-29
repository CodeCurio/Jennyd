import { supabase } from "@/lib/supabase";
import { OrdersTableClient } from "@/components/admin/OrdersTableClient";

export const revalidate = 0; // Disable cache to always show fresh orders

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, created_at, email, total, payment_status, fulfillment_status, shipping_address")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="pb-10">
      <OrdersTableClient initialOrders={orders || []} />
    </div>
  );
}

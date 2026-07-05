import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orderId, userId } = await request.json();

    if (!orderId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch order to verify ownership and check fulfillment status
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, fulfillment_status")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized to cancel this order" }, { status: 403 });
    }

    // Only allow cancellation if pending or processing (packed)
    const allowedStatuses = ["pending", "processing"];
    if (!allowedStatuses.includes(order.fulfillment_status)) {
      return NextResponse.json(
        { error: `Order cannot be cancelled. Current status is '${order.fulfillment_status}'` },
        { status: 400 }
      );
    }

    // 2. Fetch order items to restore stock
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("product_id, variant_id, quantity")
      .eq("order_id", orderId);

    if (itemsError) {
      return NextResponse.json({ error: "Failed to fetch order items for stock restoration" }, { status: 500 });
    }

    // 3. Update Order fulfillment status to cancelled
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ fulfillment_status: "cancelled" })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 4. Restore stock in database for each item
    for (const item of items || []) {
      if (item.product_id) {
        // Fetch current product stock
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("stock_quantity, track_inventory")
          .eq("id", item.product_id)
          .single();

        if (product?.track_inventory) {
          const newQty = (product.stock_quantity || 0) + item.quantity;
          await supabaseAdmin
            .from("products")
            .update({ stock_quantity: newQty })
            .eq("id", item.product_id);

          // Increment variant stock if it exists
          if (item.variant_id) {
            const { data: variant } = await supabaseAdmin
              .from("product_variants")
              .select("stock_quantity")
              .eq("id", item.variant_id)
              .single();

            if (variant) {
              const newVarQty = (variant.stock_quantity || 0) + item.quantity;
              await supabaseAdmin
                .from("product_variants")
                .update({ stock_quantity: newVarQty })
                .eq("id", item.variant_id);
            }
          }
        }
      }
    }

    // 5. Insert cancellation timeline event
    await supabaseAdmin
      .from("order_timeline")
      .insert({
        order_id: orderId,
        status: "cancelled",
        note: "Cancelled by customer"
      });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

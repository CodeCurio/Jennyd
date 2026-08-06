import { NextResponse } from "next/server";
import { sendOrderReceiptEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Order Receipt API Called with body:", JSON.stringify(body));

    const { email, orderNumber, customerName, totalAmount, items, shippingAddress } = body;

    if (!email || !orderNumber) {
      console.warn("Order Receipt API missing required fields:", { email, orderNumber });
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendOrderReceiptEmail(
      email,
      orderNumber,
      customerName,
      totalAmount,
      items,
      shippingAddress
    );

    console.log("Order Receipt Send Result:", JSON.stringify(result));

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("Order Receipt Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

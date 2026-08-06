import { NextResponse } from "next/server";
import { sendOrderReceiptEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, orderNumber, customerName, totalAmount, items, shippingAddress } = body;

    if (!email || !orderNumber) {
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

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

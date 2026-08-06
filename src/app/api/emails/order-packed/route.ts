import { NextResponse } from "next/server";
import { sendOrderPackedEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Order Packed API Called with body:", JSON.stringify(body));

    const { email, orderNumber, customerName, items, shippingAddress } = body;

    if (!email || !orderNumber) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendOrderPackedEmail(
      email,
      orderNumber,
      customerName,
      items,
      shippingAddress
    );

    console.log("Order Packed Send Result:", JSON.stringify(result));

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("Order Packed Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { savePartnerApplication, PartnerRecord } from "@/lib/partnerStorage";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.full_name || !body.phone || !body.city) {
      return NextResponse.json(
        { error: "Full Name, Phone, and City are required." },
        { status: 400 }
      );
    }

    const payload: PartnerRecord = {
      id: body.id && body.id.length > 10 ? body.id : randomUUID(),
      full_name: body.full_name.trim(),
      business_name: body.business_name ? body.business_name.trim() : null,
      phone: body.phone.trim(),
      email: body.email ? body.email.trim().toLowerCase() : null,
      city: body.city.trim(),
      partner_type: body.partner_type || "Retail Store / Boutique Owner",
      message: body.message ? body.message.trim() : null,
      status: "Pending",
      created_at: body.created_at || new Date().toISOString()
    };

    const result = await savePartnerApplication(payload);

    return NextResponse.json({
      success: true,
      message: "Partner Application submitted successfully!",
      data: result.data,
      inSupabase: result.inSupabase
    });
  } catch (error: any) {
    console.error("Partner Application API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit partner application" },
      { status: 500 }
    );
  }
}

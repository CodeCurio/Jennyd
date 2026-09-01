import { NextResponse } from "next/server";
import { getAllPartnerApplications } from "@/lib/partnerStorage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { list, supabaseOnline } = await getAllPartnerApplications();
    return NextResponse.json({
      success: true,
      data: list,
      supabaseOnline
    });
  } catch (error: any) {
    console.error("Fetch Partner list API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch partner applications" },
      { status: 500 }
    );
  }
}

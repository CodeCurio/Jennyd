import { NextResponse } from "next/server";
import { getAllIboRegistrations } from "@/lib/partnerStorage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { list, supabaseOnline } = await getAllIboRegistrations();
    return NextResponse.json({
      success: true,
      data: list,
      supabaseOnline
    });
  } catch (error: any) {
    console.error("Fetch IBO list API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch IBO registrations" },
      { status: 500 }
    );
  }
}

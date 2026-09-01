import { NextResponse } from "next/server";
import { deletePartnerRecord } from "@/lib/partnerStorage";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    await deletePartnerRecord(id);

    return NextResponse.json({
      success: true,
      message: "Partner application deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete Partner API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete partner application" },
      { status: 500 }
    );
  }
}

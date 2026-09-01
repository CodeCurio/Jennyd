import { NextResponse } from "next/server";
import { updateIboRecord } from "@/lib/partnerStorage";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing registration ID" }, { status: 400 });
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    await updateIboRecord(id, updates);

    return NextResponse.json({
      success: true,
      message: "IBO registration updated successfully"
    });
  } catch (error: any) {
    console.error("Update IBO API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update IBO registration" },
      { status: 500 }
    );
  }
}

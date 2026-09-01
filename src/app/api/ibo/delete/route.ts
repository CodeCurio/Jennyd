import { NextResponse } from "next/server";
import { deleteIboRecord } from "@/lib/partnerStorage";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing registration ID" }, { status: 400 });
    }

    await deleteIboRecord(id);

    return NextResponse.json({
      success: true,
      message: "IBO registration deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete IBO API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete IBO registration" },
      { status: 500 }
    );
  }
}

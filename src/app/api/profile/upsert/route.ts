import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, email, fullName, phone } = await request.json();

    console.log("Upsert Profile Request:", { userId, email, fullName, phone });

    if (!userId || !email || userId === "undefined" || userId === "null") {
      return NextResponse.json({ error: "Invalid or missing user identity information" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        { 
          id: userId, 
          email, 
          full_name: fullName, 
          phone: phone || null 
        },
        { onConflict: "id" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

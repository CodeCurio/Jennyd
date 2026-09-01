import { NextResponse } from "next/server";
import { saveIboRegistration, IBORecord } from "@/lib/partnerStorage";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Required validation
    if (!body.full_name || !body.mobile_number || !body.whatsapp_number || !body.email || !body.purchase_order_no) {
      return NextResponse.json(
        { error: "Missing mandatory fields: Full Name, Mobile, WhatsApp, Email, and Purchase Order No are required." },
        { status: 400 }
      );
    }

    if (!body.consent_agreement || !body.consent_income_disclosure) {
      return NextResponse.json(
        { error: "Please accept the Declaration & Consent terms to proceed." },
        { status: 400 }
      );
    }

    const newId = body.id && body.id.length > 10 ? body.id : randomUUID();

    const payload: IBORecord = {
      id: newId,
      full_name: body.full_name.trim(),
      mother_name: body.mother_name ? body.mother_name.trim() : null,
      father_name: body.father_name ? body.father_name.trim() : null,
      dob: body.dob || null,
      gender: body.gender || null,
      occupation: body.occupation ? body.occupation.trim() : null,
      marital_status: body.marital_status || null,

      pan_tax_number: body.pan_tax_number ? body.pan_tax_number.trim().toUpperCase() : null,
      aadhaar_national_id: body.aadhaar_national_id ? body.aadhaar_national_id.trim() : null,
      other_gov_id: body.other_gov_id ? body.other_gov_id.trim() : null,
      driving_license: body.driving_license ? body.driving_license.trim().toUpperCase() : null,
      passport_number: body.passport_number ? body.passport_number.trim().toUpperCase() : null,
      national_id_number: body.national_id_number ? body.national_id_number.trim() : null,
      voter_card_number: body.voter_card_number ? body.voter_card_number.trim().toUpperCase() : null,

      mobile_number: body.mobile_number.trim(),
      whatsapp_number: body.whatsapp_number.trim(),
      email: body.email.trim().toLowerCase(),
      alternate_contact: body.alternate_contact ? body.alternate_contact.trim() : null,

      house_flat_no: body.house_flat_no ? body.house_flat_no.trim() : null,
      street: body.street ? body.street.trim() : null,
      landmark: body.landmark ? body.landmark.trim() : null,
      city: body.city ? body.city.trim() : "",
      district: body.district ? body.district.trim() : null,
      state: body.state ? body.state.trim() : null,
      pin_code: body.pin_code ? body.pin_code.trim() : null,
      country: body.country ? body.country.trim() : "India",
      same_as_permanent: body.same_as_permanent ?? true,

      perm_house_flat_no: body.perm_house_flat_no ? body.perm_house_flat_no.trim() : null,
      perm_street: body.perm_street ? body.perm_street.trim() : null,
      perm_landmark: body.perm_landmark ? body.perm_landmark.trim() : null,
      perm_city: body.perm_city ? body.perm_city.trim() : null,
      perm_district: body.perm_district ? body.perm_district.trim() : null,
      perm_state: body.perm_state ? body.perm_state.trim() : null,
      perm_pin_code: body.perm_pin_code ? body.perm_pin_code.trim() : null,
      perm_country: body.perm_country ? body.perm_country.trim() : "India",

      sponsor_name: body.sponsor_name ? body.sponsor_name.trim() : null,
      sponsor_ibo_id: body.sponsor_ibo_id ? body.sponsor_ibo_id.trim().toUpperCase() : null,
      sponsor_mobile: body.sponsor_mobile ? body.sponsor_mobile.trim() : null,

      account_holder_name: body.account_holder_name ? body.account_holder_name.trim() : null,
      bank_name: body.bank_name ? body.bank_name.trim() : null,
      account_number: body.account_number ? body.account_number.trim() : null,
      ifsc_code: body.ifsc_code ? body.ifsc_code.trim().toUpperCase() : null,
      upi_id: body.upi_id ? body.upi_id.trim() : null,

      hear_about_us: Array.isArray(body.hear_about_us) ? body.hear_about_us : [],
      hear_about_other: body.hear_about_other ? body.hear_about_other.trim() : null,

      consent_agreement: Boolean(body.consent_agreement),
      consent_income_disclosure: Boolean(body.consent_income_disclosure),
      purchase_order_no: body.purchase_order_no.trim(),

      status: "Pending",
      created_at: body.created_at || new Date().toISOString()
    };

    const result = await saveIboRegistration(payload);

    return NextResponse.json({
      success: true,
      message: "IBO Registration submitted and saved successfully!",
      data: result.data,
      inSupabase: result.inSupabase
    });
  } catch (error: any) {
    console.error("IBO Registration API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process IBO registration" },
      { status: 500 }
    );
  }
}

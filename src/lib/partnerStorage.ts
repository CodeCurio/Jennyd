import fs from "fs/promises";
import path from "path";
import { supabaseAdmin, supabase } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const IBO_FILE = path.join(DATA_DIR, "ibo_registrations.json");
const PARTNER_FILE = path.join(DATA_DIR, "partner_applications.json");

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

export interface IBORecord {
  id: string;
  full_name: string;
  mother_name?: string | null;
  father_name?: string | null;
  dob?: string | null;
  gender?: string | null;
  occupation?: string | null;
  marital_status?: string | null;
  pan_tax_number?: string | null;
  aadhaar_national_id?: string | null;
  other_gov_id?: string | null;
  driving_license?: string | null;
  passport_number?: string | null;
  national_id_number?: string | null;
  voter_card_number?: string | null;
  mobile_number: string;
  whatsapp_number: string;
  email: string;
  alternate_contact?: string | null;
  house_flat_no?: string | null;
  street?: string | null;
  landmark?: string | null;
  city: string;
  district?: string | null;
  state?: string | null;
  pin_code?: string | null;
  country?: string | null;
  same_as_permanent?: boolean;
  perm_house_flat_no?: string | null;
  perm_street?: string | null;
  perm_landmark?: string | null;
  perm_city?: string | null;
  perm_district?: string | null;
  perm_state?: string | null;
  perm_pin_code?: string | null;
  perm_country?: string | null;
  sponsor_name?: string | null;
  sponsor_ibo_id?: string | null;
  sponsor_mobile?: string | null;
  account_holder_name?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  upi_id?: string | null;
  hear_about_us?: string[] | null;
  hear_about_other?: string | null;
  consent_agreement?: boolean;
  consent_income_disclosure?: boolean;
  purchase_order_no: string;
  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface PartnerRecord {
  id: string;
  full_name: string;
  business_name?: string | null;
  phone: string;
  email?: string | null;
  city: string;
  partner_type: string;
  message?: string | null;
  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

// ----------------------------------------------------------------------------
// IBO STORAGE HELPERS
// ----------------------------------------------------------------------------

export async function getLocalIboList(): Promise<IBORecord[]> {
  try {
    await ensureDir();
    const raw = await fs.readFile(IBO_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export async function saveLocalIboList(list: IBORecord[]): Promise<void> {
  try {
    await ensureDir();
    await fs.writeFile(IBO_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save local IBO file:", e);
  }
}

export async function saveIboRegistration(record: IBORecord): Promise<{ success: boolean; data: IBORecord; inSupabase: boolean }> {
  let inSupabase = false;
  const client = supabaseAdmin || supabase;

  // 1. Try Supabase Table
  try {
    const { data, error } = await client
      .from("ibo_registrations")
      .insert([record])
      .select()
      .single();

    if (!error && data) {
      inSupabase = true;
      record = data;
    }
  } catch (err) {
    console.warn("Supabase IBO insertion fallback:", err);
  }

  // 2. Always persist in server store
  const localList = await getLocalIboList();
  const index = localList.findIndex((item) => item.id === record.id || (item.purchase_order_no === record.purchase_order_no && item.mobile_number === record.mobile_number));
  if (index >= 0) {
    localList[index] = record;
  } else {
    localList.unshift(record);
  }
  await saveLocalIboList(localList);

  return { success: true, data: record, inSupabase };
}

export async function getAllIboRegistrations(): Promise<{ list: IBORecord[]; supabaseOnline: boolean }> {
  const client = supabaseAdmin || supabase;
  let supabaseList: IBORecord[] = [];
  let supabaseOnline = false;

  try {
    const { data, error } = await client
      .from("ibo_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      supabaseList = data;
      supabaseOnline = true;
    }
  } catch (e) {}

  const localList = await getLocalIboList();

  // If Supabase table is online, attempt to sync any local records that aren't in Supabase yet
  if (supabaseOnline && localList.length > 0) {
    const supabaseIds = new Set(supabaseList.map((i) => i.id));
    const missingInSupabase = localList.filter((i) => !supabaseIds.has(i.id));

    if (missingInSupabase.length > 0) {
      try {
        await client.from("ibo_registrations").insert(missingInSupabase);
      } catch (err) {}
    }
  }

  // Merge lists (Supabase takes precedence)
  const map = new Map<string, IBORecord>();
  [...supabaseList, ...localList].forEach((item) => {
    const key = item.id || `${item.mobile_number}-${item.purchase_order_no}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return { list: merged, supabaseOnline };
}

export async function updateIboRecord(id: string, updates: Partial<IBORecord>): Promise<{ success: boolean }> {
  const client = supabaseAdmin || supabase;

  try {
    await client
      .from("ibo_registrations")
      .update(updates)
      .eq("id", id);
  } catch (e) {}

  const localList = await getLocalIboList();
  const updatedList = localList.map((item) =>
    item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
  );
  await saveLocalIboList(updatedList);

  return { success: true };
}

export async function deleteIboRecord(id: string): Promise<{ success: boolean }> {
  const client = supabaseAdmin || supabase;

  try {
    await client.from("ibo_registrations").delete().eq("id", id);
  } catch (e) {}

  const localList = await getLocalIboList();
  const filtered = localList.filter((item) => item.id !== id);
  await saveLocalIboList(filtered);

  return { success: true };
}

// ----------------------------------------------------------------------------
// GENERAL PARTNER STORAGE HELPERS
// ----------------------------------------------------------------------------

export async function getLocalPartnerList(): Promise<PartnerRecord[]> {
  try {
    await ensureDir();
    const raw = await fs.readFile(PARTNER_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export async function saveLocalPartnerList(list: PartnerRecord[]): Promise<void> {
  try {
    await ensureDir();
    await fs.writeFile(PARTNER_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save local partner file:", e);
  }
}

export async function savePartnerApplication(record: PartnerRecord): Promise<{ success: boolean; data: PartnerRecord; inSupabase: boolean }> {
  let inSupabase = false;
  const client = supabaseAdmin || supabase;

  try {
    const { data, error } = await client
      .from("partner_applications")
      .insert([record])
      .select()
      .single();

    if (!error && data) {
      inSupabase = true;
      record = data;
    }
  } catch (err) {}

  const localList = await getLocalPartnerList();
  const index = localList.findIndex((item) => item.id === record.id || (item.phone === record.phone && item.created_at === record.created_at));
  if (index >= 0) {
    localList[index] = record;
  } else {
    localList.unshift(record);
  }
  await saveLocalPartnerList(localList);

  return { success: true, data: record, inSupabase };
}

export async function getAllPartnerApplications(): Promise<{ list: PartnerRecord[]; supabaseOnline: boolean }> {
  const client = supabaseAdmin || supabase;
  let supabaseList: PartnerRecord[] = [];
  let supabaseOnline = false;

  try {
    const { data, error } = await client
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      supabaseList = data;
      supabaseOnline = true;
    }
  } catch (e) {}

  const localList = await getLocalPartnerList();

  if (supabaseOnline && localList.length > 0) {
    const supabaseIds = new Set(supabaseList.map((i) => i.id));
    const missing = localList.filter((i) => !supabaseIds.has(i.id));
    if (missing.length > 0) {
      try {
        await client.from("partner_applications").insert(missing);
      } catch (e) {}
    }
  }

  const map = new Map<string, PartnerRecord>();
  [...supabaseList, ...localList].forEach((item) => {
    const key = item.id || `${item.phone}-${item.created_at}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return { list: merged, supabaseOnline };
}

export async function updatePartnerRecord(id: string, updates: Partial<PartnerRecord>): Promise<{ success: boolean }> {
  const client = supabaseAdmin || supabase;

  try {
    await client
      .from("partner_applications")
      .update(updates)
      .eq("id", id);
  } catch (e) {}

  const localList = await getLocalPartnerList();
  const updatedList = localList.map((item) =>
    item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
  );
  await saveLocalPartnerList(updatedList);

  return { success: true };
}

export async function deletePartnerRecord(id: string): Promise<{ success: boolean }> {
  const client = supabaseAdmin || supabase;

  try {
    await client.from("partner_applications").delete().eq("id", id);
  } catch (e) {}

  const localList = await getLocalPartnerList();
  const filtered = localList.filter((item) => item.id !== id);
  await saveLocalPartnerList(filtered);

  return { success: true };
}

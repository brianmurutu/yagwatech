import { getSupabase } from "./supabase";

// ── Types ─────────────────────────────────────────────────────────────────────
export type KYCStatus = "Pending" | "Verified" | "Failed" | "Not Started";

export interface KYCRecord {
  email:      string;
  status:     KYCStatus;
  inquiryId?: string;
  updatedAt:  string;
}

// Full store shape returned by getAllKYCRecords (matches old file-based shape)
export type KYCStore = Record<string, Omit<KYCRecord, "email">>;

// ── getKYCStatus ──────────────────────────────────────────────────────────────
// Returns the current KYC status for an email; defaults to "Not Started".
export async function getKYCStatus(email: string): Promise<KYCStatus> {
  const normEmail = email.trim().toLowerCase();
  const db = getSupabase();

  const { data, error } = await db
    .from("kyc_records")
    .select("status")
    .eq("email", normEmail)
    .maybeSingle();

  if (error) {
    console.error("[KYC Store] getKYCStatus error:", error);
    return "Not Started";
  }

  return (data?.status as KYCStatus) ?? "Not Started";
}

// ── updateKYCStatus ───────────────────────────────────────────────────────────
// Upserts a KYC record. Preserves existing inquiryId if a new one is not provided.
export async function updateKYCStatus(
  email: string,
  status: KYCStatus,
  inquiryId?: string
): Promise<void> {
  const normEmail = email.trim().toLowerCase();
  const db = getSupabase();

  // Build the upsert payload
  const payload: Record<string, string> = {
    email:      normEmail,
    status,
    updated_at: new Date().toISOString(),
  };
  if (inquiryId) payload.inquiry_id = inquiryId;

  const { error } = await db
    .from("kyc_records")
    .upsert(payload, { onConflict: "email" });

  if (error) {
    console.error("[KYC Store] updateKYCStatus error:", error);
  }
}

// ── getAllKYCRecords ───────────────────────────────────────────────────────────
// Returns all KYC records as a keyed object { email: { status, inquiryId, updatedAt } }.
export async function getAllKYCRecords(): Promise<KYCStore> {
  const db = getSupabase();

  const { data, error } = await db
    .from("kyc_records")
    .select("email, status, inquiry_id, updated_at");

  if (error) {
    console.error("[KYC Store] getAllKYCRecords error:", error);
    return {};
  }

  const result: KYCStore = {};
  for (const row of data ?? []) {
    result[row.email] = {
      status:     row.status as KYCStatus,
      inquiryId:  row.inquiry_id ?? undefined,
      updatedAt:  row.updated_at,
    };
  }
  return result;
}

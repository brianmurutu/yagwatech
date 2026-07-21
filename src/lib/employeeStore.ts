import bcrypt from "bcryptjs";
import { getSupabase } from "./supabase";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
  avatarUrl?: string;
}

// DB row → Employee interface mapper
function rowToEmployee(row: Record<string, any>): Employee {
  return {
    id:           row.id,
    fullName:     row.full_name,
    email:        row.email,
    phone:        row.phone,
    passwordHash: row.password_hash,
    createdAt:    row.created_at,
    avatarUrl:    row.avatar_url,
  };
}

// ── Password hashing (bcrypt, cost 12) ───────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ── createEmployee ────────────────────────────────────────────────────────────
// Returns null if email is already registered, otherwise creates and returns the employee.
export async function createEmployee(
  fullName: string,
  email: string,
  phone: string,
  password: string
): Promise<Employee | null> {
  const normEmail = email.trim().toLowerCase();
  const db = getSupabase();

  // Check for duplicate
  const { data: existing } = await db
    .from("employees")
    .select("id")
    .eq("email", normEmail)
    .maybeSingle();

  if (existing) return null;

  const passwordHash = await hashPassword(password);
  const id = `emp_${Date.now()}`;

  const { data, error } = await db
    .from("employees")
    .insert({
      id,
      full_name:     fullName.trim(),
      email:         normEmail,
      phone:         phone.trim(),
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[Employee Store] createEmployee error:", error);
    return null;
  }

  return rowToEmployee(data);
}

// ── verifyEmployee ────────────────────────────────────────────────────────────
// Returns the employee if credentials are valid, otherwise null.
export async function verifyEmployee(
  email: string,
  password: string
): Promise<Employee | null> {
  const normEmail = email.trim().toLowerCase();
  const db = getSupabase();

  const { data, error } = await db
    .from("employees")
    .select("*")
    .eq("email", normEmail)
    .maybeSingle();

  if (error || !data) return null;

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) return null;

  return rowToEmployee(data);
}

// ── getEmployeeByEmail ────────────────────────────────────────────────────────
// Pure lookup — no password check.
export async function getEmployeeByEmail(
  email: string
): Promise<Employee | null> {
  const normEmail = email.trim().toLowerCase();
  const db = getSupabase();

  const { data, error } = await db
    .from("employees")
    .select("*")
    .eq("email", normEmail)
    .maybeSingle();

  if (error || !data) return null;

  return rowToEmployee(data);
}

// ── updateEmployeeProfile ──────────────────────────────────────────────────────
export async function updateEmployeeProfile(
  email: string,
  updates: { fullName?: string; phone?: string; passwordHash?: string; avatarUrl?: string }
): Promise<Employee | null> {
  const normEmail = email.trim().toLowerCase();
  const db = getSupabase();

  const dbUpdates: Record<string, string> = {};
  if (updates.fullName) dbUpdates.full_name = updates.fullName.trim();
  if (updates.phone) dbUpdates.phone = updates.phone.trim();
  if (updates.passwordHash) dbUpdates.password_hash = updates.passwordHash;
  if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl.trim();

  // Try updating with avatar_url first
  const { data, error } = await db
    .from("employees")
    .update(dbUpdates)
    .eq("email", normEmail)
    .select()
    .maybeSingle();

  if (error) {
    console.warn("[Employee Store] Update failed, retrying without avatar_url:", error);
    delete dbUpdates.avatar_url;
    const { data: retryData, error: retryError } = await db
      .from("employees")
      .update(dbUpdates)
      .eq("email", normEmail)
      .select()
      .maybeSingle();

    if (retryError || !retryData) {
      console.error("[Employee Store] updateEmployeeProfile retry error:", retryError);
      return null;
    }
    return rowToEmployee(retryData);
  }

  if (!data) return null;
  return rowToEmployee(data);
}

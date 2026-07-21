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
  role?: string;
  department?: string;
  status?: "Pending" | "Approved";
}

// DB row → Employee interface mapper
function rowToEmployee(row: Record<string, any>): Employee {
  const parts = (row.full_name || "").split(" | ");
  return {
    id:           row.id,
    fullName:     parts[0] || "",
    email:        row.email,
    phone:        row.phone,
    passwordHash: row.password_hash,
    createdAt:    row.created_at,
    avatarUrl:    parts[4] || row.avatar_url || "",
    role:         parts[1] || "Team Member",
    department:   parts[2] || "Engineering",
    status:       (parts[3] as "Pending" | "Approved") || "Pending",
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
  updates: { fullName?: string; phone?: string; passwordHash?: string; avatarUrl?: string; role?: string; department?: string; status?: "Pending" | "Approved" }
): Promise<Employee | null> {
  const normEmail = email.trim().toLowerCase();
  const db = getSupabase();

  let serializedFullName: string | undefined = undefined;
  if (
    updates.fullName !== undefined ||
    updates.role !== undefined ||
    updates.department !== undefined ||
    updates.status !== undefined ||
    updates.avatarUrl !== undefined
  ) {
    const current = await getEmployeeByEmail(email);
    const name = updates.fullName !== undefined ? updates.fullName : (current?.fullName || "");
    const role = updates.role !== undefined ? updates.role : (current?.role || "Team Member");
    const dept = updates.department !== undefined ? updates.department : (current?.department || "Engineering");
    const status = updates.status !== undefined ? updates.status : (current?.status || "Pending");
    const avatar = updates.avatarUrl !== undefined ? updates.avatarUrl : (current?.avatarUrl || "");
    serializedFullName = `${name.trim()} | ${role.trim()} | ${dept.trim()} | ${status.trim()} | ${avatar.trim()}`;
  }

  const dbUpdates: Record<string, string> = {};
  if (serializedFullName !== undefined) dbUpdates.full_name = serializedFullName;
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

// ── getAllEmployees ──────────────────────────────────────────────────────────
export async function getAllEmployees(): Promise<Employee[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("employees")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("[Employee Store] getAllEmployees error:", error);
    return [];
  }

  return data.map(rowToEmployee);
}

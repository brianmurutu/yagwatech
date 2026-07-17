import fs from "fs";
import path from "path";
import crypto from "crypto";

const STORE_PATH = path.join(process.cwd(), "src/lib/employees.json");

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
}

function readStore(): Record<string, Employee> {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, "utf8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("[Employee Store] Failed to read storage file:", e);
  }
  return {};
}

function writeStore(data: Record<string, Employee>) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("[Employee Store] Failed to write storage file:", e);
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function createEmployee(fullName: string, email: string, phone: string, password: string): Employee | null {
  const normEmail = email.trim().toLowerCase();
  const store = readStore();

  if (store[normEmail]) {
    return null; // Email already registered
  }

  const newEmployee: Employee = {
    id: `emp_${Date.now()}`,
    fullName: fullName.trim(),
    email: normEmail,
    phone: phone.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  store[normEmail] = newEmployee;
  writeStore(store);
  return newEmployee;
}

export function verifyEmployee(email: string, password: string): Employee | null {
  const normEmail = email.trim().toLowerCase();
  const store = readStore();
  const employee = store[normEmail];

  if (!employee) return null;

  const expectedHash = hashPassword(password);
  if (employee.passwordHash === expectedHash) {
    return employee;
  }
  return null;
}

export function getEmployeeByEmail(email: string): Employee | null {
  const normEmail = email.trim().toLowerCase();
  const store = readStore();
  return store[normEmail] || null;
}

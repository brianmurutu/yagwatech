import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "src/lib/kyc_records.json");

interface KYCStore {
  [email: string]: {
    status: "Pending" | "Verified" | "Failed" | "Not Started";
    inquiryId?: string;
    updatedAt: string;
  };
}

function readStore(): KYCStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, "utf8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("[KYC Store] Failed to read storage file:", e);
  }
  return {};
}

function writeStore(data: KYCStore) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("[KYC Store] Failed to write storage file:", e);
  }
}

export function getKYCStatus(email: string): "Pending" | "Verified" | "Failed" | "Not Started" {
  const normEmail = email.trim().toLowerCase();
  const store = readStore();
  return store[normEmail]?.status || "Not Started";
}

export function updateKYCStatus(
  email: string,
  status: "Pending" | "Verified" | "Failed" | "Not Started",
  inquiryId?: string
) {
  const normEmail = email.trim().toLowerCase();
  const store = readStore();
  store[normEmail] = {
    status,
    inquiryId: inquiryId || store[normEmail]?.inquiryId,
    updatedAt: new Date().toISOString(),
  };
  writeStore(store);
}

export function getAllKYCRecords() {
  return readStore();
}

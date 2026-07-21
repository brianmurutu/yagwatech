import { NextResponse } from "next/server";
import { getKYCStatus, updateKYCStatus, getAllKYCRecords } from "@/lib/kycStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      // If no email is provided, return all records (useful for admin overview)
      const allRecords = await getAllKYCRecords();
      return NextResponse.json({ success: true, records: allRecords });
    }

    const status = await getKYCStatus(email);
    return NextResponse.json({ success: true, email, status });
  } catch (error) {
    console.error("[KYC Status GET Error]:", error);
    return NextResponse.json({ error: "Failed to read KYC status" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, status } = body;

    if (!email || !status) {
      return NextResponse.json({ error: "Email and Status are required" }, { status: 400 });
    }

    if (!["Pending", "Verified", "Failed", "Not Started"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    await updateKYCStatus(email, status);
    return NextResponse.json({ success: true, email, status });
  } catch (error) {
    console.error("[KYC Status POST Error]:", error);
    return NextResponse.json({ error: "Failed to update KYC status" }, { status: 500 });
  }
}

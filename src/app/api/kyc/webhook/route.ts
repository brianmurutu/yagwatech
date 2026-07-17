import { NextResponse } from "next/server";
import { updateKYCStatus } from "@/lib/kycStore";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // ── Signature Verification (Production) ──────────────────────────────────
    // In production, Persona signs request bodies. We verify it using Webhook Secret.
    const signature = request.headers.get("Persona-Signature");
    const secret = process.env.PERSONA_WEBHOOK_SECRET;

    if (signature && secret) {
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(rawBody);
      const expectedSignature = hmac.digest("hex");
      
      if (signature !== expectedSignature) {
        console.warn("[Persona Webhook] Invalid signature detected. Ignoring webhook event.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const { event, payload } = body;
    console.log(`[Persona Webhook] Event received: ${event}`, payload);

    if (!payload) {
      return NextResponse.json({ error: "Missing payload data" }, { status: 400 });
    }

    const referenceId = payload.referenceId || payload.client_reference_id || payload.attributes?.referenceId;
    const inquiryId = payload.id;

    if (!referenceId) {
      console.warn("[Persona Webhook] Webhook payload missing referenceId (User Email).");
      return NextResponse.json({ success: true, warning: "Missing referenceId" });
    }

    // Map Persona statuses to our internal state
    let mappedStatus: "Verified" | "Failed" | "Pending" | "Not Started" = "Pending";

    if (event === "inquiry.approved" || payload.status === "approved") {
      mappedStatus = "Verified";
    } else if (
      event === "inquiry.failed" || 
      event === "inquiry.declined" || 
      payload.status === "failed" || 
      payload.status === "declined"
    ) {
      mappedStatus = "Failed";
    } else if (event === "inquiry.created" || event === "inquiry.started" || payload.status === "created") {
      mappedStatus = "Pending";
    }

    updateKYCStatus(referenceId, mappedStatus, inquiryId);
    console.log(`[Persona Webhook] Persisted KYC status "${mappedStatus}" for ${referenceId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Persona Webhook Error]:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}

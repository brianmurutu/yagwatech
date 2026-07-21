import { NextResponse } from "next/server";
import { updateKYCStatus } from "@/lib/kycStore";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // ── Signature Verification ────────────────────────────────────────────────
    // Persona-Signature header format: "t=<unix_timestamp>,v1=<hex_hmac>"
    // The signed string is: "<timestamp>.<rawBody>"
    const signatureHeader = request.headers.get("Persona-Signature");
    const secret = process.env.PERSONA_WEBHOOK_SECRET;

    if (secret && signatureHeader) {
      try {
        // Parse all t/v1 pairs (Persona can send multiple during secret rotation)
        const pairs = signatureHeader.split(" ");
        let verified = false;

        for (const pair of pairs) {
          const params = Object.fromEntries(
            pair.split(",").map((part) => part.split("=") as [string, string])
          );
          const timestamp = params["t"];
          const v1 = params["v1"];

          if (!timestamp || !v1) continue;

          // Construct the signed payload string
          const signedPayload = `${timestamp}.${rawBody}`;
          const expectedHmac = crypto
            .createHmac("sha256", secret)
            .update(signedPayload)
            .digest("hex");

          // Use timing-safe comparison to prevent timing attacks
          const expectedBuf = Buffer.from(expectedHmac, "hex");
          const receivedBuf = Buffer.from(v1, "hex");
          if (
            expectedBuf.length === receivedBuf.length &&
            crypto.timingSafeEqual(expectedBuf, receivedBuf)
          ) {
            verified = true;
            break;
          }
        }

        if (!verified) {
          console.warn("[Persona Webhook] Invalid signature. Rejecting event.");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      } catch (sigErr) {
        console.error("[Persona Webhook] Signature parsing error:", sigErr);
        return NextResponse.json({ error: "Signature error" }, { status: 400 });
      }
    } else if (!secret) {
      // No secret configured — log a warning but allow through (dev mode)
      console.warn("[Persona Webhook] PERSONA_WEBHOOK_SECRET not set. Skipping signature check.");
    }

    // ── Parse Event Body ──────────────────────────────────────────────────────
    // Persona webhook body structure:
    // { data: { type, id, attributes: { status, reference-id, ... } } }
    const body = JSON.parse(rawBody);

    const eventName: string = body?.data?.type ?? body?.event ?? "";
    const attributes = body?.data?.attributes ?? body?.payload?.attributes ?? body?.payload ?? {};
    const inquiryId: string = body?.data?.id ?? attributes?.id ?? "";

    // reference-id is the value we passed as client-reference-id (the employee email)
    const referenceId: string =
      attributes?.["reference-id"] ??
      attributes?.referenceId ??
      attributes?.client_reference_id ??
      body?.payload?.referenceId ??
      "";

    const personaStatus: string =
      attributes?.status ?? body?.payload?.status ?? "";

    console.log(`[Persona Webhook] Event: "${eventName}" | Status: "${personaStatus}" | ReferenceId: "${referenceId}" | InquiryId: "${inquiryId}"`);

    if (!referenceId) {
      console.warn("[Persona Webhook] Missing referenceId — cannot update KYC record.");
      return NextResponse.json({ success: true, warning: "Missing referenceId" });
    }

    // ── Map Persona status → internal status ──────────────────────────────────
    let mappedStatus: "Verified" | "Failed" | "Pending" | "Not Started" = "Pending";

    if (eventName === "inquiry.approved" || personaStatus === "approved") {
      mappedStatus = "Verified";
    } else if (
      eventName === "inquiry.failed" ||
      eventName === "inquiry.declined" ||
      personaStatus === "failed" ||
      personaStatus === "declined"
    ) {
      mappedStatus = "Failed";
    } else if (
      eventName === "inquiry.created" ||
      eventName === "inquiry.started" ||
      personaStatus === "created" ||
      personaStatus === "pending"
    ) {
      mappedStatus = "Pending";
    }

    updateKYCStatus(referenceId, mappedStatus, inquiryId);
    console.log(`[Persona Webhook] KYC status updated → "${mappedStatus}" for ${referenceId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Persona Webhook Error]:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}

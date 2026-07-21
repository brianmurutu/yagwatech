import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Helper to normalize message items from DB row format to application format
interface MessageItem {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  department: string;
  createdAt: string;
}

export async function GET() {
  try {
    const db = getSupabase();

    // 1. Try querying messages from database table first
    const { data, error } = await db
      .from("portal_chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(300);

    if (error) {
      // If table doesn't exist, we expect a schema cache lookup failure error
      if (error.message.includes("schema cache") || error.code === "PGRST116" || error.code === "42P01") {
        console.log("[Chat API] DB Table 'portal_chat_messages' not found. Falling back to Supabase storage file.");

        // Fallback: read from bucket
        const { data: fileData, error: downloadError } = await db.storage
          .from("avatars")
          .download("chat_messages.json");

        if (downloadError) {
          // If file doesn't exist yet, return empty list
          return NextResponse.json({ success: true, messages: [] });
        }

        const text = await fileData.text();
        const messages = JSON.parse(text || "[]");
        return NextResponse.json({ success: true, messages });
      }

      console.error("[Chat API] DB Query error:", error);
      return NextResponse.json({ error: "Failed to read messages" }, { status: 500 });
    }

    // Map DB fields to camelCase structure for frontend client compatibility
    const mapped: MessageItem[] = (data || []).map((row: any) => ({
      id: row.id,
      senderName: row.sender_name,
      senderEmail: row.sender_email,
      message: row.message,
      department: row.department,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ success: true, messages: mapped });
  } catch (error) {
    console.error("[Chat API GET Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderName, senderEmail, message, department } = body;

    if (!senderName || !senderEmail || !message || !department) {
      return NextResponse.json({ error: "Missing required message parameters." }, { status: 400 });
    }

    const db = getSupabase();
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const createdAt = new Date().toISOString();

    // 1. Try inserting to database table
    const { error: insertError } = await db
      .from("portal_chat_messages")
      .insert({
        id,
        sender_name: senderName.trim(),
        sender_email: senderEmail.trim().toLowerCase(),
        message: message.trim(),
        department: department.trim(),
        created_at: createdAt,
      });

    if (insertError) {
      if (insertError.message.includes("schema cache") || insertError.code === "42P01") {
        // Fallback: Append to storage file
        let messages: MessageItem[] = [];

        try {
          const { data: fileData } = await db.storage
            .from("avatars")
            .download("chat_messages.json");

          if (fileData) {
            const text = await fileData.text();
            messages = JSON.parse(text || "[]");
          }
        } catch (_) {
          // ignore download error if file doesn't exist
        }

        messages.push({
          id,
          senderName: senderName.trim(),
          senderEmail: senderEmail.trim().toLowerCase(),
          message: message.trim(),
          department: department.trim(),
          createdAt,
        });

        // Cap array to prevent infinite growth
        if (messages.length > 300) {
          messages = messages.slice(-300);
        }

        const { error: uploadError } = await db.storage
          .from("avatars")
          .upload("chat_messages.json", Buffer.from(JSON.stringify(messages)), {
            upsert: true,
            contentType: "application/json",
          });

        if (uploadError) {
          console.error("[Chat API] Storage fallback upload failed:", uploadError);
          return NextResponse.json({ error: "Failed to store message." }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: messages[messages.length - 1] });
      }

      console.error("[Chat API] DB Insert error:", insertError);
      return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: { id, senderName, senderEmail, message, department, createdAt },
    });
  } catch (error) {
    console.error("[Chat API POST Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

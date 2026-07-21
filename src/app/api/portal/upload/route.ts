import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const email = formData.get("email") as string | null;

    if (!file || !email) {
      return NextResponse.json(
        { error: "Bad request. File and Email are required." },
        { status: 400 }
      );
    }

    // Validate email domain or format
    const normEmail = email.trim().toLowerCase();
    if (!normEmail || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid request. Please upload an image file." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const db = getSupabase();

    // Upload to avatars bucket
    const fileName = `${normEmail}.png`;
    const { data, error } = await db.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("[Profile Upload Route] Supabase upload error:", error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;

    return NextResponse.json({
      success: true,
      avatarUrl: `${publicUrl}?t=${Date.now()}`,
    });
  } catch (error) {
    console.error("[Profile Upload Route Error]:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

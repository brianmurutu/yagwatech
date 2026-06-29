import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate type (images only)
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save path inside public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate safe, unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${sanitizedName}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return the public URL path
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}

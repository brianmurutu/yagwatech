import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: pdf-parse v2.x reads test files at module initialisation time, which
// crashes Next.js API routes if it is required at the top level.  We lazy-load
// it inside the request handler so that any import-time error is caught by the
// surrounding try/catch and returned as a proper JSON error response instead of
// an HTML 500 page that the browser cannot parse as JSON.

// Rate limiting: simple in-memory store (resets on cold start)
const requestMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestMap.get(ip);
  if (!entry || now > entry.resetAt) {
    requestMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // IP-based rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many resume analysis requests. Please try again in an hour." },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service is not configured. Please contact us directly." },
      { status: 500 }
    );
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("resume");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No resume file uploaded." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File size must be under 5MB." }, { status: 400 });
  }

  // Extract text from PDF
  // pdf-parse is lazy-loaded here so that any import-time crash (a known issue
  // with pdf-parse v2.x) is caught by this try/catch block and surfaces as a
  // proper JSON error rather than an unhandled exception that makes Next.js
  // return an HTML page the client cannot parse as JSON.
  let resumeText: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdf = require("pdf-parse");
    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new pdf.PDFParse({ data: buffer });
    const parsed = await parser.getText();
    resumeText = parsed.text?.trim();
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return NextResponse.json(
      { error: "Could not read the PDF. Please ensure it is not password-protected." },
      { status: 422 }
    );
  }

  if (!resumeText || resumeText.length < 100) {
    return NextResponse.json(
      { error: "Resume appears to be empty or image-only. Please use a text-based PDF." },
      { status: 422 }
    );
  }

  // Truncate to avoid token limits (~12,000 chars ≈ 3,000 tokens)
  const truncated = resumeText.slice(0, 12000);

  const prompt = `You are an expert career readiness coach and senior technical recruiter at a leading tech agency in Nairobi, Kenya called Yagwa Tech Solutions.

Yagwa Tech Solutions has these open roles:
1. Senior Fullstack Engineer (React / Next.js / Node) - ID: snr-fullstack-dev
2. UI/UX & Branding Designer - ID: uiux-designer
3. Cybersecurity & Systems Engineer - ID: security-sysadmin

Analyze the following resume text and return a JSON object (no markdown, no code fences, pure JSON only) with this exact structure:
{
  "score": <integer 0-100 representing overall career readiness>,
  "badge": <one of: "Ready", "Nearly Ready", "Needs Work">,
  "summary": <2-3 sentence encouraging summary of the candidate's profile>,
  "strengths": [<up to 5 specific strengths from the resume>],
  "improvements": [<up to 5 specific, actionable improvement suggestions>],
  "matchedRoles": [<array of role IDs from the list above that this candidate fits, e.g. ["snr-fullstack-dev"]>],
  "matchReason": <1-2 sentences explaining why they match or don't match the roles>
}

Score guidance:
- 80-100: Ready (strong match for at least one role, excellent profile)
- 55-79: Nearly Ready (good foundation, a few gaps)
- 0-54: Needs Work (significant gaps or very junior profile)

Resume text:
---
${truncated}
---`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Strip any accidental markdown fences
    const jsonStr = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const analysis = JSON.parse(jsonStr);

    return NextResponse.json({ success: true, analysis });
  } catch (err) {
    console.error("Gemini resume analysis error:", err);
    return NextResponse.json(
      { error: "AI analysis failed. Please try again shortly." },
      { status: 500 }
    );
  }
}

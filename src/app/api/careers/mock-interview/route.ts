import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jobPositions } from "@/lib/jobs";

// Rate limiting: simple in-memory store
const requestMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
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
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in an hour." },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service is not configured." },
      { status: 500 }
    );
  }

  let body: { jobId: string; stage: "questions" | "feedback"; answers?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { jobId, stage, answers } = body;

  if (!jobId || !stage) {
    return NextResponse.json({ error: "Missing jobId or stage." }, { status: 400 });
  }

  // Find the job (allow "general" as a wildcard)
  const job =
    jobId === "general"
      ? null
      : jobPositions.find((j) => j.id === jobId);

  const roleName =
    job?.title ?? "a general tech role at Yagwa Tech Solutions";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // ── Stage 1: Generate questions ─────────────────────────────────────────
  if (stage === "questions") {
    const prompt = `You are a senior interviewer at Yagwa Tech Solutions, a full-spectrum digital agency in Nairobi, Kenya.
    
Generate exactly 5 interview questions for a candidate applying for: "${roleName}".

Requirements:
- Mix of technical, behavioral, and situational questions
- Questions should be specific to the role and relevant to the Kenyan/East African tech market context where appropriate
- Vary difficulty: 2 warm-up, 2 mid-level, 1 challenging
- Each question should be concise (1-2 sentences max)

Return a JSON object (no markdown, no code fences, pure JSON only) with this exact structure:
{
  "questions": [
    { "id": 1, "question": "...", "type": "behavioral" | "technical" | "situational" },
    { "id": 2, "question": "...", "type": "..." },
    { "id": 3, "question": "...", "type": "..." },
    { "id": 4, "question": "...", "type": "..." },
    { "id": 5, "question": "...", "type": "..." }
  ]
}`;

    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text().trim();
      const jsonStr = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const data = JSON.parse(jsonStr);
      return NextResponse.json({ success: true, ...data });
    } catch (err) {
      console.error("Gemini questions error:", err);
      return NextResponse.json({ error: "Failed to generate questions." }, { status: 500 });
    }
  }

  // ── Stage 2: Evaluate answers ────────────────────────────────────────────
  if (stage === "feedback") {
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Answers are required for feedback stage." }, { status: 400 });
    }

    const answersText = answers
      .map((ans, i) => `Answer ${i + 1}: ${ans}`)
      .join("\n\n");

    const prompt = `You are a senior interviewer at Yagwa Tech Solutions evaluating a candidate for: "${roleName}".

The candidate answered ${answers.length} interview questions. Here are their answers:

${answersText}

Evaluate each answer and provide constructive, encouraging feedback. Then give an overall assessment.

Return a JSON object (no markdown, no code fences, pure JSON only) with this exact structure:
{
  "overallScore": <integer 0-100>,
  "overallBadge": "Excellent" | "Good" | "Fair" | "Needs Improvement",
  "overallFeedback": "<2-3 sentence overall performance summary>",
  "answerFeedback": [
    {
      "answerIndex": 0,
      "score": <integer 0-100>,
      "highlight": "<what they did well in 1 sentence>",
      "suggestion": "<one specific improvement tip in 1 sentence>"
    }
  ],
  "topTips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "readyToApply": <boolean>
}`;

    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text().trim();
      const jsonStr = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const data = JSON.parse(jsonStr);
      return NextResponse.json({ success: true, ...data });
    } catch (err) {
      console.error("Gemini feedback error:", err);
      return NextResponse.json({ error: "Failed to evaluate answers." }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
}

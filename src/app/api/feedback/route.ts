import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

// Check if KV is configured
function isKVConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getFeedbackKey(lessonId: string, userIp: string) {
  return `feedback:${lessonId}:${userIp}`;
}

async function checkIfAlreadyVoted(lessonId: string, userIp: string) {
  if (!isKVConfigured()) return false;
  const key = await getFeedbackKey(lessonId, userIp);
  const existingVote = await kv.get(key);
  return existingVote !== null;
}

export async function POST(request: NextRequest) {
  try {
    // Check if KV is configured
    if (!isKVConfigured()) {
      console.warn("Vercel KV not configured. Feedback will not be saved.");
      return NextResponse.json(
        { 
          error: "Feedback service not configured",
          message: "KV database not set up. Please configure Vercel KV."
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    const { lessonId, lessonTitle, type, userIp, timestamp } = body;

    // Validate input
    if (!lessonId || !type || !userIp || !timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["up", "down"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid feedback type" },
        { status: 400 }
      );
    }

    // Check if user already voted on this lesson
    const alreadyVoted = await checkIfAlreadyVoted(lessonId, userIp);
    if (alreadyVoted) {
      return NextResponse.json(
        { error: "You have already voted on this lesson" },
        { status: 409 }
      );
    }

    // Store feedback in Vercel KV
    const feedbackKey = await getFeedbackKey(lessonId, userIp);
    const feedbackData = {
      type,
      lessonTitle,
      timestamp,
      userIp,
    };

    // Store with 1 year expiry
    await kv.set(feedbackKey, JSON.stringify(feedbackData), {
      ex: 365 * 24 * 60 * 60,
    });

    // Also store for analytics/counting purposes
    await kv.incr(`feedback:count:${lessonId}:${type}`);

    return NextResponse.json(
      { message: "Feedback saved successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all feedback (for admin/analytics)
export async function GET() {
  try {
    const allKeys = await kv.keys("feedback:*");
    const feedback = [];

    for (const key of allKeys) {
      const data = await kv.get(key);
      if (data) {
        const [_, lessonId, userIp] = key.split(":");
        feedback.push({
          lessonId,
          userIp,
          ...JSON.parse(data as string),
        });
      }
    }

    return NextResponse.json({
      total: feedback.length,
      data: feedback,
    });
  } catch (err) {
    console.error("Failed to retrieve feedback:", err);
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}

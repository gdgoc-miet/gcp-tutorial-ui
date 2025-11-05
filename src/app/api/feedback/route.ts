import { put, list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Check if Blob is configured
function isBlobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// Generate a unique filename for each feedback
function getFeedbackFilename(lessonId: string, userIp: string) {
  const hash = crypto.createHash("md5").update(userIp).digest("hex").slice(0, 8);
  return `feedback/${lessonId}/${hash}.json`;
}

async function checkIfAlreadyVoted(lessonId: string, userIp: string) {
  if (!isBlobConfigured()) return false;
  
  try {
    const filename = getFeedbackFilename(lessonId, userIp);
    const { blobs } = await list({ prefix: filename });
    return blobs.length > 0;
  } catch (err) {
    console.error("Error checking vote:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Blob is configured
    if (!isBlobConfigured()) {
      console.warn("Vercel Blob not configured. Feedback will not be saved.");
      return NextResponse.json(
        { 
          error: "Feedback service not configured",
          message: "Blob storage not set up. Please configure Vercel Blob."
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

    // Store feedback in Vercel Blob
    const filename = getFeedbackFilename(lessonId, userIp);
    const feedbackData = {
      lessonId,
      lessonTitle,
      type,
      timestamp,
      userIp,
    };

    await put(filename, JSON.stringify(feedbackData), {
      access: "public",
      addRandomSuffix: false,
    });

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
    if (!isBlobConfigured()) {
      return NextResponse.json(
        { error: "Blob storage not configured" },
        { status: 503 }
      );
    }

    const { blobs } = await list({ prefix: "feedback/" });
    const feedback = [];

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        const data = await response.json();
        feedback.push(data);
      } catch (err) {
        console.error(`Failed to fetch blob ${blob.pathname}:`, err);
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

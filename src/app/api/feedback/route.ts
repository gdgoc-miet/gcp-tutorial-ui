import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

const FEEDBACK_DIR = join(process.cwd(), "public", "feedback");
const FEEDBACK_FILE = join(FEEDBACK_DIR, "feedback.csv");

async function ensureFeedbackDir() {
  try {
    await mkdir(FEEDBACK_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create feedback directory:", err);
  }
}

async function appendFeedbackToCsv(feedback: {
  lessonId: string;
  lessonTitle: string;
  type: "up" | "down";
  userIp: string;
  timestamp: string;
}) {
  await ensureFeedbackDir();

  try {
    let fileContent = "";

    // Check if file exists and read it
    try {
      fileContent = await readFile(FEEDBACK_FILE, "utf-8");
    } catch {
      // File doesn't exist, so we'll create headers
      fileContent =
        "timestamp,lessonId,lessonTitle,feedbackType,userIp\n";
    }

    // Append new feedback
    const csvLine = `"${feedback.timestamp}","${feedback.lessonId}","${feedback.lessonTitle}","${feedback.type}","${feedback.userIp}"\n`;
    fileContent += csvLine;

    // Write back to file
    await writeFile(FEEDBACK_FILE, fileContent, "utf-8");

    return true;
  } catch (err) {
    console.error("Failed to append feedback to CSV:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Save to CSV
    const success = await appendFeedbackToCsv({
      lessonId,
      lessonTitle,
      type,
      userIp,
      timestamp,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Failed to save feedback" },
        { status: 500 }
      );
    }

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

// GET endpoint to retrieve feedback (optional, for viewing stats)
export async function GET() {
  try {
    await ensureFeedbackDir();

    const fileContent = await readFile(FEEDBACK_FILE, "utf-8");
    const lines = fileContent.trim().split("\n");

    // Parse CSV
    const header = lines[0];
    const data = lines.slice(1).map((line) => {
      const values = line.match(/(".*?"|[^",]+)/g) || [];
      return {
        timestamp: values[0]?.replace(/"/g, ""),
        lessonId: values[1]?.replace(/"/g, ""),
        lessonTitle: values[2]?.replace(/"/g, ""),
        feedbackType: values[3]?.replace(/"/g, ""),
        userIp: values[4]?.replace(/"/g, ""),
      };
    });

    return NextResponse.json({ header, data });
  } catch (err) {
    console.error("Failed to read feedback:", err);
    return NextResponse.json(
      { error: "Failed to read feedback" },
      { status: 500 }
    );
  }
}

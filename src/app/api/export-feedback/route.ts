import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

// Check if Blob is configured
function isBlobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

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

    // Retrieve all feedback data
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        const data = await response.json();
        feedback.push({
          timestamp: data.timestamp,
          lessonId: data.lessonId,
          lessonTitle: data.lessonTitle,
          feedbackType: data.type,
          userIp: data.userIp,
        });
      } catch (err) {
        console.error(`Failed to fetch blob ${blob.pathname}:`, err);
      }
    }

    // Sort by timestamp
    feedback.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Convert to CSV
    const csvHeader =
      "timestamp,lessonId,lessonTitle,feedbackType,userIp\n";
    const csvRows = feedback
      .map(
        (row) =>
          `"${row.timestamp}","${row.lessonId}","${row.lessonTitle}","${row.feedbackType}","${row.userIp}"`
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;

    // Return as downloadable CSV file
    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="feedback_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("Failed to export feedback:", err);
    return NextResponse.json(
      { error: "Failed to export feedback" },
      { status: 500 }
    );
  }
}

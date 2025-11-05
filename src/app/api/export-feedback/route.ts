import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allKeys = await kv.keys("feedback:*");
    const feedback = [];

    // Retrieve all feedback data
    for (const key of allKeys) {
      const data = await kv.get(key);
      if (data) {
        const [_, lessonId, userIp] = key.split(":");
        const parsedData = JSON.parse(data as string);
        feedback.push({
          timestamp: parsedData.timestamp,
          lessonId,
          lessonTitle: parsedData.lessonTitle,
          feedbackType: parsedData.type,
          userIp,
        });
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

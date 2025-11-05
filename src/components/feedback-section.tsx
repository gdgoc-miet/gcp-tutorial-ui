"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FeedbackSectionProps = {
  lessonId: string;
  lessonTitle: string;
};

export function FeedbackSection({
  lessonId,
  lessonTitle,
}: FeedbackSectionProps) {
  const [userIp, setUserIp] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down">>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user IP
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setUserIp(data.ip))
      .catch((err) => console.error("Failed to fetch IP:", err));

    // Load user votes from localStorage
    const savedVotes = localStorage.getItem("userVotes");
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }
  }, []);

  const handleVote = async (type: "up" | "down") => {
    if (!userIp) return;
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          lessonTitle,
          type,
          userIp,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newVotes = { ...userVotes, [lessonId]: type };
        setUserVotes(newVotes);
        localStorage.setItem("userVotes", JSON.stringify(newVotes));
      }
    } catch (err) {
      console.error("Failed to send feedback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentVote = userVotes[lessonId];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Was this lesson helpful?</CardTitle>
        <CardDescription>Your feedback helps us improve.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Button
            variant={currentVote === "up" ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote("up")}
            disabled={isLoading || currentVote !== undefined}
            className="flex-1 gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            Helpful
          </Button>
          <Button
            variant={currentVote === "down" ? "default" : "outline"}
            size="sm"
            onClick={() => handleVote("down")}
            disabled={isLoading || currentVote !== undefined}
            className="flex-1 gap-2"
          >
            <ThumbsDown className="h-4 w-4" />
            Not Helpful
          </Button>
        </div>
        {currentVote && (
          <p className="text-xs text-muted-foreground mt-2">
            Thank you for your feedback!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

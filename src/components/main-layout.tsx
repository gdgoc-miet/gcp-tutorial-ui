"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lesson } from "@/lib/types";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { MarkdownNotes } from "./markdown-notes";
import { VideoPlayer } from "./video-player";
import { FeedbackSection } from "./feedback-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

type MainLayoutProps = {
  lessons: Lesson[];
};

export default function MainLayout({ lessons }: MainLayoutProps) {
  const initialLesson = useMemo(() => lessons?.[0] ?? null, [lessons]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(initialLesson);

  useEffect(() => {
    setSelectedLesson(initialLesson);
  }, [initialLesson]);

  if (!selectedLesson) {
    return (
      <div className="flex h-screen items-center justify-center">
        No lessons found.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        lessons={lessons}
        selectedLesson={selectedLesson}
        onSelectLesson={setSelectedLesson}
      />
      <SidebarInset className="flex min-h-screen flex-1 flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex flex-1 min-h-0 flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <PanelGroup direction="horizontal" className="flex-1 min-h-0 gap-6">
            <Panel defaultSize={62} minSize={30} className="flex min-h-0 min-w-0 flex-col gap-6">
              <VideoPlayer videoId={selectedLesson.details.videoId} />
              <Card>
                <CardHeader className="space-y-3">
                  <CardTitle>{selectedLesson.details.title}</CardTitle>
                  <CardDescription>Key information about this lesson.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Overview</p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {selectedLesson.details.description ??
                        "We are still writing a description for this lesson."}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <FeedbackSection
                lessonId={selectedLesson.id}
                lessonTitle={selectedLesson.details.title}
              />
            </Panel>
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
            <Panel defaultSize={38} minSize={22} className="flex min-h-0 min-w-0 flex-col overflow-hidden">
              <Card className="flex h-full min-h-0 flex-col overflow-hidden">
                <CardHeader></CardHeader>
                <CardContent className="flex-1 overflow-hidden min-h-0">
                  <ScrollArea className="h-full w-full pr-4">
                    <MarkdownNotes notes={selectedLesson.notes} />
                  </ScrollArea>
                </CardContent>
              </Card>
            </Panel>
          </PanelGroup>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";

import type { Lesson } from "@/lib/types";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Cloud } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState, useRef } from "react";

function Logo() {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <Cloud className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-bold">GDGoC MIET</h1>
      </div>
    </div>
  );
}

type AppSidebarProps = {
  lessons: Lesson[];
  selectedLesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
};

export function AppSidebar({
  lessons,
  selectedLesson,
  onSelectLesson,
}: AppSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 16rem = 256px
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Measure the actual text width
    if (typeof window !== "undefined" && measureRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        // Use the same font as the sidebar buttons
        context.font = "11px Inter, sans-serif";context.font = "11px Inter, sans-serif";
        
        const titles = lessons.map(
          (lesson) => lesson.details.sidebarTitle || lesson.details.title
        );
        
        let maxWidth = 0;
        titles.forEach((title) => {
          const metrics = context.measureText(title);
          maxWidth = Math.max(maxWidth, metrics.width);
        });
        
        // Add padding: 32px (left/right padding) + 16px (icon space) + 32px (extra spacing)
        const calculatedWidth = Math.ceil(maxWidth + 80);
        
        // Set min 200px and max 400px
        const finalWidth = Math.max(200, Math.min(calculatedWidth, 400));
        setSidebarWidth(finalWidth);
      }
    }
  }, [lessons]);

  return (
    <Sidebar style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          <SidebarMenu className="space-y-1">
            {lessons.map((lesson) => (
              <SidebarMenuItem key={lesson.id} ref={measureRef}>
                <SidebarMenuButton
                  onClick={() => onSelectLesson(lesson)}
                  isActive={selectedLesson.id === lesson.id}
                  tooltip={{
                    children: lesson.details.sidebarTitle || lesson.details.title,
                    side: "right",
                    align: "center",
                  }}
                >
                  <span>{lesson.details.sidebarTitle || lesson.details.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}

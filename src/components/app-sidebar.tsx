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
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          <SidebarMenu className="space-y-1">
            {lessons.map((lesson) => (
              <SidebarMenuItem key={lesson.id}>
                <SidebarMenuButton
                  onClick={() => onSelectLesson(lesson)}
                  isActive={selectedLesson.id === lesson.id}
                  tooltip={{
                    children: lesson.details.title,
                    side: "right",
                    align: "center",
                  }}
                >
                  <span>{lesson.details.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}

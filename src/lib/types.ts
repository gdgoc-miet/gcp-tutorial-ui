export interface LessonDetails {
  title: string;
  sidebarTitle?: string;
  videoId: string;
  description?: string;
}

export interface Lesson {
  id: string;
  details: LessonDetails;
  notes: string;
}

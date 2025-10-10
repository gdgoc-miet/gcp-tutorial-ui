import fs from 'fs/promises';
import path from 'path';
import { Lesson, LessonDetails } from './types';

const contentDirectory = path.join(process.cwd(), 'src', 'content', 'videos');

export async function getLessons(): Promise<Lesson[]> {
  try {
    const lessonFolders = await fs.readdir(contentDirectory, { withFileTypes: true });

    const lessons: Lesson[] = await Promise.all(
      lessonFolders
        .filter((dirent) => dirent.isDirectory())
        .map(async (dirent) => {
          const lessonId = dirent.name;
          const notesPath = path.join(contentDirectory, lessonId, 'notes.md');

          // Using dynamic import for the .ts file
          const detailsModule = await import(`@/content/videos/${lessonId}/details.ts`);
          const details: LessonDetails = detailsModule.details;
          
          const notes = await fs.readFile(notesPath, 'utf-8');

          return {
            id: lessonId,
            details,
            notes,
          };
        })
    );

    return lessons;
  } catch (error) {
    console.error("Failed to read lessons:", error);
    // In a real app, you might want to handle this more gracefully.
    // For now, if the directory doesn't exist, we return an empty array.
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

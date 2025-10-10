import MainLayout from "@/components/main-layout";
import { getLessons } from "@/lib/lessons";

export default async function Home() {
  const lessons = await getLessons();
  return (
    <div className="bg-background">
      <MainLayout lessons={lessons} />
    </div>
  );
}

import { Card } from "@/components/ui/card";

type VideoPlayerProps = {
  videoId: string;
};

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="aspect-video">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </Card>
  );
}

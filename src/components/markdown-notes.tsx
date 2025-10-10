import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownNotesProps = {
  notes: string;
};

export function MarkdownNotes({ notes }: MarkdownNotesProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
    </div>
  );
}

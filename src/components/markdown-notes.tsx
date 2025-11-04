import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownNotesProps = {
  notes: string;
};

export function MarkdownNotes({ notes }: MarkdownNotesProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none w-full overflow-wrap-anywhere">
      <style jsx global>{`
        .prose {
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .prose p,
        .prose li,
        .prose pre,
        .prose code,
        .prose a,
        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }
        .prose pre {
          white-space: pre-wrap;
        }
        .prose code {
          white-space: pre-wrap;
        }
      `}</style>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
    </div>
  );
}

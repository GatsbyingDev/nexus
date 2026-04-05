import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

interface CodeBlockProps {
  code: string;
}

export const CodeBlock = ({ code }: CodeBlockProps) => {
  const highlighted = useMemo(() => hljs.highlightAuto(code).value, [code]);

  return (
    <div className="rounded-md border border-outline-variant bg-surface-container-low p-3">
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="mb-2 rounded bg-surface-container-high px-2 py-1 text-xs"
      >
        Copy
      </button>
      <pre className="overflow-x-auto text-xs" dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  );
};

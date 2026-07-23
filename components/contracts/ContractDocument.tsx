"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ContractDocument({ content }: { content: string }) {
  return (
    <div className="contract-doc mx-auto max-w-3xl bg-white px-6 py-10 sm:px-12 print:max-w-none print:px-0 print:py-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => (
            <h1
              className="mb-6 mt-2 text-center text-2xl font-extrabold tracking-tight text-navy-950"
              {...p}
            />
          ),
          h2: (p) => (
            <h2 className="mb-3 mt-8 text-lg font-bold text-navy-900" {...p} />
          ),
          p: (p) => (
            <p className="mb-4 text-justify text-sm leading-relaxed text-navy-800" {...p} />
          ),
          strong: (p) => <strong className="font-bold text-navy-950" {...p} />,
          blockquote: (p) => (
            <blockquote
              className="mb-6 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 [&_p]:mb-1 [&_p]:text-xs [&_p]:text-amber-900"
              {...p}
            />
          ),
          table: (p) => (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...p} />
            </div>
          ),
          th: (p) => (
            <th
              className="border border-navy-200 bg-navy-50 px-3 py-2 text-left text-xs font-bold text-navy-800"
              {...p}
            />
          ),
          td: (p) => (
            <td className="border border-navy-200 px-3 py-2 text-sm text-navy-800" {...p} />
          ),
          hr: () => <hr className="my-8 border-navy-200" />,
          ul: (p) => (
            <ul className="mb-4 list-disc space-y-1 pl-6 text-sm text-navy-800" {...p} />
          ),
          ol: (p) => (
            <ol className="mb-4 list-decimal space-y-1 pl-6 text-sm text-navy-800" {...p} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

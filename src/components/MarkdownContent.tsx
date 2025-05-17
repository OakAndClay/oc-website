import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export default function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`prose prose-slate font-roboto max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1 className="text-5xl font-bold mt-8 mb-4 border-b pb-2" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-4xl font-semibold mt-8 mb-4 border-b pb-1" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-3xl font-semibold mt-6 mb-2" {...props} />
          ),
          h4: (props) => (
            <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />
          ),
          p: (props) => (
            <p className="my-2" {...props} />
          ),
          ul: (props) => (
            <ul className="list-disc list-inside my-2" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal list-inside my-2" {...props} />
          ),
          li: (props) => (
            <li className="my-1" {...props} />
          ),
          blockquote: (props) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />
          ),
          code(
            props: React.ComponentProps<'code'> & { inline?: boolean; children?: React.ReactNode }
          ) {
            const { inline, className, children, ...rest } = props;
            return inline ? (
              <code className={`bg-gray-100 rounded px-1 py-0.5 font-mono text-sm ${className ?? ""}`} {...rest}>
                {children}
              </code>
            ) : (
              <pre className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto my-4">
                <code className={`font-mono text-sm ${className ?? ""}`} {...rest}>
                  {children}
                </code>
              </pre>
            );
          },
          table: (props) => (
            <table className="border-collapse border border-gray-300 my-4" {...props} />
          ),
          th: (props) => (
            <th className="border border-gray-300 bg-gray-100 px-2 py-1 font-semibold" {...props} />
          ),
          td: (props) => (
            <td className="border border-gray-300 px-2 py-1" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
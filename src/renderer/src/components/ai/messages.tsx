import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState } from "react";

export default function Messages({ messages, logsEndRef }: { messages: any[]; logsEndRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="space-y-3">
      {messages.map((message: any, index: number) => (
        <div key={index} className="text-xs text-balance" style={{ scrollSnapAlign: "start" }}>
          <span className="text-neutral-400 mr-2">
            AI - {new Date(message.created_at || Date.now()).toLocaleTimeString()}:
          </span>
          <div className="prose prose-invert max-w-none text-[13px] leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                code({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeText = String(children).replace(/\n$/, "");

                  const CodeBlockWithCopy = () => {
                    const [copied, setCopied] = useState(false);
                    const handleCopy = () => {
                      navigator.clipboard.writeText(codeText).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      });
                    };
                    return (
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={handleCopy}
                          aria-label="Copy code"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 cursor-pointer bg-gray-700 text-gray-200 text-xs px-2 py-0.5 rounded select-none transition-opacity"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match ? match[1] : undefined}
                          PreTag="div"
                          {...props}
                        >
                          {codeText}
                        </SyntaxHighlighter>
                      </div>
                    );
                  };

                  return !inline && match ? (
                    <CodeBlockWithCopy />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content || message.message?.content || "No content"}
            </ReactMarkdown>
          </div>
        </div>
      ))}
      <div ref={logsEndRef} />
    </div>
  );
}

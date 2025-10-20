import { useEffect, useMemo, useRef } from "react";

interface TerminalOutputProps {
  lines: string[];
  id?: string;
  className?: string;
  containerClassName?: string;
  autoScroll?: boolean; // follow output
}

export default function TerminalOutput({
  lines,
  id,
  className,
  containerClassName,
  autoScroll = true,
}: TerminalOutputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef<number>(0);

  // Join once to keep DOM light and fast (single text node)
  const text = useMemo(() => (Array.isArray(lines) ? lines.join("\n") : ""), [
    lines,
  ]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!autoScroll) return;

    // If user is near the bottom, stick to bottom on updates
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    const grew = lines.length >= prevLengthRef.current;

    if (nearBottom || grew) {
      el.scrollTop = el.scrollHeight;
    }

    prevLengthRef.current = lines.length;
  }, [lines, autoScroll]);

  return (
    <div
      id={id}
      ref={containerRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      className={
        containerClassName ??
        "mx-auto max-h-96 hide-scrollbar overflow-auto pointer-events-auto select-text pb-4"
      }
    >
      <pre className={className ?? "whitespace-pre-wrap break-words font-mono text-xs text-neutral-300 leading-5"}>
        {text}
      </pre>
    </div>
  );
}

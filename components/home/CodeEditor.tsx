"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type Token = { text: string; cls?: string };

const CODE_LINES: Token[][] = [
  [
    { text: "const", cls: "code-kw" },
    { text: " " },
    { text: "developer", cls: "code-var" },
    { text: " " },
    { text: "=", cls: "code-kw" },
    { text: " {" },
  ],
  [
    { text: "  name:", cls: "code-var" },
    { text: " " },
    { text: "'Mahdi Hasan'", cls: "code-str" },
    { text: "," },
  ],
  [
    { text: "  role:", cls: "code-var" },
    { text: " " },
    { text: "'Frontend Developer'", cls: "code-str" },
    { text: "," },
  ],
  [
    { text: "  stack:", cls: "code-var" },
    { text: " [" },
    { text: "'React'", cls: "code-str" },
    { text: ", " },
    { text: "'Next.js'", cls: "code-str" },
    { text: ", " },
    { text: "'WordPress'", cls: "code-str" },
    { text: "]," },
  ],
  [
    { text: "  passion:", cls: "code-var" },
    { text: " " },
    { text: "'clean code'", cls: "code-str" },
    { text: "," },
  ],
  [
    { text: "  available", cls: "code-fn" },
    { text: ": " },
    { text: "true", cls: "code-kw" },
  ],
  [{ text: "};" }],
  [],
  [
    { text: "export function", cls: "code-kw" },
    { text: " " },
    { text: "buildAwesome", cls: "code-fn" },
    { text: "(" },
    { text: "idea", cls: "code-var" },
    { text: ": Idea", cls: "code-type" },
    { text: ") {" },
  ],
  [
    { text: "  return", cls: "code-kw" },
    { text: " " },
    { text: "developer", cls: "code-var" },
    { text: "." },
    { text: "ship", cls: "code-fn" },
    { text: "(" },
    { text: "idea", cls: "code-var" },
    { text: ");" },
  ],
  [{ text: "}" }],
];

const LAST_LINE = CODE_LINES.length - 1;

const lineLength = (line: Token[]) =>
  line.reduce((total, token) => total + token.text.length, 0);

/** Renders a line clipped to its first `chars` characters. */
function renderLine(line: Token[], chars: number) {
  let used = 0;

  return line.map((token, i) => {
    const remaining = chars - used;
    used += token.text.length;
    if (remaining <= 0) return null;

    return (
      <span key={i} className={token.cls}>
        {token.text.slice(0, remaining)}
      </span>
    );
  });
}

/** The signature hero element: a fake editor that types itself out on a loop. */
const CodeEditor = () => {
  const [{ line, chars }, setProgress] = useState({ line: 0, chars: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    // Reduced motion gets the finished snippet with no typing at all.
    if (reduced) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let current = 0;
    let typed = 0;

    const tick = () => {
      if (cancelled) return;

      const length = lineLength(CODE_LINES[current]);

      if (typed >= length) {
        if (current === LAST_LINE) {
          // Hold the finished snippet on screen, then type it again.
          timer = setTimeout(() => {
            current = 0;
            typed = 0;
            setProgress({ line: 0, chars: 0 });
            tick();
          }, 3000);
          return;
        }
        current += 1;
        typed = 0;
      } else {
        typed = Math.min(length, typed + 2);
      }

      setProgress({ line: current, chars: typed });
      timer = setTimeout(tick, 6);
    };

    timer = setTimeout(tick, 6);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced]);

  return (
    // Pure decoration: it restates the hero copy, so screen readers skip it.
    <div className="editor reveal-scale" aria-hidden>
      <div className="editor-bar">
        <span className="tdot" style={{ background: "#ff5f57" }} />
        <span className="tdot" style={{ background: "#febc2e" }} />
        <span className="tdot" style={{ background: "#28c840" }} />
        <div className="editor-tabs">
          <span className="active">developer.ts</span>
          <span>stack.json</span>
        </div>
      </div>

      <div className="editor-body" id="codeBody">
        {CODE_LINES.map((tokens, i) => (
          <div className="editor-line" key={i}>
            <span className="ln">{i + 1}</span>
            <span className="txt">
              {(reduced || i < line) && renderLine(tokens, lineLength(tokens))}
              {!reduced && i === line && (
                <>
                  {renderLine(tokens, chars)}
                  <span className="type-cursor" />
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeEditor;

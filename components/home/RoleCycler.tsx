"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

const TYPE_MS = 85;
const ERASE_MS = 45;
const HOLD_MS = 1800;
/** Waits for the hero's load sequence to finish before typing starts. */
const START_MS = 1500;

/**
 * Types each word, holds it, erases it, moves on. Rendered inline (it sits
 * inside the hero <h1>). Screen readers get the whole
 * list once instead of a stream of letters.
 */
const RoleCycler = ({ words }: { words: string[] }) => {
  const reduced = useReducedMotion();
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (reduced) return;

    let timer: ReturnType<typeof setTimeout>;
    let index = 0;
    let length = words[0].length;
    let erasing = true;

    const step = () => {
      const word = words[index];

      if (erasing) {
        length -= 1;
        if (length === 0) {
          erasing = false;
          index = (index + 1) % words.length;
        }
        setText(word.slice(0, length));
        timer = setTimeout(step, ERASE_MS);
        return;
      }

      length += 1;
      setText(word.slice(0, length));
      if (length === word.length) {
        erasing = true;
        timer = setTimeout(step, HOLD_MS);
      } else {
        timer = setTimeout(step, TYPE_MS);
      }
    };

    timer = setTimeout(step, START_MS + HOLD_MS);
    return () => clearTimeout(timer);
  }, [reduced, words]);

  return (
    <span className="hero-builds">
      <span className="sr-only">{words.join(", ").toLowerCase()}</span>
      <span aria-hidden>
        {reduced ? words[0] : text}
        <span className="caret" />
      </span>
    </span>
  );
};

export default RoleCycler;

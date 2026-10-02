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
    // The middle line's mask child: it slides up with the other lines and its
    // palette keeps shifting. min-height holds the line open while the word is
    // fully erased.
    <span className="text-palette block min-h-[1em] animate-[lineUp_1.1s_var(--ease-smooth)_.36s_both,paletteShift_8s_linear_infinite] whitespace-nowrap">
      <span className="sr-only">{words.join(", ").toLowerCase()}</span>
      <span aria-hidden>
        {reduced ? words[0] : text}
        <span className="ml-[.06em] inline-block h-[.78em] w-[.07em] animate-blink bg-khaki align-[-.04em]" />
      </span>
    </span>
  );
};

export default RoleCycler;

"use client";

import { useMagnetic } from "@/hooks/useMagnetic";
import { useReveal } from "@/hooks/useReveal";
import { useSpotlight } from "@/hooks/useSpotlight";

/**
 * Page-wide behaviour that works off class names rather than props: scroll
 * reveals, magnetic buttons and card spotlights. Render it last on the page so
 * the markup it queries is already mounted.
 */
const Interactions = () => {
  useReveal();
  useMagnetic();
  useSpotlight();

  return null;
};

export default Interactions;

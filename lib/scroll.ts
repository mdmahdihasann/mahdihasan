/**
 * Pure scroll maths behind the nav's scroll-spy.
 * Kept out of the hooks so it can be unit tested without a DOM.
 */

/**
 * Picks the id of the section that owns the current viewport.
 *
 * A section counts as active once its top has passed the nav line; the last one
 * to do so wins, which keeps the highlight stable while scrolling through a
 * tall section. Before the first section, nothing is highlighted.
 */
export function activeSectionId(
  sections: { id: string; top: number }[],
  scrollY: number,
  offset: number,
): string | null {
  let current: string | null = null;
  for (const section of sections) {
    if (section.top - offset <= scrollY) current = section.id;
  }
  return current;
}

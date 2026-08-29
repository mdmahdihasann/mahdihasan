/**
 * Pure scroll maths shared by the nav progress bar and the back-to-top button.
 * Kept out of the hooks so it can be unit tested without a DOM.
 */

/**
 * How far the page has been read, as `0..1`.
 *
 * `scrollHeight - innerHeight` is the total scrollable distance; when a page is
 * shorter than the viewport that is `0` and there is nothing to report, so the
 * bar stays empty instead of dividing by zero.
 */
export function scrollProgress(
  scrollY: number,
  scrollHeight: number,
  innerHeight: number,
) {
  const scrollable = scrollHeight - innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / scrollable));
}

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

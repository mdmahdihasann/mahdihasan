/**
 * Window events the client islands use to reach each other without sharing
 * React state: the command palette and the estimator live in different
 * subtrees from the chat and the contact form they drive.
 */
export const OPEN_PALETTE = "mh:open-palette";
export const OPEN_CHAT = "mh:open-chat";
export const PREFILL_CONTACT = "mh:prefill-contact";

export type ContactPrefill = { subject: string; message: string };

export function emit<T>(name: string, detail?: T) {
  window.dispatchEvent(new CustomEvent<T>(name, { detail }));
}

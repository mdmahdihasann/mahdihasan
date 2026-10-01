import { z } from "zod";

/**
 * The contact form's rules, shared by the form (client) and `/api/contact`
 * (server) so a hand-crafted request can't skip what the form enforces.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email").max(200),
  subject: z.string().trim().min(3, "Please add a subject").max(200),
  message: z.string().trim().min(10, "Tell me a little more (10+ characters)").max(5000),
});

export type ContactValues = z.infer<typeof contactSchema>;

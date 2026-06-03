import { z } from "zod";

export const contentPostSchema = z.object({
  section: z.enum([
    "hero",
    "orientation",
    "perspectives",
    "research",
    "focus",
    "journey",
    "projects",
    "publications",
    "experience",
    "contact",
  ]),
  payload: z.record(z.string(), z.unknown()),
});

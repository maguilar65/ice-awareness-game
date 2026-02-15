import { z } from "zod";
import { insertGameContentSchema, gameContent, insertPlayerProgressSchema } from "./schema";

export const api = {
  content: {
    list: {
      method: "GET",
      path: "/api/content",
      responses: {
        200: z.array(z.custom<typeof gameContent.$inferSelect>()),
      },
    },
    create: {
      method: "POST",
      path: "/api/content",
      input: insertGameContentSchema,
      responses: {
        201: z.custom<typeof gameContent.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
  progress: {
    update: {
      method: "POST",
      path: "/api/progress",
      input: insertPlayerProgressSchema,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
} as const;

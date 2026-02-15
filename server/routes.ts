import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.content.list.path, async (_req, res) => {
    const content = await storage.getContent();
    res.json(content);
  });

  app.post(api.content.create.path, async (req, res) => {
    try {
      const input = api.content.create.input.parse(req.body);
      const content = await storage.createContent(input);
      res.status(201).json(content);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
  });

  // Seed initial data if empty
  const existing = await storage.getContent();
  if (existing.length === 0) {
    await storage.createContent({
      title: "Know Your Rights",
      content: "You have the right to remain silent. If you wish to exercise that right, say so out loud.",
      type: "fact",
      category: "rights",
      order: 1,
    });
    await storage.createContent({
      title: "The Community Center",
      content: "This place has been a safe haven for decades. We help everyone who walks through those doors.",
      type: "story",
      category: "community",
      order: 2,
    });
    await storage.createContent({
      title: "Warrants",
      content: "ICE agents must have a warrant signed by a judge to enter your home without permission.",
      type: "fact",
      category: "rights",
      order: 3,
    });
    await storage.createContent({
      title: "Maria's Story",
      content: "I came here for a better life for my children. We work hard every day to build our future.",
      type: "story",
      category: "community",
      order: 4,
    });
  }

  return httpServer;
}

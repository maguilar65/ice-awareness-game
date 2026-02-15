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
      title: "Citizens Deported",
      content: "ICE has wrongfully detained and deported U.S. citizens. Studies estimate that thousands of American citizens have been mistakenly detained or deported because ICE relied on flawed databases and ignored proof of citizenship.",
      type: "fact",
      category: "rights",
      order: 1,
    });
    await storage.createContent({
      title: "No Warrant, No Entry",
      content: "ICE agents often show up at homes without a judicial warrant. An ICE administrative warrant does NOT give them the right to enter your home. Only a warrant signed by a judge does. You have the right to keep your door closed.",
      type: "fact",
      category: "rights",
      order: 2,
    });
    await storage.createContent({
      title: "Force Against the Nonviolent",
      content: "ICE agents have been documented using excessive force during raids — including against people who posed no threat. Families have been separated at gunpoint. Nursing mothers, elderly individuals, and children have been caught in violent raids on homes and workplaces.",
      type: "fact",
      category: "history",
      order: 3,
    });
    await storage.createContent({
      title: "Davino Watson's Story",
      content: "Davino Watson, a U.S. citizen, was held by ICE for over three years despite repeatedly telling agents he was born in the United States. He was nearly deported to Jamaica before a judge intervened. His case is not unique — it is part of a pattern.",
      type: "story",
      category: "history",
      order: 4,
    });
    await storage.createContent({
      title: "Workplace Raids",
      content: "ICE conducts large-scale workplace raids that terrorize entire communities. In one 2019 Mississippi raid, 680 workers were arrested at food processing plants. Children came home from their first day of school to find their parents gone. Many of these workers had no criminal record.",
      type: "story",
      category: "community",
      order: 5,
    });
    await storage.createContent({
      title: "Right to Remain Silent",
      content: "You have the right to remain silent. You do not have to answer questions about where you were born, your immigration status, or how you entered the country. Say: 'I am exercising my right to remain silent.' This applies to EVERYONE — citizens and non-citizens alike.",
      type: "fact",
      category: "rights",
      order: 6,
    });
    await storage.createContent({
      title: "Detention Conditions",
      content: "People held in ICE detention facilities have reported overcrowding, lack of medical care, and unsafe conditions. Multiple people have died in ICE custody. Investigations have revealed facilities where detainees were denied basic hygiene and medical treatment.",
      type: "fact",
      category: "history",
      order: 7,
    });
    await storage.createContent({
      title: "Community Under Fear",
      content: "When ICE operates in a neighborhood, the entire community suffers. People stop going to work, children miss school, and families avoid hospitals and police — even for emergencies. This climate of fear affects everyone, not just those targeted.",
      type: "story",
      category: "community",
      order: 8,
    });
    await storage.createContent({
      title: "Know Your Rights at a Checkpoint",
      content: "At immigration checkpoints, you must stop. But you still have rights. You can refuse to answer questions beyond confirming citizenship. You can refuse a vehicle search unless agents have probable cause. Record badge numbers. Stay calm. Document everything.",
      type: "scenario",
      category: "rights",
      order: 9,
    });
    await storage.createContent({
      title: "What You Can Do",
      content: "Get involved: Know your rights and share them. Support organizations like RAICES, ACLU, and United We Dream. Attend community meetings. If you witness an ICE raid, document it safely from a distance. Be an ally. Silence helps no one.",
      type: "scenario",
      category: "community",
      order: 10,
    });
  }

  return httpServer;
}

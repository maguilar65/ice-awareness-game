import { db } from "./db";
import { gameContent, type InsertGameContent, type GameContent } from "@shared/schema";

export interface IStorage {
  getContent(): Promise<GameContent[]>;
  createContent(content: InsertGameContent): Promise<GameContent>;
}

export class DatabaseStorage implements IStorage {
  async getContent(): Promise<GameContent[]> {
    return await db.select().from(gameContent).orderBy(gameContent.order);
  }

  async createContent(insertContent: InsertGameContent): Promise<GameContent> {
    const [newContent] = await db
      .insert(gameContent)
      .values(insertContent)
      .returning();
    return newContent;
  }
}

export const storage = new DatabaseStorage();

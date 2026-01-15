import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, user_id: userId })
    .returning();
  return result;
}

export async function getFeeds() {
  return await db
    .select({
      id: feeds.id,
      name: feeds.name,
      url: feeds.url,
      createdBy: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.user_id, users.id));
}

export async function getFeedByURL(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

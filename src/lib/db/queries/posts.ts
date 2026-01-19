import { desc, eq, inArray } from "drizzle-orm";
import { db } from "..";
import { feeds, posts } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createPost(
  title: string,
  url: string,
  description: string,
  publishedAt: Date,
  feedId: string,
) {
  const result = await db
    .insert(posts)
    .values({
      title,
      url,
      description,
      publishedAt,
      feedId,
    })
    .returning();
  return firstOrUndefined(result);
}

export async function getPostsForUser(userId: string, numOfPosts: number) {
  return await db
    .select()
    .from(posts)
    .where(
      inArray(
        posts.feedId,
        db.select({ id: feeds.id }).from(feeds).where(eq(feeds.userId, userId)),
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(numOfPosts);
}

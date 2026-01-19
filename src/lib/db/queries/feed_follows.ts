import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId: userId, feedId: feedId })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .where(eq(feedFollows.id, newFeedFollow.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id));

  return result;
}

export async function deleteFeedFollow(userId: string, feedURL: string) {
  const [deletedFeedFollow] = await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.userId, userId),
        eq(
          feedFollows.feedId,
          db.select({ id: feeds.id }).from(feeds).where(eq(feeds.url, feedURL)),
        ),
      ),
    )
    .returning();
  return deletedFeedFollow;
}

export async function getFeedFollowsForUser(userId: string) {
  return await db
    .select({ id: feedFollows.id, userName: users.name, feedName: feeds.name })
    .from(feedFollows)
    .where(eq(feedFollows.userId, userId))
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
}

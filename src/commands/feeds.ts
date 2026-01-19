import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/feed_follows";
import type { Feed, User } from "../lib/db/schema";
import { type UserCommandHandler } from "./middleware";
import { type CommandHandler } from "./commands";
import { getUserById } from "src/lib/db/queries/users";
import { printFeedFollow } from "./follow";

export const addFeedHandler: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feedName> <feedURL>`);
  }

  const [feedName, feedURL] = args;
  const feed = await createFeed(feedName, feedURL, user.id);
  if (!feed) {
    throw new Error("Failed to create feed");
  }
  const follow = await createFeedFollow(user.id, feed.id);
  console.log("Feed added!");
  printFeed(feed, user);
  printFeedFollow(follow.userName, follow.feedName);
};

export const listFeedsHandler: CommandHandler = async () => {
  const feeds = await getFeeds();
  if (feeds.length === 0) {
    console.log("No feeds found.");
    return;
  }

  console.log(`Found %d feeds:\n`, feeds.length);
  for (let feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }

    printFeed(feed, user);
    console.log("=====================================");
  }
};

const printFeed = (feed: Feed, user: User) => {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
};

import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";
import { type UserCommandHandler } from "./middleware";
import { type CommandHandler } from "./commands";

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
  const follow = await createFeedFollow(user.id, feed.id);
  console.log(
    `${follow.userName} added and is now following "${follow.feedName}"`,
  );
};

export const listFeedsHandler: CommandHandler = async () => {
  const feeds = await getFeeds();
  console.log(JSON.stringify(feeds, null, 2));
};

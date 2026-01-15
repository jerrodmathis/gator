import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { readConfig } from "../config";
import { getUser } from "../lib/db/queries/users";
import { createFeedFollow } from "src/lib/db/queries/feed_follows";

export async function addFeedHandler(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feedName> <feedURL>`);
  }

  const [feedName, feedURL] = args;
  const userName = readConfig().currentUserName;
  const existingUser = await getUser(userName);
  const feed = await createFeed(feedName, feedURL, existingUser.id);
  const feedFollow = await createFeedFollow(existingUser.id, feed.id);
  console.log(
    `${feedFollow.userName} added and is now following "${feedFollow.feedName}"`,
  );
}

export async function listFeedsHandler(_: string) {
  const feeds = await getFeeds();
  console.log(JSON.stringify(feeds, null, 2));
}

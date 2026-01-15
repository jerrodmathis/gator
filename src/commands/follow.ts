import { readConfig } from "src/config";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";

export async function followFeedHandler(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feedURL>`);
  }

  const feedURL = args[0];
  const userName = readConfig().currentUserName;
  const existingUser = await getUser(userName);

  const existingFeed = await getFeedByURL(feedURL);
  if (!existingFeed) {
    throw new Error(`${feedURL} does not exist`);
  }

  const feedFollow = await createFeedFollow(existingUser.id, existingFeed.id);
  console.log(`${feedFollow.userName} followed "${feedFollow.feedName}"!`);
}

export async function listFollowsHandler(_: string) {
  const userName = readConfig().currentUserName;
  const follows = await getFeedFollowsForUser(userName);
  follows.forEach((follow) => console.log(`* ${follow.feedName}`));
}

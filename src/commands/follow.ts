import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed_follows";
import { getFeedByURL } from "src/lib/db/queries/feeds";
import { type UserCommandHandler } from "./middleware";

export const followFeedHandler: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feedURL>`);
  }

  const feedURL = args[0];
  const existingFeed = await getFeedByURL(feedURL);
  if (!existingFeed) {
    throw new Error(`${feedURL} does not exist`);
  }

  const feedFollow = await createFeedFollow(user.id, existingFeed.id);
  printFeedFollow(feedFollow.userName, feedFollow.feedName);
};

export const listFollowsHandler: UserCommandHandler = async (
  _cmdName,
  user,
  ..._args
) => {
  const follows = await getFeedFollowsForUser(user.id);
  follows.forEach((follow) => console.log(`* ${follow.feedName}`));
};

export const unfollowFeedHandler: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feedURL>`);
  }

  const feedURL = args[0];
  const existingFeed = await getFeedByURL(feedURL);
  if (!existingFeed) {
    throw new Error(`${feedURL} does not exist`);
  }

  await deleteFeedFollow(user.id, feedURL);
};

export const printFeedFollow = (userName: string, feedName: string) => {
  console.log(`${userName} just followed ${feedName}!`);
};

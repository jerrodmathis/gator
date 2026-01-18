import { fetchFeed } from "../lib/rss";
import { CommandHandler } from "./commands";

export const aggHandler: CommandHandler = async () => {
  const feedURL = "https://www.wagslane.dev/index.xml";
  const feedData = await fetchFeed(feedURL);
  console.log(JSON.stringify(feedData));
};

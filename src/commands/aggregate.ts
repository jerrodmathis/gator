import { fetchFeed } from "../lib/rss";

export async function aggHandler() {
  const feedURL = "https://www.wagslane.dev/index.xml";
  const feedData = await fetchFeed(feedURL);
  console.log(JSON.stringify(feedData));
}

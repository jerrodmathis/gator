import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "../lib/rss";
import { parseDuration } from "../lib/time";
import { CommandHandler } from "./commands";
import { createPost } from "src/lib/db/queries/posts";

export const aggHandler: CommandHandler = async (cmdName, ...args) => {
  if (args.length !== 1) {
    throw new Error(
      `usage: ${cmdName} <time_between_reqs> ('1s', '1m', '1h', etc.)`,
    );
  }

  const duration = args[0];
  const durationMs = parseDuration(duration);
  if (!durationMs) {
    throw new Error(
      `invalid duration: ${duration} = use format 1h 30m 15s or 3500ms`,
    );
  }
  console.log(`Collecting feeds every ${duration}...`);

  scrapeFeeds().catch(handleError);
  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, durationMs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
};

const scrapeFeeds = async () => {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feeds to fetch.");
    return;
  }

  console.log("Found a feed to fetch!");
  await markFeedFetched(feed.id);
  const feedData = await fetchFeed(feed.url);
  feedData.channel.item.forEach(async (post) => {
    const newPost = await createPost(
      post.title,
      post.link,
      post.description,
      new Date(post.pubDate),
      feed.id,
    );
    if (!newPost) {
      throw new Error("Failed to create post");
    }
    console.log("New post added!");
  });
};

const handleError = (err: unknown) => {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
};

import { getPostsForUser } from "src/lib/db/queries/posts";
import { UserCommandHandler } from "./middleware";

export const browseHandler: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  const limit = parseInt(args[0] ?? "2", 10);
  const posts = await getPostsForUser(user.id, limit);
  console.log(JSON.stringify(posts, null, 2));
};

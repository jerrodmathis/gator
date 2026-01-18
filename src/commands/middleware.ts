import { readConfig } from "src/config";
import { type User } from "../lib/db/schema";
import { CommandHandler } from "./commands";
import { getUser } from "src/lib/db/queries/users";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type MiddlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export const middlewareLoggedIn: MiddlewareLoggedIn = (userHandler) => {
  return async (cmdName: string, ...args: string[]) => {
    const currentUserName = readConfig().currentUserName;
    const user = await getUser(currentUserName);
    if (!user) {
      throw new Error(`User ${currentUserName} not found`);
    }
    await userHandler(cmdName, user, ...args);
  };
};

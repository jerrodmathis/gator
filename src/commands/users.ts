import { setUser } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/users";
import { CommandHandler } from "./commands";
import { UserCommandHandler } from "./middleware";

export const loginHandler: CommandHandler = async (cmdName, ...args) => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const username = args[0];
  const existingUser = await getUser(username);
  if (!existingUser) {
    throw new Error(`User ${username} not found`);
  }

  setUser(username);
  console.log(`Logged in as ${username}!`);
};

export const registerHandler: CommandHandler = async (cmdName, ...args) => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const name = args[0];
  const user = await createUser(name);
  if (!user) {
    throw new Error(`User ${name} not found`);
  }

  setUser(user.name);
  console.log(`User ${user.name} created successfully!`);
};

export const listUsersHandler: UserCommandHandler = async (
  _cmd,
  user,
  _args,
) => {
  const users = await getUsers();
  users.forEach((u) => {
    console.log(`* ${u.name}${u.name === user.name ? " (current)" : ""}`);
  });
};

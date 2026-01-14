import { setUser, readConfig } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/users";

export async function loginHandler(cmdName: string, ...args: string[]) {
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
}

export async function registerHandler(cmdName: string, ...args: string[]) {
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
}

export async function listUsersHandler(_: string) {
  const users = await getUsers();
  const currentUser = readConfig().currentUserName;
  users.forEach((user) => {
    console.log(
      `* ${user.name}${user.name === currentUser ? " (current)" : ""}`,
    );
  });
}

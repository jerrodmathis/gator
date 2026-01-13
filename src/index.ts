import { DrizzleQueryError } from "drizzle-orm";
import { readConfig, setUser } from "./config";
import {
  createUser,
  deleteUsers,
  getUserByName,
  getUsers,
} from "./lib/db/queries/users";

type CommandHandler = (...args: string[]) => Promise<void>;
type CommandsRegistry = Record<string, CommandHandler>;

function registerCommand(
  registry: CommandsRegistry,
  name: string,
  handler: CommandHandler,
) {
  registry[name] = handler;
}

async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  await registry[cmdName](...args);
}

async function loginHandler(...args: string[]) {
  if (args.length === 0) {
    console.error("username is required");
    process.exit(1);
  }
  const username = args[0];
  const userExists = await getUserByName(username);
  if (!userExists) {
    console.error("username does not exist");
    process.exit(1);
  }
  setUser(username);
  console.log("logged in as", username);
}

async function registerHandler(...args: string[]) {
  if (args.length === 0) {
    console.error("name is required");
    process.exit(1);
  }
  try {
    const name = args[0];
    const newUser = await createUser(name);
    setUser(name);
    console.log("user created:", newUser);
  } catch (err) {
    if (err instanceof DrizzleQueryError) {
      console.error("user already exists");
      process.exit(1);
    }
  }
}

async function resetHandler() {
  try {
    await deleteUsers();
  } catch (err) {
    if (err instanceof DrizzleQueryError) {
      process.exit(1);
    }
  }
}

async function usersHandler() {
  try {
    const users = await getUsers();
    const loggedInUser = readConfig().currentUserName;
    users.forEach((user) => {
      console.log(
        `* ${user.name}${user.name === loggedInUser ? " (current)" : ""}`,
      );
    });
  } catch (err) {
    if (err instanceof DrizzleQueryError) {
      process.exit(1);
    }
  }
}

async function main() {
  const commandRegistry: CommandsRegistry = {};
  registerCommand(commandRegistry, "login", loginHandler);
  registerCommand(commandRegistry, "register", registerHandler);
  registerCommand(commandRegistry, "reset", resetHandler);
  registerCommand(commandRegistry, "users", usersHandler);

  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("no arguments were provided");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;
  await runCommand(commandRegistry, cmdName, ...cmdArgs);
  process.exit(0);
}

main();

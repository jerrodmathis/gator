import { aggHandler } from "./commands/aggregate";
import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { addFeedHandler, listFeedsHandler } from "./commands/feeds";
import { followFeedHandler, listFollowsHandler } from "./commands/follow";
import { middlewareLoggedIn } from "./commands/middleware";
import { resetHandler } from "./commands/reset";
import {
  listUsersHandler,
  loginHandler,
  registerHandler,
} from "./commands/users";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("usage: cli <command> [args...]");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;
  const commandRegistry: CommandsRegistry = {};
  registerCommand(commandRegistry, "login", loginHandler);
  registerCommand(commandRegistry, "register", registerHandler);
  registerCommand(commandRegistry, "reset", resetHandler);
  registerCommand(
    commandRegistry,
    "users",
    middlewareLoggedIn(listUsersHandler),
  );
  registerCommand(commandRegistry, "agg", aggHandler);
  registerCommand(commandRegistry, "feeds", listFeedsHandler);
  registerCommand(
    commandRegistry,
    "addfeed",
    middlewareLoggedIn(addFeedHandler),
  );
  registerCommand(
    commandRegistry,
    "follow",
    middlewareLoggedIn(followFeedHandler),
  );
  registerCommand(
    commandRegistry,
    "following",
    middlewareLoggedIn(listFollowsHandler),
  );

  try {
    await runCommand(commandRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();

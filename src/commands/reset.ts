import { deleteUsers } from "../lib/db/queries/users";
import { CommandHandler } from "./commands";

export const resetHandler: CommandHandler = async () => {
  await deleteUsers();
  console.log("Database reset successfully!");
};

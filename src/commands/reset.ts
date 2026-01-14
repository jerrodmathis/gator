import { deleteUsers } from "../lib/db/queries/users";

export async function resetHandler() {
  await deleteUsers();
  console.log("Database reset successfully!");
}

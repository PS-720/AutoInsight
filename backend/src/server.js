import app from "./app.js";
import { env } from "./config/env.js";
import { getStore } from "./services/store.js";

await getStore();
const server = app.listen(env.port, () =>
  console.log(`AutoInsight API listening on http://localhost:${env.port}`),
);

async function shutdown(signal) {
  console.log(`${signal} received; shutting down.`);
  server.close();
  const { closeStore } = await import("./services/store.js");
  await closeStore();
  process.exit(0);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

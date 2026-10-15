import { closeStore, getStore } from "../services/store.js";
import { env } from "../config/env.js";

if (!env.mongodbUri) {
  throw new Error("MONGODB_URI is required to seed MongoDB.");
}

try {
  const store = await getStore();
  console.log(
    `MongoDB is ready: ${store.cars.length} cars and ${store.users.length} users.`,
  );
} finally {
  await closeStore();
}

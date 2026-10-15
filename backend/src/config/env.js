import "dotenv/config";

const port = Number.parseInt(process.env.PORT || "4000", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

export const env = {
  port,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "development-only-change-me",
  mongodbUri: process.env.MONGODB_URI || null,
  mongodbDatabase: process.env.MONGODB_DATABASE || "autoinsight",
};

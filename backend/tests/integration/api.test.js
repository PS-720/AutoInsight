import test from "node:test";
import assert from "node:assert/strict";
import app from "../../src/app.js";
import { closeStore } from "../../src/services/store.js";

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

test.after(async () => {
  server.close();
  await closeStore();
});

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  return { response, body: await response.json() };
}

const requiresMongo = {
  skip: !process.env.MONGODB_URI ? "MONGODB_URI is not configured" : false,
};

test(
  "health and seeded car endpoints are available",
  requiresMongo,
  async () => {
    const health = await request("/health");
    assert.equal(health.response.status, 200);
    const cars = await request("/cars?limit=2");
    assert.equal(cars.response.status, 200);
    assert.equal(cars.body.items.length, 2);
    assert.equal(cars.body.pagination.total >= 5, true);
  },
);

test(
  "registration returns a token and never exposes password hash",
  requiresMongo,
  async () => {
    const result = await request("/auth/register", {
      method: "POST",
      body: {
        name: "Test Owner",
        email: `owner-${Date.now()}@example.com`,
        password: "correct horse battery staple",
      },
    });
    assert.equal(result.response.status, 201);
    assert.equal(typeof result.body.token, "string");
    assert.equal("passwordHash" in result.body.user, false);
  },
);

test(
  "protected content rejects unauthenticated requests",
  requiresMongo,
  async () => {
    const result = await request("/reviews", {
      method: "POST",
      body: {
        carId: 1,
        rating: 5,
        title: "Great",
        body: "This review is intentionally too short and should be rejected by validation.",
      },
    });
    assert.equal(result.response.status, 401);
  },
);

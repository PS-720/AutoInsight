import bcrypt from "bcryptjs";
import { getStore, nextId, publicUser, saveStore } from "../services/store.js";
import { signUser } from "../middleware/auth.js";
import { HttpError } from "../utils/http.js";
import { email, requiredString } from "../utils/validation.js";

export async function register(request, response) {
  const store = await getStore();
  const name = requiredString(request.body.name, "name", 100);
  const userEmail = email(request.body.email);
  const password = requiredString(request.body.password, "password", 128);
  if (password.length < 8)
    throw new HttpError(400, "password must be at least 8 characters.");
  if (store.users.some((user) => user.email === userEmail))
    throw new HttpError(409, "An account with this email already exists.");
  const user = {
    id: nextId("users"),
    name,
    email: userEmail,
    passwordHash: await bcrypt.hash(password, 12),
    role: "user",
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  await saveStore();
  response
    .status(201)
    .json({ success: true, token: signUser(user), user: publicUser(user) });
}

export async function login(request, response) {
  const store = await getStore();
  const user = store.users.find(
    (candidate) => candidate.email === email(request.body.email),
  );
  if (
    !user ||
    !(await bcrypt.compare(
      String(request.body.password || ""),
      user.passwordHash,
    ))
  )
    throw new HttpError(401, "Email or password is incorrect.");
  response.json({
    success: true,
    token: signUser(user),
    user: publicUser(user),
  });
}

export async function me(request, response) {
  response.json({ success: true, user: publicUser(request.user) });
}

export async function updateProfile(request, response) {
  const store = await getStore();
  const user = store.users.find((u) => u.id === request.user.id);
  if (!user) throw new HttpError(404, "User not found.");

  if (request.body.name !== undefined) {
    user.name = requiredString(request.body.name, "name", 100);
  }

  if (request.body.password !== undefined && request.body.password !== "") {
    const password = requiredString(request.body.password, "password", 128);
    if (password.length < 8)
      throw new HttpError(400, "password must be at least 8 characters.");
    user.passwordHash = await bcrypt.hash(password, 12);
  }

  if (request.body.avatar !== undefined) {
    user.avatar = typeof request.body.avatar === "string" ? request.body.avatar : "";
  }

  await saveStore();
  response.json({
    success: true,
    user: publicUser(user),
    token: signUser(user),
  });
}

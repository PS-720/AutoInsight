import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http.js";
import { getStore } from "../services/store.js";

export function signUser(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: "7d",
  });
}

export async function authenticate(request, _response, next) {
  const header = request.get("authorization");
  if (!header?.startsWith("Bearer "))
    return next(new HttpError(401, "Authentication is required."));
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    const store = await getStore();
    const user = store.users.find((candidate) => candidate.id === payload.sub);
    if (!user) return next(new HttpError(401, "User no longer exists."));
    request.user = user;
    next();
  } catch {
    next(new HttpError(401, "The authentication token is invalid or expired."));
  }
}

export function requireAdmin(request, _response, next) {
  if (request.user?.role !== "admin")
    return next(new HttpError(403, "Administrator access is required."));
  next();
}

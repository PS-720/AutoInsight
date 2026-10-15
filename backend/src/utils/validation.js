import { HttpError } from "./http.js";

export function requiredString(value, field, max = 5000) {
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${field} is required.`);
  }
  if (value.trim().length > max)
    throw new HttpError(400, `${field} is too long.`);
  return value.trim();
}

export function optionalString(value, field, max = 5000) {
  if (value === undefined || value === null || value === "") return undefined;
  return requiredString(value, field, max);
}

export function integer(value, field, min, max) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < min || result > max) {
    throw new HttpError(
      400,
      `${field} must be an integer between ${min} and ${max}.`,
    );
  }
  return result;
}

export function email(value) {
  const result = requiredString(value, "email", 150).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result))
    throw new HttpError(400, "email is invalid.");
  return result;
}

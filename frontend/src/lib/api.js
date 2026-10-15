const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = sessionStorage.getItem("ai_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(payload?.message || "Request failed.");
  return payload;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
  setSession: (payload) => {
    sessionStorage.setItem("ai_token", payload.token);
    sessionStorage.setItem("ai_user", JSON.stringify(payload.user));
  },
  clearSession: () => {
    sessionStorage.removeItem("ai_token");
    sessionStorage.removeItem("ai_user");
  },
};

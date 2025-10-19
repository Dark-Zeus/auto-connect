// Helper to safely read the backend base URL in Vite/SPA environments
function getBaseUrl() {
  // For Vite
  const viteUrl = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BACKEND_URL;
  if (viteUrl) return viteUrl;

  // Optional global override if you inject it via index.html
  if (typeof window !== "undefined" && window.__APP_BACKEND_URL__) return window.__APP_BACKEND_URL__;

  // Sensible default for local dev
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3000`;
  }
  // Final fallback
  return "http://localhost:3000";
}

const BASE_URL = getBaseUrl();

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const createSession = async ({ amount, planLabel }) => {
  const res = await fetch(`${BASE_URL}/api/v1/subscription-payments/create-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ amount, planLabel }),
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to create checkout session");
  }
  return res.json(); // { sessionId, url }
};

const confirm = async (sessionId) => {
  const res = await fetch(`${BASE_URL}/api/v1/subscription-payments/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ sessionId }),
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to confirm subscription");
  }
  return res.json();
};

export default { createSession, confirm };
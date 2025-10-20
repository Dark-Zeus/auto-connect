function getBaseUrl() {
  const viteUrl =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_BACKEND_URL;
  if (viteUrl) return viteUrl;

  if (typeof window !== "undefined" && window.__APP_BACKEND_URL__)
    return window.__APP_BACKEND_URL__;

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3000`;
  }
  return "http://localhost:3000";
}

const BASE_URL = getBaseUrl();

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getMyPlan = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/my-plan`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to load plan");
  }
  return res.json();
};

const requestCancel = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/my-plan/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to cancel");
  }
  return res.json();
};

export default { getMyPlan, requestCancel };
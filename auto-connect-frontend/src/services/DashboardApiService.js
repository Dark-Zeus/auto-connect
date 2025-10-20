const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL ||
  "http://localhost:3001/api/v1";

async function request(endpoint = "", { method = "GET", body } = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, options);

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
    data = null;
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed with status ${res.status}`);
    err.response = { status: res.status, data };
    throw err;
  }

  return data; // note: returns the raw parsed body
}

// Export an object with the functions you need
const DashboardAPI = {
  // returns backend body (example: { success: true, data: { totalUsers: X } })
  getDashboardStats: () => request("/dashboard"),
};

export default DashboardAPI;
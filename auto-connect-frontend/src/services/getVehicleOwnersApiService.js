const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  "http://localhost:3001/api/v1";

async function request(endpoint = "", { method = "GET", body } = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  };
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

const VehicleOwnerAPI = {
  getAllOwners: () => request("/users/vehicleowners"), // your backend endpoint
};

export default VehicleOwnerAPI;

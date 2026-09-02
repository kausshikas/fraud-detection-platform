const API = "http://localhost:5000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("fraudguard_token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Request failed");
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) => request<any>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  dashboard: () => request<any>("/dashboard/summary"),
  transactions: (query = "") => request<any[]>(`/transactions${query}`),
  analyze: (body: any) => request<any>("/transactions/analyze", { method: "POST", body: JSON.stringify(body) }),
  customers: (query = "") => request<any[]>(`/customers${query}`),
  alerts: () => request<any[]>("/alerts"),
  updateAlert: (id: string, status: string) => request<any>(`/alerts/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  analytics: () => request<any>("/analytics")
};

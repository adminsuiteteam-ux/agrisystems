const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("agrosystem_token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = "An error occurred";
    try {
      const errData = await res.json();
      errorMessage = errData.error || errData.message || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return res.json();
}

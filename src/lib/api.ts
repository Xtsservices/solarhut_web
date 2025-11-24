// Centralized API utility for all backend calls
export async function fetchPackages(token?: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/packages`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  return res.json();
}
// Centralized API utility for all backend calls
export async function fetchPackages(token?: string) {
  const res = await fetch('http://172.16.4.40:3200/api/packages', {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  return res.json();
}
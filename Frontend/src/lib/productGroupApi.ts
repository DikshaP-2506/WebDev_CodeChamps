const API_BASE = 'http://localhost:5000/api/product-groups';

export async function createProductGroup(data: any) {
  // data should include price if present
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product group');
  return res.json();
}

export async function fetchProductGroups(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch product groups');
  return res.json();
}

export async function updateProductGroupStatus(id: number, status: 'accepted' | 'declined' | 'delivered') {
  const res = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update product group status');
  return res.json();
} 
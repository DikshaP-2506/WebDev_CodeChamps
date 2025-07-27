const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/product-groups`;

export async function createProductGroup(data: any) {
  console.log('Creating product group with data:', data);
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('API Error Response:', errorText);
    throw new Error(`Failed to create product group: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('Product group created successfully:', result);
  return result;
}

export async function fetchProductGroups(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch product groups');
  return res.json();
}

export async function updateProductGroupStatus(id: number, status: 'accepted' | 'declined' | 'delivered') {
  console.log(`Making API call to update status: ${API_BASE}/${id}/status with status: ${status}`);
  
  const res = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  
  console.log(`API response status: ${res.status}`);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API error response: ${errorText}`);
    throw new Error(`Failed to update product group status: ${res.status} ${errorText}`);
  }
  
  const result = await res.json();
  console.log(`API success response:`, result);
  return result;
} 
import { api } from './api';

// Vendor-related types
export interface VendorProfile {
  id?: number;
  firebaseUserId?: string;
  fullName: string;
  mobileNumber: string;
  languagePreference: string;
  stallName?: string;
  stallAddress: string;
  city: string;
  pincode: string;
  state: string;
  stallType: string;
  rawMaterialNeeds: string[];
  preferredDeliveryTime: string;
  latitude?: string;
  longitude?: string;
}

export interface VendorResponse {
  message: string;
  vendorId: number;
  data: VendorProfile;
}

export interface VendorListResponse {
  vendors: VendorProfile[];
  total: number;
}

// Vendor API functions
export const vendorApi = {
  // Create a new vendor profile
  create: async (vendorData: Omit<VendorProfile, 'id'>): Promise<VendorResponse> => {
    return api.post('/vendors', vendorData);
  },

  // Get all vendors
  getAll: async (): Promise<VendorListResponse> => {
    return api.get('/vendors');
  },

  // Get vendor by ID
  getById: async (id: number): Promise<{ vendor: VendorProfile }> => {
    return api.get(`/vendors/${id}`);
  },

  // Get vendor by Firebase user ID
  getByUserId: async (firebaseUserId: string): Promise<{ vendor: VendorProfile }> => {
    return api.get(`/vendors/by-user/${firebaseUserId}`);
  },

  // Update vendor profile
  update: async (id: number, vendorData: Partial<VendorProfile>): Promise<VendorResponse> => {
    return api.put(`/vendors/${id}`, vendorData);
  },

  // Delete vendor
  delete: async (id: number): Promise<{ message: string }> => {
    return api.delete(`/vendors/${id}`);
  },

  // Search vendors by location or other criteria
  search: async (params: {
    city?: string;
    state?: string;
    stallType?: string;
    rawMaterial?: string;
  }): Promise<VendorListResponse> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/vendors/search?${queryString}` : '/vendors';
    
    return api.get(endpoint);
  }
};

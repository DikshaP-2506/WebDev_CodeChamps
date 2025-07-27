import { api } from './api';

// Supplier-related types
export interface SupplierProfile {
  id?: number;
  firebaseUserId?: string;
  fullName: string;
  mobileNumber: string;
  languagePreference: string;
  businessName?: string;
  businessAddress: string;
  city: string;
  pincode: string;
  state: string;
  businessType: string;
  supplyCapabilities: string[];
  preferredDeliveryTime: string;
  latitude?: string;
  longitude?: string;
  // Additional Business Information
  gstNumber?: string;
  licenseNumber?: string;
  yearsInBusiness?: string;
  employeeCount?: string;
  // Contact Information
  primaryEmail?: string;
  whatsappBusiness?: string;
  // Certifications
  foodSafetyLicense?: string;
  organicCertification?: string;
  isoCertification?: string;
  exportLicense?: string;
}

export interface SupplierResponse {
  message: string;
  supplierId: number;
  data: SupplierProfile;
}

export interface SupplierListResponse {
  suppliers: SupplierProfile[];
  total: number;
}

export interface SupplierProduct {
  id?: number;
  supplierId: number;
  productName: string;
  category: string;
  pricePerKg: number;
  availableQuantity: number;
  unit: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductListResponse {
  products: SupplierProduct[];
  total: number;
}

// Supplier API functions
export const supplierApi = {
  // Create a new supplier profile
  create: async (supplierData: Omit<SupplierProfile, 'id'>): Promise<SupplierResponse> => {
    return api.post('/suppliers', supplierData);
  },

  // Get all suppliers
  getAll: async (): Promise<SupplierListResponse> => {
    return api.get('/suppliers');
  },

  // Get supplier by ID
  getById: async (id: number): Promise<{ supplier: SupplierProfile }> => {
    return api.get(`/suppliers/${id}`);
  },

  // Get supplier by Firebase user ID
  getByUserId: async (firebaseUserId: string): Promise<{ supplier: SupplierProfile }> => {
    return api.get(`/suppliers/by-user/${firebaseUserId}`);
  },

  // Update supplier profile
  update: async (id: number, supplierData: Partial<SupplierProfile>): Promise<SupplierResponse> => {
    return api.put(`/suppliers/${id}`, supplierData);
  },

  // Delete supplier
  delete: async (id: number): Promise<{ message: string }> => {
    return api.delete(`/suppliers/${id}`);
  },

  // Search suppliers by location or other criteria
  search: async (params: {
    city?: string;
    state?: string;
    businessType?: string;
    supplyCapability?: string;
  }): Promise<SupplierListResponse> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/suppliers/search?${queryString}` : '/suppliers';
    
    return api.get(endpoint);
  },

  // Get supplier products
  getProducts: async (supplierId: number): Promise<ProductListResponse> => {
    return api.get(`/suppliers/${supplierId}/products`);
  },

  // Add product to supplier
  addProduct: async (supplierId: number, productData: Omit<SupplierProduct, 'id' | 'supplierId'>): Promise<{ message: string; productId: number }> => {
    return api.post(`/suppliers/${supplierId}/products`, productData);
  },

  // Update product
  updateProduct: async (supplierId: number, productId: number, productData: Partial<SupplierProduct>): Promise<{ message: string }> => {
    return api.put(`/suppliers/${supplierId}/products/${productId}`, productData);
  },

  // Delete product
  deleteProduct: async (supplierId: number, productId: number): Promise<{ message: string }> => {
    return api.delete(`/suppliers/${supplierId}/products/${productId}`);
  }
};

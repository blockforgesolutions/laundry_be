import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Customer {
  id: number;
  name: string;
  phone: string;
}

export interface RingSlot {
  id: number;
  time_range: string;
}

export interface LaundryItem {
  id: number;
  customer_id: number;
  status: string;
  shelf_code?: string;
}

export interface LaundryWithCustomer {
  id: number;
  status: string;
  shelf_code?: string;
  name: string;
  phone: string;
}

// Customer API
export const customerAPI = {
  getAll: () => api.get<Customer[]>('/customers'),
  getByPhone: (phone: string) => api.get<Customer>(`/customers/${phone}`),
  create: (customer: Omit<Customer, 'id'>) => api.post<Customer>('/customers', customer),
};

// Ring Slots API
export const ringSlotAPI = {
  getAll: () => api.get<RingSlot[]>('/ring-slots'),
  create: (timeRange: string) => api.post<RingSlot>('/ring-slots', { time_range: timeRange }),
  createAppointment: (customerId: number, ringSlotId: number) => 
    api.post('/ring-appointments', { customer_id: customerId, ring_slot_id: ringSlotId }),
};

// Laundry API
export const laundryAPI = {
  getAll: (status?: string) => api.get<LaundryItem[]>('/laundry', { params: { status } }),
  getAllWithCustomer: () => api.get<LaundryWithCustomer[]>('/laundry/with-customer'),
  create: (laundryItem: Omit<LaundryItem, 'id'>) => api.post<LaundryItem>('/laundry', laundryItem),
  update: (id: number, status: string, shelfCode?: string) => 
    api.put(`/laundry/${id}`, { status, shelf_code: shelfCode }),
}; 
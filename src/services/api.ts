import axios from 'axios';

const API_BASE = 'https://68935be7c49d24bce86a8259.mockapi.io';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CreateTicketData {
  customerId: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
}

// Customer API
export const customerAPI = {
  getAll: () => axios.get<Customer[]>(`${API_BASE}/Customers`),
  getById: (id: string) => axios.get<Customer>(`${API_BASE}/Customers/${id}`),
  create: (data: CreateCustomerData) => axios.post<Customer>(`${API_BASE}/Customers`, data),
  update: (id: string, data: Partial<Customer>) => axios.put<Customer>(`${API_BASE}/Customers/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE}/Customers/${id}`),
};

// Ticket API
export const ticketAPI = {
  getAll: () => axios.get<Ticket[]>(`${API_BASE}/Tickets`),
  getById: (id: string) => axios.get<Ticket>(`${API_BASE}/Tickets/${id}`),
  getByCustomerId: (customerId: string) => 
    axios.get<Ticket[]>(`${API_BASE}/Tickets?customerId=${customerId}`),
  create: (data: CreateTicketData) => axios.post<Ticket>(`${API_BASE}/Tickets`, data),
  update: (id: string, data: Partial<Ticket>) => axios.put<Ticket>(`${API_BASE}/Tickets/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE}/Tickets/${id}`),
};
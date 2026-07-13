export type UnitOfMeasurement = string;

export type PaymentMethod = string;

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  rcNumber: string;
  motto: string;
  logo: string; // Base64 or URL
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'Admin' | 'Accountant' | 'Cashier';
  active: boolean;
}

export interface Role {
  name: 'Admin' | 'Accountant' | 'Cashier';
  permissions: string[];
}

export interface Product {
  id: string;
  name: string;
  unit: UnitOfMeasurement;
  price: number;
  quantity: number;
  category: string;
  sku: string;
  supplierId?: string;
  expiryDate?: string;
  binLocation?: string;
}

export interface TransactionItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  date: string;
  customerName: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: PaymentMethod;
  cashierName: string;
  costCenter: string;
  branch: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  companyName: string;
}

export interface SupplierTransaction {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  amount: number;
  type: 'purchase' | 'payment';
  description: string;
  invoiceNumber?: string;
}

export interface ProcurementItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  costPrice: number;
  subtotal: number;
}

export interface ProcurementOrder {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: ProcurementItem[];
  totalAmount: number;
  amountPaid: number;
  status: 'Paid' | 'Unpaid' | 'Partially Paid';
  branch?: string;
}

export interface CostCenter {
  id: string;
  name: string;
  code: string;
  branch: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Subscription {
  id: string;
  planName: string;
  status: 'Active' | 'Expired' | 'Pending';
  amount: number;
  expiryDate: string;
}

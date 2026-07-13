import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  CompanySettings, User, Role, Product, Transaction, 
  Supplier, SupplierTransaction, CostCenter, Category, 
  Subscription, ProcurementOrder 
} from '../types';

const API_BASE = '/api';

interface AppContextType {
  // Loading state
  loading: boolean;
  
  // Data
  settings: CompanySettings;
  currentUser: User | null;
  users: User[];
  roles: Role[];
  products: Product[];
  categories: Category[];
  transactions: Transaction[];
  suppliers: Supplier[];
  supplierTransactions: SupplierTransaction[];
  costCenters: CostCenter[];
  subscriptions: Subscription[];
  units: string[];
  paymentMethods: string[];
  branches: string[];
  procurementOrders: ProcurementOrder[];
  
  // Actions
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: CompanySettings) => Promise<void>;
  login: (username: string, role: 'Admin' | 'Accountant' | 'Cashier') => boolean;
  logout: () => void;
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<Transaction>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (supplier: Supplier) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addSupplierTransaction: (transaction: Omit<SupplierTransaction, 'id' | 'date'>) => Promise<void>;
  deleteSupplierTransaction: (id: string) => Promise<void>;
  addCostCenter: (cc: Omit<CostCenter, 'id'>) => Promise<void>;
  updateCostCenter: (cc: CostCenter) => Promise<void>;
  deleteCostCenter: (id: string) => Promise<void>;
  updateSubscription: (sub: Subscription) => Promise<void>;
  addUnit: (u: string) => Promise<void>;
  deleteUnit: (u: string) => Promise<void>;
  addPaymentMethod: (pm: string) => Promise<void>;
  deletePaymentMethod: (pm: string) => Promise<void>;
  addBranch: (b: string) => Promise<void>;
  deleteBranch: (b: string) => Promise<void>;
  addProcurementOrder: (order: ProcurementOrder) => Promise<void>;
  updateProcurementOrder: (order: ProcurementOrder) => Promise<void>;
}

// Initial default roles
const DEFAULT_ROLES: Role[] = [
  {
    name: 'Admin',
    permissions: ['dashboard', 'categories', 'products', 'reports', 'sales', 'procurement', 'accounting', 'settings', 'users', 'subscriptions', 'costcenters']
  },
  {
    name: 'Accountant',
    permissions: ['dashboard', 'products', 'reports', 'sales', 'procurement', 'accounting']
  },
  {
    name: 'Cashier',
    permissions: ['dashboard', 'reports', 'sales']
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  // State
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'ELECTRICAL HALL NIG LTD',
    address: 'Plot 14, Alaba International Market, Ojo, Lagos, Nigeria',
    phone: '+234 803 123 4567',
    email: 'info@electricalhall.com.ng',
    rcNumber: 'RC-1294812',
    motto: 'Powering Quality & Reliability',
    logo: '/logo.png'
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const data = sessionStorage.getItem('eh_currentuser');
    return data ? JSON.parse(data) : null;
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierTransactions, setSupplierTransactions] = useState<SupplierTransaction[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [procurementOrders, setProcurementOrders] = useState<ProcurementOrder[]>([]);

  // Helper to fetch all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        settingsRes,
        usersRes,
        categoriesRes,
        productsRes,
        suppliersRes,
        costCentersRes,
        subscriptionsRes,
        transactionsRes,
        supplierTransactionsRes,
        procurementOrdersRes,
        unitsRes,
        paymentMethodsRes,
        branchesRes
      ] = await Promise.all([
        fetch(`${API_BASE}/settings`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/categories`),
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/suppliers`),
        fetch(`${API_BASE}/cost-centers`),
        fetch(`${API_BASE}/subscriptions`),
        fetch(`${API_BASE}/transactions`),
        fetch(`${API_BASE}/supplier-transactions`),
        fetch(`${API_BASE}/procurement-orders`),
        fetch(`${API_BASE}/units`),
        fetch(`${API_BASE}/payment-methods`),
        fetch(`${API_BASE}/branches`)
      ]);

      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (suppliersRes.ok) setSuppliers(await suppliersRes.json());
      if (costCentersRes.ok) setCostCenters(await costCentersRes.json());
      if (subscriptionsRes.ok) setSubscriptions(await subscriptionsRes.json());
      if (transactionsRes.ok) setTransactions(await transactionsRes.json());
      if (supplierTransactionsRes.ok) setSupplierTransactions(await supplierTransactionsRes.json());
      if (procurementOrdersRes.ok) setProcurementOrders(await procurementOrdersRes.json());
      if (unitsRes.ok) setUnits(await unitsRes.json());
      if (paymentMethodsRes.ok) setPaymentMethods(await paymentMethodsRes.json());
      if (branchesRes.ok) setBranches(await branchesRes.json());
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auth
  const login = (username: string, role: 'Admin' | 'Accountant' | 'Cashier') => {
    const matched = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.role === role && u.active);
    if (matched) {
      setCurrentUser(matched);
      sessionStorage.setItem('eh_currentuser', JSON.stringify(matched));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('eh_currentuser');
  };

  // Settings
  const updateSettings = async (newSettings: CompanySettings) => {
    await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    setSettings(newSettings);
  };

  // Users
  const addUser = async (user: User) => {
    await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    await refreshData();
  };

  const updateUser = async (user: User) => {
    await fetch(`${API_BASE}/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (currentUser && currentUser.id === user.id) {
      setCurrentUser(user);
      sessionStorage.setItem('eh_currentuser', JSON.stringify(user));
    }
    await refreshData();
  };

  const deleteUser = async (id: string) => {
    await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  // Products
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const id = 'prod-' + (products.length + 1) + '-' + Math.floor(Math.random() * 1000);
    await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, id })
    });
    await refreshData();
  };

  const updateProduct = async (product: Product) => {
    await fetch(`${API_BASE}/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    await refreshData();
  };

  const deleteProduct = async (id: string) => {
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  // Categories
  const addCategory = async (category: Omit<Category, 'id'>) => {
    const id = 'cat-' + (categories.length + 1) + '-' + Math.floor(Math.random() * 100);
    await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...category, id })
    });
    await refreshData();
  };

  const updateCategory = async (category: Category) => {
    await fetch(`${API_BASE}/categories`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    await refreshData();
  };

  const deleteCategory = async (id: string) => {
    await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  // Transactions
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> => {
    const id = 'TXN-' + (1000 + transactions.length + 1) + '-' + Math.floor(Math.random() * 90 + 10);
    const date = new Date().toISOString();
    const newTransaction = { ...transaction, id, date };
    
    await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction)
    });
    
    // Update product quantities
    const updatedProducts = products.map(prod => {
      const itemSold = transaction.items.find(item => item.productId === prod.id);
      if (itemSold) {
        return {
          ...prod,
          quantity: Math.max(0, prod.quantity - itemSold.quantity)
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    
    await refreshData();
    return newTransaction;
  };

  // Suppliers
  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    const id = 'sup-' + (suppliers.length + 1);
    await fetch(`${API_BASE}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...supplier, id })
    });
    await refreshData();
  };

  const updateSupplier = async (supplier: Supplier) => {
    await fetch(`${API_BASE}/suppliers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier)
    });
    await refreshData();
  };

  const deleteSupplier = async (id: string) => {
    await fetch(`${API_BASE}/suppliers/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  // Supplier Transactions
  const addSupplierTransaction = async (transaction: Omit<SupplierTransaction, 'id' | 'date'>) => {
    const id = 'stx-' + (supplierTransactions.length + 1) + '-' + Math.floor(Math.random() * 100);
    const date = new Date().toISOString();
    await fetch(`${API_BASE}/supplier-transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...transaction, id, date })
    });
    await refreshData();
  };

  const deleteSupplierTransaction = async (id: string) => {
    await fetch(`${API_BASE}/supplier-transactions/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  // Cost Centers
  const addCostCenter = async (cc: Omit<CostCenter, 'id'>) => {
    const id = 'cc-' + (costCenters.length + 1);
    await fetch(`${API_BASE}/cost-centers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cc, id })
    });
    await refreshData();
  };

  const updateCostCenter = async (cc: CostCenter) => {
    await fetch(`${API_BASE}/cost-centers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cc)
    });
    await refreshData();
  };

  const deleteCostCenter = async (id: string) => {
    await fetch(`${API_BASE}/cost-centers/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  // Subscriptions
  const updateSubscription = async (sub: Subscription) => {
    await fetch(`${API_BASE}/subscriptions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub)
    });
    await refreshData();
  };

  // Units
  const addUnit = async (u: string) => {
    if (!units.includes(u)) {
      await fetch(`${API_BASE}/units`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: u })
      });
      await refreshData();
    }
  };

  const deleteUnit = async (u: string) => {
    await fetch(`${API_BASE}/units/${encodeURIComponent(u)}`, { method: 'DELETE' });
    await refreshData();
  };

  // Payment Methods
  const addPaymentMethod = async (pm: string) => {
    if (!paymentMethods.includes(pm)) {
      await fetch(`${API_BASE}/payment-methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: pm })
      });
      await refreshData();
    }
  };

  const deletePaymentMethod = async (pm: string) => {
    await fetch(`${API_BASE}/payment-methods/${encodeURIComponent(pm)}`, { method: 'DELETE' });
    await refreshData();
  };

  // Branches
  const addBranch = async (b: string) => {
    if (!branches.includes(b)) {
      await fetch(`${API_BASE}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: b })
      });
      await refreshData();
    }
  };

  const deleteBranch = async (b: string) => {
    await fetch(`${API_BASE}/branches/${encodeURIComponent(b)}`, { method: 'DELETE' });
    await refreshData();
  };

  // Procurement Orders
  const addProcurementOrder = async (order: ProcurementOrder) => {
    await fetch(`${API_BASE}/procurement-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    
    // Update product quantities
    const updatedProducts = products.map(prod => {
      const itemPurchased = order.items.find(item => item.productId === prod.id);
      if (itemPurchased) {
        return {
          ...prod,
          quantity: prod.quantity + itemPurchased.quantity
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    
    // Add supplier transactions
    const purchaseTx: SupplierTransaction = {
      id: 'stx-bill-' + (supplierTransactions.length + 1) + '-' + Math.floor(Math.random() * 100),
      supplierId: order.supplierId,
      supplierName: order.supplierName,
      date: order.date,
      amount: order.totalAmount,
      type: 'purchase',
      description: `Inbound Bill [${order.invoiceNumber}] - ${order.items.length} items restocked`,
      invoiceNumber: order.invoiceNumber
    };
    await addSupplierTransaction(purchaseTx);
    
    if (order.amountPaid > 0) {
      const paymentTx: SupplierTransaction = {
        id: 'stx-pay-' + (supplierTransactions.length + 2) + '-' + Math.floor(Math.random() * 100),
        supplierId: order.supplierId,
        supplierName: order.supplierName,
        date: order.date,
        amount: order.amountPaid,
        type: 'payment',
        description: `Cash outflow down-payment on Bill [${order.invoiceNumber}]`,
        invoiceNumber: order.invoiceNumber
      };
      await addSupplierTransaction(paymentTx);
    }
    
    await refreshData();
  };

  const updateProcurementOrder = async (order: ProcurementOrder) => {
    await fetch(`${API_BASE}/procurement-orders`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    await refreshData();
  };

  return (
    <AppContext.Provider value={{
      loading,
      settings,
      currentUser,
      users,
      roles: DEFAULT_ROLES,
      products,
      categories,
      transactions,
      suppliers,
      supplierTransactions,
      costCenters,
      subscriptions,
      units,
      paymentMethods,
      branches,
      procurementOrders,
      refreshData,
      updateSettings,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addTransaction,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addSupplierTransaction,
      deleteSupplierTransaction,
      addCostCenter,
      updateCostCenter,
      deleteCostCenter,
      updateSubscription,
      addUnit,
      deleteUnit,
      addPaymentMethod,
      deletePaymentMethod,
      addBranch,
      deleteBranch,
      addProcurementOrder,
      updateProcurementOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

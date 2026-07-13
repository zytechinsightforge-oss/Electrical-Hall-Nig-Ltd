import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CompanySettings, User, Role, Product, Transaction, 
  Supplier, SupplierTransaction, CostCenter, Category, Subscription, PaymentMethod, UnitOfMeasurement,
  ProcurementOrder
} from '../types';

interface AppContextType {
  settings: CompanySettings;
  updateSettings: (newSettings: CompanySettings) => void;
  currentUser: User | null;
  login: (username: string, role: 'Admin' | 'Accountant' | 'Cashier') => boolean;
  logout: () => void;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  roles: Role[];
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Transaction;
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  supplierTransactions: SupplierTransaction[];
  addSupplierTransaction: (tx: Omit<SupplierTransaction, 'id' | 'date'>) => void;
  deleteSupplierTransaction: (id: string) => void;
  costCenters: CostCenter[];
  addCostCenter: (cc: Omit<CostCenter, 'id'>) => void;
  updateCostCenter: (cc: CostCenter) => void;
  deleteCostCenter: (id: string) => void;
  subscriptions: Subscription[];
  updateSubscription: (sub: Subscription) => void;
  units: string[];
  addUnit: (u: string) => void;
  deleteUnit: (u: string) => void;
  paymentMethods: string[];
  addPaymentMethod: (pm: string) => void;
  deletePaymentMethod: (pm: string) => void;
  branches: string[];
  addBranch: (b: string) => void;
  deleteBranch: (b: string) => void;
  procurementOrders: ProcurementOrder[];
  addProcurementOrder: (order: ProcurementOrder) => void;
  updateProcurementOrder: (order: ProcurementOrder) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial default roles
const DEFAULT_ROLES: Role[] = [
  {
    name: 'Admin',
    permissions: ['dashboard', 'categories', 'products', 'reports', 'sales', 'procurement', 'accounting', 'settings', 'users', 'subscriptions', 'costcentres']
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

// Seed data helper
const seedDefaultData = () => {
    const settings: CompanySettings = {
      name: "ELECTRICAL HALL NIG LTD",
      address: "Plot 14, Alaba International Market, Ojo, Lagos, Nigeria",
      phone: "+234 803 123 4567",
      email: "info@electricalhall.com.ng",
      rcNumber: "RC-1294812",
      motto: "Powering Quality & Reliability",
      logo: "/logo.png"
    };

  const users: User[] = [
    { id: 'usr-1', username: 'admin', name: 'Chief Administrator', role: 'Admin', active: true },
    { id: 'usr-2', username: 'accountant', name: 'Senior Accountant', role: 'Accountant', active: true },
    { id: 'usr-3', username: 'cashier', name: 'Front Desk Cashier', role: 'Cashier', active: true }
  ];

  const categories: Category[] = [
    { id: 'cat-1', name: 'Cables & Wires', description: 'Power and electrical copper cables' },
    { id: 'cat-2', name: 'Lighting & Bulbs', description: 'LED lights, fluorescent, and fixtures' },
    { id: 'cat-3', name: 'Sockets & Switches', description: 'Wall plates, sockets, extension boxes' },
    { id: 'cat-4', name: 'Switchgears', description: 'Distribution boards, breakers, and changeovers' },
    { id: 'cat-5', name: 'Appliances', description: 'Fans, heaters, and extractors' }
  ];

  const products: Product[] = [
    { id: 'prod-1', name: '16mm Single Core Copper Cable', unit: 'Roll', price: 45000, quantity: 42, category: 'Cables & Wires', sku: 'CAB-16', supplierId: 'sup-1', binLocation: 'Shelf A3' },
    { id: 'prod-2', name: '2.5mm Twin & Earth Cable (100m)', unit: 'Roll', price: 35000, quantity: 88, category: 'Cables & Wires', sku: 'CAB-2.5', supplierId: 'sup-1', binLocation: 'Shelf A5' },
    { id: 'prod-3', name: '1.5mm Single Core Copper Cable', unit: 'Roll', price: 18000, quantity: 125, category: 'Cables & Wires', sku: 'CAB-1.5', supplierId: 'sup-1', binLocation: 'Shelf A6' },
    { id: 'prod-4', name: 'LED Panel Light 18W Cool White', unit: 'Piece', price: 2500, quantity: 412, category: 'Lighting & Bulbs', sku: 'BLB-18W', supplierId: 'sup-2', binLocation: 'Box B12' },
    { id: 'prod-5', name: 'LED Bulb 9W Warm White', unit: 'Piece', price: 1200, quantity: 320, category: 'Lighting & Bulbs', sku: 'BLB-9W', supplierId: 'sup-2', binLocation: 'Box B15' },
    { id: 'prod-6', name: 'Dual USB Wall Socket plate', unit: 'Piece', price: 8500, quantity: 140, category: 'Sockets & Switches', sku: 'SCK-DUAL', supplierId: 'sup-2', binLocation: 'Drawer C4' },
    { id: 'prod-7', name: '13A Single Wall Socket plate', unit: 'Piece', price: 1800, quantity: 210, category: 'Sockets & Switches', sku: 'SCK-13AS', supplierId: 'sup-2', binLocation: 'Drawer C5' },
    { id: 'prod-8', name: '12-Way Distribution Board Flush', unit: 'Box', price: 62000, quantity: 15, category: 'Switchgears', sku: 'DB-12W', supplierId: 'sup-1', binLocation: 'Rack D2' },
    { id: 'prod-9', name: '100A Changeover Switch Manual', unit: 'Piece', price: 29500, quantity: 18, category: 'Switchgears', sku: 'CO-100A', supplierId: 'sup-1', binLocation: 'Rack D4' },
    { id: 'prod-10', name: 'Industrial Exhaust Fan 12-inch', unit: 'Piece', price: 48000, quantity: 24, category: 'Appliances', sku: 'FAN-IND', supplierId: 'sup-2', binLocation: 'Pallet E1' }
  ];

  const suppliers: Supplier[] = [
    { id: 'sup-1', name: 'Coleman Wires and Cables Ltd', phone: '+234 800 265 3626', email: 'sales@coleman.com.ng', address: 'Arepo, Ogun State', companyName: 'Coleman Cables' },
    { id: 'sup-2', name: 'Havells Electricals Nigeria', phone: '+234 1 234 5678', email: 'lagos@havells.com', address: 'Victoria Island, Lagos', companyName: 'Havells NG' }
  ];

  const costCenters: CostCenter[] = [
    { id: 'cc-1', name: 'Alaba Main Branch', code: 'CC-ALB-01', branch: 'Alaba' },
    { id: 'cc-2', name: 'Ikeja Showroom', code: 'CC-IKJ-02', branch: 'Ikeja' },
    { id: 'cc-3', name: 'Port Harcourt Depot', code: 'CC-PHC-03', branch: 'Port Harcourt' }
  ];

  const subscriptions: Subscription[] = [
    { id: 'sub-1', planName: 'Enterprise Unlimited', status: 'Active', amount: 150000, expiryDate: '2026-12-31' }
  ];

  const supplierTransactions: SupplierTransaction[] = [
    { id: 'stx-1', supplierId: 'sup-1', supplierName: 'Coleman Wires and Cables Ltd', date: '2026-07-01T10:30:00Z', amount: 1250000, type: 'purchase', description: 'Restocking 16mm, 2.5mm copper rolls' },
    { id: 'stx-2', supplierId: 'sup-1', supplierName: 'Coleman Wires and Cables Ltd', date: '2026-07-02T14:15:00Z', amount: 800000, type: 'payment', description: 'Installment payment for invoices' },
    { id: 'stx-3', supplierId: 'sup-2', supplierName: 'Havells Electricals Nigeria', date: '2026-07-04T11:00:00Z', amount: 450000, type: 'purchase', description: 'LED Light and switches inventory supply' }
  ];

  // Helper to generate a date relative to now
  const getPastDateStr = (daysAgo: number, hour = 12) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  const transactions: Transaction[] = [
    {
      id: 'TXN-1001',
      date: getPastDateStr(6, 10),
      customerName: 'Emeka Obi',
      items: [
        { productId: 'prod-1', name: '16mm Single Core Copper Cable', price: 45000, quantity: 2, subtotal: 90000 },
        { productId: 'prod-4', name: 'LED Panel Light 18W Cool White', price: 2500, quantity: 10, subtotal: 25000 }
      ],
      total: 115000,
      paymentMethod: 'Transfer',
      cashierName: 'Front Desk Cashier',
      costCenter: 'Alaba Main Branch',
      branch: 'Alaba'
    },
    {
      id: 'TXN-1002',
      date: getPastDateStr(5, 11),
      customerName: 'Alhaji Musa Kabir',
      items: [
        { productId: 'prod-2', name: '2.5mm Twin & Earth Cable (100m)', price: 35000, quantity: 5, subtotal: 175000 },
        { productId: 'prod-8', name: '12-Way Distribution Board Flush', price: 62000, quantity: 1, subtotal: 62000 }
      ],
      total: 237000,
      paymentMethod: 'Cash',
      cashierName: 'Front Desk Cashier',
      costCenter: 'Alaba Main Branch',
      branch: 'Alaba'
    },
    {
      id: 'TXN-1003',
      date: getPastDateStr(4, 14),
      customerName: 'Grace Electricals',
      items: [
        { productId: 'prod-3', name: '1.5mm Single Core Copper Cable', price: 18000, quantity: 10, subtotal: 180000 },
        { productId: 'prod-6', name: 'Dual USB Wall Socket plate', price: 8500, quantity: 15, subtotal: 127500 },
        { productId: 'prod-5', name: 'LED Bulb 9W Warm White', price: 1200, quantity: 50, subtotal: 60000 }
      ],
      total: 367500,
      paymentMethod: 'Transfer',
      cashierName: 'Front Desk Cashier',
      costCenter: 'Ikeja Showroom',
      branch: 'Ikeja'
    },
    {
      id: 'TXN-1004',
      date: getPastDateStr(3, 16),
      customerName: 'Nnamdi Okonkwo',
      items: [
        { productId: 'prod-9', name: '100A Changeover Switch Manual', price: 29500, quantity: 2, subtotal: 59000 },
        { productId: 'prod-10', name: 'Industrial Exhaust Fan 12-inch', price: 48000, quantity: 3, subtotal: 144000 }
      ],
      total: 203000,
      paymentMethod: 'Card',
      cashierName: 'Front Desk Cashier',
      costCenter: 'Alaba Main Branch',
      branch: 'Alaba'
    },
    {
      id: 'TXN-1005',
      date: getPastDateStr(2, 9),
      customerName: 'Kolawole Adewale',
      items: [
        { productId: 'prod-2', name: '2.5mm Twin & Earth Cable (100m)', price: 35000, quantity: 8, subtotal: 280000 }
      ],
      total: 280000,
      paymentMethod: 'Transfer',
      cashierName: 'Front Desk Cashier',
      costCenter: 'Ikeja Showroom',
      branch: 'Ikeja'
    },
    {
      id: 'TXN-1006',
      date: getPastDateStr(1, 15),
      customerName: 'Ezenwa & Sons Ltd',
      items: [
        { productId: 'prod-1', name: '16mm Single Core Copper Cable', price: 45000, quantity: 4, subtotal: 180000 },
        { productId: 'prod-8', name: '12-Way Distribution Board Flush', price: 62000, quantity: 3, subtotal: 186000 },
        { productId: 'prod-10', name: 'Industrial Exhaust Fan 12-inch', price: 48000, quantity: 2, subtotal: 96000 }
      ],
      total: 462000,
      paymentMethod: 'Card',
      cashierName: 'Chief Administrator',
      costCenter: 'Port Harcourt Depot',
      branch: 'Port Harcourt'
    },
    {
      id: 'TXN-1007',
      date: new Date().toISOString(), // Today
      customerName: 'Walking Customer',
      items: [
        { productId: 'prod-4', name: 'LED Panel Light 18W Cool White', price: 2500, quantity: 6, subtotal: 15000 },
        { productId: 'prod-7', name: '13A Single Wall Socket plate', price: 1800, quantity: 12, subtotal: 21600 }
      ],
      total: 36600,
      paymentMethod: 'Cash',
      cashierName: 'Front Desk Cashier',
      costCenter: 'Alaba Main Branch',
      branch: 'Alaba'
    }
  ];

  return {
    settings,
    users,
    categories,
    products,
    suppliers,
    costCenters,
    subscriptions,
    supplierTransactions,
    transactions
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize DB state
  const [settings, setSettings] = useState<CompanySettings>(() => {
    const data = localStorage.getItem('eh_settings');
    const defaultSettings = seedDefaultData().settings;
    if (data) {
      const parsed = JSON.parse(data);
      // Always use the new default logo path
      return { ...parsed, logo: defaultSettings.logo };
    }
    return defaultSettings;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const data = localStorage.getItem('eh_users');
    return data ? JSON.parse(data) : seedDefaultData().users;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const data = localStorage.getItem('eh_categories');
    return data ? JSON.parse(data) : seedDefaultData().categories;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const data = localStorage.getItem('eh_products');
    return data ? JSON.parse(data) : seedDefaultData().products;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const data = localStorage.getItem('eh_suppliers');
    return data ? JSON.parse(data) : seedDefaultData().suppliers;
  });

  const [costCenters, setCostCenters] = useState<CostCenter[]>(() => {
    const data = localStorage.getItem('eh_costcenters');
    return data ? JSON.parse(data) : seedDefaultData().costCenters;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const data = localStorage.getItem('eh_subscriptions');
    return data ? JSON.parse(data) : seedDefaultData().subscriptions;
  });

  const [supplierTransactions, setSupplierTransactions] = useState<SupplierTransaction[]>(() => {
    const data = localStorage.getItem('eh_suppliertransactions');
    return data ? JSON.parse(data) : seedDefaultData().supplierTransactions;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const data = localStorage.getItem('eh_transactions');
    return data ? JSON.parse(data) : seedDefaultData().transactions;
  });

  const [units, setUnits] = useState<string[]>(() => {
    const data = localStorage.getItem('eh_units');
    return data ? JSON.parse(data) : ['Piece', 'Roll', 'Meter', 'Box', 'Pack', 'Dozen', 'Kg', 'Liter'];
  });

  const [paymentMethods, setPaymentMethods] = useState<string[]>(() => {
    const data = localStorage.getItem('eh_payment_methods');
    return data ? JSON.parse(data) : ['Cash', 'Transfer', 'Card'];
  });

  const [branches, setBranches] = useState<string[]>(() => {
    const data = localStorage.getItem('eh_branches');
    return data ? JSON.parse(data) : ['Alaba', 'Ikeja', 'Port Harcourt'];
  });

  const [procurementOrders, setProcurementOrders] = useState<ProcurementOrder[]>(() => {
    const data = localStorage.getItem('eh_procurement_orders');
    return data ? JSON.parse(data) : [
      {
        id: 'PRC-1001',
        invoiceNumber: 'INV-COL-9902',
        supplierId: 'sup-1',
        supplierName: 'Coleman Wires and Cables Ltd',
        date: '2026-07-01T10:30:00Z',
        items: [
          { productId: 'prod-1', name: '16mm Single Core Copper Cable', sku: 'CAB-16', quantity: 20, unit: 'Roll', costPrice: 38000, subtotal: 760000 },
          { productId: 'prod-2', name: '2.5mm Twin & Earth Cable (100m)', sku: 'CAB-2.5', quantity: 14, unit: 'Roll', costPrice: 35000, subtotal: 490000 }
        ],
        totalAmount: 1250000,
        amountPaid: 800000,
        status: 'Partially Paid'
      },
      {
        id: 'PRC-1002',
        invoiceNumber: 'INV-HAV-4411',
        supplierId: 'sup-2',
        supplierName: 'Havells Electricals Nigeria',
        date: '2026-07-04T11:00:00Z',
        items: [
          { productId: 'prod-4', name: 'LED Panel Light 18W Cool White', sku: 'BLB-18W', quantity: 100, unit: 'Piece', costPrice: 2000, subtotal: 200000 },
          { productId: 'prod-5', name: 'LED Bulb 9W Warm White', sku: 'BLB-9W', quantity: 200, unit: 'Piece', costPrice: 1000, subtotal: 200000 },
          { productId: 'prod-6', name: 'Dual USB Wall Socket plate', sku: 'SCK-DUAL', quantity: 10, unit: 'Piece', costPrice: 5000, subtotal: 50000 }
        ],
        totalAmount: 450000,
        amountPaid: 450000,
        status: 'Paid'
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const data = sessionStorage.getItem('eh_currentuser');
    return data ? JSON.parse(data) : null;
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('eh_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('eh_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('eh_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('eh_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('eh_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('eh_costcenters', JSON.stringify(costCenters));
  }, [costCenters]);

  useEffect(() => {
    localStorage.setItem('eh_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('eh_suppliertransactions', JSON.stringify(supplierTransactions));
  }, [supplierTransactions]);

  useEffect(() => {
    localStorage.setItem('eh_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('eh_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('eh_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('eh_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('eh_procurement_orders', JSON.stringify(procurementOrders));
  }, [procurementOrders]);

  // Auth Operations
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

  // Company Settings
  const updateSettings = (newSettings: CompanySettings) => {
    setSettings(newSettings);
  };

  // Users CRUD
  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    if (currentUser && currentUser.id === user.id) {
      setCurrentUser(user);
      sessionStorage.setItem('eh_currentuser', JSON.stringify(user));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Products CRUD
  const addProduct = (p: Omit<Product, 'id'>) => {
    const id = 'prod-' + (products.length + 1) + '-' + Math.floor(Math.random() * 1000);
    const newProd = { ...p, id } as Product;
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Categories
  const addCategory = (c: Omit<Category, 'id'>) => {
    const id = 'cat-' + (categories.length + 1) + '-' + Math.floor(Math.random() * 100);
    setCategories(prev => [...prev, { ...c, id }]);
  };

  const updateCategory = (cat: Category) => {
    setCategories(prev => prev.map(c => c.id === cat.id ? cat : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Transactions (POS Checkout)
  const addTransaction = (t: Omit<Transaction, 'id' | 'date'>) => {
    const id = 'TXN-' + (1000 + transactions.length + 1) + '-' + Math.floor(Math.random() * 90 + 10);
    const date = new Date().toISOString();
    const newTx: Transaction = {
      ...t,
      id,
      date
    };
    
    // Deduct stock of sold items
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const itemSold = t.items.find(item => item.productId === prod.id);
        if (itemSold) {
          return {
            ...prod,
            quantity: Math.max(0, prod.quantity - itemSold.quantity)
          };
        }
        return prod;
      });
    });

    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  // Suppliers CRUD
  const addSupplier = (s: Omit<Supplier, 'id'>) => {
    const id = 'sup-' + (suppliers.length + 1);
    setSuppliers(prev => [...prev, { ...s, id }]);
  };

  const updateSupplier = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // Supplier Transactions
  const addSupplierTransaction = (stx: Omit<SupplierTransaction, 'id' | 'date'>) => {
    const id = 'stx-' + (supplierTransactions.length + 1) + '-' + Math.floor(Math.random() * 100);
    const date = new Date().toISOString();
    const newStx: SupplierTransaction = {
      ...stx,
      id,
      date
    };
    
    setSupplierTransactions(prev => [newStx, ...prev]);
  };

  const deleteSupplierTransaction = (id: string) => {
    setSupplierTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // Cost Centers
  const addCostCenter = (cc: Omit<CostCenter, 'id'>) => {
    const id = 'cc-' + (costCenters.length + 1);
    setCostCenters(prev => [...prev, { ...cc, id }]);
  };

  const updateCostCenter = (cc: CostCenter) => {
    setCostCenters(prev => prev.map(item => item.id === cc.id ? cc : item));
  };

  const deleteCostCenter = (id: string) => {
    setCostCenters(prev => prev.filter(cc => cc.id !== id));
  };

  // Subscriptions
  const updateSubscription = (sub: Subscription) => {
    setSubscriptions(prev => prev.map(s => s.id === sub.id ? sub : s));
  };

  // Dynamic Settings Filter Management
  const addUnit = (u: string) => {
    if (!units.includes(u)) setUnits(prev => [...prev, u]);
  };

  const deleteUnit = (u: string) => {
    setUnits(prev => prev.filter(item => item !== u));
  };

  const addPaymentMethod = (pm: string) => {
    if (!paymentMethods.includes(pm)) setPaymentMethods(prev => [...prev, pm]);
  };

  const deletePaymentMethod = (pm: string) => {
    setPaymentMethods(prev => prev.filter(item => item !== pm));
  };

  const addBranch = (b: string) => {
    if (!branches.includes(b)) setBranches(prev => [...prev, b]);
  };

  const deleteBranch = (b: string) => {
    setBranches(prev => prev.filter(item => item !== b));
  };

  // Multi-item Procurement orders
  const addProcurementOrder = (order: ProcurementOrder) => {
    setProcurementOrders(prev => [order, ...prev]);

    // 1. Update product quantities (Restock)
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const itemPurchased = order.items.find(item => item.productId === prod.id);
        if (itemPurchased) {
          return {
            ...prod,
            quantity: prod.quantity + itemPurchased.quantity
          };
        }
        return prod;
      });
    });

    // 2. Add Supplier Transaction log for the purchase total (Account Payable liability)
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
    
    // 3. If there was an amount paid, log an outgoing payment transaction (asset reduction)
    let paymentTx: SupplierTransaction | null = null;
    if (order.amountPaid > 0) {
      paymentTx = {
        id: 'stx-pay-' + (supplierTransactions.length + 2) + '-' + Math.floor(Math.random() * 100),
        supplierId: order.supplierId,
        supplierName: order.supplierName,
        date: order.date,
        amount: order.amountPaid,
        type: 'payment',
        description: `Cash outflow down-payment on Bill [${order.invoiceNumber}]`,
        invoiceNumber: order.invoiceNumber
      };
    }

    setSupplierTransactions(prev => {
      const newList = [...prev];
      newList.unshift(purchaseTx);
      if (paymentTx) newList.unshift(paymentTx);
      return newList;
    });
  };

  const updateProcurementOrder = (order: ProcurementOrder) => {
    setProcurementOrders(prev => prev.map(o => o.id === order.id ? order : o));
  };

  const refreshData = () => {
    // Reload seed data as reset action
    localStorage.clear();
    const seed = seedDefaultData();
    setSettings(seed.settings);
    setUsers(seed.users);
    setCategories(seed.categories);
    setProducts(seed.products);
    setSuppliers(seed.suppliers);
    setCostCenters(seed.costCenters);
    setSubscriptions(seed.subscriptions);
    setSupplierTransactions(seed.supplierTransactions);
    setTransactions(seed.transactions);
    setUnits(['Piece', 'Roll', 'Meter', 'Box', 'Pack', 'Dozen', 'Kg', 'Liter']);
    setPaymentMethods(['Cash', 'Transfer', 'Card']);
    setBranches(['Alaba', 'Ikeja', 'Port Harcourt']);
    setProcurementOrders([]);
  };

  return (
    <AppContext.Provider value={{
      settings,
      updateSettings,
      currentUser,
      login,
      logout,
      users,
      addUser,
      updateUser,
      deleteUser,
      roles: DEFAULT_ROLES,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      transactions,
      addTransaction,
      suppliers,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      supplierTransactions,
      addSupplierTransaction,
      deleteSupplierTransaction,
      costCenters,
      addCostCenter,
      updateCostCenter,
      deleteCostCenter,
      subscriptions,
      updateSubscription,
      units,
      addUnit,
      deleteUnit,
      paymentMethods,
      addPaymentMethod,
      deletePaymentMethod,
      branches,
      addBranch,
      deleteBranch,
      procurementOrders,
      addProcurementOrder,
      updateProcurementOrder,
      refreshData
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

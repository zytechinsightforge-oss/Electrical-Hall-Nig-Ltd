-- Company Settings - single row for global settings
CREATE TABLE IF NOT EXISTS company_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  rc_number TEXT NOT NULL,
  motto TEXT NOT NULL,
  logo TEXT NOT NULL
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Admin', 'Accountant', 'Cashier')),
  active BOOLEAN NOT NULL DEFAULT 1
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  sku TEXT NOT NULL,
  supplier_id TEXT,
  expiry_date TEXT,
  bin_location TEXT
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  company_name TEXT NOT NULL
);

-- Cost Centers
CREATE TABLE IF NOT EXISTS cost_centers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  branch TEXT NOT NULL
);

-- Transactions (POS sales) - items stored as JSON
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  items TEXT NOT NULL, -- JSON array of TransactionItem
  total REAL NOT NULL,
  payment_method TEXT NOT NULL,
  cashier_name TEXT NOT NULL,
  cost_center TEXT NOT NULL,
  branch TEXT NOT NULL
);

-- Supplier Transactions
CREATE TABLE IF NOT EXISTS supplier_transactions (
  id TEXT PRIMARY KEY,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('purchase', 'payment')),
  description TEXT NOT NULL,
  invoice_number TEXT
);

-- Procurement Orders - items stored as JSON
CREATE TABLE IF NOT EXISTS procurement_orders (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  date TEXT NOT NULL,
  items TEXT NOT NULL, -- JSON array of ProcurementItem
  total_amount REAL NOT NULL,
  amount_paid REAL NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Paid', 'Unpaid', 'Partially Paid')),
  branch TEXT
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Active', 'Expired', 'Pending')),
  amount REAL NOT NULL,
  expiry_date TEXT NOT NULL
);

-- Dynamic lists
CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS branches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Insert default data
INSERT INTO company_settings (name, address, phone, email, rc_number, motto, logo)
VALUES (
  'ELECTRICAL HALL NIG LTD',
  'Plot 14, Alaba International Market, Ojo, Lagos, Nigeria',
  '+234 803 123 4567',
  'info@electricalhall.com.ng',
  'RC-1294812',
  'Powering Quality & Reliability',
  '/logo.png'
);

INSERT INTO users (id, username, name, role, active)
VALUES
  ('usr-1', 'admin', 'Chief Administrator', 'Admin', 1),
  ('usr-2', 'accountant', 'Senior Accountant', 'Accountant', 1),
  ('usr-3', 'cashier', 'Front Desk Cashier', 'Cashier', 1);

INSERT INTO categories (id, name, description)
VALUES
  ('cat-1', 'Cables & Wires', 'Power and electrical copper cables'),
  ('cat-2', 'Lighting & Bulbs', 'LED lights, fluorescent, and fixtures'),
  ('cat-3', 'Sockets & Switches', 'Wall plates, sockets, extension boxes'),
  ('cat-4', 'Switchgears', 'Distribution boards, breakers, and changeovers'),
  ('cat-5', 'Appliances', 'Fans, heaters, and extractors');

INSERT INTO products (id, name, unit, price, quantity, category, sku, supplier_id, bin_location)
VALUES
  ('prod-1', '16mm Single Core Copper Cable', 'Roll', 45000, 42, 'Cables & Wires', 'CAB-16', 'sup-1', 'Shelf A3'),
  ('prod-2', '2.5mm Twin & Earth Cable (100m)', 'Roll', 35000, 88, 'Cables & Wires', 'CAB-2.5', 'sup-1', 'Shelf A5'),
  ('prod-3', '1.5mm Single Core Copper Cable', 'Roll', 18000, 125, 'Cables & Wires', 'CAB-1.5', 'sup-1', 'Shelf A6'),
  ('prod-4', 'LED Panel Light 18W Cool White', 'Piece', 2500, 412, 'Lighting & Bulbs', 'BLB-18W', 'sup-2', 'Box B12'),
  ('prod-5', 'LED Bulb 9W Warm White', 'Piece', 1200, 320, 'Lighting & Bulbs', 'BLB-9W', 'sup-2', 'Box B15'),
  ('prod-6', 'Dual USB Wall Socket plate', 'Piece', 8500, 140, 'Sockets & Switches', 'SCK-DUAL', 'sup-2', 'Drawer C4'),
  ('prod-7', '13A Single Wall Socket plate', 'Piece', 1800, 210, 'Sockets & Switches', 'SCK-13AS', 'sup-2', 'Drawer C5'),
  ('prod-8', '12-Way Distribution Board Flush', 'Box', 62000, 15, 'Switchgears', 'DB-12W', 'sup-1', 'Rack D2'),
  ('prod-9', '100A Changeover Switch Manual', 'Piece', 29500, 18, 'Switchgears', 'CO-100A', 'sup-1', 'Rack D4'),
  ('prod-10', 'Industrial Exhaust Fan 12-inch', 'Piece', 48000, 24, 'Appliances', 'FAN-IND', 'sup-2', 'Pallet E1');

INSERT INTO suppliers (id, name, phone, email, address, company_name)
VALUES
  ('sup-1', 'Coleman Wires and Cables Ltd', '+234 800 265 3626', 'sales@coleman.com.ng', 'Arepo, Ogun State', 'Coleman Cables'),
  ('sup-2', 'Havells Electricals Nigeria', '+234 1 234 5678', 'lagos@havells.com', 'Victoria Island, Lagos', 'Havells NG');

INSERT INTO cost_centers (id, name, code, branch)
VALUES
  ('cc-1', 'Alaba Main Branch', 'CC-ALB-01', 'Alaba'),
  ('cc-2', 'Ikeja Showroom', 'CC-IKJ-02', 'Ikeja'),
  ('cc-3', 'Port Harcourt Depot', 'CC-PHC-03', 'Port Harcourt');

INSERT INTO subscriptions (id, plan_name, status, amount, expiry_date)
VALUES
  ('sub-1', 'Enterprise Unlimited', 'Active', 150000, '2026-12-31');

INSERT INTO units (name)
VALUES
  ('Piece'), ('Roll'), ('Meter'), ('Box'), ('Pack'), ('Dozen'), ('Kg'), ('Liter');

INSERT INTO payment_methods (name)
VALUES
  ('Cash'), ('Transfer'), ('Card');

INSERT INTO branches (name)
VALUES
  ('Alaba'), ('Ikeja'), ('Port Harcourt');

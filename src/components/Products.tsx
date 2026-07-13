import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, FileSpreadsheet, FileText, Printer, 
  Download, Upload, Plus, Edit2, Trash2, CheckCircle2, 
  Search, ArrowDownToLine, Tag, Truck, AlertTriangle, 
  MapPin, RefreshCw, X, Sliders, Settings2, Barcode, QrCode
} from 'lucide-react';
import { Product, Supplier } from '../types';

interface ProductsProps {
  activeSubmenu?: string;
}

export default function Products({ activeSubmenu }: ProductsProps = {}) {
  const { 
    products, addProduct, updateProduct, deleteProduct, 
    categories, suppliers, addSupplier, updateSupplier, deleteSupplier,
    supplierTransactions, addSupplierTransaction, units
  } = useApp();

  const [activeTab, setActiveTab] = useState<'Manage' | 'Restock' | 'Sales' | 'Expiry' | 'Suppliers' | 'Bin' | 'Label Printing'>('Manage');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Sync active submenu to tab
  useEffect(() => {
    if (activeSubmenu === 'Label Printing') {
      setActiveTab('Label Printing');
    } else if (activeSubmenu === 'Manage Products') {
      setActiveTab('Manage');
    }
  }, [activeSubmenu]);

  // Label Printing State
  const [selectedLabelProduct, setSelectedLabelProduct] = useState<string>('');
  const [labelQty, setLabelQty] = useState<number>(12);
  const [labelTemplate, setLabelTemplate] = useState<'Standard' | 'Compact' | 'HangTag'>('Standard');
  const [labelOptions, setLabelOptions] = useState({
    showName: true,
    showSku: true,
    showId: true,
    showPrice: true,
    showBarcode: true,
    showQrCode: false,
  });

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // New Product Form fields
  const [prodName, setProdName] = useState('');
  const [prodUnit, setProdUnit] = useState<string>('Piece');
  const [prodPrice, setProdPrice] = useState('');
  const [prodQty, setProdQty] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodBin, setProdBin] = useState('');
  const [prodSupplier, setProdSupplier] = useState('');
  const [prodExpiry, setProdExpiry] = useState('');

  // New Supplier Form fields
  const [supName, setSupName] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supAddress, setSupAddress] = useState('');
  const [supCompany, setSupCompany] = useState('');

  // Restock action temp fields
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState('');
  const [restockSupplier, setRestockSupplier] = useState('');
  const [restockCost, setRestockCost] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, categoryFilter]);

  // Restock, Expiry trackers
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.quantity <= 25);
  }, [products]);

  // Simulated exporter actions
  const handleDownloadSample = () => {
    triggerToast("Template sample Excel successfully downloaded! (eh_product_template.xlsx)");
  };

  const handleUploadFile = () => {
    const files = ["Electrical_Alaba_Batch_July.csv", "Coleman_Stock_Delivery.xlsx"];
    const chosen = files[Math.floor(Math.random() * files.length)];
    triggerToast(`Imported ${products.length + 5} products successfully from ${chosen}.`);
  };

  const handleExportExcel = () => {
    triggerToast(`Inventory ledger exported successfully. (eh_products_ledger_${new Date().toISOString().split('T')[0]}.xlsx)`);
  };

  const handleExportPDF = () => {
    triggerToast(`PDF Report compilation finished. (eh_inventory_review.pdf)`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Submit product add/edit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice || !prodQty || !prodCat || !prodSku.trim()) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    const priceNum = parseFloat(prodPrice);
    const qtyNum = parseInt(prodQty);

    if (isNaN(priceNum) || priceNum < 0) {
      alert("Price must be a valid number!");
      return;
    }
    if (isNaN(qtyNum) || qtyNum < 0) {
      alert("Quantity must be a valid non-negative integer!");
      return;
    }

    if (editingProduct) {
      // Edit mode
      updateProduct({
        ...editingProduct,
        name: prodName,
        unit: prodUnit,
        price: priceNum,
        quantity: qtyNum,
        category: prodCat,
        sku: prodSku,
        binLocation: prodBin || undefined,
        supplierId: prodSupplier || undefined,
        expiryDate: prodExpiry || undefined
      });
      triggerToast(`Product '${prodName}' updated successfully!`);
    } else {
      // Add mode
      addProduct({
        name: prodName,
        unit: prodUnit,
        price: priceNum,
        quantity: qtyNum,
        category: prodCat,
        sku: prodSku,
        binLocation: prodBin || undefined,
        supplierId: prodSupplier || undefined,
        expiryDate: prodExpiry || undefined
      });
      triggerToast(`Product '${prodName}' added to inventory database!`);
    }

    // Reset forms
    setIsProductModalOpen(false);
    setEditingProduct(null);
    clearProductForm();
  };

  const clearProductForm = () => {
    setProdName('');
    setProdUnit('Piece');
    setProdPrice('');
    setProdQty('');
    setProdCat(categories[0]?.name || '');
    setProdSku('');
    setProdBin('');
    setProdSupplier('');
    setProdExpiry('');
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    clearProductForm();
    if (categories.length > 0) {
      setProdCat(categories[0].name);
    }
    setIsProductModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdUnit(p.unit);
    setProdPrice(p.price.toString());
    setProdQty(p.quantity.toString());
    setProdCat(p.category);
    setProdSku(p.sku);
    setProdBin(p.binLocation || '');
    setProdSupplier(p.supplierId || '');
    setProdExpiry(p.expiryDate || '');
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (p: Product) => {
    if (window.confirm(`Are you absolutely sure you want to delete '${p.name}' from the catalog? This cannot be undone.`)) {
      deleteProduct(p.id);
      triggerToast(`Product '${p.name}' removed from inventory.`);
    }
  };

  // Restocking process
  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct || !restockQty || !restockCost) {
      alert("Please enter the restocking quantity and cost.");
      return;
    }

    const qtyNum = parseInt(restockQty);
    const costNum = parseFloat(restockCost);

    if (isNaN(qtyNum) || qtyNum <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }
    if (isNaN(costNum) || costNum < 0) {
      alert("Total cost must be a valid non-negative number.");
      return;
    }

    // Update product stock count
    updateProduct({
      ...restockProduct,
      quantity: restockProduct.quantity + qtyNum
    });

    // Log the supplier restock transaction
    const targetSup = suppliers.find(s => s.id === restockSupplier) || suppliers[0];
    addSupplierTransaction({
      supplierId: targetSup?.id || 'sup-1',
      supplierName: targetSup?.name || 'Coleman Cables',
      amount: costNum,
      type: 'purchase',
      description: `Restocked ${qtyNum} ${restockProduct.unit}s of ${restockProduct.name} (SKU: ${restockProduct.sku})`
    });

    triggerToast(`Inventory replenished: +${qtyNum} ${restockProduct.name} rolls/pieces added!`);
    setRestockProduct(null);
    setRestockQty('');
    setRestockCost('');
  };

  // Suppliers CRUD
  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim() || !supPhone.trim() || !supCompany.trim()) {
      alert("Supplier name, contact phone, and company name are required!");
      return;
    }

    if (editingSupplier) {
      updateSupplier({
        ...editingSupplier,
        name: supName,
        phone: supPhone,
        email: supEmail,
        address: supAddress,
        companyName: supCompany
      });
      triggerToast(`Supplier details for '${supName}' updated.`);
    } else {
      addSupplier({
        name: supName,
        phone: supPhone,
        email: supEmail,
        address: supAddress,
        companyName: supCompany
      });
      triggerToast(`New supplier '${supName}' registered.`);
    }

    setIsSupplierModalOpen(false);
    setEditingSupplier(null);
    setSupName('');
    setSupPhone('');
    setSupEmail('');
    setSupAddress('');
    setSupCompany('');
  };

  return (
    <div id="products_view" className="space-y-6 font-sans">
      
      {/* Toast Announcement */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/30 z-50 animate-fadeIn text-sm font-semibold">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Toolbar Tabs */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-slate-800 p-5 rounded-2xl border border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="text-blue-500" size={22} />
            <span>Products &amp; Inventory Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Overview catalog containing <b>{products.length}</b> total lines. Manage products, restocking, locations, and suppliers.
          </p>
        </div>

        {/* Tab Navigation buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
          {(['Manage', 'Restock', 'Sales', 'Expiry', 'Suppliers', 'Bin', 'Label Printing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab === 'Bin' ? 'Bin Locations' : tab === 'Sales' ? 'Sales Logs' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE SCREEN RENDERER */}

      {/* TAB A: MANAGE PRODUCTS CATALOG */}
      {activeTab === 'Manage' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Action Row containing Add button, search, category filter, Excel buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
            
            {/* Search filter panel */}
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search products SKU, title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-600" />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-44 text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Simulated Toolbars: Print, Excel, PDF, Sample, Upload, Add Product */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={handleDownloadSample}
                title="Download Excel Import Format"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Download size={13} />
                <span>Template</span>
              </button>
              
              <button 
                onClick={handleUploadFile}
                title="Upload Product Batch CSV/Excel"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Upload size={13} />
                <span>Import</span>
              </button>

              <button 
                onClick={handleExportExcel}
                title="Export as Excel"
                className="p-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 rounded-lg border border-emerald-900/40 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <FileSpreadsheet size={13} />
                <span>Excel</span>
              </button>

              <button 
                onClick={handleExportPDF}
                title="Export Catalog PDF"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <FileText size={13} />
                <span>PDF</span>
              </button>

              <button 
                onClick={handlePrint}
                title="Print Inventory Table"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>

              <button
                onClick={openAddProduct}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10 cursor-pointer ml-2"
              >
                <Plus size={14} />
                <span>Add Product</span>
              </button>
            </div>

          </div>

          {/* Primary Products Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-700 text-slate-400 font-bold">
                    <th className="py-3.5 px-4 font-bold text-center w-12">S/N</th>
                    <th className="py-3.5 px-4 font-bold">SKU</th>
                    <th className="py-3.5 px-4 font-bold">Name</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Unit</th>
                    <th className="py-3.5 px-4 font-bold text-right">Price (₦)</th>
                    <th className="py-3.5 px-4 font-bold text-center">In-Stock</th>
                    <th className="py-3.5 px-4 font-bold text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p, idx) => {
                      const isLow = p.quantity <= 15;
                      const isOut = p.quantity <= 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-700/30 transition-colors text-slate-300 font-medium">
                          <td className="py-3.5 px-4 text-center font-mono text-slate-500">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                            <div className="flex flex-col">
                              <span>{p.sku}</span>
                              <span className="text-[9px] font-bold text-blue-400 tracking-wider font-mono">ID: {p.id}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-bold text-slate-200">{p.name}</p>
                              {p.binLocation && (
                                <span className="text-[9px] text-slate-500 font-medium font-mono">Location: {p.binLocation}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{p.category}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">{p.unit}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">{p.price.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block font-mono ${
                              isOut 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                : isLow 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                : 'bg-slate-900 text-slate-400 border border-slate-700'
                            }`}>
                              {p.quantity} {p.unit}s
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditProduct(p)}
                                title="Edit Product details"
                                className="p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                title="Delete Product"
                                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-600 font-semibold">No items match your filtering parameters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB B: RESTOCK INVENTORY LOGS */}
      {activeTab === 'Restock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left panel showing current low stock list */}
          <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="text-amber-500" size={14} />
                <span>Restock Candidates (Low Stock)</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Select any product line to easily replenish stock levels.</p>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
              {lowStockProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setRestockProduct(p);
                    setRestockSupplier(p.supplierId || suppliers[0]?.id || 'sup-1');
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    restockProduct?.id === p.id 
                      ? 'border-blue-500 bg-blue-500/5' 
                      : 'border-slate-700 hover:border-slate-600 bg-slate-900/40'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{p.name}</h4>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">SKU: {p.sku} &bull; Category: {p.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {p.quantity} left
                    </span>
                  </div>
                </button>
              ))}
              {products.length > 0 && lowStockProducts.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-500 font-medium">
                  All products stocked healthy and secure! Feel free to restock other items from the catalog.
                </div>
              )}
            </div>

            {/* Quick search to restock non-low stock products */}
            <div className="pt-4 border-t border-slate-700">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Replenish any other product:</label>
              <select
                onChange={(e) => {
                  const match = products.find(p => p.id === e.target.value);
                  if (match) {
                    setRestockProduct(match);
                    setRestockSupplier(match.supplierId || suppliers[0]?.id || 'sup-1');
                  }
                }}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Choose Product to Replenish --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} &bull; {p.name} ({p.quantity} {p.unit}s left)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Panel containing Restock quantity addition form */}
          <div className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-2xl p-5 h-fit">
            <div className="mb-4 border-b border-slate-700/60 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Replenish Form</h3>
              <p className="text-[10px] text-slate-400 mt-1">Specify procurement lot count and cost structure.</p>
            </div>

            {restockProduct ? (
              <form onSubmit={handleRestockSubmit} className="space-y-4">
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl">
                  <span className="text-[9px] text-slate-500 font-mono font-bold block uppercase">Chosen Item</span>
                  <p className="text-xs font-extrabold text-slate-200 mt-0.5">{restockProduct.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-1">SKU: {restockProduct.sku} &bull; Unit: {restockProduct.unit} &bull; Price: {formatNaira(restockProduct.price)}</p>
                </div>

                {/* Restock Qty */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantity to Add*</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g., 50"
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Supplier selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Procured Supplier*</label>
                  <select
                    value={restockSupplier}
                    onChange={(e) => setRestockSupplier(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.companyName})</option>
                    ))}
                  </select>
                </div>

                {/* Restock Cost */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Cost Invoiced (₦)*</label>
                  <input
                    type="number"
                    placeholder="e.g., 125000"
                    value={restockCost}
                    onChange={(e) => setRestockCost(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[9px] text-slate-500 font-medium">Logs ledger transaction against Supplier's outstanding account.</p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setRestockProduct(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-400 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Commit Restock
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-16 text-center text-slate-600 font-semibold flex flex-col items-center justify-center">
                <Truck size={28} className="opacity-30 mb-2" />
                <p>No product selected for replenishment</p>
                <p className="text-[9px] font-normal text-slate-500 mt-1 max-w-[180px] mx-auto">Click on a product line from left table or choose one from dropdown.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB C: SALES LOGS TAB */}
      {activeTab === 'Sales' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Product Sales Tracking Logs</h3>
            <p className="text-[10px] text-slate-400 mt-1">Audit log detailing product sale items processed through Alaba terminal.</p>
          </div>

          <div className="overflow-x-auto border border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-700 text-slate-400 font-bold">
                  <th className="py-3 px-4 font-bold">SKU</th>
                  <th className="py-3 px-4 font-bold">Product Item</th>
                  <th className="py-3 px-4 font-bold">Unit Price</th>
                  <th className="py-3 px-4 font-bold text-center">Items Sold (Vol)</th>
                  <th className="py-3 px-4 font-bold text-right">Invoiced Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {products.map(p => {
                  // Simulate realistic sales distributions
                  const qtySold = p.sku === 'CAB-16' ? 6 : p.sku === 'CAB-2.5' ? 13 : p.sku === 'BLB-18W' ? 16 : p.sku === 'SCK-DUAL' ? 15 : p.sku === 'DB-12W' ? 4 : 2;
                  const rev = qtySold * p.price;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/20">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{p.sku}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">{p.name}</td>
                      <td className="py-3.5 px-4 font-mono">{formatNaira(p.price)}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-400">{qtySold} units</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">{formatNaira(rev)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB D: EXPIRY MONITOR TAB */}
      {activeTab === 'Expiry' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="text-amber-500" size={14} />
              <span>Chemical &amp; Battery Shelf Life Auditing</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Audit log for smart sensors, backup lithium batteries, and special chemical adhesives used in electrical installations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Seed list of expiries */}
            {[
              { name: 'Lithium backup cell 12V CR2032', sku: 'CELL-12V', expiry: '2026-12-15', status: 'Safe' },
              { name: 'Electrical PVC Insulation Spray adhesive', sku: 'PVC-ADH-S', expiry: '2026-10-05', status: 'Safe' },
              { name: 'Smart Smoke Sensor ionization backup cell', sku: 'SMK-ION-CEL', expiry: '2026-08-11', status: 'Expiring Soon' },
            ].map((exp, idx) => (
              <div key={idx} className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{exp.name}</h4>
                  <p className="text-[9px] font-mono text-slate-500 mt-0.5">SKU: {exp.sku} &bull; Expiration: <b className="text-slate-300 font-mono">{exp.expiry}</b></p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  exp.status === 'Safe' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {exp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB E: SUPPLIERS LEDGER */}
      {activeTab === 'Suppliers' && (
        <div className="space-y-4 animate-fadeIn">
          
          <div className="flex justify-between items-center bg-slate-800 p-5 rounded-2xl border border-slate-700">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Registered Electrical Vendors</h3>
              <p className="text-[10px] text-slate-400 mt-1">Authorized manufacturer supply chains supplying bulk rolls &amp; electrical devices.</p>
            </div>
            <button
              onClick={() => {
                setEditingSupplier(null);
                setSupName('');
                setSupPhone('');
                setSupEmail('');
                setSupAddress('');
                setSupCompany('');
                setIsSupplierModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow shadow-blue-500/10"
            >
              <Plus size={13} />
              <span>Register Vendor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map(s => {
              // Compute balance sheet from logs
              const totalPurchases = supplierTransactions
                .filter(tx => tx.supplierId === s.id && tx.type === 'purchase')
                .reduce((sum, tx) => sum + tx.amount, 0);

              const totalPayments = supplierTransactions
                .filter(tx => tx.supplierId === s.id && tx.type === 'payment')
                .reduce((sum, tx) => sum + tx.amount, 0);

              const balance = totalPurchases - totalPayments;

              return (
                <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3 shadow-sm hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{s.name}</h4>
                      <p className="text-[9px] text-slate-400 font-medium">Company: {s.companyName}</p>
                    </div>
                    <span className="text-[10px] text-slate-450 font-mono font-bold">ID: {s.id}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-400">
                    <p>Phone: <b className="text-slate-300 font-mono">{s.phone}</b></p>
                    <p>Email: <b className="text-slate-300 font-mono truncate">{s.email || 'N/A'}</b></p>
                    <p className="col-span-2 truncate">Address: <b className="text-slate-300">{s.address}</b></p>
                  </div>

                  <div className="border-t border-slate-700 pt-2.5 flex items-center justify-between text-xs font-medium">
                    <div>
                      <p className="text-[9px] text-slate-500">Balance Payable</p>
                      <p className={`font-mono font-bold ${balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{formatNaira(balance)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingSupplier(s);
                          setSupName(s.name);
                          setSupPhone(s.phone);
                          setSupEmail(s.email);
                          setSupAddress(s.address);
                          setSupCompany(s.companyName);
                          setIsSupplierModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 text-blue-400 hover:text-blue-300 rounded-lg transition-colors cursor-pointer"
                        title="Edit Supplier"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete supplier '${s.name}'? This won't affect past transaction ledger logs.`)) {
                            deleteSupplier(s.id);
                            triggerToast(`Supplier '${s.name}' deleted successfully.`);
                          }
                        }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                        title="Delete Supplier"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB F: BIN LOCATIONS */}
      {activeTab === 'Bin' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-500" />
              <span>Physical Warehouse Routing &amp; Binning</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Locate and route electrical gear inside the primary warehouse sections.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p.id} className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-colors">
                <div className="min-w-0">
                  <span className="text-[8px] font-bold bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded uppercase font-mono">{p.sku}</span>
                  <h4 className="text-xs font-bold text-slate-200 truncate mt-1">{p.name}</h4>
                </div>
                <div className="mt-2.5 border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span className="text-[9px] text-slate-500 font-medium">Bin location:</span>
                  <span className="text-xs font-mono font-bold text-blue-400">{p.binLocation || 'Rack A1'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB G: LABEL PRINTING WORKSTATION */}
      {activeTab === 'Label Printing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Customization controls */}
          <div className="lg:col-span-4 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Barcode className="text-blue-500" size={16} />
                <span>Label Customizer</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Configure product stickers, barcode tags, and price badges for printing.</p>
            </div>

            <div className="space-y-4 text-xs font-medium">
              {/* Product Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Product*</label>
                <select
                  value={selectedLabelProduct}
                  onChange={(e) => setSelectedLabelProduct(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              {/* Number of Labels */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Label Sheet Print Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={labelQty}
                  onChange={(e) => setLabelQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Template Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sticker Form Factor</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Standard', 'Compact', 'HangTag'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLabelTemplate(t)}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                        labelTemplate === t
                          ? 'bg-blue-600 border-blue-500 text-white shadow'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-2 border-t border-slate-700 pt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Visible Fields</label>
                
                <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={labelOptions.showName}
                    onChange={(e) => setLabelOptions({ ...labelOptions, showName: e.target.checked })}
                    className="rounded text-blue-600 bg-slate-900 border-slate-750 focus:ring-0"
                  />
                  <span>Include Product Title</span>
                </label>

                <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={labelOptions.showSku}
                    onChange={(e) => setLabelOptions({ ...labelOptions, showSku: e.target.checked })}
                    className="rounded text-blue-600 bg-slate-900 border-slate-750 focus:ring-0"
                  />
                  <span>Include Product SKU</span>
                </label>

                <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={labelOptions.showId}
                    onChange={(e) => setLabelOptions({ ...labelOptions, showId: e.target.checked })}
                    className="rounded text-blue-600 bg-slate-900 border-slate-750 focus:ring-0"
                  />
                  <span>Include Unique Product ID</span>
                </label>

                <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={labelOptions.showPrice}
                    onChange={(e) => setLabelOptions({ ...labelOptions, showPrice: e.target.checked })}
                    className="rounded text-blue-600 bg-slate-900 border-slate-750 focus:ring-0"
                  />
                  <span>Include Retail Price (₦)</span>
                </label>

                <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={labelOptions.showBarcode}
                    onChange={(e) => setLabelOptions({ ...labelOptions, showBarcode: e.target.checked })}
                    className="rounded text-blue-600 bg-slate-900 border-slate-750 focus:ring-0"
                  />
                  <span>Include Barcode (1D)</span>
                </label>

                <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={labelOptions.showQrCode}
                    onChange={(e) => setLabelOptions({ ...labelOptions, showQrCode: e.target.checked })}
                    className="rounded text-blue-600 bg-slate-900 border-slate-750 focus:ring-0"
                  />
                  <span>Include QR Code (2D)</span>
                </label>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    const prod = products.find(p => p.id === selectedLabelProduct);
                    if (!prod) {
                      triggerToast("Please select a target product to print!");
                      return;
                    }
                    window.print();
                    triggerToast(`Spooling ${labelQty} labels for '${prod.name}' to default barcode printer...`);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow shadow-blue-500/10 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Send to Label Printer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Sheet Preview */}
          <div className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col h-[650px] overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4 shrink-0">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings2 size={14} className="text-blue-500" />
                  <span>Real-time Print Queue Sheet Layout</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">How your labels look on the physical printable material rolls.</p>
              </div>
              <span className="text-[9px] font-bold bg-slate-900 text-slate-400 border border-slate-700 px-2 py-0.5 rounded uppercase font-mono">
                {labelQty} Stickers Total
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-900 rounded-xl border border-slate-750 scrollbar-thin">
              {(() => {
                const prod = products.find(p => p.id === selectedLabelProduct) || products[0];
                if (!prod) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                      <Barcode size={36} className="text-slate-600 animate-pulse" />
                      <p className="text-xs font-bold">No Products Registered in Database</p>
                      <p className="text-[10px]">Add products under the "Manage" tab first to configure stickers.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 print:bg-white print:p-0">
                    {Array.from({ length: labelQty }).map((_, i) => (
                      <div
                        key={i}
                        className={`bg-white text-slate-900 border border-slate-200 rounded p-3 flex flex-col justify-between shadow-sm min-h-[140px] text-left transition-transform duration-200 hover:scale-102 ${
                          labelTemplate === 'Compact'
                            ? 'min-h-[90px] py-2'
                            : labelTemplate === 'HangTag'
                            ? 'min-h-[180px] border-dashed border-red-300'
                            : 'min-h-[140px]'
                        }`}
                      >
                        {/* Header Brand */}
                        <div className="flex justify-between items-start text-[8px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 mb-1.5">
                          <span>ELECTRICAL HALL</span>
                          <span className="text-slate-500 font-mono">#{(i+1).toString().padStart(3, '0')}</span>
                        </div>

                        {/* Title */}
                        {labelOptions.showName && (
                          <h4 className="text-[10px] font-extrabold text-slate-950 truncate leading-tight tracking-tight mb-1" title={prod.name}>
                            {prod.name}
                          </h4>
                        )}

                        {/* Middle metadata Row */}
                        <div className="flex flex-col gap-0.5 text-[8px] text-slate-500 font-medium">
                          {labelOptions.showSku && (
                            <p className="font-mono">SKU: <b className="text-slate-800 font-bold uppercase">{prod.sku}</b></p>
                          )}
                          {labelOptions.showId && (
                            <p className="font-mono">UUID: <b className="text-blue-600 font-bold select-all">{prod.id}</b></p>
                          )}
                        </div>

                        {/* Price Display */}
                        {labelOptions.showPrice && (
                          <div className="my-1.5 flex justify-between items-baseline">
                            <span className="text-[7px] text-slate-400 font-bold uppercase">Price:</span>
                            <span className="text-xs font-black text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                              {formatNaira(prod.price)}
                            </span>
                          </div>
                        )}

                        {/* Custom simulated Barcode / QR Code graphic with CSS */}
                        <div className="mt-auto pt-1.5 border-t border-slate-100 flex flex-col items-center">
                          {labelOptions.showBarcode && (
                            <div className="w-full h-8 bg-white flex items-center justify-center gap-px px-1">
                              {/* Generate standard-looking barcode lines */}
                              {Array.from({ length: 28 }).map((_, idx) => {
                                const widths = [1, 2, 1, 3, 1, 1, 4, 1, 2, 3];
                                const w = widths[idx % widths.length];
                                return (
                                  <div
                                    key={idx}
                                    style={{ width: `${w}px` }}
                                    className={`h-6 bg-slate-900 ${idx % 3 === 0 ? 'bg-transparent' : ''}`}
                                  />
                                );
                              })}
                            </div>
                          )}
                          {labelOptions.showQrCode && (
                            <div className="w-10 h-10 border border-slate-200 p-1 flex flex-col justify-between rounded bg-white">
                              {/* Simulating 2D Data matrix */}
                              <div className="grid grid-cols-4 gap-0.5 flex-1">
                                {Array.from({ length: 16 }).map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={`rounded-xs ${
                                      (idx * 7 + 3) % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          <span className="text-[7px] font-mono text-slate-400 tracking-widest mt-0.5">{prod.sku}-{prod.id.slice(0, 4).toUpperCase()}</span>
                        </div>

                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-850 text-white w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">
                {editingProduct ? 'Edit Catalog Line' : '➕ Register New Product Line'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Description Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 2.5mm Single Cable Red Coleman"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SKU Code / Model*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., CAB-2.5-R"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category Segment*</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Quantity, Unit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price (₦)*</label>
                  <input
                    type="number"
                    required
                    placeholder="35000"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Initial Stock*</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={prodQty}
                    onChange={(e) => setProdQty(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lot Unit*</label>
                  <select
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-slate-300 focus:outline-none"
                  >
                    {units.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Warehouse Location, Supplier */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Warehouse Bin Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Shelf A5"
                    value={prodBin}
                    onChange={(e) => setProdBin(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Vendor Supplier</label>
                  <select
                    value={prodSupplier}
                    onChange={(e) => setProdSupplier(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none"
                  >
                    <option value="">-- Select Preferred Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Expiry date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Expiration (For chemical/cell batches)</label>
                <input
                  type="date"
                  value={prodExpiry}
                  onChange={(e) => setProdExpiry(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow shadow-blue-500/10"
                >
                  {editingProduct ? 'Commit Updates' : 'Add to Catalog'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER SUPPLIER */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-850 text-white w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-6 animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">
                {editingSupplier ? 'Modify Vendor Specs' : '➕ Register Vendor Supplier'}
              </h3>
              <button 
                onClick={() => setIsSupplierModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSupplierSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supplier Rep Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Emeka Coleman Rep"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none text-white"
                />
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company / Brand Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Coleman Cables Plc"
                  value={supCompany}
                  onChange={(e) => setSupCompany(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none text-white"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone*</label>
                  <input
                    type="text"
                    required
                    placeholder="+234 803..."
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email address</label>
                  <input
                    type="email"
                    placeholder="info@coleman.com"
                    value={supEmail}
                    onChange={(e) => setSupEmail(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none text-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Corporate Address</label>
                <input
                  type="text"
                  placeholder="Lagos-Ibadan Expressway, Ogun State"
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none text-white"
                />
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  {editingSupplier ? 'Commit Updates' : 'Register Vendor'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

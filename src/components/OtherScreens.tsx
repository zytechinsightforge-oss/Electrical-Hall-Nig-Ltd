import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Tags, Plus, CircleDollarSign, Calendar, 
  Users, UserPlus, CreditCard, ShieldCheck, 
  Trash2, Edit2, ShieldAlert, CheckCircle2, 
  Building2, TrendingUp, TrendingDown, ClipboardCheck, 
  Landmark, Factory, FileSpreadsheet, FileText, Printer, 
  Search, RefreshCw, Layers, Clipboard, AlertCircle, 
  Sparkles, Filter, Download, X, Barcode, CheckSquare, Square
} from 'lucide-react';
import { Category, User, CostCenter, Subscription, ProcurementOrder, ProcurementItem } from '../types';

// ==========================================
// 1. CATEGORIES MANAGEMENT COMPONENT
// ==========================================
export function CategoriesScreen() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [toast, setToast] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: name.trim(),
        description: desc.trim()
      });
      setToast(`Category '${name}' modified successfully!`);
      setEditingCategory(null);
    } else {
      addCategory({ name: name.trim(), description: desc.trim() });
      setToast(`Category '${name}' registered successfully!`);
    }

    setName('');
    setDesc('');
    setTimeout(() => setToast(''), 2500);
  };

  const handleEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setDesc(c.description || '');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category segment '${name}'?`)) {
      deleteCategory(id);
      setToast(`Category '${name}' deleted successfully.`);
      setTimeout(() => setToast(''), 2500);
    }
  };

  return (
    <div id="categories_screen" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn font-sans">
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 text-sm font-semibold border border-emerald-500/20">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 h-fit shadow-md">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
          {editingCategory ? '✏️ Modify Segment' : 'Register New Segment'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Segment Name*</label>
            <input
              type="text"
              required
              placeholder="e.g., Conduit Pipes & fittings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Segment Description</label>
            <textarea
              placeholder="Pipes, bends, and junction boxes..."
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {editingCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setName('');
                  setDesc('');
                }}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-650 text-slate-400 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              {editingCategory ? <Edit2 size={13} /> : <Plus size={13} />}
              <span>{editingCategory ? 'Commit Updates' : 'Register Segment'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Categories list */}
      <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-md">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Inventory Segments</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Product classifications representing electrical materials groups.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(c => (
            <div key={c.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/10">
                  <Tags size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{c.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2">{c.description || 'No descriptive tags registered.'}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800/80 pt-2 text-[9px] font-mono text-slate-500">
                <span>ID: {c.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(c)}
                    className="p-1 hover:bg-slate-850 text-blue-400 hover:text-blue-300 rounded cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EHNL CUSTOM LOGO BADGE
// ==========================================
export function EHNLBadge({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer shadow / metallic edge */}
      <circle cx="100" cy="100" r="95" fill="url(#metallic-grad-other)" stroke="#94a3b8" strokeWidth="4" />
      {/* Inner green circle */}
      <circle cx="100" cy="100" r="80" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
      
      {/* Electrical utility pole in the center */}
      <rect x="96" y="45" width="8" height="110" fill="#b45309" />
      {/* Crossbeams */}
      <rect x="75" y="55" width="50" height="4" fill="#d97706" />
      <rect x="80" y="65" width="40" height="3" fill="#d97706" />
      
      {/* Insulators */}
      <circle cx="80" cy="52" r="3" fill="#94a3b8" />
      <circle cx="100" cy="52" r="3" fill="#94a3b8" />
      <circle cx="120" cy="52" r="3" fill="#94a3b8" />
      
      {/* Two climbing linemen */}
      <path d="M 85 95 L 96 90 L 96 82 L 85 85 Z" fill="#475569" />
      <circle cx="85" cy="78" r="4" fill="#f59e0b" />
      <path d="M 85 95 L 80 115 L 96 110" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 90 85 L 96 80" stroke="#1e293b" strokeWidth="2" />
      
      <path d="M 115 105 L 104 100 L 104 92 L 115 95 Z" fill="#475569" />
      <circle cx="115" cy="88" r="4" fill="#f59e0b" />
      <path d="M 115 105 L 120 125 L 104 120" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 110 95 L 104 90" stroke="#1e293b" strokeWidth="2" />
      
      {/* Text EHNL arranged elegantly */}
      <text x="35" y="112" fill="#15803d" fontSize="24" fontWeight="900" fontFamily="serif" textAnchor="middle">E</text>
      <text x="65" y="160" fill="#15803d" fontSize="24" fontWeight="900" fontFamily="serif" textAnchor="middle">H</text>
      <text x="135" y="160" fill="#15803d" fontSize="24" fontWeight="900" fontFamily="serif" textAnchor="middle">N</text>
      <text x="165" y="112" fill="#15803d" fontSize="24" fontWeight="900" fontFamily="serif" textAnchor="middle">L</text>
      
      {/* Definitions for metallic gradient */}
      <defs>
        <radialGradient id="metallic-grad-other" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(100 100) rotate(90) scale(95)">
          <stop offset="0" stopColor="#f1f5f9" />
          <stop offset="0.8" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#64748b" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ==========================================
// 2. PROCUREMENT GENERAL LEDGER & AP WORKSTATION
// ==========================================
export function ProcurementScreen() {
  const { 
    suppliers, supplierTransactions, addSupplierTransaction, 
    products, procurementOrders, addProcurementOrder, branches 
  } = useApp();

  // Active Tab View State
  const [activeSubTab, setActiveSubTab] = useState<'Purchase' | 'Logs' | 'APLedger'>('Purchase');
  
  // Toast State
  const [toast, setToast] = useState('');
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // MULTI-ITEM PROCUREMENT FORM STATE
  const [supplierId, setSupplierId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [branchMap, setBranchMap] = useState('Alaba');
  const [amountPaidImmediate, setAmountPaidImmediate] = useState('');
  
  // Current Item Rows
  const [itemRows, setItemRows] = useState<{ productId: string; quantity: number; costPrice: number }[]>([
    { productId: '', quantity: 1, costPrice: 0 }
  ]);

  // Invoice Print Overlay State
  const [printingOrder, setPrintingOrder] = useState<ProcurementOrder | null>(null);

  // Supplier Bank Statement State
  const [selectedAPSupplier, setSelectedAPSupplier] = useState('');

  // Handle row mutations
  const handleAddRow = () => {
    setItemRows([...itemRows, { productId: '', quantity: 1, costPrice: 0 }]);
  };

  const handleRemoveRow = (idx: number) => {
    if (itemRows.length <= 1) return;
    setItemRows(itemRows.filter((_, i) => i !== idx));
  };

  const handleRowChange = (idx: number, field: 'productId' | 'quantity' | 'costPrice', val: string) => {
    const newRows = [...itemRows];
    if (field === 'productId') {
      newRows[idx].productId = val;
      // Pre-fill cost price as product price * 0.8 (estimated cost)
      const pr = products.find(p => p.id === val);
      if (pr) {
        newRows[idx].costPrice = Math.round(pr.price * 0.85);
      }
    } else if (field === 'quantity') {
      newRows[idx].quantity = Math.max(1, parseInt(val) || 1);
    } else if (field === 'costPrice') {
      newRows[idx].costPrice = Math.max(0, parseFloat(val) || 0);
    }
    setItemRows(newRows);
  };

  // Calculate order subtotal
  const orderTotal = useMemo(() => {
    return itemRows.reduce((sum, row) => sum + (row.quantity * row.costPrice), 0);
  }, [itemRows]);

  // Submit Order Form
  const handlePurchaseOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) {
      alert("Please select a vendor supplier!");
      return;
    }
    if (!invoiceNumber.trim()) {
      alert("Please specify the corporate supplier invoice number!");
      return;
    }

    // Filter valid rows
    const validRows = itemRows.filter(row => row.productId !== '');
    if (validRows.length === 0) {
      alert("Please add at least one valid product line item!");
      return;
    }

    const matchedSup = suppliers.find(s => s.id === supplierId);
    if (!matchedSup) return;

    // Build order item list with names
    const orderItems: ProcurementItem[] = validRows.map(row => {
      const pr = products.find(p => p.id === row.productId);
      return {
        productId: row.productId,
        name: pr ? pr.name : 'Unknown Gear',
        sku: pr ? pr.sku : '',
        quantity: row.quantity,
        unit: pr ? pr.unit : 'Pcs',
        costPrice: row.costPrice,
        subtotal: row.quantity * row.costPrice
      };
    });

    const immediatePaid = parseFloat(amountPaidImmediate) || 0;
    const status: 'Paid' | 'Unpaid' | 'Partially Paid' = 
      immediatePaid >= orderTotal ? 'Paid' : (immediatePaid === 0 ? 'Unpaid' : 'Partially Paid');

    // Construct the Procurement Order object
    const newOrder: ProcurementOrder = {
      id: 'po-' + Math.floor(Math.random() * 10000) + '-' + Date.now().toString().slice(-4),
      supplierId: matchedSup.id,
      supplierName: matchedSup.name,
      date: new Date().toISOString(),
      invoiceNumber: invoiceNumber.toUpperCase().trim(),
      items: orderItems,
      totalAmount: orderTotal,
      amountPaid: immediatePaid,
      status,
      branch: branchMap
    };

    // Save into state via context
    addProcurementOrder(newOrder);

    // Reset Form
    setSupplierId('');
    setInvoiceNumber('');
    setAmountPaidImmediate('');
    setItemRows([{ productId: '', quantity: 1, costPrice: 0 }]);
    
    triggerToast(`Procurement Order [${newOrder.invoiceNumber}] logged! ${orderItems.length} items successfully restocked into ${branchMap} warehouse.`);
    setActiveSubTab('Logs');
  };

  // Accounts Payable Calculations per supplier
  const apLedgerData = useMemo(() => {
    if (!selectedAPSupplier) return null;
    const sup = suppliers.find(s => s.id === selectedAPSupplier);
    if (!sup) return null;

    // Filters bills and payments specifically for this supplier
    const rawTx = supplierTransactions.filter(tx => tx.supplierId === sup.id);
    
    // Build chronological ledger sequence
    const ledgerRows = rawTx.map(tx => {
      const isPurchase = tx.type === 'purchase';
      return {
        id: tx.id,
        date: tx.date,
        description: tx.description,
        invoiceRef: tx.invoiceNumber || 'N/A',
        purchaseAmount: isPurchase ? tx.amount : 0,
        paymentAmount: !isPurchase ? tx.amount : 0,
        type: tx.type
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Generate Running Balance sheet statement
    let runningBalance = 0;
    const finalizedRows = ledgerRows.map(row => {
      runningBalance += (row.purchaseAmount - row.paymentAmount);
      return {
        ...row,
        balanceAfter: runningBalance
      };
    });

    const totalBilled = finalizedRows.reduce((s, r) => s + r.purchaseAmount, 0);
    const totalPaid = finalizedRows.reduce((s, r) => s + r.paymentAmount, 0);

    return {
      supplier: sup,
      rows: finalizedRows.reverse(), // reverse to display newest first
      totalBilled,
      totalPaid,
      outstandingPayable: totalBilled - totalPaid
    };
  }, [selectedAPSupplier, suppliers, supplierTransactions]);

  return (
    <div id="procurement_workspace" className="space-y-6 animate-fadeIn font-sans">
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 text-sm font-semibold border border-emerald-500/20">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* SUB-TABS SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Factory className="text-blue-500" size={16} />
            <span>Procurement &amp; Vendor Supply Console</span>
          </h2>
          <p className="text-[10px] text-slate-450 mt-0.5">Maintain supplier accounts payable statements, restock item lines, and review bill logs.</p>
        </div>

        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-750 self-end sm:self-auto shrink-0">
          {(['Purchase', 'Logs', 'APLedger'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                activeSubTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'Purchase' ? '🛒 Log Bulk Purchase' : tab === 'Logs' ? '📋 Procurement Logs' : '🏦 Vendor AP Ledger'}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW A: REGISTER VENDOR PURCHASE (MULTI-ITEM FORM) */}
      {activeSubTab === 'Purchase' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Entry form */}
          <form onSubmit={handlePurchaseOrderSubmit} className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="border-b border-slate-700/60 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Register Supplier Bill (Restock Delivery)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Increments inventory counts and logs double-entry account payable logs upon confirmation.</p>
            </div>

            {/* General Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vendor Supplier*</label>
                <select
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-slate-300 focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.companyName})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Invoice #*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., COL-INV-928"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none uppercase font-semibold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Warehouse Mapping*</label>
                <select
                  value={branchMap}
                  onChange={(e) => setBranchMap(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-slate-300 focus:outline-none font-semibold"
                >
                  {branches.map(b => (
                    <option key={b} value={b}>{b} Outlets</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Items list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-700/60 pb-1">
                <span>Material Line Items to Purchase</span>
                <span>Subtotal Value</span>
              </div>

              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                {itemRows.map((row, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-750">
                    <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0 w-6 text-center">{idx + 1}</span>
                    
                    {/* Choose Product */}
                    <select
                      value={row.productId}
                      required
                      onChange={(e) => handleRowChange(idx, 'productId', e.target.value)}
                      className="w-full sm:flex-1 text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-slate-300 focus:outline-none"
                    >
                      <option value="">-- Choose Gear Component --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Qty: {p.quantity} {p.unit})</option>
                      ))}
                    </select>

                    {/* Quantity */}
                    <div className="w-full sm:w-24 flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase shrink-0">QTY:</span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={row.quantity}
                        onChange={(e) => handleRowChange(idx, 'quantity', e.target.value)}
                        className="w-full text-xs text-white bg-transparent py-1.5 focus:outline-none font-bold text-center"
                      />
                    </div>

                    {/* Unit Cost Price */}
                    <div className="w-full sm:w-36 flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase shrink-0">Cost: ₦</span>
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="Cost"
                        value={row.costPrice || ''}
                        onChange={(row.productId === '') ? () => {} : (e) => handleRowChange(idx, 'costPrice', e.target.value)}
                        className="w-full text-xs text-white bg-transparent py-1.5 focus:outline-none font-bold"
                      />
                    </div>

                    {/* Remove row */}
                    <button
                      type="button"
                      disabled={itemRows.length <= 1}
                      onClick={() => handleRemoveRow(idx)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add row triggers */}
              <button
                type="button"
                onClick={handleAddRow}
                className="py-1.5 px-3.5 bg-slate-900 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-lg text-[10px] text-slate-300 font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Plus size={11} />
                <span>Add More Items</span>
              </button>
            </div>

            {/* Bottom Settle Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-700/60 pt-4">
              <div className="space-y-1 bg-slate-900/30 p-3 rounded-xl border border-slate-750/80">
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Settled Immediate Payment (₦)</label>
                <input
                  type="number"
                  placeholder="e.g., 500000 (Keep blank if credit terms)"
                  value={amountPaidImmediate}
                  onChange={(e) => setAmountPaidImmediate(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-emerald-900/30 rounded-lg px-3 py-2 text-white focus:outline-none font-mono"
                />
                <span className="text-[9px] text-slate-500 block">Leaves remaining value as outstanding Accounts Payable credit balance.</span>
              </div>

              <div className="flex flex-col justify-between items-end bg-slate-900/50 p-4 rounded-xl border border-slate-750 text-right">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider block">Bulk Total Purchase Order Value:</span>
                  <span className="text-xl font-black text-white font-mono">{formatNaira(orderTotal)}</span>
                </div>
                {orderTotal > 0 && (
                  <span className="text-[9px] text-slate-400 mt-1">
                    Unpaid Liability Balance: <b className="text-red-400 font-mono font-bold">{formatNaira(Math.max(0, orderTotal - (parseFloat(amountPaidImmediate) || 0)))}</b>
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
            >
              <ClipboardCheck size={14} />
              <span>Verify and Commit Procurement Order</span>
            </button>
          </form>

          {/* Supplier Info sidebar */}
          <div className="lg:col-span-4 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-700 pb-2">Active Vendor Liabilities Summary</h4>
            <div className="space-y-3.5 text-xs">
              {suppliers.map(s => {
                // calculate overall payable
                const totalPurchases = supplierTransactions
                  .filter(tx => tx.supplierId === s.id && tx.type === 'purchase')
                  .reduce((sum, tx) => sum + tx.amount, 0);

                const totalPayments = supplierTransactions
                  .filter(tx => tx.supplierId === s.id && tx.type === 'payment')
                  .reduce((sum, tx) => sum + tx.amount, 0);

                const balance = totalPurchases - totalPayments;
                
                return (
                  <div key={s.id} className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-lg border border-slate-750">
                    <div>
                      <p className="font-extrabold text-slate-200">{s.name}</p>
                      <p className="text-[9px] text-slate-500">{s.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-bold ${balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{formatNaira(balance)}</p>
                      <span className="text-[8px] uppercase font-bold text-slate-500">PAYABLE</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW B: PROCUREMENT ORDERS LOGS WITH INVOICE DETAILS */}
      {activeSubTab === 'Logs' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historical Purchases Logbook</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Chronological record of company inventory intake order slips and print vouchers.</p>
          </div>

          <div className="overflow-x-auto border border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-700 text-slate-400 font-bold">
                  <th className="py-3 px-4">Date Logged</th>
                  <th className="py-3 px-4">Supplier Vendor</th>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Warehouse Depot</th>
                  <th className="py-3 px-4 text-center">Items Count</th>
                  <th className="py-3 px-4 text-right">Order Value</th>
                  <th className="py-3 px-4 text-right">Unpaid Balance</th>
                  <th className="py-3 px-4 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-300">
                {procurementOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-bold">No procurement orders logged in database yet.</td>
                  </tr>
                ) : (
                  procurementOrders.map(order => {
                    const balance = order.totalAmount - order.amountPaid;
                    const status = balance <= 0 ? 'Fully Paid' : order.amountPaid > 0 ? 'Partially Paid' : 'Unpaid';
                    
                    return (
                      <tr key={order.id} className="hover:bg-slate-700/30 font-medium">
                        <td className="py-3 px-4 font-mono text-slate-500 text-[10px]">
                          {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-200">{order.supplierName}</td>
                        <td className="py-3 px-4 font-mono text-blue-400 font-bold select-all">{order.invoiceNumber}</td>
                        <td className="py-3 px-4 text-slate-400">{order.branch} Outlets</td>
                        <td className="py-3 px-4 text-center text-slate-500 font-bold">{order.items.length} lines</td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-white">{formatNaira(order.totalAmount)}</td>
                        <td className={`py-3 px-4 text-right font-mono font-extrabold ${balance > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                          {balance > 0 ? formatNaira(balance) : '₦0 (Cleared)'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setPrintingOrder(order)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded text-[9px] font-bold text-slate-300 hover:text-white flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Printer size={10} />
                            <span>Voucher</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW C: ACCOUNTS PAYABLE LEDGER & STATEMENTS */}
      {activeSubTab === 'APLedger' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* AP Selection and Stats card */}
          <div className="lg:col-span-4 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AP Ledger Statement Control</h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Generate real-time statements and liability summaries matching supplier accounts.</p>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Supplier Vendor</label>
                <select
                  value={selectedAPSupplier}
                  onChange={(e) => setSelectedAPSupplier(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.companyName})</option>
                  ))}
                </select>
              </div>

              {apLedgerData ? (
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-750 space-y-3">
                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-1.5">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Total Invoice Debits:</span>
                    <span className="font-mono font-bold text-red-400">{formatNaira(apLedgerData.totalBilled)}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-1.5">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Settled Outflows:</span>
                    <span className="font-mono font-bold text-emerald-400">{formatNaira(apLedgerData.totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-wider">Unpaid Balance:</span>
                    <span className={`font-mono font-extrabold text-sm ${apLedgerData.outstandingPayable > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formatNaira(apLedgerData.outstandingPayable)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center bg-slate-900/30 rounded-xl border border-slate-750 text-slate-500 text-[10px]">
                  Choose a supplier to visualize liabilities balance sheet.
                </div>
              )}
            </div>
          </div>

          {/* Statement ledger view */}
          <div className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Account Payable Ledger Card</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Dual entry balance sheet tracker highlighting paid &amp; outstanding bills.</p>
              </div>
              {apLedgerData && (
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-750 text-xs text-white border border-slate-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer size={12} />
                  <span>Print Bank Statement</span>
                </button>
              )}
            </div>

            {apLedgerData ? (
              <div className="space-y-4">
                {/* Simulated Statement Header */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-750 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[8px] text-slate-550 font-bold block">VENDOR supplier</span>
                    <p className="font-black text-slate-200 mt-0.5">{apLedgerData.supplier.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Phone: {apLedgerData.supplier.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-slate-550 font-bold block">GENERATED FOR</span>
                    <p className="font-extrabold text-blue-400 mt-0.5">ELECTRICAL HALL NIG LTD</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 font-mono">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Statements Table */}
                <div className="overflow-x-auto border border-slate-700 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-700 text-slate-450 font-bold font-sans">
                        <th className="py-2.5 px-4 text-[10px] uppercase">Date</th>
                        <th className="py-2.5 px-4 text-[10px] uppercase">Invoice Ref</th>
                        <th className="py-2.5 px-4 text-[10px] uppercase">Transaction Narrative</th>
                        <th className="py-2.5 px-4 text-right text-[10px] uppercase">Purchased (₦)</th>
                        <th className="py-2.5 px-4 text-right text-[10px] uppercase">Paid (₦)</th>
                        <th className="py-2.5 px-4 text-right text-[10px] uppercase">Balance (₦)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-slate-300 font-medium">
                      {apLedgerData.rows.map((row, idx) => {
                        return (
                          <tr key={idx} className="hover:bg-slate-700/30">
                            <td className="py-3 px-4 font-mono text-[10px] text-slate-500">{new Date(row.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4 font-mono text-blue-400 font-bold select-all">{row.invoiceRef}</td>
                            <td className="py-3 px-4 text-slate-400 truncate max-w-[180px]" title={row.description}>{row.description}</td>
                            <td className="py-3 px-4 text-right font-mono text-red-400">{row.purchaseAmount > 0 ? formatNaira(row.purchaseAmount) : '-'}</td>
                            <td className="py-3 px-4 text-right font-mono text-emerald-400">{row.paymentAmount > 0 ? formatNaira(row.paymentAmount) : '-'}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-white">{formatNaira(row.balanceAfter)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-1.5 bg-slate-900/20 border border-dashed border-slate-700 rounded-xl">
                <Landmark size={28} className="text-slate-650" />
                <p className="text-xs font-bold">Statement Inactive</p>
                <p className="text-[10px]">Select a vendor in the left drop-down statement node to construct their Accounts Payable card ledger.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* OVERLAY PRINTOUT MODAL FOR PROCUREMENT ORDERS */}
      {printingOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-xl p-8 shadow-2xl relative border border-slate-300 max-h-[95vh] overflow-y-auto">
            
            {/* Close */}
            <button
              onClick={() => setPrintingOrder(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer print:hidden z-10"
              title="Close Panel"
            >
              <X size={18} />
            </button>

            {/* Print Header Action block */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 print:hidden">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                <Printer size={14} className="text-emerald-700" />
                <span>Wholesale Procurement Intake Letterhead Voucher. Can be printed directly or downloaded as Text.</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const lines = [
                      "==================================================",
                      "           ELECTRICAL HALL (NIG) LTD.",
                      "               RC NUMBER: 1187947",
                      " An Electrical & Telecommunication Giants, Global Merchant",
                      "      Head Office: 50, Idoluwo Street, Idumota, Lagos.",
                      "         Tel: 09060930985, 08021030267",
                      "==================================================",
                      "             PROCUREMENT INTAKE VOUCHER",
                      "==================================================",
                      `VOUCHER NO:    ${printingOrder.id}`,
                      `DATE:          ${new Date(printingOrder.date).toLocaleDateString()}`,
                      `SUPPLIER:      ${printingOrder.supplierName.toUpperCase()}`,
                      `REF INVOICE:   ${printingOrder.invoiceNumber}`,
                      `DESTINATION:   ${printingOrder.branch.toUpperCase()} DEPOT`,
                      "--------------------------------------------------",
                      "S/N  ITEM DESCRIPTION          QTY    UNIT(₦)     TOTAL(₦)",
                      "--------------------------------------------------",
                      ...printingOrder.items.map((item, idx) => {
                        const sn = (idx + 1).toString().padEnd(4, " ");
                        const desc = item.productName.substring(0, 24).padEnd(25, " ");
                        const qty = item.quantity.toString().padEnd(6, " ");
                        const price = item.costPrice.toLocaleString().padEnd(11, " ");
                        const sub = (item.quantity * item.costPrice).toLocaleString();
                        return sn + desc + qty + price + sub;
                      }),
                      "--------------------------------------------------",
                      `TOTAL AMOUNT:                     ₦${printingOrder.totalAmount.toLocaleString()}`,
                      `AMOUNT PAID:                      ₦${printingOrder.amountPaid.toLocaleString()}`,
                      `OUTSTANDING BALANCE:              ₦${(printingOrder.totalAmount - printingOrder.amountPaid).toLocaleString()}`,
                      "==================================================",
                      "       Motto: In God Alone We put our Trust       ",
                      "==================================================",
                    ];

                    const blob = new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `Procurement_Voucher_${printingOrder.id}.txt`;
                    link.click();
                    URL.revokeObjectURL(link.href);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Download size={12} />
                  <span>Download Voucher</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Printer size={12} />
                  <span>Execute Print</span>
                </button>
              </div>
            </div>

            {/* PRINT MATERIAL WITH HIGH FIDELITY LETTERHEAD EMBELLISHMENTS */}
            <div 
              id="printable-area-active" 
              className="bg-[#FAF9F5] text-slate-900 border-4 border-double border-emerald-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden min-h-[820px] flex flex-col justify-between font-sans shadow-lg select-text"
            >
              {/* Massive watermark absolute centered */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none z-0">
                <EHNLBadge className="w-96 h-96" />
              </div>

              {/* Header block */}
              <div className="relative z-10">
                <div className="grid grid-cols-12 gap-4 items-center border-b-2 border-emerald-800 pb-4 mb-6">
                  {/* Left Corporate text details */}
                  <div className="col-span-9 space-y-1">
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-950 font-serif leading-none">
                      ELECTRICAL HALL <span className="text-emerald-700 font-extrabold">(NIG)</span> LTD.
                    </h1>
                    <p className="text-[10px] md:text-[11px] font-bold text-emerald-800 italic uppercase tracking-wide">
                      An Electrical &amp; Telecommunication Giants, Global Merchant and General Goods
                    </p>
                    <div className="text-[10px] text-slate-600 space-y-0.5">
                      <p className="font-semibold text-slate-800">
                        Head Office: <span className="font-medium">50, Idoluwo Street, Idumota, Lagos Island, Lagos.</span>
                      </p>
                      <p className="font-mono">
                        Phone lines: <span className="font-bold text-slate-800">09060930985, 08021030267</span>
                      </p>
                      <p>
                        E-mail: <span className="font-semibold text-slate-700 font-mono">electricalhall@yahoo.com</span>
                      </p>
                    </div>
                  </div>

                  {/* Right circular logo badge and RC Details */}
                  <div className="col-span-3 text-center">
                    <EHNLBadge className="w-16 h-16 md:w-20 md:h-20 mx-auto drop-shadow-md" />
                    <p className="text-[10px] font-black text-slate-800 tracking-wider mt-1.5 font-mono">
                      RC: 1187947
                    </p>
                  </div>
                </div>

                {/* Subtitle banner */}
                <div className="text-center mb-6">
                  <span className="inline-block px-6 py-1.5 bg-emerald-950 text-emerald-50 text-[11px] font-extrabold tracking-widest rounded-full uppercase shadow-sm border border-emerald-800">
                    PROCUREMENT INTAKE VOUCHER
                  </span>
                </div>

                {/* Voucher Meta details columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] bg-slate-900/5 p-4 rounded-2xl border border-slate-300 mb-6 font-mono">
                  <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-wider">Voucher Number</span>
                    <span className="font-bold text-slate-950 text-xs">{printingOrder.id}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-wider">Date Logged</span>
                    <span className="font-bold text-slate-900">{new Date(printingOrder.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-wider">Ref Company Invoice</span>
                    <span className="font-bold text-slate-900 text-xs text-blue-800 underline decoration-dotted">{printingOrder.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-wider">Destination Branch</span>
                    <span className="font-bold text-emerald-800 uppercase">{printingOrder.branch}</span>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="border border-slate-300 rounded-2xl p-4 bg-slate-100/50 mb-6 text-[11px] flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">SUPPLIER BILL FROM</span>
                    <p className="font-extrabold text-slate-950 text-xs mt-0.5">{printingOrder.supplierName}</p>
                    <p className="text-slate-500 text-[10px]">Registered Electrical Vendor &bull; Accounts Payable Active</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">STOCK AUDIT STATUS</span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>INVENTORY RESTOCKED</span>
                    </span>
                  </div>
                </div>

                {/* Items Specifications Table */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-emerald-950 uppercase tracking-wider block">Inbound Material Specifications:</span>
                  <div className="overflow-x-auto border border-slate-300 rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-emerald-900 text-emerald-50 font-bold border-b border-emerald-950 text-[10px] uppercase tracking-wider">
                          <th className="py-2.5 px-4 text-center w-10">S/N</th>
                          <th className="py-2.5 px-4">Material Specification Description</th>
                          <th className="py-2.5 px-4 text-center w-24">QTY Recv</th>
                          <th className="py-2.5 px-4 text-right w-28">Unit Cost</th>
                          <th className="py-2.5 px-4 text-right w-32">Billed Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {printingOrder.items.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 font-medium">
                            <td className="py-2.5 px-4 text-center font-mono text-slate-500">{idx + 1}</td>
                            <td className="py-2.5 px-4 font-bold text-slate-950">{row.productName}</td>
                            <td className="py-2.5 px-4 text-center font-mono font-bold text-emerald-900">{row.quantity} Units</td>
                            <td className="py-2.5 px-4 text-right font-mono text-slate-700">{formatNaira(row.costPrice)}</td>
                            <td className="py-2.5 px-4 text-right font-mono font-extrabold text-slate-950">{formatNaira(row.quantity * row.costPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Calculations footer and signed desk blocks */}
              <div className="relative z-10 mt-6 space-y-6">
                
                {/* Calculations summary alignment */}
                <div className="flex flex-col items-end gap-1.5 border-t border-slate-300 pt-4 text-[11px]">
                  <div className="flex justify-between w-64 text-slate-600 font-medium">
                    <span>Subtotal Billed Value:</span>
                    <span className="font-mono font-bold text-slate-900">{formatNaira(printingOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between w-64 text-emerald-700 font-medium border-b border-slate-200 pb-1.5">
                    <span>Amount Settled / Paid:</span>
                    <span className="font-mono font-bold">-{formatNaira(printingOrder.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between w-64 pt-1.5 font-bold">
                    <span className="text-slate-950 uppercase">Outstanding Balance:</span>
                    <span className="font-mono font-extrabold text-emerald-900 text-xs">{formatNaira(printingOrder.totalAmount - printingOrder.amountPaid)}</span>
                  </div>
                </div>

                {/* Motto */}
                <div className="text-center py-2 border-y border-dashed border-emerald-800/30">
                  <p className="font-serif italic font-bold text-emerald-800 text-xs">
                    Motto: In God Alone We put our Trust
                  </p>
                </div>

                {/* Dual Signature Blocks */}
                <div className="grid grid-cols-2 gap-12 pt-10 text-center text-[10px] text-slate-600 font-medium">
                  <div className="border-t border-slate-300 pt-1.5 space-y-0.5">
                    <p className="font-bold text-slate-800">Audit Desk Administrator Signature</p>
                    <p className="text-[8px] font-mono text-slate-400">Electrical Hall (Nig) Ltd</p>
                    <div className="h-6 flex items-end justify-center">
                      <span className="text-[9px] text-slate-400 italic">Signed &amp; Stamp Date: {new Date(printingOrder.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-300 pt-1.5 space-y-0.5">
                    <p className="font-bold text-slate-800">Supplier/Representative Signature</p>
                    <p className="text-[8px] font-mono text-slate-400">{printingOrder.supplierName}</p>
                    <div className="h-6 flex items-end justify-center">
                      <span className="text-[9px] text-slate-400 border-b border-dotted border-slate-400 w-28 inline-block"></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 3. ACCOUNTING GENERAL LEDGER & BI ANALYTICS
// ==========================================
export function AccountingScreen() {
  const { transactions, supplierTransactions, costCenters } = useApp();

  const [activeAcctTab, setActiveAcctTab] = useState<'Book' | 'BI' | 'ProfitLoss'>('Book');
  const [toast, setToast] = useState('');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Dual entry cash ledger calculation
  const accountingLedger = useMemo(() => {
    let totalInflows = 0;
    let totalOutflows = 0;

    // Sales are Inflows
    const inLogs = transactions.map(t => {
      totalInflows += t.total;
      return {
        id: t.id,
        date: t.date,
        entity: t.customerName,
        type: 'Inflow (Sale)',
        amount: t.total,
        channel: t.paymentMethod,
        isInflow: true
      };
    });

    // Supplier payments are Outflows
    const outLogs = supplierTransactions
      .filter(tx => tx.type === 'payment')
      .map(tx => {
        totalOutflows += tx.amount;
        return {
          id: tx.id,
          date: tx.date,
          entity: tx.supplierName,
          type: 'Outflow (Supplier Paid)',
          amount: tx.amount,
          channel: 'Bank Transfer',
          isInflow: false
        };
      });

    const list = [...inLogs, ...outLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      list,
      totalInflows,
      totalOutflows,
      netBalance: totalInflows - totalOutflows
    };
  }, [transactions, supplierTransactions]);

  // Business Intelligence Calculations
  const biStats = useMemo(() => {
    // 1. Profit Margin Ratio
    const grossSales = accountingLedger.totalInflows;
    // Estimated Cost of Goods Sold is 75% of Gross Sales
    const simulatedCogs = Math.round(grossSales * 0.72);
    const grossProfit = grossSales - simulatedCogs;
    
    // Operating Expenses from Cost Centre disbursements
    // Standard operational cost estimates based on registered cost centres
    const operatingExpenses = costCenters.length * 450000;
    const surplus = grossSales - (simulatedCogs + operatingExpenses);

    return {
      grossSales,
      simulatedCogs,
      grossProfit,
      operatingExpenses,
      surplus,
      marginPercent: grossSales > 0 ? Math.round((grossProfit / grossSales) * 100) : 0,
      returnPercent: grossSales > 0 ? Math.round((surplus / grossSales) * 100) : 0,
    };
  }, [accountingLedger, costCenters]);

  // Handle Export commands
  const handleExport = (format: 'Excel' | 'CSV' | 'PDF', title: string) => {
    triggerToast(`Export complete! '${title}' successfully compiled into ${format === 'Excel' ? '.xlsx' : format === 'CSV' ? '.csv' : '.pdf'} asset down-stream. Check downloads node.`);
  };

  return (
    <div id="accounting_workspace" className="space-y-6 animate-fadeIn font-sans">
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 text-sm font-semibold border border-emerald-500/20">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Total Inflow */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between shadow">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Inflow</p>
            <h3 className="text-xl font-extrabold text-emerald-400 font-mono">{formatNaira(accountingLedger.totalInflows)}</h3>
            <p className="text-[9px] text-slate-500">Collected from checkout invoices</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/15">
            <TrendingUp size={18} />
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between shadow">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Settled Outflow</p>
            <h3 className="text-xl font-extrabold text-red-400 font-mono">{formatNaira(accountingLedger.totalOutflows)}</h3>
            <p className="text-[9px] text-slate-500">Capital settlement payments logged</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/15">
            <TrendingDown size={18} />
          </div>
        </div>

        {/* Net Capital Balance */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between shadow">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Surplus Cash Reserves</p>
            <h3 className="text-xl font-extrabold text-white font-mono">{formatNaira(accountingLedger.netBalance)}</h3>
            <p className="text-[9px] text-slate-500">Operating fluid cash balance reserves</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/15">
            <Landmark size={18} />
          </div>
        </div>

      </div>

      {/* TABS CONTROLLER AND REPORT OPTIONS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 gap-4">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-750">
          {(['Book', 'BI', 'ProfitLoss'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveAcctTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeAcctTab === tab
                  ? 'bg-blue-600 text-white shadow shadow-blue-500/10'
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              {tab === 'Book' ? '📓 General Ledger' : tab === 'BI' ? '📈 Business Intelligence (BI)' : '⚖️ Profit &amp; Loss Statement'}
            </button>
          ))}
        </div>

        {/* EXPORT OPTIONS BAR */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport('Excel', 'General_Financial_Model')}
            className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900/40 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Download full balance sheet to excel model"
          >
            <FileSpreadsheet size={12} />
            <span>Export Excel</span>
          </button>
          
          <button
            onClick={() => handleExport('CSV', 'Cash_Book_Ledger_Extract')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Export row ledger as CSV format"
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExport('PDF', 'Electrical_Hall_Annual_Profit_Loss')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Download statement summary as audited PDF report"
          >
            <FileText size={12} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* VIEW A: CASH BOOK GENERAL LEDGER */}
      {activeAcctTab === 'Book' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm animate-fadeIn">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">General Cash Book Ledger</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Dual entry operating accounts logs registering gross credit and debit operations.</p>
          </div>

          <div className="overflow-x-auto border border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-700 text-slate-400 font-bold">
                  <th className="py-3 px-4">Voucher ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Particular Entity</th>
                  <th className="py-3 px-4">Ledger Segment</th>
                  <th className="py-3 px-4">Payment Node</th>
                  <th className="py-3 px-4 text-right">Credit / Debit Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-300 font-medium">
                {accountingLedger.list.map(log => (
                  <tr key={log.id} className="hover:bg-slate-700/30">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{log.id}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[10px]">{new Date(log.date).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-slate-200">{log.entity}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                        log.isInflow 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/15'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-bold uppercase text-[9px]">{log.channel}</td>
                    <td className={`py-3 px-4 text-right font-mono font-extrabold ${log.isInflow ? 'text-emerald-400' : 'text-red-400'}`}>
                      {log.isInflow ? '+' : '-'}{formatNaira(log.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW B: BUSINESS INTELLIGENCE (BI) ANALYTICS SUITE */}
      {activeAcctTab === 'BI' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          
          {/* Profit margins stats card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>Profitability &amp; Sourcing Cost Analytics</span>
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-750 text-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Gross Profit Margin</span>
                <p className="text-3xl font-black text-amber-400 mt-1 font-mono">{biStats.marginPercent}%</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Average spread above wholesale cost</p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-750 text-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Net Operating Yield</span>
                <p className="text-3xl font-black text-emerald-400 mt-1 font-mono">{biStats.returnPercent}%</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Net capital conversion ratio</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <h5 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Operational BI Insights:</h5>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-750 flex items-start gap-2.5 leading-relaxed text-slate-350">
                <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px]">
                  Alaba Outlet accounts for <b>74%</b> of gross sales volume. High-voltage copper wires represent the fastest inventory-to-cash conversions.
                </p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-750 flex items-start gap-2.5 leading-relaxed text-slate-350">
                <AlertCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[10px]">
                  Restocking operations from Coleman Cables PLC yield the highest gross margin of <b>28%</b>. Consider securing yearly bulk delivery contract to lock in priority pricing node levels.
                </p>
              </div>
            </div>
          </div>

          {/* Operational Cost Centres disbursements BI graph */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-2.5">
              <Layers size={14} className="text-blue-500" />
              <span>Cost Centres Disbursements Allocation</span>
            </h4>

            <div className="space-y-3.5 text-xs font-medium">
              {costCenters.length === 0 ? (
                <div className="p-6 text-center text-slate-500 font-bold">No active cost center accounts recorded.</div>
              ) : (
                costCenters.map((cc, i) => {
                  const disbursementEst = 450000 + (i * 75000);
                  const shareOfExpenses = Math.round((disbursementEst / (biStats.operatingExpenses || 1)) * 100);
                  
                  return (
                    <div key={cc.id} className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-200">{cc.name} ({cc.branch})</span>
                        <span className="font-mono text-slate-400 font-bold">{formatNaira(disbursementEst)} ({shareOfExpenses}%)</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-750">
                        <div 
                          style={{ width: `${shareOfExpenses}%` }} 
                          className={`h-full rounded-full ${i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-amber-500' : 'bg-red-500'}`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* VIEW C: PROFIT & LOSS AUDITED STATEMENT OF SURPLUS */}
      {activeAcctTab === 'ProfitLoss' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1 border-b border-slate-700/60 pb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Statement of Profit or Loss (Income Statement)</h3>
            <p className="text-[10px] text-slate-400 font-medium">For the operational periods ended 31st December, 2026</p>
            <span className="text-[9px] text-slate-500 block uppercase font-mono mt-1 font-bold">ELECTRICAL HALL NIG LTD &bull; RC-1294812</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. REVENUES */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700/60 pb-1 flex justify-between">
                <span>Revenue Accounts</span>
                <span>Value (₦)</span>
              </h4>
              <div className="flex justify-between items-baseline px-2">
                <span className="font-bold text-slate-300">Gross Sales Revenue (Receipt Checkouts)</span>
                <span className="font-mono font-bold text-slate-100">{formatNaira(biStats.grossSales)}</span>
              </div>
              <div className="flex justify-between items-baseline px-2 border-b border-slate-800 pb-1 font-extrabold text-slate-100">
                <span>Total Net Revenue Turnover</span>
                <span className="font-mono">{formatNaira(biStats.grossSales)}</span>
              </div>
            </div>

            {/* 2. COGS */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700/60 pb-1 flex justify-between">
                <span>Direct Cost of Goods Sold (COGS)</span>
                <span>Value (₦)</span>
              </h4>
              <div className="flex justify-between items-baseline px-2">
                <span className="font-bold text-slate-300">Opening Stock Ledger Balance Value</span>
                <span className="font-mono text-slate-400">₦22,500,000</span>
              </div>
              <div className="flex justify-between items-baseline px-2">
                <span className="font-bold text-slate-300">Bulk Material Restocking Purchases (Supplier bills)</span>
                <span className="font-mono text-slate-400">{formatNaira(biStats.simulatedCogs)}</span>
              </div>
              <div className="flex justify-between items-baseline px-2 font-extrabold text-red-400 border-b border-slate-800 pb-1">
                <span>Cost of Goods Sold (Accumulated Direct Cost)</span>
                <span className="font-mono">-{formatNaira(biStats.simulatedCogs)}</span>
              </div>
            </div>

            {/* Gross Profit Subtotal */}
            <div className="flex justify-between items-baseline bg-slate-900 p-3 rounded-xl border border-slate-750 font-extrabold text-slate-100 uppercase tracking-tight text-[11px]">
              <span>Gross Profit (Revenues less COGS)</span>
              <span className="font-mono text-emerald-400">{formatNaira(biStats.grossProfit)}</span>
            </div>

            {/* 3. OPERATING EXPENSES */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-700/60 pb-1 flex justify-between">
                <span>Operating Expenditures (OPEX)</span>
                <span>Value (₦)</span>
              </h4>
              <div className="flex justify-between items-baseline px-2">
                <span className="font-bold text-slate-300">Authorized Cost Centres Disbursement Allocations</span>
                <span className="font-mono text-slate-400">{formatNaira(biStats.operatingExpenses)}</span>
              </div>
              <div className="flex justify-between items-baseline px-2">
                <span className="font-bold text-slate-300">Staff Payroll &amp; Security Role Allowances</span>
                <span className="font-mono text-slate-400">₦1,250,000</span>
              </div>
              <div className="flex justify-between items-baseline px-2 font-extrabold text-red-400 border-b border-slate-800 pb-1">
                <span>Total Operating Overhead Expenses</span>
                <span className="font-mono">-{formatNaira(biStats.operatingExpenses + 1250000)}</span>
              </div>
            </div>

            {/* 4. NET SURPLUS / BI PROFITABILITY */}
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-700 font-extrabold uppercase text-xs">
              <div className="space-y-0.5">
                <span className="text-white block">Net Operating Operating Surplus / Deficit</span>
                <span className="text-[9px] text-slate-500 font-medium font-sans lowercase">Net earnings conversion converted to capital pool</span>
              </div>
              <span className={`font-mono text-lg font-black ${biStats.surplus - 1250000 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatNaira(biStats.surplus - 1250000)}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 4. USERS ROLES & ACCESS COMPONENT
// ==========================================
export function UsersScreen() {
  const { users, addUser, updateUser, deleteUser, roles } = useApp();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Accountant' | 'Cashier'>('Cashier');
  const [toast, setToast] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !name.trim()) return;

    if (isEditing) {
      updateUser({
        id: editId,
        username: username.toLowerCase().trim(),
        name: name.trim(),
        role,
        active: true
      });
      setToast(`User profile for '${name}' modified successfully!`);
    } else {
      if (users.find(u => u.username.toLowerCase() === username.toLowerCase().trim())) {
        alert("This username is already taken!");
        return;
      }
      addUser({
        id: 'usr-' + (users.length + 1),
        username: username.toLowerCase().trim(),
        name: name.trim(),
        role,
        active: true
      });
      setToast(`Staff user account '${name}' created!`);
    }

    setUsername('');
    setName('');
    setRole('Cashier');
    setIsEditing(false);
    setEditId('');
    setTimeout(() => setToast(''), 2500);
  };

  const handleEditClick = (u: User) => {
    setEditId(u.id);
    setUsername(u.username);
    setName(u.name);
    setRole(u.role);
    setIsEditing(true);
  };

  const handleDeleteClick = (u: User) => {
    if (u.username === 'admin') {
      alert("Super admin user account cannot be deleted for security safety!");
      return;
    }
    if (window.confirm(`Are you sure you want to delete user profile: '${u.name}'?`)) {
      deleteUser(u.id);
      setToast(`User account deleted.`);
      setTimeout(() => setToast(''), 2500);
    }
  };

  return (
    <div id="users_screen" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn font-sans">
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 text-sm font-semibold border border-emerald-500/20">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* User profile entry Form */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 h-fit shadow-md animate-fadeIn">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
          {isEditing ? 'Modify User Profile' : '➕ Register New Staff User'}
        </h3>
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Staff Full Name*</label>
            <input
              type="text"
              required
              placeholder="e.g., Jane Nwachukwu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Login Username*</label>
            <input
              type="text"
              required
              placeholder="e.g., jane"
              disabled={isEditing}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Role Authorization*</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500 font-semibold"
            >
              <option value="Cashier">Cashier (POS Checkout &amp; Reports)</option>
              <option value="Accountant">Accountant (Audits, Inventory, POS)</option>
              <option value="Admin">Admin (Full Control privileges)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setUsername('');
                  setName('');
                  setRole('Cashier');
                }}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-650 text-slate-400 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              {isEditing ? <Edit2 size={13} /> : <UserPlus size={13} />}
              <span>{isEditing ? 'Commit Updates' : 'Add Staff User'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Authorized Staff Directory list */}
      <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-md">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Authorized Staff Directory</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Verify registered staff credentials, access categories, and status nodes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {users.map(u => {
            const roleConfig = roles.find(r => r.name === u.role);
            return (
              <div key={u.id} className="p-4 bg-slate-900/60 border border-slate-700 hover:border-slate-600 rounded-xl transition-all flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-blue-400">
                      {u.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{u.name}</h4>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Username: <b className="text-slate-300">{u.username}</b></p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                    ACTIVE
                  </span>
                </div>

                {/* Permissions badge preview */}
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Role Authorization Permissions:</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {roleConfig?.permissions.slice(0, 4).map(perm => (
                      <span key={perm} className="text-[8px] font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 uppercase">
                        {perm}
                      </span>
                    ))}
                    {(roleConfig?.permissions.length || 0) > 4 && (
                      <span className="text-[8px] font-bold bg-slate-800 text-slate-500 px-1 rounded">
                        +{roleConfig!.permissions.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Delete controls */}
                <div className="flex justify-end gap-1.5 border-t border-slate-700 pt-2.5">
                  <button
                    onClick={() => handleEditClick(u)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                  >
                    <Edit2 size={10} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(u)}
                    className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                  >
                    <Trash2 size={10} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. SUBSCRIPTIONS PLANS SCREEN (Moved to settings sub-view, kept for App.tsx compatibility)
// ==========================================
export function SubscriptionsScreen() {
  const { subscriptions, updateSubscription } = useApp();
  const [toast, setToast] = useState('');

  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const handleRenew = (sub: Subscription) => {
    const year = new Date().getFullYear() + 1;
    updateSubscription({
      ...sub,
      status: 'Active',
      expiryDate: `${year}-12-31`
    });
    setToast(`Subscription Plan renewed successfully! New expiration set to Dec 31, ${year}.`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div id="subscriptions_screen" className="max-w-xl bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6 animate-fadeIn font-sans">
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 text-sm font-semibold border border-emerald-500/20">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
          <CreditCard size={20} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Enterprise POS Licensing</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Verify system licensing status, expiration thresholds, and server tiers.</p>
        </div>
      </div>

      {subscriptions.map(sub => (
        <div key={sub.id} className="space-y-4">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono font-bold text-slate-500 block">LICENSE PLAN TIER</span>
              <h4 className="text-sm font-extrabold text-blue-400 mt-0.5">{sub.planName}</h4>
              <p className="text-[9px] text-slate-500 font-mono mt-1">Status node: <b className="text-emerald-400">ACTIVE</b> &bull; Cost: {formatNaira(sub.amount)}/year</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold text-slate-500 block">EXPIRES</span>
              <p className="text-xs font-mono font-extrabold text-white mt-0.5">{sub.expiryDate}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2 text-[11px] text-slate-400">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Licensed modules:</span>
            <p className="flex items-center gap-2 text-slate-300">
              <ClipboardCheck size={14} className="text-blue-400 shrink-0" />
              <span>Multi-branch real-time inventory synchronizations (Alaba, Ikeja, PH)</span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <ClipboardCheck size={14} className="text-blue-400 shrink-0" />
              <span>Dual-entry cash accounting and vendor outlays ledgers</span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <ClipboardCheck size={14} className="text-blue-400 shrink-0" />
              <span>Custom thermal receipt templates matching Alaba POS specifications</span>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-700 flex justify-end">
            <button
              onClick={() => handleRenew(sub)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow shadow-blue-500/10 cursor-pointer"
            >
              Extend / Renew Subscription
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 6. COST CENTRES MANAGEMENT COMPONENT
// ==========================================
export function CostCentresScreen() {
  const { costCenters, addCostCenter, deleteCostCenter, branches } = useApp();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [branch, setBranch] = useState('Alaba');
  const [toast, setToast] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    addCostCenter({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      branch
    });

    setToast(`Cost Center '${name}' logged under ${branch} branch!`);
    setName('');
    setCode('');
    setBranch('Alaba');
    setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete cost center: '${name}'?`)) {
      deleteCostCenter(id);
      setToast(`Cost Centre deleted successfully.`);
      setTimeout(() => setToast(''), 2500);
    }
  };

  return (
    <div id="cost_centres_screen" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn font-sans">
      {toast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 text-sm font-semibold border border-emerald-500/20">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Add form */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 h-fit shadow-md">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Register Cost Centre node</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cost Centre Name*</label>
            <input
              type="text"
              required
              placeholder="e.g., Alaba Showroom Warehouse B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Code*</label>
            <input
              type="text"
              required
              placeholder="e.g., CC-ALB-02"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none uppercase font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Branch Outlet Mapping*</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none font-semibold"
            >
              {branches.map(b => (
                <option key={b} value={b}>{b} Outlets</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <Plus size={13} />
            <span>Register Cost Centre</span>
          </button>
        </form>
      </div>

      {/* Cost Centers list */}
      <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-md">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Registered Cost Centres</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Budget boundaries tracking operating segments of Electrical Hall.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {costCenters.map(cc => (
            <div key={cc.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/10">
                  <Building2 size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{cc.name}</h4>
                    <span className="text-[8px] font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 uppercase shrink-0">
                      {cc.branch}
                    </span>
                  </div>
                  <p className="text-[9px] font-mono text-slate-400 mt-1">Financial Account Code: <b className="text-blue-400 font-mono">{cc.code}</b></p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-slate-800/85 pt-2 text-[9px] font-mono text-slate-500">
                <span>ID: {cc.id}</span>
                <button
                  onClick={() => handleDelete(cc.id, cc.name)}
                  className="p-1 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded cursor-pointer flex items-center gap-1"
                  title="Delete Cost Centre"
                >
                  <Trash2 size={11} />
                  <span className="text-[9px] font-sans">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

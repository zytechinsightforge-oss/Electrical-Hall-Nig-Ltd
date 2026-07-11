import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, ShoppingCart, Plus, Minus, Trash2, 
  CreditCard, Check, Printer, FileText, UserPlus, 
  MapPin, RefreshCcw, Tag, PackageOpen, Download
} from 'lucide-react';
import { Product, TransactionItem, PaymentMethod, Transaction } from '../types';

export default function POS() {
  const { products, categories, costCenters, addTransaction, currentUser, settings } = useApp();

  // Search and Category filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Cart State
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState('Walking Customer');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [selectedCostCenter, setSelectedCostCenter] = useState(costCenters[0]?.name || 'Alaba Main Branch');

  // Active Receipt Modal
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  // Helper format Naira
  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Filtered products for grid
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Cart helper calculations
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = 0; // Tax or other charge can be optional or 0 for direct Alaba deals
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  // POS Add to Cart
  const handleAddToCart = (product: Product) => {
    if (product.quantity <= 0) {
      alert("This item is currently OUT OF STOCK and cannot be added.");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        // Guard against adding more than inventory
        if (existing.quantity >= product.quantity) {
          alert(`Insufficient inventory. Only ${product.quantity} units are available.`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Decrement item
  const handleDecrement = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  // Increment item
  const handleIncrement = (productId: string, maxQty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        if (existing.quantity >= maxQty) {
          alert(`Insufficient stock. Only ${maxQty} units are in inventory.`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return prev;
    });
  };

  // Remove item
  const handleRemove = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Empty cart
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to discard the current cart?")) {
      setCart([]);
      setCustomerName('Walking Customer');
    }
  };

  // Complete sale
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add products to check out.");
      return;
    }

    // Prepare transaction items
    const items: TransactionItem[] = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity
    }));

    // Find branch of chosen cost center
    const matchingCc = costCenters.find(cc => cc.name === selectedCostCenter);
    const branch = matchingCc ? matchingCc.branch : 'Alaba';

    // Commit Transaction
    const newTx = addTransaction({
      customerName: customerName.trim() || 'Walking Customer',
      items,
      total: cartTotals.total,
      paymentMethod,
      cashierName: currentUser?.name || 'System Operator',
      costCenter: selectedCostCenter,
      branch
    });

    // Show Receipt
    setCompletedTx(newTx);
    
    // Clear state
    setCart([]);
    setCustomerName('Walking Customer');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const downloadReceiptTxt = (tx: Transaction) => {
    const lines = [
      "========================================",
      `       ${settings.name.toUpperCase()}`,
      `       RC: ${settings.rcNumber || "N/A"}`,
      `       ${settings.address || "N/A"}`,
      `       Tel: ${settings.phone || "N/A"}`,
      "========================================",
      `INVOICE ID:  ${tx.id}`,
      `DATE:        ${new Date(tx.date).toLocaleString()}`,
      `CLIENT:      ${tx.customerName.toUpperCase()}`,
      `OPERATOR:    ${tx.cashierName.toUpperCase()}`,
      `COST CENTRE: ${tx.costCenter.toUpperCase()}`,
      "----------------------------------------",
      "ITEM                 QTY       TOTAL",
      "----------------------------------------",
      ...tx.items.map(item => {
        const namePart = item.name.substring(0, 18).padEnd(20, " ");
        const qtyPart = item.quantity.toString().padEnd(10, " ");
        const pricePart = ("₦" + item.subtotal.toLocaleString()).padStart(10, " ");
        return namePart + qtyPart + pricePart;
      }),
      "----------------------------------------",
      `SUBTOTAL:             ₦${tx.total.toLocaleString()}`,
      "TAX / VAT:            ₦0",
      `TOTAL PAID:           ₦${tx.total.toLocaleString()}`,
      `METHOD:               ${tx.paymentMethod.toUpperCase()}`,
      "========================================",
      "      THANK YOU FOR YOUR PATRONAGE!     ",
      " Goods purchased in good condition are  ",
      "            not returnable.             ",
      "========================================",
    ];
    
    const blob = new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Receipt_${tx.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div id="pos_view" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)] lg:h-[calc(100vh-70px)] overflow-hidden font-sans">
      
      {/* LEFT AREA: PRODUCTS GRID AND FILTERS (9 cols on lg) */}
      <div className="lg:col-span-7 flex flex-col h-full bg-slate-800 border border-slate-700 rounded-2xl p-4 overflow-hidden">
        
        {/* Filters and search header */}
        <div className="space-y-3 shrink-0 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products by SKU, item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-3 text-slate-600" size={14} />
            </div>
            
            {/* Quick reset search button */}
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-white text-xs bg-slate-700 px-3 py-2 rounded-lg cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontal Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start scrollbar-thin">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => {
              const isLowStock = p.quantity <= 15;
              const isOutOfStock = p.quantity <= 0;
              const qtyInCart = cart.find(item => item.product.id === p.id)?.quantity || 0;

              return (
                <button
                  key={p.id}
                  onClick={() => handleAddToCart(p)}
                  disabled={isOutOfStock}
                  className={`relative flex flex-col justify-between text-left p-3.5 bg-slate-900/60 hover:bg-slate-900 border rounded-xl transition-all cursor-pointer select-none group h-40 ${
                    isOutOfStock 
                      ? 'border-red-500/10 opacity-40 cursor-not-allowed' 
                      : qtyInCart > 0 
                      ? 'border-blue-500 bg-blue-500/5 hover:bg-blue-500/5'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {/* Badge */}
                  {qtyInCart > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-blue-600 border border-slate-850 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white animate-scaleIn shadow shadow-blue-600/30">
                      {qtyInCart}
                    </span>
                  )}

                  <div className="space-y-1 w-full min-w-0">
                    <div className="flex justify-between items-start gap-1 w-full">
                      <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase block truncate max-w-[100px]">{p.sku}</span>
                      {isOutOfStock ? (
                        <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1 rounded font-bold uppercase">OUT</span>
                      ) : isLowStock ? (
                        <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded font-bold uppercase">LOW</span>
                      ) : null}
                    </div>
                    <h3 className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed tracking-tight group-hover:text-white">
                      {p.name}
                    </h3>
                  </div>

                  <div className="mt-2 w-full flex items-end justify-between border-t border-slate-800 pt-2 shrink-0">
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium">1 {p.unit}</p>
                      <p className="text-xs font-mono font-extrabold text-emerald-400">{formatNaira(p.price)}</p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 font-semibold">{p.quantity} left</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 border border-slate-600">
                <PackageOpen size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400">No matching products found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search queries or selecting other categories.</p>
              </div>
            </div>
          )}
        </div>

        {/* Selected count stats footer */}
        <div className="shrink-0 pt-3 border-t border-slate-700 mt-3 flex justify-between items-center text-[10px] text-slate-500 font-medium">
          <span>Loaded Grid: <b>{filteredProducts.length}</b> products</span>
          <span>Category filter: <b>{selectedCategory}</b></span>
        </div>

      </div>

      {/* RIGHT AREA: CHECKOUT CART TERMINAL (5 cols on lg) */}
      <div className="lg:col-span-5 flex flex-col h-full bg-slate-800 border border-slate-700 rounded-2xl p-4 overflow-hidden">
        
        {/* Cart Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-blue-500" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Checkout Terminal</h2>
          </div>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-[10px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={11} />
              <span>Reset Cart</span>
            </button>
          )}
        </div>

        {/* Checkout input parameters */}
        <div className="shrink-0 space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700 mb-3">
          {/* Customer input */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Customer Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walking Customer"
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Cost center branch selection */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Cost Centre (Log)</label>
              <select
                value={selectedCostCenter}
                onChange={(e) => setSelectedCostCenter(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-blue-500"
              >
                {costCenters.map(cc => (
                  <option key={cc.id} value={cc.name}>{cc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment dropdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Payment Channel</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash', 'Transfer', 'Card'] as PaymentMethod[]).map(pm => {
                const isSelected = paymentMethod === pm;
                return (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow shadow-blue-600/10' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {pm}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cart Item rows - scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-2 border-b border-slate-700/60 pb-3 scrollbar-thin">
          {cart.length > 0 ? (
            cart.map(item => (
              <div 
                key={item.product.id}
                className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors animate-scaleIn"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {formatNaira(item.product.price)} &bull; sub: {formatNaira(item.product.price * item.quantity)}
                  </p>
                </div>

                {/* Adjust quantities */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDecrement(item.product.id)}
                    className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-xs font-mono font-extrabold text-white min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrement(item.product.id, item.product.quantity)}
                    className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus size={11} />
                  </button>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center transition-colors ml-1.5 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <ShoppingCart size={32} className="opacity-30 mb-2 animate-bounce" />
              <p className="text-xs font-bold uppercase tracking-wider">Active Cart Empty</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[180px] leading-relaxed mx-auto">Select electrical equipment from left grid to build customer invoice.</p>
            </div>
          )}
        </div>

        {/* Totals readouts & checkout button */}
        <div className="shrink-0 space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-700">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Subtotal Amount</span>
              <span className="font-mono">{formatNaira(cartTotals.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>VAT / Service Tax (0%)</span>
              <span className="font-mono">₦0</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-white font-bold text-sm">
              <span className="uppercase tracking-wider">Total Payable</span>
              <span className="font-mono text-emerald-400 text-base">{formatNaira(cartTotals.total)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/15 transition-all transform active:translate-y-0 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check size={14} />
            <span>Process Payment &amp; Print</span>
          </button>
        </div>

      </div>

      {/* THERMAL RECEIPT PRINTING DIALOG / OVERLAY MODAL */}
      {completedTx && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div id="printable-area-active" className="bg-white text-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 relative flex flex-col font-mono text-xs shadow-black border border-slate-300 max-h-[90vh] overflow-y-auto animate-scaleIn">
            
            {/* Header / Brand details */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-4 mb-4">
              <div className="flex justify-center mb-1">
                {settings.logo && (settings.logo.startsWith('data:image') || settings.logo.startsWith('http') || settings.logo.length > 8) ? (
                  <img src={settings.logo} alt="Logo" className="w-24 h-24 object-cover rounded-lg" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-5xl">{settings.logo || '🔌'}</span>
                )}
              </div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide">{settings.name}</h3>
              {settings.rcNumber && <p className="text-[10px] text-slate-600">RC: {settings.rcNumber}</p>}
              <p className="text-[10px] text-slate-500">{settings.address || 'Plot 14, Alaba Market, Lagos'}</p>
              <p className="text-[10px] text-slate-500">Tel: {settings.phone || '+234 803 123 4567'}</p>
            </div>

            {/* Audit data */}
            <div className="space-y-1 border-b border-dashed border-slate-400 pb-3 mb-3 text-[10px]">
              <div className="flex justify-between">
                <span>INVOICE ID:</span>
                <span className="font-bold">{completedTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE:</span>
                <span>{new Date(completedTx.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>CLIENT:</span>
                <span className="font-bold uppercase">{completedTx.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>OPERATOR:</span>
                <span>{completedTx.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>COST CENTRE:</span>
                <span>{completedTx.costCenter}</span>
              </div>
            </div>

            {/* Items details table */}
            <div className="border-b border-dashed border-slate-400 pb-3 mb-3">
              <div className="grid grid-cols-12 font-bold mb-1 border-b border-slate-300 pb-1 text-[10px]">
                <span className="col-span-6">ITEM</span>
                <span className="col-span-2 text-center">QTY</span>
                <span className="col-span-4 text-right">TOTAL</span>
              </div>
              <div className="space-y-2">
                {completedTx.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 text-[10px] leading-tight">
                    <div className="col-span-6">
                      <p className="font-semibold truncate">{item.name}</p>
                      <p className="text-[9px] text-slate-500">@{formatNaira(item.price)}</p>
                    </div>
                    <span className="col-span-2 text-center font-bold">{item.quantity}</span>
                    <span className="col-span-4 text-right font-bold">{formatNaira(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals summary */}
            <div className="space-y-1.5 text-right font-bold text-[10px] border-b border-dashed border-slate-400 pb-3 mb-3">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>{formatNaira(completedTx.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>TAX / VAT:</span>
                <span>₦0</span>
              </div>
              <div className="flex justify-between text-xs font-extrabold border-t border-slate-200 pt-1.5">
                <span>TOTAL PAID:</span>
                <span>{formatNaira(completedTx.total)}</span>
              </div>
              <div className="flex justify-between font-normal text-[9px] text-slate-500 mt-1">
                <span>METHOD:</span>
                <span className="font-bold text-slate-800 uppercase">{completedTx.paymentMethod}</span>
              </div>
            </div>

            {/* Footer thank you message */}
            <div className="text-center space-y-1 py-1 text-[10px]">
              <p className="font-bold">THANK YOU FOR YOUR PATRONAGE!</p>
              <p className="text-slate-500">Goods purchased in good condition are not returnable.</p>
              <p className="text-[8px] text-slate-400 mt-2 font-mono">System by Electrical Hall POS &bull; Verified</p>
            </div>

            {/* Print & Action Row */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-2 shrink-0 print-hide">
              <div className="flex gap-2">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer size={12} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => downloadReceiptTxt(completedTx)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download TXT</span>
                </button>
              </div>
              <button
                onClick={() => setCompletedTx(null)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/10"
              >
                <FileText size={12} />
                <span>New Sale (Close)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

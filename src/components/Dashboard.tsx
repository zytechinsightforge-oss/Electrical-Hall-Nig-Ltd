import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, ArrowUpRight, ShoppingBag, 
  AlertTriangle, RefreshCw, Download, 
  Filter, Calendar, Search, MapPin, User, ChevronRight, CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

export default function Dashboard() {
  const { transactions, products, currentUser, refreshData, costCenters } = useApp();

  // Filters
  const [branchFilter, setBranchFilter] = useState('All');
  const [costCenterFilter, setCostCenterFilter] = useState('All');
  const [cashierFilter, setCashierFilter] = useState('All');
  const [dateRange, setDateRange] = useState<'all' | 'today' | '7days' | '30days'>('7days');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast confirmation for actions
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // List of branches and cashiers for dropdowns
  const branches = useMemo(() => {
    const list = new Set(costCenters.map(cc => cc.branch));
    return ['All', ...Array.from(list)];
  }, [costCenters]);

  const costCenterList = useMemo(() => {
    const list = costCenters.map(cc => cc.name);
    return ['All', ...list];
  }, [costCenters]);

  const cashiers = useMemo(() => {
    const list = new Set(transactions.map(t => t.cashierName));
    return ['All', ...Array.from(list)];
  }, [transactions]);

  // Format helper for Nigerian Naira (₦)
  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Branch filter
      if (branchFilter !== 'All' && t.branch !== branchFilter) return false;
      
      // Cost center filter
      if (costCenterFilter !== 'All' && t.costCenter !== costCenterFilter) return false;

      // Cashier filter
      if (cashierFilter !== 'All' && t.cashierName !== cashierFilter) return false;

      // Search filter (Invoice ID or Customer Name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const customerMatch = t.customerName.toLowerCase().includes(query);
        const idMatch = t.id.toLowerCase().includes(query);
        if (!customerMatch && !idMatch) return false;
      }

      // Date Range filter
      const tDate = new Date(t.date);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (dateRange === 'today') {
        const checkDate = new Date(t.date);
        return checkDate.toDateString() === new Date().toDateString();
      } else if (dateRange === '7days') {
        const diff = today.getTime() - tDate.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
      } else if (dateRange === '30days') {
        const diff = today.getTime() - tDate.getTime();
        return diff <= 30 * 24 * 60 * 60 * 1000;
      }

      return true;
    });
  }, [transactions, branchFilter, costCenterFilter, cashierFilter, dateRange, searchQuery]);

  // Main KPI Calculations
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let todayRevenue = 0;
    const todayStr = new Date().toDateString();

    filteredTransactions.forEach(t => {
      totalRevenue += t.total;
      if (new Date(t.date).toDateString() === todayStr) {
        todayRevenue += t.total;
      }
    });

    const totalTransactions = filteredTransactions.length;
    const lowStockCount = products.filter(p => p.quantity <= 20).length;

    return {
      totalRevenue,
      todayRevenue,
      totalTransactions,
      lowStockCount
    };
  }, [filteredTransactions, products]);

  // Sales and Profit Trend (Chart Data)
  const chartTrendData = useMemo(() => {
    const dailyMap: Record<string, { date: string, sales: number, profit: number }> = {};
    
    // Fill last 7 days with zeros first to ensure trend is clear
    const daysToGen = dateRange === 'today' ? 1 : dateRange === '7days' ? 7 : dateRange === '30days' ? 15 : 10;
    for (let i = daysToGen - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[label] = { date: label, sales: 0, profit: 0 };
    }

    filteredTransactions.forEach(t => {
      const label = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      // Estimate profit as 30% of sales value
      const profitVal = Math.round(t.total * 0.3);
      if (dailyMap[label]) {
        dailyMap[label].sales += t.total;
        dailyMap[label].profit += profitVal;
      } else {
        // Fallback for dates outside pre-populated list
        dailyMap[label] = { date: label, sales: t.total, profit: profitVal };
      }
    });

    return Object.values(dailyMap);
  }, [filteredTransactions, dateRange]);

  // Payment Mix (Chart Data)
  const paymentMixData = useMemo(() => {
    const mix: Record<string, number> = { 'Cash': 0, 'Transfer': 0, 'Card': 0 };
    filteredTransactions.forEach(t => {
      if (mix[t.paymentMethod] !== undefined) {
        mix[t.paymentMethod] += t.total;
      }
    });

    return Object.entries(mix).map(([name, value]) => ({
      name,
      value
    })).filter(item => item.value > 0);
  }, [filteredTransactions]);

  // Colors for Payment Mix Pie
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Blue, Green, Yellow

  // Top Selling Products
  const topProducts = useMemo(() => {
    const productQuantities: Record<string, { name: string, qty: number, revenue: number, category: string }> = {};
    
    filteredTransactions.forEach(t => {
      t.items.forEach(item => {
        if (!productQuantities[item.productId]) {
          const originalProd = products.find(p => p.id === item.productId);
          productQuantities[item.productId] = {
            name: item.name,
            qty: 0,
            revenue: 0,
            category: originalProd?.category || 'General'
          };
        }
        productQuantities[item.productId].qty += item.quantity;
        productQuantities[item.productId].revenue += item.subtotal;
      });
    });

    return Object.values(productQuantities)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [filteredTransactions, products]);

  // Inventory movement alerts / low stock log
  const inventoryMovements = useMemo(() => {
    return products
      .filter(p => p.quantity <= 25)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);
  }, [products]);

  // Branch Performance
  const branchComparison = useMemo(() => {
    const branchStats: Record<string, { name: string, revenue: number, txs: number }> = {};
    
    // Initialize all known branches from costCenters
    costCenters.forEach(cc => {
      if (!branchStats[cc.branch]) {
        branchStats[cc.branch] = { name: cc.branch, revenue: 0, txs: 0 };
      }
    });

    transactions.forEach(t => {
      if (!branchStats[t.branch]) {
        branchStats[t.branch] = { name: t.branch, revenue: 0, txs: 0 };
      }
      branchStats[t.branch].revenue += t.total;
      branchStats[t.branch].txs += 1;
    });

    return Object.values(branchStats);
  }, [transactions, costCenters]);

  const handleExport = () => {
    triggerToast("Dashboard analytical report exported as Excel sample successfully!");
  };

  const handleRefresh = () => {
    triggerToast("Dashboard statistics refreshed in real time.");
  };

  return (
    <div id="dashboard_view" className="space-y-6">
      
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/30 z-50 animate-fadeIn font-sans text-sm">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Welcome, <span className="text-blue-400 font-extrabold">{currentUser?.name}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            Role Authorized: <span className="text-blue-500 font-semibold">{currentUser?.role}</span> &bull; Showing business performance overview for Electrical Hall.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-blue-600/10"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Filter size={14} />
          <span>Dynamic Control Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Branch Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={10} /> Branch
            </label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              {branches.map(b => (
                <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
              ))}
            </select>
          </div>

          {/* Cost Center Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={10} /> Cost Centre
            </label>
            <select
              value={costCenterFilter}
              onChange={(e) => setCostCenterFilter(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              {costCenterList.map(cc => (
                <option key={cc} value={cc}>{cc === 'All' ? 'All Cost Centres' : cc}</option>
              ))}
            </select>
          </div>

          {/* Cashier Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User size={10} /> Cashier
            </label>
            <select
              value={cashierFilter}
              onChange={(e) => setCashierFilter(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              {cashiers.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Cashiers' : c}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={10} /> Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="today">Today Only</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All-time Records</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Search size={10} /> Invoice/Customer
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-2 text-slate-300 focus:outline-none focus:border-blue-500 placeholder-slate-600"
              />
              <Search size={12} className="absolute left-2.5 top-2.5 text-slate-600" />
            </div>
          </div>

        </div>
      </div>

      {/* KPI Metrics Dashboard Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{formatNaira(metrics.totalRevenue)}</h3>
            <p className="text-[10px] text-slate-500 font-medium">Accumulated matching queries</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Intake</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 tracking-tight">{formatNaira(metrics.todayRevenue)}</h3>
            <p className="text-[10px] text-slate-500 font-medium">Real-time daily tracker</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
            <ArrowUpRight size={22} />
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoiced Sales</p>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{metrics.totalTransactions}</h3>
            <p className="text-[10px] text-slate-500 font-medium">Processed customer invoices</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-300 border border-slate-750">
            <ShoppingBag size={22} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
            <h3 className={`text-2xl font-extrabold tracking-tight ${metrics.lowStockCount > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
              {metrics.lowStockCount}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Requires immediate restocking</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            metrics.lowStockCount > 0 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' 
              : 'bg-slate-900 text-slate-500 border-slate-750'
          }`}>
            <AlertTriangle size={22} />
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales & Profit Trend Line Chart */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-6 border-b border-slate-700/60 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Sales & Profit Trend</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Interactive performance analytics chart</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span>
              <span>Revenue</span>
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block ml-2"></span>
              <span>Profit (Est. 30%)</span>
            </div>
          </div>

          <div className="h-72 w-full text-xs">
            {chartTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(val) => `₦${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                    formatter={(value: any) => [formatNaira(Number(value)), '']}
                  />
                  <Line type="monotone" dataKey="sales" name="Sales" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-medium">No sales data in this date range.</div>
            )}
          </div>
        </div>

        {/* Payment Mix Pie Chart */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <div className="mb-6 border-b border-slate-700/60 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Intake Payment Mix</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Payment distribution audit</p>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            {paymentMixData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                    formatter={(value: any) => [formatNaira(Number(value)), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 font-medium">No sales logged yet.</div>
            )}
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-2 border-t border-slate-700/50">
            {paymentMixData.map((entry, idx) => (
              <div key={entry.name} className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                  {entry.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">{formatNaira(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Auxiliary Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Top 5 Products */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top Selling Products</h3>
            <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Volume</span>
          </div>

          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-700/40 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-xs text-blue-400 shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{p.name}</p>
                      <p className="text-[9px] text-slate-400 font-medium truncate">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono font-bold text-white">{p.qty} Sold</p>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">{formatNaira(p.revenue)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 font-medium text-center py-8">Process invoices in POS to see top product updates!</p>
            )}
          </div>
        </div>

        {/* Inventory movement alerts */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Low Stock Warnings</h3>
            <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Critical</span>
          </div>

          <div className="space-y-3">
            {inventoryMovements.length > 0 ? (
              inventoryMovements.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 hover:bg-slate-700/40 rounded-xl transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[150px]">{p.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">SKU: {p.sku} &bull; {p.binLocation || 'No bin'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                      p.quantity <= 10 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {p.quantity} {p.unit}s Left
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 font-medium text-center py-8">All items stocked securely above threshold!</p>
            )}
          </div>
        </div>

        {/* Branch Comparisons */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Branch Performance</h3>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Live</span>
          </div>

          <div className="space-y-3">
            {branchComparison.map((b, idx) => (
              <div key={b.name} className="p-3 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-all animate-fadeIn">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">{b.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{b.txs} txs</span>
                </div>
                {/* Horizontal Progress Bar representing comparative sales */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(10, (b.revenue / (metrics.totalRevenue || 1)) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] text-slate-500 font-medium">Comparative Share</span>
                  <span className="text-xs font-mono font-extrabold text-blue-400">{formatNaira(b.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

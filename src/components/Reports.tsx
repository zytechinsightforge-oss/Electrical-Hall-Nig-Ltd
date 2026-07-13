import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, BarChart3, Receipt, Landmark, 
  Download, Printer, FileSpreadsheet, FileText, CheckCircle2, 
  MapPin, Coins, ArrowUpRight, ArrowDownRight, Layers, Box
} from 'lucide-react';

export default function Reports() {
  const { transactions, products, categories, supplierTransactions } = useApp();
  const [activeReport, setActiveReport] = useState<'Sales' | 'Stock' | 'Profits' | 'Expenses' | 'Credits'>('Sales');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  // Report calculations - 1. Stock Value by Category (Selling Price Value)
  const stockValueByCategory = useMemo(() => {
    const map: Record<string, { category: string, value: number, count: number }> = {};
    
    // Initialize with all known categories
    categories.forEach(c => {
      map[c.name] = { category: c.name, value: 0, count: 0 };
    });

    products.forEach(p => {
      const segValue = p.quantity * p.price;
      if (map[p.category]) {
        map[p.category].value += segValue;
        map[p.category].count += p.quantity;
      } else {
        map[p.category] = { category: p.category, value: segValue, count: p.quantity };
      }
    });

    return Object.values(map).filter(item => item.value > 0);
  }, [products, categories]);

  // Report calculations - 2. Sales Volume by Category
  const salesByCategory = useMemo(() => {
    const map: Record<string, { name: string, value: number, qty: number }> = {};
    
    // Initialize
    categories.forEach(c => {
      map[c.name] = { name: c.name, value: 0, qty: 0 };
    });

    transactions.forEach(t => {
      t.items.forEach(item => {
        // Find product category
        const originalProd = products.find(p => p.id === item.productId);
        const catName = originalProd?.category || 'General';
        
        if (map[catName]) {
          map[catName].value += item.subtotal;
          map[catName].qty += item.quantity;
        } else {
          map[catName] = { name: catName, value: item.subtotal, qty: item.quantity };
        }
      });
    });

    return Object.values(map).filter(item => item.value > 0);
  }, [transactions, products, categories]);

  // Report calculations - 3. Stock Value over Time (Simulated Progress representing seasonality)
  const stockValueTrend = useMemo(() => {
    // We compute total current stock value as baseline
    const currentVal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    // Simulate preceding months values back from baseline
    return [
      { month: 'Jan', value: Math.round(currentVal * 0.72) },
      { month: 'Feb', value: Math.round(currentVal * 0.81) },
      { month: 'Mar', value: Math.round(currentVal * 0.78) },
      { month: 'Apr', value: Math.round(currentVal * 0.85) },
      { month: 'May', value: Math.round(currentVal * 0.92) },
      { month: 'Jun', value: Math.round(currentVal * 0.96) },
      { month: 'Jul', value: currentVal },
    ];
  }, [products]);

  // Reports - Credits / Debtor Balances
  const customerCredits = useMemo(() => {
    return [
      { id: 'CR-101', customer: 'Obinna Contractor Ltd', phone: '+234 812 345 6789', creditLimit: 500000, outstanding: 280000, dueDate: '2026-07-25', status: 'Active' },
      { id: 'CR-102', customer: 'Grace Electrical Outlet', phone: '+234 905 111 2222', creditLimit: 300000, outstanding: 125000, dueDate: '2026-08-01', status: 'Active' },
      { id: 'CR-103', customer: 'Engr. Kolawole Ikeja Project', phone: '+234 803 444 5555', creditLimit: 1000000, outstanding: 680000, dueDate: '2026-07-15', status: 'Overdue' },
      { id: 'CR-104', customer: 'Walking Contractor B', phone: '+234 703 666 7777', creditLimit: 200000, outstanding: 45000, dueDate: '2026-08-10', status: 'Active' },
    ];
  }, []);

  // Compute total outstanding receivables
  const totalOutstandingCredits = useMemo(() => {
    return customerCredits.reduce((sum, c) => sum + c.outstanding, 0);
  }, [customerCredits]);

  // Reports - Procurement Expenses Logs from Suppliers
  const expensesLedger = useMemo(() => {
    return supplierTransactions.filter(tx => tx.type === 'purchase');
  }, [supplierTransactions]);

  const totalProcurementExpenses = useMemo(() => {
    return expensesLedger.reduce((sum, tx) => sum + tx.amount, 0);
  }, [expensesLedger]);

  // Net Profit Margins
  const profitReportData = useMemo(() => {
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const estimatedCOGS = totalSales * 0.7; // Cost of Goods Sold is ~70% of electrical selling price
    const operationalOverheads = 120000; // Electricity, rent, Alaba dues
    const grossProfit = totalSales - estimatedCOGS;
    const netProfit = grossProfit - operationalOverheads;

    return {
      totalSales,
      estimatedCOGS,
      operationalOverheads,
      grossProfit,
      netProfit,
      marginPercent: Math.round((netProfit / (totalSales || 1)) * 100)
    };
  }, [transactions]);

  // Excel, PDF simulations
  const handleExport = (fileType: 'Excel' | 'PDF') => {
    triggerToast(`${activeReport} Report compiled successfully and exported as ${fileType}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports_view" className="space-y-6 font-sans">
      
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/30 z-50 animate-fadeIn text-sm font-semibold">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reports Header & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={22} />
            <span>Interactive Reporting visualizer</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Analyze Alaba warehouse business performance, stock positioning, credits, and capital balances in real-time.
          </p>
        </div>

        {/* Report Selector Tab Group */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/60">
          {(['Sales', 'Stock', 'Profits', 'Expenses', 'Credits'] as const).map(report => (
            <button
              key={report}
              onClick={() => setActiveReport(report)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeReport === report
                  ? 'bg-blue-600 text-white font-semibold shadow shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {report === 'Sales' ? 'Sales Reports' : report === 'Stock' ? 'Stock Position' : report}
            </button>
          ))}
        </div>
      </div>

      {/* Export & Print actions toolbar */}
      <div className="flex items-center justify-between bg-slate-900 px-5 py-3 rounded-xl border border-slate-850/80">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Active sheet: <b className="text-blue-400">{activeReport} Analysis</b>
        </span>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('Excel')}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
          >
            <FileSpreadsheet size={13} className="text-emerald-500" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
          >
            <FileText size={13} className="text-red-400" />
            <span className="hidden sm:inline">PDF Report</span>
          </button>
          <button 
            onClick={handlePrint}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Print Sheet</span>
          </button>
        </div>
      </div>

      {/* REPORT SHEETS RENDERING ENGINE */}

      {/* 1. SALES REPORTS SEGMENT */}
      {activeReport === 'Sales' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sales Revenue distribution by category */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div className="mb-4 border-b border-slate-850 pb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Revenue Breakdown by Category Segment</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">Naira value allocation across wires, lighting, sockets, switchgears.</p>
              </div>

              <div className="h-64">
                {salesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                        formatter={(value: any) => [formatNaira(Number(value)), 'Revenue']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600">No Sales items computed yet.</div>
                )}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-850">
                {salesByCategory.map((entry, idx) => (
                  <div key={entry.name} className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1.5 truncate max-w-[120px]">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      {entry.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-extrabold shrink-0">{formatNaira(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Sales Volume Contribution Bar Chart */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div className="mb-4 border-b border-slate-850 pb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Product Units Sold by Segment</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">Physical product volumes dispatched (Rolls/Pieces).</p>
              </div>

              <div className="h-64 text-xs font-mono">
                {salesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesByCategory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                        formatter={(value: any) => [`${value} Units`, 'Quantity Sold']}
                      />
                      <Bar dataKey="qty" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600">No Sales items logged.</div>
                )}
              </div>
            </div>

          </div>

          {/* Historical detailed table log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Processed Invoices Audit</h3>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4 font-bold">Invoice ID</th>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Customer</th>
                    <th className="py-3 px-4 font-bold">Cost Centre</th>
                    <th className="py-3 px-4 font-bold text-center">Items</th>
                    <th className="py-3 px-4 font-bold">Method</th>
                    <th className="py-3 px-4 font-bold text-right">Invoiced (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-850/30">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">{t.id}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-bold text-slate-200">{t.customerName}</td>
                      <td className="py-3 px-4 text-slate-400">{t.costCenter}</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-400">{t.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                      <td className="py-3 px-4 font-bold text-slate-500 uppercase text-[10px]">{t.paymentMethod}</td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-400">{formatNaira(t.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2. STOCK POSITION SEGMENT */}
      {activeReport === 'Stock' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Stock Value by Category (Bar Chart) */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div className="mb-4 border-b border-slate-850 pb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Asset Stock Value by Segment (₦)</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">Asset values calculated as `in-stock quantity * unit selling price`.</p>
              </div>

              <div className="h-64 text-xs font-mono">
                {stockValueByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockValueByCategory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} tickLine={false} tickFormatter={(val) => `₦${val/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                        formatter={(value: any) => [formatNaira(Number(value)), 'Shelf Value']}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                        {stockValueByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600">No Inventory found.</div>
                )}
              </div>
            </div>

            {/* Stock Value over Time trend (Area Chart representing seasonality) */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div className="mb-4 border-b border-slate-850 pb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Inventory Capital Valuation progress (YTD)</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">Comparative capital allocation sitting on shelves over preceding months.</p>
              </div>

              <div className="h-64 text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockValueTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} tickFormatter={(val) => `₦${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                      formatter={(value: any) => [formatNaira(Number(value)), 'Asset Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Quick Breakdown table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Asset Valuation Summary Sheet</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stockValueByCategory.map((sc, idx) => (
                <div key={sc.category} className="p-4 bg-slate-950/60 rounded-xl border border-slate-855 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">{sc.category}</span>
                    <h4 className="text-sm font-extrabold text-white mt-1">{formatNaira(sc.value)}</h4>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{sc.count} total pieces in-stock</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 font-bold text-xs" style={{ color: COLORS[(idx + 2) % COLORS.length] }}>
                    #0{idx+1}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3. PROFITS AUDITING SEGMENT */}
      {activeReport === 'Profits' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Profit Breakdown metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Sales Revenue</p>
              <h3 className="text-xl font-extrabold text-white">{formatNaira(profitReportData.totalSales)}</h3>
              <p className="text-[9px] text-slate-500">Gross inflows from invoiced items</p>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estimated COGS (70%)</p>
              <h3 className="text-xl font-extrabold text-red-400">{formatNaira(profitReportData.estimatedCOGS)}</h3>
              <p className="text-[9px] text-slate-500">Inventory cost of electrical equipment</p>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">OpEx Overheads</p>
              <h3 className="text-xl font-extrabold text-amber-500">{formatNaira(profitReportData.operationalOverheads)}</h3>
              <p className="text-[9px] text-slate-500">Utilities, warehouse rent, Alaba dues</p>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Net Profit Margin</p>
              <h3 className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
                <span>{formatNaira(profitReportData.netProfit)}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold font-mono">+{profitReportData.marginPercent}%</span>
              </h3>
              <p className="text-[9px] text-slate-500">Net takehome margin on matching parameters</p>
            </div>

          </div>

          {/* Capital accounting representation */}
          <div className="bg-slate-900 p-5 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Historical Net Profit Trend</h3>
            <div className="h-64 text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'Jan', gross: 450000, net: 110000 },
                  { month: 'Feb', gross: 580000, net: 154000 },
                  { month: 'Mar', gross: 510000, net: 135000 },
                  { month: 'Apr', gross: 630000, net: 172000 },
                  { month: 'May', gross: 780000, net: 215000 },
                  { month: 'Jun', gross: 910000, net: 260000 },
                  { month: 'Jul', gross: profitReportData.totalSales, net: profitReportData.netProfit },
                ]} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} tickFormatter={(val) => `₦${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                    formatter={(value: any) => [formatNaira(Number(value)), '']}
                  />
                  <Line type="monotone" dataKey="gross" name="Gross Revenue" stroke="#3b82f6" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="net" name="Net Profit Margin" stroke="#10b981" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* 4. EXPENSES AUDITING SEGMENT */}
      {activeReport === 'Expenses' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Procurement Expenses</p>
              <h3 className="text-xl font-extrabold text-red-400 mt-1">{formatNaira(totalProcurementExpenses)}</h3>
              <p className="text-[10px] text-slate-500">Procurement spending invoiced from Coleman and Havells vendors</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/10">
              <ArrowDownRight size={20} />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Procurement Expenses Logs</h3>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4 font-bold">Log ID</th>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Vendor Supplier</th>
                    <th className="py-3 px-4 font-bold">Inflow Lot Purpose</th>
                    <th className="py-3 px-4 font-bold text-right">Procured Cost (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {expensesLedger.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-850/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{tx.id}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{new Date(tx.date).toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">{tx.supplierName}</td>
                      <td className="py-3.5 px-4 text-slate-400">{tx.description}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-red-400">{formatNaira(tx.amount)}</td>
                    </tr>
                  ))}
                  {expensesLedger.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-650 font-semibold">No procurement expenses logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 5. CREDITS / RECEIVABLES SEGMENT */}
      {activeReport === 'Credits' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Outstanding Receivables (Trade Credits)</p>
              <h3 className="text-xl font-extrabold text-amber-500 mt-1">{formatNaira(totalOutstandingCredits)}</h3>
              <p className="text-[10px] text-slate-500">Unpaid invoices issued to electrical contractors inside Alaba</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/10">
              <Coins size={20} />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Debtors Outstanding Credits Sheet</h3>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4 font-bold">Credit ID</th>
                    <th className="py-3 px-4 font-bold">Debtor Client Contractor</th>
                    <th className="py-3 px-4 font-bold font-mono text-center">Limit</th>
                    <th className="py-3 px-4 font-bold text-center">Due Date</th>
                    <th className="py-3 px-4 font-bold text-center">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Outstanding Bal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {customerCredits.map(c => (
                    <tr key={c.id} className="hover:bg-slate-850/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{c.id}</td>
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-slate-200">{c.customer}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-0.5">{c.phone}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-slate-400">{formatNaira(c.creditLimit)}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">{c.dueDate}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                          c.status === 'Overdue' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-amber-500">{formatNaira(c.outstanding)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

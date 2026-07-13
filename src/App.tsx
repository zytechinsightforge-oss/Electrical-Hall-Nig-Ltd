import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Products from './components/Products';
import Reports from './components/Reports';
import CompanySettingsScreen from './components/Settings';
import { 
  CategoriesScreen, ProcurementScreen, AccountingScreen, 
  UsersScreen, SubscriptionsScreen, CostCentresScreen 
} from './components/OtherScreens';
import { ShieldAlert } from 'lucide-react';

function ApplicationContent() {
  const { currentUser, roles } = useApp();
  
  // Navigation states
  const [activePage, setActivePage] = useState('dashboard');
  const [activeSubmenu, setActiveSubmenu] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // If no user is logged in, show the branding Login Screen
  if (!currentUser) {
    return <Login />;
  }

  // RBAC Permission checks
  const userRoleConfig = roles.find(r => r.name === currentUser.role);
  const permissions = userRoleConfig ? userRoleConfig.permissions : [];
  const isPageAuthorized = permissions.includes(activePage);

  // Render correct workspace based on state & check permissions
  const renderWorkspace = () => {
    if (!isPageAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-900 border border-slate-800 rounded-2xl max-w-md mx-auto my-12 space-y-4 animate-shake">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your staff role (<b className="text-red-400 font-bold">{currentUser.role}</b>) does not possess permission rights to access the <b>{activePage}</b> segment.
            </p>
          </div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <CategoriesScreen />;
      case 'products':
        return <Products />;
      case 'reports':
        return <Reports />;
      case 'sales':
        return <POS />;
      case 'procurement':
        return <ProcurementScreen />;
      case 'accounting':
        return <AccountingScreen />;
      case 'users':
        return <UsersScreen />;
      case 'settings':
        return <CompanySettingsScreen />;
      case 'subscriptions':
        return <SubscriptionsScreen />;
      case 'costcentres':
        return <CostCentresScreen />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar adaptive (Desktop left, Mobile drawer) */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
      />

      {/* Main content view with Header and Status Footer */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-20">
          {/* Left search */}
          <div className="relative max-w-xs w-full hidden sm:block">
            <input 
              type="text" 
              placeholder="Search transactions, products or orders..." 
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:border-blue-500 placeholder-slate-500 transition-colors"
            />
            <span className="absolute left-2.5 top-3 text-slate-500 text-xs font-sans">🔍</span>
          </div>
          <div className="sm:hidden font-bold text-xs tracking-tight uppercase text-blue-400">
            {activePage} View
          </div>

          {/* Right User Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-100">{currentUser.name}</div>
              <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded tracking-wide inline-block uppercase mt-0.5 border border-blue-500/10">
                {currentUser.role}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-blue-400 select-none uppercase shadow-sm font-mono">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 scrollbar-thin">
          {renderWorkspace()}
        </main>

        {/* Footer Status */}
        <footer className="h-8 bg-slate-950 border-t border-slate-700 flex items-center px-6 text-[10px] text-slate-400 gap-6 shrink-0 z-10 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            <span className="font-medium text-slate-300">System Online</span>
          </div>
          <div className="hidden sm:block text-slate-500">&bull;</div>
          <div className="hidden sm:block">Branch: Lagos Head Office</div>
          <div className="ml-auto font-mono text-[9px] text-slate-500">
            Last Sync: Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </footer>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ApplicationContent />
    </AppProvider>
  );
}

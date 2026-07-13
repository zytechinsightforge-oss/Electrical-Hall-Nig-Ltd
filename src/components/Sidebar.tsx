import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, Tags, Package, BarChart3, ShoppingCart, 
  Factory, CircleDollarSign, Users, Settings, CreditCard, 
  ShieldCheck, LogOut, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeSubmenu: string;
  setActiveSubmenu: (sub: string) => void;
}

export default function Sidebar({ 
  activePage, 
  setActivePage, 
  collapsed, 
  setCollapsed,
  activeSubmenu,
  setActiveSubmenu
}: SidebarProps) {
  const { currentUser, logout, roles, settings } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (!currentUser) return null;

  // Get permissions for current user's role
  const userRoleConfig = roles.find(r => r.name === currentUser.role);
  const permissions = userRoleConfig ? userRoleConfig.permissions : [];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: 'dashboard' },
    { id: 'categories', label: 'Categories', icon: Tags, permission: 'categories' },
    { id: 'products', label: 'Products', icon: Package, permission: 'products', submenus: ['Manage Products', 'Label Printing'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, permission: 'reports', submenus: ['Sales Reports', 'Stock Position', 'Profits', 'Expenses', 'Credits'] },
    { id: 'sales', label: 'Sales / POS', icon: ShoppingCart, permission: 'sales', submenus: ['Create Invoice'] },
    { id: 'procurement', label: 'Procurement', icon: Factory, permission: 'procurement' },
    { id: 'accounting', label: 'Accounting', icon: CircleDollarSign, permission: 'accounting' },
    { id: 'users', label: 'Users', icon: Users, permission: 'users' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'settings' },
    { id: 'costcentres', label: 'Cost Centres', icon: ShieldCheck, permission: 'costcentres' },
  ];

  const filteredItems = navItems.filter(item => permissions.includes(item.permission));

  const handleNavClick = (itemId: string, item: typeof navItems[0]) => {
    setActivePage(itemId);
    if (item.submenus && item.submenus.length > 0) {
      setActiveSubmenu(item.submenus[0]);
    } else {
      setActiveSubmenu('');
    }
    setShowMobileMenu(false);
  };

  return (
    <>
      {/* Mobile Header (For screens smaller than md) */}
      <div className="md:hidden flex items-center justify-between bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-40 text-white">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden p-0">
            {settings.logo && (settings.logo.startsWith('data:image') || settings.logo.startsWith('http') || settings.logo.length > 8) ? (
              <img src={settings.logo} alt="L" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-xl">{settings.logo || '🔌'}</span>
            )}
          </div>
          <span className="font-bold text-sm tracking-tight">{settings.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
            {currentUser.role}
          </span>
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)} 
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (When menu toggled) */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm transition-opacity">
          <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-xs bg-slate-800 p-6 shadow-2xl flex flex-col justify-between border-l border-slate-700">
            <div>
              <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden p-0">
                    {settings.logo && (settings.logo.startsWith('data:image') || settings.logo.startsWith('http') || settings.logo.length > 8) ? (
                      <img src={settings.logo} alt="L" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-xl">{settings.logo || '🔌'}</span>
                    )}
                  </div>
                  <span className="font-extrabold text-white text-sm">{settings.name}</span>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>

              {/* Navigation Items in Drawer */}
              <nav className="space-y-1.5 overflow-y-auto max-h-[70vh]">
                {filteredItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id, item)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-blue-500/15 text-white font-semibold shadow-lg border-l-4 border-blue-500' 
                          : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200 border-l-4 border-transparent'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* User Profile & Logout at bottom of Mobile Menu */}
            <div className="border-t border-slate-700 pt-4 mt-auto">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-blue-400 text-sm">
                  {currentUser.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white truncate max-w-[150px]">{currentUser.name}</h4>
                  <p className="text-xs text-slate-500">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-sm font-medium transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop / Tablet Sidebar */}
      <aside 
        id="desktop_sidebar"
        className={`hidden md:flex flex-col bg-slate-800 border-r border-slate-700 h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 shadow shadow-slate-950/25 overflow-hidden p-0">
              {settings.logo && (settings.logo.startsWith('data:image') || settings.logo.startsWith('http') || settings.logo.length > 8) ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xl">{settings.logo || '🔌'}</span>
              )}
            </div>
            {!collapsed && (
              <div className="flex flex-col animate-fadeIn">
                <span className="font-extrabold text-white text-xs tracking-tight truncate w-[160px] uppercase">
                  {settings.name}
                </span>
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-wider">
                  POS & Inventory
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => handleNavClick(item.id, item)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm font-medium transition-all group relative cursor-pointer ${
                    isActive 
                      ? 'bg-blue-500/10 text-white font-semibold border-l-3 border-blue-500 rounded-r-lg pl-3' 
                      : 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200 border-l-3 border-transparent pl-3'
                  }`}
                >
                  <Icon size={18} className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  
                  {!collapsed && (
                    <span className="truncate flex-1 animate-fadeIn">{item.label}</span>
                  )}
                  
                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-[80px] bg-slate-950 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow-md border border-slate-800 z-50">
                      {item.label}
                    </div>
                  )}
                </button>

                {/* Submenu Drawer if current page is active & expanded & submenus exist */}
                {isActive && item.submenus && !collapsed && (
                  <div className="pl-9 space-y-1 mt-1 animate-fadeIn">
                    {item.submenus.map(sub => {
                      const isSubActive = activeSubmenu === sub;
                      return (
                        <button
                          key={sub}
                          onClick={() => setActiveSubmenu(sub)}
                          className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isSubActive 
                              ? 'text-blue-400 bg-blue-500/10 font-semibold' 
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Current User details & Logout */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/60 mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-blue-400 shrink-0 select-none">
              {currentUser.name[0]}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 animate-fadeIn">
                <span className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">{currentUser.role}</span>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              collapsed 
                ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 px-0'
                : 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 px-3'
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={14} className="shrink-0" />
            {!collapsed && <span className="animate-fadeIn">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

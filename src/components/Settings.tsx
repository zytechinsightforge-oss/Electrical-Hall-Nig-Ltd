import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, Building2, Phone, Mail, 
  MapPin, Shield, Milestone, Image, CheckCircle2,
  Trash2, Edit2, Plus, Terminal, RefreshCw, Sliders,
  Layers, HelpCircle, Save, Database
} from 'lucide-react';

export default function CompanySettingsScreen() {
  const { 
    settings, updateSettings, refreshData,
    units, addUnit, deleteUnit,
    paymentMethods, addPaymentMethod, deletePaymentMethod,
    branches, addBranch, deleteBranch,
    products, transactions, suppliers, costCenters
  } = useApp();

  // Active sub-view tab
  const [activeTab, setActiveTab] = useState<'Branding' | 'Filters' | 'ZifConsole'>('Branding');

  // Local Form state for Branding
  const [compName, setCompName] = useState(settings.name);
  const [compAddress, setCompAddress] = useState(settings.address);
  const [compPhone, setCompPhone] = useState(settings.phone);
  const [compEmail, setCompEmail] = useState(settings.email);
  const [compRc, setCompRc] = useState(settings.rcNumber);
  const [compMotto, setCompMotto] = useState(settings.motto);
  const [compLogo, setCompLogo] = useState(settings.logo);

  // States for Dynamic Filters add/edit
  const [newUnit, setNewUnit] = useState('');
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [editedUnitVal, setEditedUnitVal] = useState('');

  const [newPayMethod, setNewPayMethod] = useState('');
  const [editingPayMethod, setEditingPayMethod] = useState<string | null>(null);
  const [editedPayMethodVal, setEditedPayMethodVal] = useState('');

  const [newBranch, setNewBranch] = useState('');
  const [editingBranch, setEditingBranch] = useState<string | null>(null);
  const [editedBranchVal, setEditedBranchVal] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) {
      alert("Company Name is a required field.");
      return;
    }

    updateSettings({
      name: compName.trim(),
      address: compAddress.trim(),
      phone: compPhone.trim(),
      email: compEmail.trim(),
      rcNumber: compRc.trim(),
      motto: compMotto.trim(),
      logo: compLogo
    });

    triggerToast("Company settings and receipt templates updated successfully!");
  };

  const handleResetSystem = () => {
    if (window.confirm("WARNING: This will clear all transactions, reset suppliers/cost centres and reseed database back to Alaba factory standards. Do you want to proceed?")) {
      refreshData();
      triggerToast("System Database re-seeded to factory defaults.");
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  // Units Management Helpers
  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnit.trim()) return;
    addUnit(newUnit.trim());
    triggerToast(`Measurement unit '${newUnit.trim()}' added successfully.`);
    setNewUnit('');
  };

  const handleSaveEditUnit = (original: string) => {
    if (!editedUnitVal.trim()) return;
    deleteUnit(original);
    addUnit(editedUnitVal.trim());
    triggerToast(`Unit updated from '${original}' to '${editedUnitVal.trim()}'.`);
    setEditingUnit(null);
    setEditedUnitVal('');
  };

  // Payment Method Helpers
  const handleAddPayMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayMethod.trim()) return;
    addPaymentMethod(newPayMethod.trim());
    triggerToast(`Payment method '${newPayMethod.trim()}' registered successfully.`);
    setNewPayMethod('');
  };

  const handleSaveEditPayMethod = (original: string) => {
    if (!editedPayMethodVal.trim()) return;
    deletePaymentMethod(original);
    addPaymentMethod(editedPayMethodVal.trim());
    triggerToast(`Payment method updated to '${editedPayMethodVal.trim()}'.`);
    setEditingPayMethod(null);
    setEditedPayMethodVal('');
  };

  // Branch Helpers
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.trim()) return;
    addBranch(newBranch.trim());
    triggerToast(`Branch Outlet '${newBranch.trim()}' registered successfully.`);
    setNewBranch('');
  };

  const handleSaveEditBranch = (original: string) => {
    if (!editedBranchVal.trim()) return;
    deleteBranch(original);
    addBranch(editedBranchVal.trim());
    triggerToast(`Branch Outlet updated to '${editedBranchVal.trim()}'.`);
    setEditingBranch(null);
    setEditedBranchVal('');
  };

  const logoOptions = ['🔌', '⚡', '💡', '🔋', '🛠️', '🏢', '⚙️'];

  return (
    <div id="settings_workspace_view" className="space-y-6 font-sans max-w-5xl animate-fadeIn">
      
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/30 z-50 animate-fadeIn text-sm font-semibold">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="text-blue-500 animate-spin-slow" size={18} />
            <span>Corporate Settings &amp; Control Centre</span>
          </h1>
          <p className="text-slate-400 text-[10px] mt-0.5">
            Configure system parameters, branches list, unit standards, and access administrative maintenance utilities.
          </p>
        </div>

        {/* Settings view toggles */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-750 self-end md:self-auto shrink-0">
          {(['Branding', 'Filters', 'ZifConsole'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'Branding' ? '🏢 Corporate Profile' : tab === 'Filters' ? '⚙️ Control Filters' : '🔌 ZIF Console'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB A: BRANDING & PROFILE FORM */}
      {activeTab === 'Branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left column: branding mockup preview */}
          <div className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Official Receipt Header Brand</span>
              
              <div className="inline-flex items-center justify-center w-36 h-36 rounded-3xl bg-slate-900 text-white shadow-xl mb-4 border border-slate-700 text-6xl overflow-hidden p-0">
                {compLogo && (compLogo.startsWith('data:image') || compLogo.startsWith('http') || compLogo.length > 8) ? (
                  <img src={compLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  compLogo || '🔌'
                )}
              </div>

              <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight truncate px-2">{compName || 'ELECTRICAL HALL'}</h3>
              <p className="text-blue-400 text-[9px] font-mono tracking-widest uppercase mt-1 px-4 truncate">{compMotto || 'QUALITY ELECTRICALS'}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-700 text-[10px] text-slate-450 text-left space-y-1.5 bg-slate-900/40 p-3.5 rounded-xl">
                <p>RC Registration: <b className="text-slate-300 font-mono font-bold">{compRc || 'RC-XXXXXX'}</b></p>
                <p className="truncate">Tel Line: <b className="text-slate-300 font-mono">{compPhone}</b></p>
                <p className="truncate">Official Email: <b className="text-slate-300 font-mono">{compEmail}</b></p>
                <p className="truncate text-[9px] text-slate-500 leading-normal">Address: <b>{compAddress}</b></p>
              </div>
            </div>
          </div>

          {/* Right column: Edit Form */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Logo selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Image size={11} className="text-blue-500" />
                  <span>Company Logo Selection &amp; Upload</span>
                </label>
                
                {/* Emoji options */}
                <div className="flex flex-wrap items-center gap-2">
                  {logoOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCompLogo(opt)}
                      className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center border transition-all cursor-pointer ${
                        compLogo === opt 
                          ? 'bg-blue-600 border-blue-500 shadow' 
                          : 'bg-slate-900 border-slate-700 hover:border-slate-650'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Custom Upload Block */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-750 space-y-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">OR UPLOAD CUSTOM LOGO IMAGE</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Drag & Drop File input */}
                    <div className="relative border border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-950/40 cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result && typeof event.target.result === 'string') {
                                setCompLogo(event.target.result);
                                triggerToast("Custom Logo image uploaded successfully!");
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Plus className="text-slate-500 group-hover:text-blue-400 mb-1" size={16} />
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-300">Choose Image File</span>
                      <span className="text-[8px] text-slate-500 mt-0.5">PNG, JPG or SVG up to 2MB</span>
                    </div>

                    {/* URL Input */}
                    <div className="flex flex-col justify-center space-y-1.5">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Or provide logo Image URL:</span>
                      <input
                        type="url"
                        value={compLogo && (compLogo.startsWith('http') && !compLogo.startsWith('data:') ) ? compLogo : ''}
                        onChange={(e) => setCompLogo(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full text-[10px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Clear custom logo */}
                  {compLogo && (compLogo.startsWith('data:image') || compLogo.startsWith('http')) && (
                    <div className="flex items-center justify-between border-t border-slate-800 pt-2.5">
                      <div className="flex items-center gap-2">
                        <img src={compLogo} className="w-8 h-8 object-contain bg-slate-950 p-1 rounded border border-slate-700" alt="Uploaded" referrerPolicy="no-referrer" />
                        <span className="text-[9px] text-emerald-400 font-bold">✓ Custom Logo Active</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCompLogo('🔌');
                          triggerToast("Custom logo cleared. Restored to default emoji.");
                        }}
                        className="text-[9px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer bg-red-500/10 px-2 py-1 rounded"
                      >
                        <Trash2 size={10} />
                        <span>Clear Image</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Corporate Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={11} className="text-blue-500" />
                  <span>Corporate Enterprise Registered Name*</span>
                </label>
                <input
                  type="text"
                  required
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="e.g., ELECTRICAL HALL NIG LTD"
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              {/* Motto */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Milestone size={11} className="text-blue-500" />
                  <span>Business Slogan Motto</span>
                </label>
                <input
                  type="text"
                  value={compMotto}
                  onChange={(e) => setCompMotto(e.target.value)}
                  placeholder="Powering Quality & Reliability"
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={11} className="text-blue-500" />
                  <span>Corporate Headquarters Address</span>
                </label>
                <input
                  type="text"
                  value={compAddress}
                  onChange={(e) => setCompAddress(e.target.value)}
                  placeholder="Plot 14, Alaba Market, Ojo, Lagos"
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* RC and Contact numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield size={11} className="text-blue-500" />
                    <span>RC Registration Number</span>
                  </label>
                  <input
                    type="text"
                    value={compRc}
                    onChange={(e) => setCompRc(e.target.value)}
                    placeholder="e.g., RC-1294812"
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={11} className="text-blue-500" />
                    <span>Official Telephone</span>
                  </label>
                  <input
                    type="text"
                    value={compPhone}
                    onChange={(e) => setCompPhone(e.target.value)}
                    placeholder="e.g., +234 803 123 4567"
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

              </div>

              {/* Corporate Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={11} className="text-blue-500" />
                  <span>Official Corporate Email</span>
                </label>
                <input
                  type="email"
                  value={compEmail}
                  onChange={(e) => setCompEmail(e.target.value)}
                  placeholder="billing@electricalhall.com"
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow shadow-blue-500/10 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save size={13} />
                  <span>Save Profile</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* TAB B: DYNAMIC CONTROL FILTERS WORKSPACE */}
      {activeTab === 'Filters' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* 1. UNITS OF MEASUREMENT */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700/60 pb-2">
                  <Sliders size={13} className="text-blue-400" />
                  <span>Units of Measurement</span>
                </h3>
                <p className="text-[9px] text-slate-400 mt-1 leading-normal">Configure packaging metrics used in products catalogs (e.g. Roll, Pcs, Coils).</p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddUnit} className="flex gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="Add new unit (e.g., Yards)"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="flex-1 text-xs bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center cursor-pointer"
                  title="Add Unit"
                >
                  <Plus size={14} />
                </button>
              </form>

              {/* List */}
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-thin pr-1">
                {units.map(item => (
                  <div key={item} className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg border border-slate-750 text-xs text-slate-300">
                    {editingUnit === item ? (
                      <div className="flex gap-1 w-full">
                        <input
                          type="text"
                          required
                          value={editedUnitVal}
                          onChange={(e) => setEditedUnitVal(e.target.value)}
                          className="flex-1 bg-slate-950 px-2 py-0.5 rounded text-xs text-white border border-slate-700"
                        />
                        <button
                          onClick={() => handleSaveEditUnit(item)}
                          className="px-2 bg-emerald-600 text-white rounded text-[10px] font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold">{item}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setEditingUnit(item); setEditedUnitVal(item); }}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded"
                          >
                            <Edit2 size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete unit metric '${item}'?`)) {
                                deleteUnit(item);
                                triggerToast(`Unit '${item}' deleted.`);
                              }
                            }}
                            className="p-1 hover:bg-red-500/10 text-slate-450 hover:text-red-400 rounded"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-700/60 text-[9px] text-slate-500 font-medium">
              Total metrics mapped: <b>{units.length} keys</b>
            </div>
          </div>

          {/* 2. PAYMENT METHODS */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700/60 pb-2">
                  <Sliders size={13} className="text-blue-400" />
                  <span>Payment Channels</span>
                </h3>
                <p className="text-[9px] text-slate-400 mt-1 leading-normal">Register checkout routing channels available during POS checkouts (e.g. Bank Transfer, Cash).</p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddPayMethod} className="flex gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="Add payment method"
                  value={newPayMethod}
                  onChange={(e) => setNewPayMethod(e.target.value)}
                  className="flex-1 text-xs bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </form>

              {/* List */}
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-thin pr-1">
                {paymentMethods.map(item => (
                  <div key={item} className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg border border-slate-750 text-xs text-slate-300">
                    {editingPayMethod === item ? (
                      <div className="flex gap-1 w-full">
                        <input
                          type="text"
                          required
                          value={editedPayMethodVal}
                          onChange={(e) => setEditedPayMethodVal(e.target.value)}
                          className="flex-1 bg-slate-950 px-2 py-0.5 rounded text-xs text-white border border-slate-700"
                        />
                        <button
                          onClick={() => handleSaveEditPayMethod(item)}
                          className="px-2 bg-emerald-600 text-white rounded text-[10px] font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold">{item}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setEditingPayMethod(item); setEditedPayMethodVal(item); }}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded"
                          >
                            <Edit2 size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete payment method '${item}'?`)) {
                                deletePaymentMethod(item);
                                triggerToast(`Method '${item}' deleted.`);
                              }
                            }}
                            className="p-1 hover:bg-red-500/10 text-slate-455 hover:text-red-400 rounded"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-[9px] text-slate-500 font-medium">
              Total channels mapped: <b>{paymentMethods.length} keys</b>
            </div>
          </div>

          {/* 3. BRANCHES & OUTLETS */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700/60 pb-2">
                  <Sliders size={13} className="text-blue-400" />
                  <span>Branches &amp; Outlets</span>
                </h3>
                <p className="text-[9px] text-slate-400 mt-1 leading-normal">Manage corporate warehouses and retail stores operating under Electrical Hall Ltd.</p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddBranch} className="flex gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="e.g., Alaba International"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="flex-1 text-xs bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </form>

              {/* List */}
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-thin pr-1">
                {branches.map(item => (
                  <div key={item} className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg border border-slate-750 text-xs text-slate-300">
                    {editingBranch === item ? (
                      <div className="flex gap-1 w-full">
                        <input
                          type="text"
                          required
                          value={editedBranchVal}
                          onChange={(e) => setEditedBranchVal(e.target.value)}
                          className="flex-1 bg-slate-950 px-2 py-0.5 rounded text-xs text-white border border-slate-700"
                        />
                        <button
                          onClick={() => handleSaveEditBranch(item)}
                          className="px-2 bg-emerald-600 text-white rounded text-[10px] font-bold"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold">{item}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setEditingBranch(item); setEditedBranchVal(item); }}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded"
                          >
                            <Edit2 size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete branch outlet mapping '${item}'?`)) {
                                deleteBranch(item);
                                triggerToast(`Branch '${item}' deleted.`);
                              }
                            }}
                            className="p-1 hover:bg-red-500/10 text-slate-455 hover:text-red-400 rounded"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-[9px] text-slate-500 font-medium">
              Total outlets mapped: <b>{branches.length} keys</b>
            </div>
          </div>

        </div>
      )}

      {/* TAB C: 🔌 ELECTRICAL HALL ZIF ADMINISTRATIVE CONSOLE */}
      {activeTab === 'ZifConsole' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal size={14} className="text-blue-500" />
                <span>🔌 ZIF Administrative Console v2.8</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Verify sandbox state registers, memory footprint limits, and trigger systemic database maintenance.</p>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-[9px] bg-slate-900 border border-slate-750 px-3 py-1.5 rounded-lg text-slate-450 font-bold shrink-0">
              <Database size={12} className="text-emerald-400 animate-pulse" />
              <span>STABLE STORAGE ENGINE: LOCALSTORAGE V2</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Database Stats Table */}
            <div className="md:col-span-8 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic Memory Registry Node Counts</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Physical counts of persisted structural records registered in memory.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-750 text-center">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Products</span>
                  <p className="text-2xl font-black text-white font-mono mt-1">{products.length}</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-750 text-center">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Transactions</span>
                  <p className="text-2xl font-black text-white font-mono mt-1">{transactions.length}</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-750 text-center">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Suppliers</span>
                  <p className="text-2xl font-black text-white font-mono mt-1">{suppliers.length}</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-750 text-center">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Cost Centres</span>
                  <p className="text-2xl font-black text-white font-mono mt-1">{costCenters.length}</p>
                </div>

              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-750 space-y-1.5 text-[10px] text-slate-400">
                <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest block mb-2">Internal Sandbox Diagnostics Checklists:</span>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span>LocalStorage state integrity matches schema v2.0 specifications.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span>No orphan keys or un-synced product category links located during diagnostics boot.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span>Cross-platform state binders syncing in background without delay loops.</span>
                </p>
              </div>
            </div>

            {/* Reset / Dangerous control column */}
            <div className="md:col-span-4 bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span>Hard Factory Maintenance</span>
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Deletes all locally registered material records, cash books, and supplier ledgers, re-initializing the database to pristine Alaba defaults.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-750">
                <button
                  onClick={handleResetSystem}
                  type="button"
                  className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center uppercase tracking-wide block font-sans"
                >
                  Factory Database Reset
                </button>
                <span className="text-[8px] text-slate-550 block text-center">Cannot be undone once executed.</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

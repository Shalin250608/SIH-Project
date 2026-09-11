import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Download, Users, RefreshCw, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/calculator';
import { getRegisteredUsers, saveRegisteredUsers } from './AuthModal';

const AdminPanel = ({ 
  isOpen, 
  onClose, 
  t, 
  activeIncomeCeiling, 
  setActiveIncomeCeiling, 
  schemes, 
  setSchemes, 
  partners, 
  setPartners, 
  onPolicyUpdated 
}) => {
  const [ceilingInput, setCeilingInput] = useState(activeIncomeCeiling || 500000);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setRegisteredUsers(getRegisteredUsers());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCeiling = () => {
    setActiveIncomeCeiling(Number(ceilingInput));
    setShowSuccess(true);
    if (onPolicyUpdated) {
      onPolicyUpdated();
    }
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleTogglePartner = (id) => {
    setPartners(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'restricted' : 'active' } : p
    ));
  };

  // Export users as users.json file download
  const handleExportUsers = () => {
    const users = getRegisteredUsers();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "users.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetUsers = () => {
    if (window.confirm('Reset users database to default demo account?')) {
      const defaultUser = [{
        name: 'Ramesh Patel',
        mobile: '9876543210',
        password: '1234',
        district: 'Ahmedabad',
        isSC: true,
        createdAt: new Date().toISOString()
      }];
      saveRegisteredUsers(defaultUser);
      setRegisteredUsers(defaultUser);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin & Policy Control Center</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage income ceilings, partner routing status, and registered user accounts</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          
          {/* Section 1: Income Ceiling Control */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {t?.admin?.incomeCeilingLabel || 'NSFDC Income Ceiling Policy'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Dynamically adjust the family income ceiling. Beneficiaries above this limit are rejected by the rule engine.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <input
                type="number"
                value={ceilingInput}
                onChange={(e) => setCeilingInput(e.target.value)}
                className="w-48 px-3.5 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              />
              <button
                onClick={handleSaveCeiling}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
              >
                Save Ceiling Policy
              </button>
              {showSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={15} /> Policy updated live!
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {[300000, 500000, 600000, 800000].map(val => (
                <button
                  key={val}
                  onClick={() => setCeilingInput(val)}
                  className={`px-3 py-1 text-xs rounded-md border font-semibold transition cursor-pointer ${
                    Number(ceilingInput) === val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {formatINR(val)}
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: Registered Beneficiaries Database & JSON Export */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  <span>Registered Users Storage ({registeredUsers.length})</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  User accounts created via Sign Up are stored locally. You can export them to a <code className="bg-gray-200 px-1 rounded text-gray-800">users.json</code> file anytime.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportUsers}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                  title="Download users.json to your computer"
                >
                  <Download size={14} />
                  <span>Export users.json</span>
                </button>

                <button
                  onClick={handleResetUsers}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-gray-600 text-xs font-semibold rounded-lg transition cursor-pointer"
                  title="Reset to default accounts"
                >
                  <RefreshCw size={13} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100/70 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Mobile (Login ID)</th>
                      <th className="p-3">District</th>
                      <th className="p-3">SC Community</th>
                      <th className="p-3">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registeredUsers.map((u, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="p-3 font-bold text-gray-900">{u.name}</td>
                        <td className="p-3 font-mono font-medium text-gray-700">{u.mobile}</td>
                        <td className="p-3 text-gray-600">{u.district}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            u.isSC ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {u.isSC ? 'SC Verified' : 'Other'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500 font-mono text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Demo Account'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3: Channel Partners Management */}
          <section className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {t?.admin?.managePartners || 'Channel Partners Status Management'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Toggle partner status between Active and Restricted (demonstrating SIH risk-filter for high-NPA agencies).
            </p>

            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {partners.map(p => (
                <div key={p.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{p.name}</span>
                    <span className="text-[11px] text-gray-500">{p.type} • {p.district}</span>
                  </div>
                  <button
                    onClick={() => handleTogglePartner(p.id)}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                      p.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {p.status === 'active' ? 'Active' : 'Restricted'}
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-lg transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
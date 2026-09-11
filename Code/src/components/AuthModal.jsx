import React, { useState, useEffect } from 'react';
import { X, User, Lock, Phone, ShieldCheck, CheckCircle2, ArrowRight, LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'sparkline_registered_users';

// Pre-seeded demo account so demo login always works
const DEFAULT_DEMO_USER = {
  name: 'Ramesh Patel',
  mobile: '9876543210',
  password: '1234',
  district: 'Ahmedabad',
  isSC: true,
  createdAt: new Date().toISOString()
};

export const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_DEMO_USER];
  } catch (e) {
    return [DEFAULT_DEMO_USER];
  }
};

export const saveRegisteredUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
};

export default function AuthModal({ isOpen, onClose, onLoginSuccess, t, lang }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  
  // Login form state
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupDistrict, setSignupDistrict] = useState('Ahmedabad');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupIsSC, setSignupIsSC] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Ensure initial demo user is seeded on load
  useEffect(() => {
    getRegisteredUsers();
  }, []);

  if (!isOpen) return null;

  const districts = [
    'Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 
    'Bhavnagar', 'Jamnagar', 'Junagadh', 'Kutch', 'Mehsana'
  ];

  // 1. LOGIN VERIFICATION: Checks against stored accounts
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanMobile = loginMobile.trim();
    const cleanPass = loginPassword.trim();

    if (!cleanMobile) {
      setErrorMsg('Please enter your registered mobile number.');
      return;
    }
    if (!cleanPass) {
      setErrorMsg('Please enter your password.');
      return;
    }

    const allUsers = getRegisteredUsers();
    
    // Find user by mobile number
    const matchedUser = allUsers.find(u => u.mobile === cleanMobile);

    if (!matchedUser) {
      setErrorMsg(`No registered account found with mobile number "${cleanMobile}". Please Sign Up first.`);
      return;
    }

    // Verify password
    if (matchedUser.password !== cleanPass) {
      setErrorMsg('Incorrect password. Please verify and try again.');
      return;
    }

    // Login successful
    setSuccessMsg(`Welcome back, ${matchedUser.name}! Login verified.`);
    setTimeout(() => {
      onLoginSuccess(matchedUser);
      onClose();
      setLoginMobile('');
      setLoginPassword('');
    }, 500);
  };

  // 2. 1-CLICK DEMO LOGIN (Uses pre-seeded Ramesh Patel account)
  const handleDemoLogin = () => {
    setErrorMsg('');
    setLoginMobile(DEFAULT_DEMO_USER.mobile);
    setLoginPassword(DEFAULT_DEMO_USER.password);
    setSuccessMsg(`Logged in as Demo Beneficiary (${DEFAULT_DEMO_USER.name})!`);
    
    setTimeout(() => {
      onLoginSuccess(DEFAULT_DEMO_USER);
      onClose();
    }, 450);
  };

  // 3. SIGNUP FLOW: Stores new user permanently in localStorage
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = signupName.trim();
    const cleanMobile = signupMobile.trim();
    const cleanPass = signupPassword.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!cleanPass || cleanPass.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    const allUsers = getRegisteredUsers();

    // Check if account already exists with this mobile number
    const existing = allUsers.find(u => u.mobile === cleanMobile);
    if (existing) {
      setErrorMsg(`An account with mobile number "${cleanMobile}" already exists. Please switch to Log In.`);
      return;
    }

    // Create new user object
    const newUser = {
      name: cleanName,
      mobile: cleanMobile,
      district: signupDistrict,
      password: cleanPass,
      isSC: signupIsSC,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage array
    const updatedUsers = [...allUsers, newUser];
    saveRegisteredUsers(updatedUsers);

    setSuccessMsg(`Account created for ${newUser.name}! Data saved successfully.`);
    
    // Auto login
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
      // Reset form
      setSignupName('');
      setSignupMobile('');
      setSignupPassword('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {mode === 'login' ? 'Beneficiary Log In' : 'Create Beneficiary Account'}
              </h3>
              <p className="text-xs text-gray-400">SparkLine Portal • Data Stored Locally</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-sm font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${
              mode === 'login'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${
              mode === 'signup'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign Up (New User)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    maxLength={10}
                    value={loginMobile}
                    onChange={(e) => setLoginMobile(e.target.value)}
                    placeholder="Enter 10-digit mobile number..."
                    className="w-full p-2.5 pl-9 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <Phone size={15} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-gray-400">Demo password: 1234</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password..."
                    className="w-full p-2.5 pl-9 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <Lock size={15} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Verify & Log In</span>
                <ArrowRight size={16} />
              </button>

              {/* Demo Fast Login for Presentation */}
              <div className="pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>1-Click Demo Login (Ramesh Patel • 9876543210)</span>
                </button>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Priya Solanki"
                    className="w-full p-2.5 pl-9 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <User size={15} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile (Used for Login)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    District (Gujarat)
                  </label>
                  <select
                    value={signupDistrict}
                    onChange={(e) => setSignupDistrict(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  >
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 4 characters..."
                    className="w-full p-2.5 pl-9 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Lock size={15} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* SC Category Verification Checkbox */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={signupIsSC}
                    onChange={(e) => setSignupIsSC(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-xs text-blue-950 font-medium leading-tight">
                    I belong to the <strong>Scheduled Caste (SC)</strong> community with verified caste certificate eligibility.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Save Profile & Create Account</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Footer Toggle */}
          <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Sign Up here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Log In here
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
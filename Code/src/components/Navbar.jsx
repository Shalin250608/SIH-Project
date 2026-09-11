import React, { useState } from 'react';
import { Sparkles, Settings, Menu, X, User, LogIn, LogOut, CheckCircle2 } from 'lucide-react';

const Navbar = ({ lang, setLang, t, activeTab, setActiveTab, openAdmin, currentUser, onOpenAuth, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'eligibility', label: t.nav.eligibility },
    { id: 'calculator', label: t.nav.calculator },
    { id: 'partners', label: t.nav.partners },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const isTabActive = (id) => {
    if (activeTab === id) return true;
    if (id === 'eligibility' && activeTab === 'wizard') return true;
    return false;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white mr-2.5 shadow-sm group-hover:bg-blue-700 transition">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              Spark<span className="text-blue-600">Line</span>
            </span>
            <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              SIH26092
            </span>
          </div>
          
          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-semibold transition-colors py-5 border-b-2 ${
                  isTabActive(item.id)
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Language Selector */}
            <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs font-medium">
              {[
                { code: 'en', label: 'EN' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'gu', label: 'ગુજરાતી' }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2 py-1 rounded transition ${
                    lang === l.code
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Login / Signup Button or User Profile Badge */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200 px-2.5 py-1 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold text-blue-900 block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-blue-700 font-medium">SC Beneficiary</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-600 p-1 transition"
                  title="Log Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              >
                <LogIn size={13} />
                <span>Log In / Sign Up</span>
              </button>
            )}
            
            {/* Admin Console Button */}
            <button 
              onClick={openAdmin}
              className="flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-xs transition"
              title="Admin Policy & Rule Controls"
            >
              <Settings className="h-3.5 w-3.5 text-gray-500 sm:mr-1" />
              <span className="hidden sm:inline">{t.nav.admin}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${
                isTabActive(item.id)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Login Row */}
          <div className="pt-2 border-t border-gray-100">
            {currentUser ? (
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{currentUser.name}</span>
                    <span className="text-[10px] text-gray-500">Logged in</span>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg text-center shadow-xs"
              >
                Log In or Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
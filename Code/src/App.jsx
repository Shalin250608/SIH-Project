import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EligibilityWizard from './components/EligibilityWizard';
import RecommendationCard from './components/RecommendationCard';
import FinancialCalculator from './components/FinancialCalculator';
import PartnerMap from './components/PartnerMap';
import AdminPanel from './components/AdminPanel';
import ChatAssistant from './components/ChatAssistant';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

import { TRANSLATIONS } from './data/translations';
import { INITIAL_SCHEMES } from './data/schemes';
import { INITIAL_PARTNERS } from './data/partners';
import { evaluateSchemes } from './utils/ruleEngine';
import { MessageSquare, Bot } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // User auth state (Simulated client-side with localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkline_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeIncomeCeiling, setActiveIncomeCeiling] = useState(500000);
  const [schemes, setSchemes] = useState(INITIAL_SCHEMES);
  const [partners, setPartners] = useState(INITIAL_PARTNERS);

  const [formData, setFormData] = useState({
    isSC: true,
    state: "Gujarat",
    district: "Ahmedabad",
    purposeType: "business",
    specificPurpose: "dairy",
    projectCost: 800000,
    annualIncome: 350000
  });

  const [evaluationResult, setEvaluationResult] = useState(null);
  const [selectedSchemeForCalc, setSelectedSchemeForCalc] = useState(null);
  const [selectedSchemeForPartners, setSelectedSchemeForPartners] = useState('ALL');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sparkline_user', JSON.stringify(user));
    } catch (e) {}

    // Auto-prefill form data with user info
    setFormData(prev => ({
      ...prev,
      district: user.district || prev.district,
      isSC: user.isSC !== undefined ? user.isSC : prev.isSC
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sparkline_user');
    } catch (e) {}
  };

  const runEvaluation = () => {
    const result = evaluateSchemes({
      isSC: formData.isSC,
      annualIncome: formData.annualIncome,
      purposeType: formData.purposeType,
      specificPurpose: formData.specificPurpose,
      projectCost: formData.projectCost,
      schemes,
      activeIncomeCeiling
    });
    setEvaluationResult(result);
    setActiveTab('recommendation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePolicyUpdated = () => {
    if (evaluationResult) runEvaluation();
  };

  const handleOpenCalculator = (scheme) => {
    setSelectedSchemeForCalc(scheme);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPartners = (schemeOrCode) => {
    const code = typeof schemeOrCode === 'object' && schemeOrCode !== null ? schemeOrCode.code : schemeOrCode;
    setSelectedSchemeForPartners(code ? String(code).toUpperCase() : 'ALL');
    setActiveTab('partners');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goTo = (tab, opts = {}) => {
    if (opts.purposeType) setFormData(prev => ({ ...prev, ...opts }));
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When user applies details from Chat Assistant
  const handleApplyChatData = (data) => {
    const updatedForm = { ...formData, ...data };
    setFormData(updatedForm);

    const result = evaluateSchemes({
      isSC: updatedForm.isSC,
      annualIncome: updatedForm.annualIncome,
      purposeType: updatedForm.purposeType,
      specificPurpose: updatedForm.specificPurpose,
      projectCost: updatedForm.projectCost,
      schemes,
      activeIncomeCeiling
    });
    setEvaluationResult(result);
    setActiveTab('recommendation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        activeTab={activeTab}
        setActiveTab={(tab) => goTo(tab)}
        openAdmin={() => setIsAdminOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {activeTab === 'home' && (
          <Hero
            t={t}
            onStartWizard={() => goTo('eligibility', { purposeType: 'business' })}
            onStartEducation={() => goTo('eligibility', { purposeType: 'education', specificPurpose: 'engineering', projectCost: 1500000 })}
            openCalculator={() => { setSelectedSchemeForCalc(schemes[1]); goTo('calculator'); }}
            openPartners={() => { setSelectedSchemeForPartners('ALL'); goTo('partners'); }}
            openChat={() => setIsChatOpen(true)}
          />
        )}

        {(activeTab === 'wizard' || activeTab === 'eligibility') && (
          <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t.nav.eligibility}</h1>
              <p className="text-sm text-gray-500 mt-2">
                Check which official NSFDC government schemes you qualify for in 3 easy steps
              </p>
            </div>
            <EligibilityWizard
              t={t}
              lang={lang}
              formData={formData}
              setFormData={setFormData}
              onEvaluate={runEvaluation}
              activeIncomeCeiling={activeIncomeCeiling}
            />
          </div>
        )}

        {activeTab === 'recommendation' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <button
              onClick={() => goTo('eligibility')}
              className="text-sm font-semibold text-blue-600 hover:underline mb-4 inline-flex items-center gap-1"
            >
              &larr; Modify Eligibility Details
            </button>
            <RecommendationCard
              result={evaluationResult}
              formData={formData}
              t={t}
              lang={lang}
              onOpenCalculator={handleOpenCalculator}
              onOpenPartners={handleOpenPartners}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <FinancialCalculator
              t={t}
              lang={lang}
              schemes={schemes}
              initialScheme={selectedSchemeForCalc || schemes[1]}
              formData={formData}
              onLocatePartners={handleOpenPartners}
            />
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="py-6 px-4">
            <PartnerMap
              partners={partners}
              selectedSchemeFilter={selectedSchemeForPartners}
              t={t}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* Floating Chat Assistant Button (Always accessible) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-full shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          title="Chat with AI Scheme Assistant"
        >
          <div className="relative">
            <MessageSquare size={20} />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse"></span>
          </div>
          <span className="text-sm font-semibold hidden sm:inline">Ask AI Assistant</span>
        </button>
      </div>

      {/* Login / Sign Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        t={t}
        lang={lang}
      />

      {/* Chat Assistant Dialog */}
      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        t={t}
        lang={lang}
        onApplyToWizard={handleApplyChatData}
        onOpenCalculator={handleOpenCalculator}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        t={t}
        activeIncomeCeiling={activeIncomeCeiling}
        setActiveIncomeCeiling={setActiveIncomeCeiling}
        schemes={schemes}
        setSchemes={setSchemes}
        partners={partners}
        setPartners={setPartners}
        onPolicyUpdated={handlePolicyUpdated}
      />

      <Footer t={t} />
    </div>
  );
}
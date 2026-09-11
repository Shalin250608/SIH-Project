import React, { useState, useEffect } from 'react';
import { Calculator, Info, CheckCircle2, Building2, Calendar, Percent, ShieldCheck, ArrowRight } from 'lucide-react';
import { calculateLoanDetails, formatINR } from '../utils/calculator';

export default function FinancialCalculator({ t, lang, schemes = [], initialScheme, formData, onLocatePartners }) {
  const [currentScheme, setCurrentScheme] = useState(initialScheme || null);

  const [projectCost, setProjectCost] = useState(800000);
  const [loanPercentage, setLoanPercentage] = useState(90);
  const [interestRate, setInterestRate] = useState(8.0);
  const [tenureYears, setTenureYears] = useState(7);
  const [moratoriumMonths, setMoratoriumMonths] = useState(6);

  // Automatically update and pre-fill all inputs when initialScheme or formData changes
  useEffect(() => {
    if (initialScheme) {
      applyScheme(initialScheme);
    }
  }, [initialScheme]);

  const applyScheme = (scheme) => {
    setCurrentScheme(scheme);

    // Use project cost from user's wizard input, capped at scheme's maximum
    let targetCost = formData?.projectCost || 800000;
    if (scheme.maxProjectCost && targetCost > scheme.maxProjectCost) {
      targetCost = scheme.maxProjectCost;
    }
    if (scheme.minProjectCost && targetCost < scheme.minProjectCost) {
      targetCost = scheme.minProjectCost;
    }

    setProjectCost(targetCost);
    setInterestRate(scheme.interestRate ?? 7.0);
    setTenureYears(scheme.tenureYears ?? 5);
    setMoratoriumMonths(scheme.moratoriumMonths !== undefined ? scheme.moratoriumMonths : 3);
    setLoanPercentage(scheme.maxLoanPercentage || 90);
  };

  const loanAmount = Math.round((projectCost * loanPercentage) / 100);
  const promoterContribution = projectCost - loanAmount;
  
  const results = calculateLoanDetails({
    projectCost,
    loanPercentage,
    interestRate,
    tenureYears,
    moratoriumMonths
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-white">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-blue-600" />
            <span>{t?.calc?.title || 'Financial & EMI Amortization Calculator'}</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t?.calc?.subtitle || 'Estimate your monthly EMI, moratorium interest, and promoter contribution'}
          </p>
        </div>

        {currentScheme && (
          <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-blue-900">
              Auto-Filled for: {currentScheme.code}
            </span>
          </div>
        )}
      </div>

      {/* Auto-filled Notification Banner */}
      {currentScheme && (
        <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-emerald-400">✓ {currentScheme.name}</span>
            <span className="text-slate-400 hidden sm:inline">• Official Parameters Loaded</span>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-slate-200">
              Interest: <strong className="text-emerald-400">{interestRate}% p.a.</strong>
            </span>
            <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-slate-200">
              Max Loan: <strong className="text-white">{loanPercentage}%</strong>
            </span>
            <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-slate-200">
              Tenure: <strong className="text-white">{tenureYears} Yrs</strong>
            </span>
            <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-slate-200">
              Moratorium: <strong className="text-white">{moratoriumMonths} Mo.</strong>
            </span>
          </div>
        </div>
      )}

      {/* Quick Scheme Selector Chips */}
      {schemes.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
            Switch Scheme:
          </span>
          {schemes.map(s => (
            <button
              key={s.code}
              onClick={() => applyScheme(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                currentScheme?.code === s.code
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              {s.code} ({s.interestRate}%)
            </button>
          ))}
        </div>
      )}

      {/* Calculator Body */}
      <div className="flex flex-col lg:flex-row">
        
        {/* Left Side: Interactive Sliders & Inputs */}
        <div className="w-full lg:w-3/5 p-6 md:p-8 space-y-6">
          
          {/* Project Cost Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-bold text-gray-800">
                Total Project Cost:
              </label>
              <span className="text-base font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {formatINR(projectCost)}
              </span>
            </div>
            <input 
              type="range" 
              min="50000" 
              max={currentScheme?.maxProjectCost ? Math.max(currentScheme.maxProjectCost, 1000000) : 5000000} 
              step="25000"
              value={projectCost} 
              onChange={(e) => setProjectCost(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
              <span>Min: ₹50,000</span>
              {currentScheme?.maxProjectCost && (
                <span className="text-blue-600 font-semibold">Scheme Max: {formatINR(currentScheme.maxProjectCost)}</span>
              )}
            </div>
          </div>

          {/* Loan Financing Percentage */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-bold text-gray-800">
                Loan Percentage ({loanPercentage}%):
              </label>
              <span className="text-sm font-bold text-gray-900">
                Loan Amount: <strong className="text-blue-700">{formatINR(loanAmount)}</strong>
              </span>
            </div>
            <input 
              type="range" 
              min="50" 
              max={currentScheme?.maxLoanPercentage || 95} 
              step="5"
              value={loanPercentage} 
              onChange={(e) => setLoanPercentage(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
              <span>50%</span>
              <span className="text-emerald-700 font-semibold">Max Allowed: {currentScheme?.maxLoanPercentage || 90}%</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-bold text-gray-800">
                Concessional Interest Rate (% p.a.):
              </label>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {interestRate}% p.a.
              </span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="12" 
              step="0.5"
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
              <span>6.0% (Women ELS)</span>
              <span>6.5% (MFS/ELS)</span>
              <span>7.5% (UNY)</span>
              <span>8.0% (Term Loan)</span>
            </div>
          </div>

          {/* Tenure and Moratorium Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Repayment Tenure:
                </label>
                <span className="text-sm font-bold text-gray-900">{tenureYears} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                step="1"
                value={tenureYears} 
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[11px] text-gray-400 block mt-1">Months: {tenureYears * 12}</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Moratorium (Grace):
                </label>
                <span className="text-sm font-bold text-gray-900">{moratoriumMonths} Months</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="12" 
                step="1"
                value={moratoriumMonths} 
                onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[11px] text-gray-400 block mt-1">No principal EMI during grace</span>
            </div>
          </div>

        </div>

        {/* Right Side: Results & Repayment Breakdown */}
        <div className="w-full lg:w-2/5 bg-gray-50/80 p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col justify-between">
          
          <div>
            {/* Monthly EMI Big Display */}
            <div className="text-center p-5 bg-white rounded-xl border border-gray-200 shadow-xs mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Estimated Monthly EMI
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-700">
                {formatINR(results.monthlyEMI)}
              </div>
              <span className="text-[11px] text-gray-500 block mt-1.5">
                Calculated across {tenureYears * 12} monthly installments
              </span>
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-3 text-xs sm:text-sm bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Total Project Cost:</span>
                <span className="font-bold text-gray-900">{formatINR(projectCost)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Loan Principal ({loanPercentage}%):</span>
                <span className="font-bold text-blue-700">{formatINR(loanAmount)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Promoter Margin ({100 - loanPercentage}%):</span>
                <span className="font-bold text-emerald-700">{formatINR(promoterContribution)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Total Interest Payable:</span>
                <span className="font-bold text-gray-900">{formatINR(results.totalInterest)}</span>
              </div>

              <div className="flex justify-between py-2 pt-2.5">
                <span className="text-sm font-bold text-gray-900">Total Repayment:</span>
                <span className="text-base font-extrabold text-blue-900">{formatINR(results.totalRepayment)}</span>
              </div>
            </div>
          </div>

          {/* Action to find partners for this scheme */}
          <div className="mt-6 pt-4">
            <button 
              onClick={() => onLocatePartners(currentScheme ? currentScheme.code : 'ALL')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 size={16} />
              <span>Find Partners for this Scheme</span>
              <ArrowRight size={16} />
            </button>
            <p className="text-[11px] text-gray-400 mt-2.5 text-center flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Concessional figures based on official NSFDC rate cards.</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
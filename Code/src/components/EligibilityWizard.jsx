import React, { useState } from 'react';
import { Briefcase, GraduationCap, Check, ArrowRight, ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';
import { formatINR } from '../utils/calculator';

const EligibilityWizard = ({ t, lang, formData, setFormData, onEvaluate, activeIncomeCeiling }) => {
  const [step, setStep] = useState(1);

  const districts = [
    'Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 
    'Bhavnagar', 'Jamnagar', 'Junagadh', 'Kutch', 'Mehsana'
  ];

  const businessCategories = [
    { id: 'dairy', label: 'Dairy & Livestock', label_gu: 'ડેરી અને પશુપાલન', label_hi: 'डेयरी एवं पशुपालन' },
    { id: 'small_shop', label: 'Retail / Kirana Shop', label_gu: 'કરિયાણા / છૂટક દુકાન', label_hi: 'किराना / खुदरा दुकान' },
    { id: 'artisan', label: 'Artisan / Tailoring', label_gu: 'કારીગરી / સિલાઈ', label_hi: 'कारीगरी / सिलाई' },
    { id: 'manufacturing', label: 'Small Manufacturing', label_gu: 'નાના પાયે ઉત્પાદન', label_hi: 'लघु विनिर्माण' },
    { id: 'transport', label: 'Commercial Transport', label_gu: 'વાણિજ્યિક વાહન', label_hi: 'वाणिज्यिक वाहन' },
    { id: 'services', label: 'Service Business', label_gu: 'સેવા વ્યવસાય', label_hi: 'सेवा व्यवसाय' }
  ];

  const educationStreams = [
    { id: 'engineering', label: 'Engineering / IT (B.Tech)', label_gu: 'એન્જિનિયરિંગ / IT', label_hi: 'इंजीनियरिंग / बी.टेक' },
    { id: 'medical', label: 'Medical / Nursing (MBBS/BDS)', label_gu: 'મેડિકલ / નર્સિંગ', label_hi: 'मेडिकल / नर्सिंग' },
    { id: 'management', label: 'Management (MBA / CA)', label_gu: 'મેનેજમેન્ટ / MBA', label_hi: 'प्रबंधन / एमबीए' },
    { id: 'higher_education', label: 'Higher Degree / Research', label_gu: 'અનુસ્નાતક / ઉચ્ચ અભ્યાસ', label_hi: 'स्नातकोत्तर / शोध' }
  ];

  const costPresets = [100000, 140000, 450000, 800000, 1500000, 3000000];
  const incomePresets = [180000, 250000, 350000, 480000, 550000];

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((num, idx) => (
        <React.Fragment key={num}>
          <button
            type="button"
            onClick={() => setStep(num)}
            className={`flex items-center justify-center w-9 h-9 rounded-full border-2 font-bold text-xs transition cursor-pointer 
            ${step === num 
              ? 'border-blue-600 bg-blue-600 text-white shadow-sm' 
              : step > num 
              ? 'border-emerald-600 bg-emerald-600 text-white' 
              : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
          >
            {step > num ? <Check size={16} /> : num}
          </button>
          {idx < 2 && (
            <div className={`w-16 h-1 mx-2 rounded ${step > num ? 'bg-emerald-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto">
      <StepIndicator />
      
      <div className="min-h-[280px]">
        {/* STEP 1: Basic Eligibility */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Step 1 of 3</span>
              <h2 className="text-xl font-bold text-gray-900">Community & District</h2>
              <p className="text-xs text-gray-500 mt-0.5">NSFDC concessional schemes are dedicated to Scheduled Caste (SC) applicants.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                {t?.wizard?.qCategory || 'Do you belong to the Scheduled Caste (SC) community?'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => updateForm('isSC', true)}
                  className={`py-3 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition ${
                    formData.isSC === true 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <ShieldCheck size={18} className={formData.isSC === true ? 'text-blue-600' : 'text-gray-400'} />
                  <span>Yes, SC Community</span>
                </button>
                <button 
                  type="button"
                  onClick={() => updateForm('isSC', false)}
                  className={`py-3 px-4 rounded-xl border font-semibold text-sm transition ${
                    formData.isSC === false 
                      ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  No, Other
                </button>
              </div>

              {!formData.isSC && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-600" />
                  <span>Notice: NSFDC schemes require an official SC Caste Certificate. If not eligible, you will be guided to PM Mudra or general central banking options.</span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Your District in Gujarat</label>
              <select 
                value={formData.district || 'Ahmedabad'}
                onChange={(e) => updateForm('district', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-sm outline-none bg-white cursor-pointer"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Purpose */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Step 2 of 3</span>
              <h2 className="text-xl font-bold text-gray-900">What is your purpose?</h2>
              <p className="text-xs text-gray-500 mt-0.5">Select whether you need funding for an enterprise venture or higher education.</p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => { updateForm('purposeType', 'business'); updateForm('specificPurpose', 'dairy'); }}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                  formData.purposeType === 'business' 
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-500' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 shadow-sm">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Start / Expand Business</h4>
                  <p className="text-xs text-gray-500 mt-0.5">MFS, Term Loan, Udyam Nidhi</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { updateForm('purposeType', 'education'); updateForm('specificPurpose', 'engineering'); }}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                  formData.purposeType === 'education' 
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Higher Education</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Education Loan Scheme (ELS)</p>
                </div>
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                {formData.purposeType === 'business' ? 'Select Business Activity:' : 'Select Course / Faculty:'}
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {(formData.purposeType === 'business' ? businessCategories : educationStreams).map(cat => {
                  const isSelected = formData.specificPurpose === cat.id;
                  const label = lang === 'gu' && cat.label_gu ? cat.label_gu : lang === 'hi' && cat.label_hi ? cat.label_hi : cat.label;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateForm('specificPurpose', cat.id)}
                      className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm' 
                          : 'border-gray-200 text-gray-700 bg-gray-50 hover:bg-white hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Financials */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Step 3 of 3</span>
              <h2 className="text-xl font-bold text-gray-900">Project Cost & Family Income</h2>
              <p className="text-xs text-gray-500 mt-0.5">Official criteria require annual family income $\le$ ₹5,00,000.</p>
            </div>
            
            {/* Project Cost */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-gray-800">
                  Total Project Cost / Course Fee:
                </label>
                <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {formatINR(formData.projectCost)}
                </span>
              </div>
              
              <input
                type="number"
                step="25000"
                value={formData.projectCost || ''}
                onChange={(e) => updateForm('projectCost', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-2.5 font-bold text-gray-900"
                placeholder="Enter cost in Rupees..."
              />
              
              <div className="flex flex-wrap gap-1.5">
                {costPresets.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateForm('projectCost', preset)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                      formData.projectCost === preset
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {formatINR(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Income */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-gray-800">
                  Annual Family Income (all sources):
                </label>
                <span className={`text-sm font-bold px-2 py-0.5 rounded border ${
                  formData.annualIncome > activeIncomeCeiling
                    ? 'text-rose-700 bg-rose-50 border-rose-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  {formatINR(formData.annualIncome)}
                </span>
              </div>

              <input
                type="number"
                step="20000"
                value={formData.annualIncome || ''}
                onChange={(e) => updateForm('annualIncome', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-2.5 font-bold text-gray-900"
                placeholder="Enter annual income in Rupees..."
              />

              {formData.annualIncome > activeIncomeCeiling && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-medium mb-2.5 flex items-start gap-2">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-600" />
                  <span>Warning: Income exceeds the official NSFDC ceiling of {formatINR(activeIncomeCeiling)}. The rule engine will flag this profile.</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {incomePresets.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateForm('annualIncome', preset)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                      formData.annualIncome === preset
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {formatINR(preset)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between items-center">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 1}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
            step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition shadow-sm"
          >
            <span>Next Step</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onEvaluate}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition shadow-sm"
          >
            <span>Find Matching Schemes</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EligibilityWizard;
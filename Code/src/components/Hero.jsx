import React from 'react';
import { Briefcase, GraduationCap, ArrowRight, Search, Calculator, MapPin, Shield, CheckCircle, Users, FileText, TrendingUp, Clock, IndianRupee, Building2, ExternalLink, Star, MessageSquare, Bot } from 'lucide-react';

const Hero = ({ t, onStartWizard, onStartEducation, openCalculator, openPartners, openChat }) => {
  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              {t.hero.titlePrefix}{' '}
              <span className="text-blue-600">{t.hero.titleHighlight}</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
              {t.hero.subtitle}
            </p>

            <div className="mt-10 sm:flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onStartWizard}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition md:py-4 md:text-lg md:px-10"
              >
                <Search className="w-5 h-5 mr-2" />
                Find My Scheme
              </button>
              
              <button
                onClick={openChat}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 border border-blue-200 text-base font-bold rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition md:py-4 md:text-lg md:px-8"
              >
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Chat with Assistant
              </button>

              <button
                onClick={openCalculator}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition md:py-4 md:text-lg md:px-8"
              >
                <Calculator className="w-5 h-5 mr-2 text-gray-400" />
                Calculate EMI
              </button>
            </div>
          </div>

          {/* Quick Start Cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            
            {/* Card 1: Business */}
            <div
              onClick={onStartWizard}
              className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3.5">
                  <h3 className="text-base font-bold text-gray-900">Start / Expand Business</h3>
                  <p className="mt-0.5 text-xs text-gray-500">MFS, Term Loan, Udyam Nidhi</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Card 2: Education */}
            <div
              onClick={onStartEducation}
              className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-center">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <GraduationCap className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-3.5">
                  <h3 className="text-base font-bold text-gray-900">Higher Education Loan</h3>
                  <p className="mt-0.5 text-xs text-gray-500">Education Loan Scheme (ELS)</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Card 3: Chat Assistant */}
            <div
              onClick={openChat}
              className="bg-white rounded-xl border border-blue-200 p-5 cursor-pointer hover:border-blue-500 hover:shadow-sm transition-all bg-gradient-to-br from-white to-blue-50/40"
            >
              <div className="flex items-center">
                <div className="bg-blue-600 text-white rounded-lg p-3 shadow-xs">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="ml-3.5">
                  <h3 className="text-base font-bold text-blue-950">AI Scheme Assistant</h3>
                  <p className="mt-0.5 text-xs text-blue-700">Chat in plain language</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-blue-500" />
              </div>
            </div>

          </div>

          <div className="mt-8 text-center">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {t.hero.incomeLimitNotice}
            </span>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How SparkLine Works</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              From understanding your needs to connecting you with the right agency — in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', icon: FileText, title: 'Tell Us Your Need', desc: 'Select your purpose or chat with our assistant to describe your budget and family income.' },
              { step: '2', icon: CheckCircle, title: 'Get Matched Schemes', desc: 'Our rule engine evaluates your profile against official NSFDC policies and shows every scheme you qualify for with clear reasons.' },
              { step: '3', icon: IndianRupee, title: 'See Your EMI', desc: 'Use the interactive calculator to understand monthly repayment, interest, moratorium period, and total cost — all transparent.' },
              { step: '4', icon: MapPin, title: 'Find Your Partner', desc: 'Locate the nearest authorized Channel Partner (SCA, Bank, RRB) on the map that supports your scheme and is operationally active.' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Step {item.step}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Schemes Overview */}
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Available NSFDC Schemes</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Official concessional credit schemes for Scheduled Caste beneficiaries with family income up to Rs 5 Lakh per annum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { code: 'MFS', name: 'Micro Financing Scheme', rate: '6.5%', maxLoan: '1.25 Lakh', tenure: '3 Years', purpose: 'Small shops, artisans, vendors' },
              { code: 'TERM LOAN', name: 'Term Loan Scheme', rate: '8.0%', maxLoan: '45 Lakh', tenure: '7 Years', purpose: 'Dairy, manufacturing, transport' },
              { code: 'UNY', name: 'Udyam Nidhi Scheme', rate: '7.5%', maxLoan: '4.5 Lakh', tenure: '5 Years', purpose: 'Micro-enterprises, service units' },
              { code: 'ELS', name: 'Education Loan Scheme', rate: '6.5%', maxLoan: '40 Lakh', tenure: '10-12 Years', purpose: 'Engineering, medical, MBA' }
            ].map((scheme) => (
              <div key={scheme.code} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{scheme.code}</span>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">{scheme.rate} p.a.</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{scheme.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{scheme.purpose}</p>
                <div className="border-t border-gray-100 pt-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Max Loan</span>
                    <span className="font-semibold text-gray-900">Rs {scheme.maxLoan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tenure</span>
                    <span className="font-semibold text-gray-900">{scheme.tenure}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={onStartWizard}
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition"
            >
              Check Which Schemes You Qualify For <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Use SparkLine?</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Built to solve real problems faced by beneficiaries navigating government loan schemes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: '100% Rule-Based Matching', desc: 'No guesswork. Every recommendation is backed by official NSFDC eligibility rules with transparent "why matched" and "why not matched" explanations.' },
              { icon: TrendingUp, title: 'Transparent Financial Planning', desc: 'See your exact monthly EMI, total interest, moratorium period, and promoter contribution before you visit any agency. No hidden calculations.' },
              { icon: Building2, title: 'Smart Partner Routing', desc: 'We only route you to authorized Channel Partners that support your specific scheme and have healthy fund utilization. High-NPA or restricted agencies are filtered out.' },
              { icon: Users, title: 'Multilingual Support', desc: 'Use the platform in English, Hindi, or Gujarati. All questions, explanations, document lists, and scheme details are fully translated.' },
              { icon: Clock, title: 'Dynamic & Up-to-Date', desc: 'Scheme rules, income ceilings, interest rates, and partner statuses are stored in a dynamic database — not hard-coded. Admins can update them instantly.' },
              { icon: FileText, title: 'Document Checklist Ready', desc: 'For every recommended scheme, see the exact list of documents you need to prepare before visiting the Channel Partner — SC certificate, income proof, project report, and more.' }
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats / Trust Section */}
      <div className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '4', label: 'Official NSFDC Schemes' },
              { value: '102+', label: 'Channel Partners Nationwide' },
              { value: 'Rs 5L', label: 'Family Income Ceiling' },
              { value: '6.5%', label: 'Starting Interest Rate' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-extrabold text-blue-600">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Sources */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Grounded in Official Sources</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              All scheme data, eligibility rules, and financial parameters are sourced from official Government of India portals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'NSFDC Official Portal', url: 'https://nsfdc.nic.in', desc: 'National Scheduled Castes Finance and Development Corporation — primary source for scheme rules, rates, and partner data.' },
              { name: 'NSFDC FAQ & Policies', url: 'https://nsfdc.nic.in/faqs', desc: 'Official FAQ covering income ceilings, application routes, channel-finance model, and current scheme parameters.' },
              { name: 'PM-SURAJ Portal', url: 'https://pmsuraj.dosje.gov.in', desc: 'National digital portal for online scheme application under the Ministry of Social Justice and Empowerment.' }
            ].map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-gray-50 rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition"
              >
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  {source.name} <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{source.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to find your scheme?</h2>
          <p className="mt-4 text-blue-100 text-lg max-w-2xl mx-auto">
            Instead of visiting multiple offices, let SparkLine guide you to the right scheme, the right EMI plan, and the right Channel Partner — in under 3 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onStartWizard}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition"
            >
              <Search className="w-5 h-5 mr-2" />
              Start Scheme Matching
            </button>
            <button
              onClick={openPartners}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Browse Channel Partners
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
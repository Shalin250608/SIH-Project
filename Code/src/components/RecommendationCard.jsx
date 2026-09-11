import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText, ExternalLink, Calculator, Users, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../utils/calculator';

const RecommendationCard = ({ result, formData, t, lang, onOpenCalculator, onOpenPartners }) => {
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [showUnmatched, setShowUnmatched] = useState(false);

  useEffect(() => {
    if (result && result.eligible) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (result.allMatches && result.allMatches.length > 0) {
        setExpandedScheme(result.allMatches[0].scheme.code);
      }
    }
  }, [result]);

  if (!result) return null;

  const getLocalizedString = (obj, key, lang) => {
    if (!obj) return '';
    if (lang === 'hi' && obj[`${key}_hi`]) return obj[`${key}_hi`];
    if (lang === 'gu' && obj[`${key}_gu`]) return obj[`${key}_gu`];
    return obj[key] || '';
  };

  if (!result.eligible) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full shrink-0">
            <XCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Not Eligible for State Schemes</h2>
            <p className="text-gray-700 mb-4">{result.ineligibleReason}</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Alternative Options</h3>
              <p className="text-sm text-gray-600 mb-3">You may still be eligible for central government schemes.</p>
              <a 
                href="https://pmsuraj.dosje.gov.in/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Visit PM-SURAJ Portal <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const toggleExpand = (code) => {
    setExpandedScheme(expandedScheme === code ? null : code);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-600" size={24} />
          <h2 className="text-lg font-medium text-green-900">
            You are eligible for {result.allMatches.length} scheme(s)
          </h2>
        </div>
      </div>

      <div className="grid gap-4">
        {result.allMatches.map((match, index) => {
          const scheme = match.scheme;
          const isExpanded = expandedScheme === scheme.code;
          const isBestMatch = index === 0;

          return (
            <div key={scheme.code} className={`bg-white rounded-xl shadow-sm border transition-all ${isBestMatch ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-200'}`}>
              <div 
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                onClick={() => toggleExpand(scheme.code)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{getLocalizedString(scheme, 'name', lang)}</h3>
                    {isBestMatch && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star size={12} className="fill-current" /> Best Match
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-mono">CODE: {scheme.code}</p>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="block text-gray-500">Max Loan</span>
                    <span className="font-semibold text-gray-900">{formatINR(scheme.maxLoanAmount)}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Interest</span>
                    <span className="font-semibold text-gray-900">{scheme.interestRate}% p.a.</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Tenure</span>
                    <span className="font-semibold text-gray-900">{scheme.tenureYears} yrs</span>
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50 rounded-b-xl">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" /> Why this matches
                      </h4>
                      <ul className="space-y-2">
                        {match.reasons.map((reason, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span> {reason}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onOpenCalculator(scheme); }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Calculator size={16} /> Calculate EMI
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onOpenPartners(scheme); }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Users size={16} /> Find Partners
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" /> Documents Required
                      </h4>
                      <ul className="list-decimal list-inside space-y-1">
                        {scheme.documents?.map((doc, i) => (
                          <li key={i} className="text-sm text-gray-600">{doc}</li>
                        ))}
                      </ul>
                      
                      <div className="mt-6 text-xs text-gray-500 bg-white p-3 rounded border border-gray-200">
                        <p><strong>Source:</strong> <a href={scheme.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{scheme.officialSource}</a></p>
                        <p className="mt-1"><strong>Verified:</strong> {scheme.verifiedAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {result.unmatchedSchemes && result.unmatchedSchemes.length > 0 && (
        <div className="mt-8 border border-gray-200 rounded-xl bg-white overflow-hidden">
          <button 
            onClick={() => setShowUnmatched(!showUnmatched)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-700">Why other schemes did not match ({result.unmatchedSchemes.length})</span>
            {showUnmatched ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
          </button>
          
          {showUnmatched && (
            <div className="p-4 divide-y divide-gray-100">
              {result.unmatchedSchemes.map((match) => (
                <div key={match.scheme.code} className="py-3 first:pt-0 last:pb-0">
                  <h4 className="font-medium text-gray-800 text-sm mb-2">{match.scheme.name}</h4>
                  <ul className="space-y-1">
                    {match.rejectionReasons.map((reason, i) => (
                      <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                        <XCircle size={14} className="mt-0.5 shrink-0" /> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
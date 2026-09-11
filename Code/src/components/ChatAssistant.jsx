import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, ArrowRight, Sparkles, CheckCircle2, Key, RefreshCw, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/calculator';

const DEFAULT_GEMINI_API_KEY = "";

const GEMINI_SYSTEM_PROMPT = `
You are the official AI Scheme Assistant for SparkLine (SIH26092) - an AI-driven platform for Marginalized Scheduled Caste (SC) Entrepreneurs & Students in India, aligned with NSFDC (National Scheduled Castes Finance and Development Corporation).

Official Scheme Knowledge:
1. Micro Financing Scheme (MFS):
   - Project Cost: up to Rs 1,40,000 | Max Loan: Rs 1,25,000 (90%)
   - Interest: 6.5% p.a. | Tenure: Up to 3 years | Moratorium: 3 months
   - Target: Small vendors, artisans, kirana shops, vegetable vendors, micro trades.

2. Term Loan Scheme:
   - Project Cost: up to Rs 50,00,000 | Max Loan: Rs 45,00,000 (90%)
   - Interest: 8.0% p.a. | Tenure: Up to 7 years | Moratorium: 6 months
   - Target: Dairy farming, small manufacturing, commercial transport, agro-processing, service businesses.

3. Udyam Nidhi Scheme:
   - Project Cost: up to Rs 5,00,000 | Max Loan: Rs 4,50,000 (90%)
   - Interest: 7.5% p.a. | Tenure: Up to 5 years | Moratorium: 3 months
   - Target: Micro-enterprises, service units, skill-based shops.

4. Educational Loan Scheme (ELS):
   - Course Cost: up to Rs 40,00,000 (India) / Rs 40L (Abroad)
   - Interest: 6.5% p.a. (Special 0.5% rebate for women = 6.0% p.a.)
   - Tenure: 10 to 12 years | Moratorium: Course duration + 6 months
   - Target: Professional higher degrees (Engineering/B.Tech, Medical/MBBS, Management/MBA, Technical diplomas).

Key Eligibility Rules:
- Beneficiary MUST belong to the Scheduled Caste (SC) community with an official caste certificate.
- Annual family income must NOT exceed Rs 5,00,000 per annum from all sources (Jan 2026 NSFDC guidelines).
- Channel Partners in Gujarat: GSCDC (State Channelizing Agency), Bank of Baroda Lead Bank, SBI, Baroda Gujarat Gramin Bank (RRB).

Instructions:
- Answer every user question helpfully, politely, and factually based on official NSFDC policies.
- Respond in the language used by the user (English, Hindi, or Gujarati).
- Keep answers structured with bullet points and clear numbers.
`;

export default function ChatAssistant({ isOpen, onClose, t, lang, onApplyToWizard, onOpenCalculator }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('sparkline_gemini_api_key') || '';
    } catch (e) {
      return '';
    }
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial greeting based on language
  useEffect(() => {
    const greeting = lang === 'gu'
      ? "નમસ્તે! હું સ્પાર્કલાઇન Google Gemini AI સહાયક છું. તમે મને NSFDC સરકારી લોન યોજનાઓ, વ્યાજ દરો, પાત્રતા અથવા તમારા વ્યવસાયનું આયોજન ગમે ત્યારે પૂછી શકો છો. હું તમને કેવી રીતે મદદ કરી શકું?"
      : lang === 'hi'
      ? "नमस्ते! मैं स्पार्कलाइन Google Gemini AI सहायक हूँ। आप मुझसे NSFDC सरकारी ऋण योजनाओं, ब्याज दरों, पात्रता नियमों के बारे में पूछ सकते हैं या अपनी व्यावसायिक योजना बता सकते हैं। मैं आपकी क्या सहायता कर सकता हूँ?"
      : "Hello! I am the SparkLine Scheme Assistant powered by Google Gemini AI. You can ask me any question about NSFDC government loans, eligibility criteria, interest rates, or your business and education plans. How can I help you today?";

    setMessages([
      { id: 'initial', sender: 'bot', text: greeting, timestamp: new Date() }
    ]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: "Dairy farm with ₹8L budget", text: "I want to start a dairy farm in Ahmedabad with ₹8 Lakh project cost and ₹3.5 Lakh family income." },
    { label: "Higher education loan", text: "Need an education loan of ₹15 Lakh for engineering with ₹4 Lakh annual income." },
    { label: "Small tailoring shop (₹1L)", text: "I want to open a small tailoring shop with ₹1 Lakh project cost." },
    { label: "What is the income ceiling?", text: "What is the annual family income ceiling for NSFDC schemes?" },
    { label: "What documents are required?", text: "What documents are needed to apply for NSFDC concessional loans?" }
  ];

  // Helper to extract structured parameters from natural language
  const extractParameters = (query) => {
    const q = query.toLowerCase();
    let purpose = 'business';
    let specific = 'dairy';
    let cost = 800000;
    let income = 350000;
    let detected = false;

    if (q.includes('study') || q.includes('education') || q.includes('college') || q.includes('engineering') || q.includes('medical') || q.includes('b.tech') || q.includes('mbbs') || q.includes('shikshan')) {
      purpose = 'education';
      specific = q.includes('medical') || q.includes('mbbs') ? 'medical' : 'engineering';
      cost = 1500000;
      detected = true;
    } else if (q.includes('dairy') || q.includes('cow') || q.includes('buffalo') || q.includes('milk') || q.includes('pashu')) {
      purpose = 'business';
      specific = 'dairy';
      detected = true;
    } else if (q.includes('tailor') || q.includes('silai') || q.includes('artisan') || q.includes('handicraft')) {
      purpose = 'business';
      specific = 'artisan';
      cost = 100000;
      detected = true;
    } else if (q.includes('shop') || q.includes('retail') || q.includes('kirana') || q.includes('dukaan')) {
      purpose = 'business';
      specific = 'small_shop';
      cost = 140000;
      detected = true;
    } else if (q.includes('manufactur') || q.includes('factory') || q.includes('workshop')) {
      purpose = 'business';
      specific = 'manufacturing';
      cost = 1200000;
      detected = true;
    }

    const lakhMatches = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l\b)/g);
    if (lakhMatches && lakhMatches.length > 0) {
      detected = true;
      const parsedValues = lakhMatches.map(m => {
        const num = parseFloat(m.replace(/[^\d.]/g, ''));
        return num * 100000;
      });

      if (parsedValues.length >= 2) {
        cost = Math.max(parsedValues[0], parsedValues[1]);
        income = Math.min(parsedValues[0], parsedValues[1]);
      } else if (parsedValues.length === 1) {
        cost = parsedValues[0];
      }
    }

    return detected ? {
      purposeType: purpose,
      specificPurpose: specific,
      projectCost: cost,
      annualIncome: income,
      district: 'Ahmedabad'
    } : null;
  };

  // Local Offline Fallback Engine (used ONLY if offline/network fails)
  const localFallbackQuery = (query) => {
    const q = query.toLowerCase();
    if (q.includes('income') && (q.includes('ceiling') || q.includes('limit') || q.includes('maximum'))) {
      return "Under official NSFDC guidelines (Jan 2026), the annual family income ceiling is ₹5,00,000 per annum from all sources.";
    }
    if (q.includes('document') || q.includes('paper') || q.includes('certificate')) {
      return "The primary documents required are:\n1. SC Caste Certificate issued by competent revenue authority\n2. Annual Family Income Certificate (<= ₹5 Lakh)\n3. Project Report or item quotation from suppliers\n4. Aadhaar Card / Voter ID for KYC\n5. Bank passbook with IFSC code";
    }
    if (q.includes('interest') && (q.includes('rate') || q.includes('vyaj'))) {
      return "Official NSFDC Interest Rates:\n• Micro Financing Scheme (MFS): 6.5% p.a.\n• Term Loan Scheme: 8.0% p.a.\n• Udyam Nidhi Scheme: 7.5% p.a.\n• Education Loan Scheme (ELS): 6.5% p.a. (6.0% for female students).";
    }
    return "Under NSFDC guidelines, concessional loans are provided for SC beneficiaries with income up to ₹5L across Micro Financing (up to ₹1.4L), Term Loans (up to ₹50L), Udyam Nidhi (up to ₹5L), and Education Loans (up to ₹40L).";
  };

  // Call Google AI Studio / Gemini API with Multi-Turn Support
  const callGeminiAPI = async (userQuery, previousMessages) => {
    const activeKey = apiKey ? apiKey.trim() : '';
    if (!activeKey) {
      throw new Error('No Gemini API key provided. Using built-in offline NSFDC intelligence engine.');
    }

    // Supported active models in order of preference
    const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];

    // Construct valid alternating history starting strictly with 'user'
    const conversationTurns = [];
    
    // Scan previous messages (skip initial greeting)
    for (const msg of previousMessages) {
      if (msg.id === 'initial') continue;
      if (!msg.text || !msg.text.trim()) continue;

      const role = msg.sender === 'user' ? 'user' : 'model';

      // Ensure strict alternating pattern required by Gemini API
      if (conversationTurns.length === 0) {
        if (role === 'user') {
          conversationTurns.push({ role: 'user', parts: [{ text: msg.text }] });
        }
      } else {
        const lastRole = conversationTurns[conversationTurns.length - 1].role;
        if (role !== lastRole) {
          conversationTurns.push({ role, parts: [{ text: msg.text }] });
        }
      }
    }

    // Append current user turn
    if (conversationTurns.length > 0 && conversationTurns[conversationTurns.length - 1].role === 'user') {
      conversationTurns[conversationTurns.length - 1] = { role: 'user', parts: [{ text: userQuery }] };
    } else {
      conversationTurns.push({ role: 'user', parts: [{ text: userQuery }] });
    }

    const payload = {
      contents: conversationTurns,
      systemInstruction: {
        parts: [{ text: GEMINI_SYSTEM_PROMPT }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    let lastError = null;

    // Try models in sequence
    for (const modelName of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${activeKey}`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': activeKey
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return reply;
        } else {
          const errText = await res.text();
          console.warn(`Model ${modelName} returned status ${res.status}:`, errText);
          lastError = new Error(`Status ${res.status}: ${errText}`);
        }
      } catch (e) {
        console.warn(`Fetch to ${modelName} failed:`, e.message);
        lastError = e;
      }
    }

    throw lastError || new Error("Failed to get response from Gemini API");
  };

  const handleSend = async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };

    // Save previous messages snapshot for multi-turn history
    const prevHistory = [...messages];
    
    // Immediately show user message in UI
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const extractedData = extractParameters(trimmed);

    try {
      // Call live Gemini API with user query and previous context
      const aiResponseText = await callGeminiAPI(trimmed, prevHistory);
      
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: aiResponseText,
        extractedData: extractedData,
        isLiveGemini: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('Gemini API call error, using local engine:', err.message);
      
      const fallbackText = localFallbackQuery(trimmed);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackText,
        extractedData: extractedData,
        isLiveGemini: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApply = (data) => {
    onApplyToWizard(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        
        {/* Chat Header with Gemini Status */}
        <div className="bg-slate-900 text-white p-4 px-6 flex justify-between items-center shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">SparkLine Scheme Assistant</h3>
                <span className="bg-blue-950 border border-blue-500/40 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Google Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Ask any question or describe your loan requirements</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              title="API Key Configuration"
            >
              <Key size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Optional API Key Inspector Bar */}
        {showKeyInput && (
          <div className="bg-slate-800 p-3 px-6 text-xs text-white border-b border-slate-700 flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2">
              <Key size={14} className="text-blue-400 shrink-0" />
              <span className="font-medium text-slate-300">Gemini Key:</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API key..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded px-2.5 py-1 text-xs text-white font-mono outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setShowKeyInput(false);
                try {
                  if (apiKey && apiKey.trim()) {
                    localStorage.setItem('sparkline_gemini_api_key', apiKey.trim());
                    alert('Gemini API key saved to browser storage!');
                  } else {
                    localStorage.removeItem('sparkline_gemini_api_key');
                    alert('Gemini API key cleared. Using built-in offline NSFDC intelligence engine.');
                  }
                } catch (e) {}
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded font-bold text-white text-xs cursor-pointer"
            >
              Save
            </button>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/70">
          
          {/* Quick Suggestion Chips */}
          <div className="pb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Suggested Questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.text)}
                  className="text-xs bg-white hover:bg-blue-50 hover:border-blue-300 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium transition shadow-xs cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                    <Sparkles size={13} />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isBot 
                    ? 'bg-white text-gray-800 border border-gray-200 shadow-xs' 
                    : 'bg-blue-600 text-white font-medium shadow-sm'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* 1-Click Action Button when details are extracted */}
                  {msg.extractedData && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100">
                      <button
                        onClick={() => handleApply(msg.extractedData)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 size={15} />
                        <span>Check Eligibility with these inputs</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <User size={13} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                <Sparkles size={13} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-3 px-4 shadow-xs flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Gemini is thinking</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or describe your business plan..."
              className="flex-1 p-2.5 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={`p-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center transition ${
                input.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={15} />
            </button>
          </form>
          <div className="mt-1.5 px-1 flex justify-between items-center text-[10px] text-gray-400">
            <span>Powered by Google Gemini 3.6 Flash • Multi-Turn Memory Active</span>
            <span>English • हिन्दी • ગુજરાતી</span>
          </div>
        </div>

      </div>
    </div>
  );
}
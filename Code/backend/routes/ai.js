const express = require('express');
const router = express.Router();

const SCHEME_KNOWLEDGE = [
  {
    code: 'MFS',
    name: 'Micro Financing Scheme (MFS)',
    maxLoan: '₹1,40,000',
    interest: '6.5% p.a.',
    tenure: '3 to 5 years',
    subsidy: 'Direct small unit funding',
    keywords: ['micro', 'small shop', 'dairy', 'artisan', 'chai', 'sewing', 'tailor', 'chota vyapar', 'dukan']
  },
  {
    code: 'TERM_LOAN',
    name: 'Term Loan Scheme',
    maxLoan: '₹50,00,000 (Up to ₹15 Lakhs under normal guidelines)',
    interest: '8.0% - 9.0% p.a.',
    tenure: 'Up to 10 years (moratorium up to 12 months)',
    subsidy: 'Up to 90% project cost financed',
    keywords: ['term loan', 'manufacturing', 'transport', 'tractor', 'taxi', 'vehicle', 'factory', 'workshop', 'plant']
  },
  {
    code: 'MSY',
    name: 'Mahila Samriddhi Yojana (MSY)',
    maxLoan: '₹1,40,000',
    interest: '4.0% p.a. (Special concession for women)',
    tenure: '3 years',
    subsidy: 'Exclusive low-interest scheme for SC women entrepreneurs',
    keywords: ['mahila', 'woman', 'women', 'female', 'shg', 'stree', 'nari', 'samriddhi']
  },
  {
    code: 'ELS',
    name: 'Education Loan Scheme (ELS)',
    maxLoan: '₹20,00,000 (Domestic) / ₹40,00,000 (Abroad)',
    interest: '4.0% for Girls / 4.5% for Boys',
    tenure: 'Up to 15 years (starts 6 months after course completion)',
    subsidy: 'Concessional interest rate for professional courses (MBBS, B.Tech, MBA, Higher Studies abroad)',
    keywords: ['education', 'study', 'college', 'abroad', 'foreign', 'engineering', 'medical', 'btech', 'mbbs', 'scholarship', 'course', 'degree']
  },
  {
    code: 'UDYAM_NIDHI',
    name: 'NSFDC Udyam Nidhi Scheme',
    maxLoan: '₹10,00,000',
    interest: '7.5% p.a.',
    tenure: 'Up to 7 years',
    subsidy: 'Special enterprise credit with fast-track processing',
    keywords: ['udyam', 'business', 'credit', 'expansion', 'enterprise']
  }
];

// Offline scheme advisor
function generateSchemeAdvice(query, lang) {
  const q = (query || '').toLowerCase();
  
  // Find matching scheme
  let matched = SCHEME_KNOWLEDGE.find(s => s.keywords.some(k => q.includes(k)));
  if (!matched) {
    matched = SCHEME_KNOWLEDGE[0]; // default MFS
  }

  if (lang === 'gu') {
    return `SparkLine સહાયક: તમારા પ્રશ્ન "${query}" માટે:\n\n` +
      `📌 ભલામણ કરેલ યોજના: **${matched.name}**\n` +
      `• મહત્તમ લોન: **${matched.maxLoan}**\n` +
      `• વ્યાજ દર: **${matched.interest}**\n` +
      `• પરત ચૂકવણી મુદત: **${matched.tenure}**\n` +
      `• મુખ્ય લાભ: ${matched.subsidy}\n\n` +
      `💡 પાત્રતા: અનુસૂચિત જાતિ (SC) પરિવારો જે ગુજરાતમાં રહે છે. વાર્ષિક આવક મર્યાદા ₹3,00,000 (અથવા કૌટુંબિક માપદંડ) હેઠળ હોવી જોઈએ.\n\n` +
      `તમે કેલ્ક્યુલેટરમાં જઈને EMI ગણી શકો છો અને નજીકના GSCDC અથવા બેંક શાખાનો સંપર્ક કરી શકો છો!`;
  }

  if (lang === 'hi') {
    return `SparkLine सहायक: आपके प्रश्न "${query}" के अनुसार:\n\n` +
      `📌 सुझाई गई योजना: **${matched.name}**\n` +
      `• अधिकतम ऋण राशि: **${matched.maxLoan}**\n` +
      `• ब्याज दर: **${matched.interest}**\n` +
      `• पुनर्भुगतान अवधि: **${matched.tenure}**\n` +
      `• मुख्य लाभ: ${matched.subsidy}\n\n` +
      `💡 पात्रता: गुजरात के अनुसूचित जाति (SC) समुदाय के नागरिक। वार्षिक पारिवारिक आय ₹3,00,000 की सीमा के भीतर होनी चाहिए।\n\n` +
      `आप हमारे पोर्टल पर ईएमआई कैलकुलेटर की मदद से किस्त देख सकते हैं और सीधे अधिकृत GSCDC या बैंक चैनल पार्टनर से संपर्क कर सकते हैं!`;
  }

  return `SparkLine AI Assistant: For your query regarding "${query}":\n\n` +
    `📌 Recommended Scheme: **${matched.name}**\n` +
    `• Maximum Loan: **${matched.maxLoan}**\n` +
    `• Interest Rate: **${matched.interest}**\n` +
    `• Repayment Tenure: **${matched.tenure}**\n` +
    `• Key Highlight: ${matched.subsidy}\n\n` +
    `💡 Eligibility: Scheduled Caste (SC) citizens residing in Gujarat. Annual family income ceiling ₹3,00,000 applies for concessional rates.\n\n` +
    `You can use our Financial Calculator to simulate your monthly EMI and locate the nearest GSCDC or Bank Channel Partner!`;
}

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, lang } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() && apiKey !== 'YOUR_GEMINI_API_KEY') {
      try {
        const prompt = `You are SparkLine AI, an official and empathetic virtual advisor for NSFDC & GSCDC Scheduled Caste welfare credit schemes in Gujarat, India.
Guidelines:
- Provide accurate advice about NSFDC loan schemes (Micro Financing Scheme, Term Loan, Mahila Samriddhi Yojana, Education Loan).
- Mention interest rates (typically 4% to 8%), maximum loan ceilings, promoter contribution (5% to 15%), and channel partner banks (GSCDC, Bank of Baroda, SBI).
- Always be helpful, respectful, and clear.
- Respond in the user language (${lang === 'gu' ? 'Gujarati' : lang === 'hi' ? 'Hindi' : 'English'}).
User query: "${message}"`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const json = await response.json();
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.json({ success: true, reply: text, source: 'gemini' });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini proxy error, falling back to local scheme intelligence:', geminiErr.message);
      }
    }

    // Fallback: Local Scheme Intelligence Engine
    const localReply = generateSchemeAdvice(message, lang);
    return res.json({ success: true, reply: localReply, source: 'local_scheme_engine' });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ success: false, error: 'AI service unavailable' });
  }
});

module.exports = router;
// Official NSFDC Schemes Database (Dynamic & Versioned)
// Reference: NSFDC FAQ (Effective Jan 2026) & Official Scheme Compendium

export const INITIAL_SCHEMES = [
  {
    id: "MFS",
    code: "MFS",
    name: "Micro Financing Scheme (MFS)",
    name_hi: "माइक्रो फाइनेंसिंग योजना (MFS)",
    name_gu: "માઇક્રો ફાઇનાન્સિંગ યોજના (MFS)",
    category: "business",
    purpose: ["micro_trade", "artisan", "small_shop", "vegetable_vendor", "tailoring", "handicraft", "dairy"],
    targetGroup: "Micro-entrepreneurs, small artisans and vendors seeking quick working capital",
    targetGroup_hi: "सूक्ष्म उद्यमी, छोटे कारीगर और विक्रेता जो त्वरित कार्यशील पूंजी चाहते हैं",
    targetGroup_gu: "ઝડપી કાર્યકારી મૂડી મેળવવા માંગતા નાના કારીગરો અને વેપારીઓ",
    minProjectCost: 10000,
    maxProjectCost: 140000, // Rs 1.40 Lakh
    maxLoanAmount: 125000,   // Rs 1.25 Lakh (Up to 90-95%)
    maxLoanPercentage: 90,
    promoterContribution: 10, // 5-10%
    interestRate: 6.5,       // 6.5% p.a.
    womenInterestRebate: 0.5,
    tenureYears: 3,          // Up to 3 years
    moratoriumMonths: 3,     // 3 months
    incomeCeiling: 500000,   // Rs 5.00 Lakh
    channelPartners: ["SCA", "RRB", "NBFC_MFI", "COOPERATIVE_BANK"],
    documents: [
      "SC Caste Certificate issued by Revenue Authority",
      "Income Certificate showing annual family income <= Rs 5 Lakh",
      "Aadhaar Card / Voter ID for KYC",
      "Bank Account Passbook with IFSC",
      "Simple Project quotation or estimate of items"
    ],
    documents_hi: [
      "राजस्व प्राधिकरण द्वारा जारी अनुसूचित जाति (SC) प्रमाण पत्र",
      "वार्षिक पारिवारिक आय <= 5 लाख दर्शाने वाला आय प्रमाण पत्र",
      "केवाईसी के लिए आधार कार्ड / मतदाता पहचान पत्र",
      "आईएफएससी कोड वाली बैंक खाता पासबुक",
      "सामग्री का सामान्य परियोजना कोटेशन या अनुमान"
    ],
    documents_gu: [
      "સક્ષમ અધિકારી દ્વારા જારી કરાયેલું SC જાતિ પ્રમાણપત્ર",
      "વાર્ષિક કૌટુંબિક આવક <= ₹5 લાખ દર્શાવતો આવકનો દાખલો",
      "કેવાયસી માટે આધાર કાર્ડ / ચૂંટણી કાર્ડ",
      "IFSC કોડ સાથે બેંક પાસબુક",
      "પ્રોજેક્ટ ક્વોટેશન અથવા સાધનોનો અંદાજ"
    ],
    officialSource: "NSFDC FAQ Jan 2026 (Sec 1.4)",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    version: "2026.01",
    verifiedAt: "2026-09-10"
  },
  {
    id: "TERM_LOAN",
    code: "TERM_LOAN",
    name: "Term Loan Scheme",
    name_hi: "टर्म लोन (सावधि ऋण) योजना",
    name_gu: "ટર્મ લોન યોજના",
    category: "business",
    purpose: ["dairy", "manufacturing", "transport", "retail", "services", "agro_processing", "engineering"],
    targetGroup: "Medium to larger commercial business, equipment purchases, transport and industrial ventures",
    targetGroup_hi: "मध्यम से बड़े व्यावसायिक उद्यम, उपकरण खरीद, परिवहन और औद्योगिक इकाइयां",
    targetGroup_gu: "મધ્યમથી મોટા વ્યાપારી એકમો, મશીનરી ખરીદી, પરિવહન અને ઔદ્યોગિક સાહસો",
    minProjectCost: 140001, // > Rs 1.40 Lakh
    maxProjectCost: 5000000, // Up to Rs 50.00 Lakh
    maxLoanAmount: 4500000,   // Up to Rs 45.00 Lakh (90%)
    maxLoanPercentage: 90,
    promoterContribution: 10,
    interestRate: 8.0,       // 8% p.a.
    womenInterestRebate: 0.5,
    tenureYears: 7,          // Up to 7 years
    moratoriumMonths: 6,     // 6 months (can extend up to 12 for agro/dairy)
    incomeCeiling: 500000,   // Rs 5.00 Lakh
    channelPartners: ["SCA", "PSB", "RRB"],
    documents: [
      "SC Caste Certificate issued by competent authority",
      "Income Certificate (annual family income <= Rs 5 Lakh)",
      "Detailed Project Report (DPR) / Machinery Quotations",
      "Premises Rent Agreement or Land Ownership Papers",
      "Last 6 Months Bank Statement & KYC Documents",
      "PAN Card & Aadhaar Card"
    ],
    documents_hi: [
      "सक्षम प्राधिकारी द्वारा जारी अनुसूचित जाति (SC) प्रमाण पत्र",
      "आय प्रमाण पत्र (पारिवारिक आय <= 5 लाख रुपये)",
      "विस्तृत प्रोजेक्ट रिपोर्ट (DPR) / मशीनरी कोटेशन",
      "किरायानामा या भूमि स्वामित्व दस्तावेज",
      "पिछले 6 महीने का बैंक स्टेटमेंट और केवाईसी",
      "पैन कार्ड और आधार कार्ड"
    ],
    documents_gu: [
      "સક્ષમ અધિકારી દ્વારા અપાયેલું SC જાતિ પ્રમાણપત્ર",
      "આવકનો દાખલો (કૌટુંબિક આવક <= ₹5 લાખ)",
      "વિગતવાર પ્રોજેક્ટ રિપોર્ટ (DPR) / મશીનરી ક્વોટેશન",
      "ભાડાકરાર અથવા જમીનના દસ્તાવેજ",
      "છેલ્લા ૬ મહિનાનું બેંક સ્ટેટમેન્ટ અને કેવાયસી",
      "પાન કાર્ડ અને આધાર કાર્ડ"
    ],
    officialSource: "NSFDC Scheme Compendium & FAQ",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    version: "2026.01",
    verifiedAt: "2026-09-10"
  },
  {
    id: "UDYAM_NIDHI",
    code: "UDYAM_NIDHI",
    name: "Udyam Nidhi Scheme (UNY)",
    name_hi: "उद्यम निधि योजना (UNY)",
    name_gu: "ઉદ્યમ નિધિ યોજના (UNY)",
    category: "business",
    purpose: ["retail", "services", "small_shop", "tailoring", "food_stall", "agro_processing", "artisan"],
    targetGroup: "Micro-enterprises and service activities requiring flexible capital up to Rs 5 Lakh",
    targetGroup_hi: "सूक्ष्म उद्यम और सेवा गतिविधियां जिन्हें 5 लाख रुपये तक की लचीली पूंजी की आवश्यकता है",
    targetGroup_gu: "₹૫ લાખ સુધીની મૂડીની જરૂરિયાત ધરાવતા નાના ઉદ્યોગો અને સેવા વ્યવસાયો",
    minProjectCost: 50000,
    maxProjectCost: 500000,  // Up to Rs 5.00 Lakh
    maxLoanAmount: 450000,   // Up to Rs 4.50 Lakh (90%)
    maxLoanPercentage: 90,
    promoterContribution: 10,
    interestRate: 7.5,       // Channel dependent (7.0 - 8.0%)
    womenInterestRebate: 0.5,
    tenureYears: 5,          // Up to 5 years
    moratoriumMonths: 3,     // 3 months
    incomeCeiling: 500000,   // Rs 5.00 Lakh
    channelPartners: ["SCA", "RRB", "PSB", "COOPERATIVE_BANK"],
    documents: [
      "SC Caste Certificate",
      "Income Certificate (family income <= Rs 5 Lakh)",
      "Udyam Registration (free online MSME registration if available)",
      "Project quotation / Bills estimate",
      "Aadhaar & Bank Account Passbook"
    ],
    documents_hi: [
      "अनुसूचित जाति (SC) प्रमाण पत्र",
      "आय प्रमाण पत्र (पारिवारिक आय <= 5 लाख रुपये)",
      "उद्यम पंजीकरण (यदि उपलब्ध हो)",
      "प्रोजेक्ट कोटेशन या बिल का अनुमान",
      "आधार कार्ड और बैंक खाता पासबुक"
    ],
    documents_gu: [
      "SC જાતિ પ્રમાણપત્ર",
      "આવકનો દાખલો (કૌટુંબિક આવક <= ₹5 લાખ)",
      "ઉદ્યમ નોંધણી (જો ઉપલબ્ધ હોય તો)",
      "સાધન સામગ્રીનું ક્વોટેશન",
      "આધાર કાર્ડ અને બેંક પાસબુક"
    ],
    officialSource: "NSFDC Official FAQ",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    version: "2026.01",
    verifiedAt: "2026-09-10"
  },
  {
    id: "ELS",
    code: "ELS",
    name: "Educational Loan Scheme (ELS)",
    name_hi: "शिक्षा ऋण योजना (ELS)",
    name_gu: "શિક્ષણ લોન યોજના (ELS)",
    category: "education",
    purpose: ["higher_education", "engineering", "medical", "management", "technical_courses", "study_abroad"],
    targetGroup: "SC students pursuing recognized full-time professional or technical higher degrees",
    targetGroup_hi: "मान्यता प्राप्त पूर्णकालिक व्यावसायिक या तकनीकी उच्च शिक्षा प्राप्त करने वाले SC छात्र",
    targetGroup_gu: "માન્યતા પ્રાપ્ત વ્યવસાયિક કે ટેકનિકલ ઉચ્ચ શિક્ષણ મેળવતા SC વિદ્યાર્થીઓ",
    minProjectCost: 50000,
    maxProjectCost: 4000000, // Up to Rs 40.00 Lakh
    maxLoanAmount: 4000000,   // Up to Rs 40 Lakh or 90-100% of course fee
    maxLoanPercentage: 90,
    promoterContribution: 10,
    interestRate: 6.5,       // 6.5% p.a. (6.0% for female students)
    womenInterestRebate: 0.5, // Female students pay 6.0%
    tenureYears: 10,         // Repayment up to 10-12 years
    moratoriumMonths: 12,    // Course duration + 6 months
    incomeCeiling: 500000,   // Rs 5.00 Lakh
    channelPartners: ["SCA", "PSB"],
    documents: [
      "SC Caste Certificate of student and parent/guardian",
      "Annual Family Income Certificate (<= Rs 5 Lakh)",
      "Admission confirmation letter from recognized institution/university",
      "Fee structure breakdown attested by university/college",
      "Marksheets of 10th, 12th, or Graduation",
      "Collateral security documents (if loan > Rs 7.5 Lakh per norms)"
    ],
    documents_hi: [
      "छात्र और माता-पिता का अनुसूचित जाति (SC) प्रमाण पत्र",
      "वार्षिक पारिवारिक आय प्रमाण पत्र (<= 5 लाख रुपये)",
      "मान्यता प्राप्त संस्थान से प्रवेश पुष्टि पत्र",
      "कॉलेज द्वारा सत्यापित फीस संरचना का विवरण",
      "10वीं, 12वीं या स्नातक की अंकतालिकाएं",
      "संपार्श्विक प्रतिभूति दस्तावेज (यदि 7.5 लाख रुपये से अधिक हो)"
    ],
    documents_gu: [
      "વિદ્યાર્થી અને વાલીનું SC જાતિ પ્રમાણપત્ર",
      "વાર્ષિક કૌટુંબિક આવકનો દાખલો (<= ₹5 લાખ)",
      "માન્યતા પ્રાપ્ત કૉલેજમાંથી એડમિશન કન્ફર્મેશન લેટર",
      "કૉલેજ દ્વારા પ્રમાણિત ફીનું માળખું",
      "ધોરણ ૧૦, ૧૨ અથવા ગ્રેજ્યુએશનની માર્કશીટ",
      "જરૂરી જામીનગીરી દસ્તાવેજ (જો લોન ₹૭.૫ લાખથી વધુ હોય)"
    ],
    officialSource: "NSFDC FAQ & Scheme Compendium",
    sourceUrl: "https://nsfdc.nic.in/faqs",
    version: "2026.01",
    verifiedAt: "2026-09-10"
  }
];

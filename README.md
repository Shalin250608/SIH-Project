# SIH-Project
================================================================================
                    SPARKLINE (SIH26092) - PROJECT README
   AI-Driven Scheme Matching & Channel Partner Routing Platform for NSFDC
================================================================================

TABLE OF CONTENTS:
1. ABOUT THE WEBSITE & PROJECT OVERVIEW
2. HOW TO RUN THE WEBSITE (3 EASY METHODS)
3. BRIEF DESCRIPTION OF ALL FILES & FOLDERS
4. DEMO ACCOUNTS & APPLICATION REFERENCES FOR TESTING
5. KEY FEATURES & TECHNICAL HIGHLIGHTS

================================================================================
1. ABOUT THE WEBSITE & PROJECT OVERVIEW
================================================================================
SparkLine is an official, AI-driven civic financial platform built for the 
Smart India Hackathon (SIH26092). It is designed specifically for marginalized 
Scheduled Caste (SC) entrepreneurs and students across India, aligned with 
NSFDC (National Scheduled Castes Finance and Development Corporation, Ministry 
of Social Justice and Empowerment, Govt. of India).

THE CORE PROBLEMS WE SOLVE:
- High-Interest Debt Traps: Many marginalized citizens lack awareness of low-interest 
  government schemes (4% to 8% p.a.) and fall victim to private moneylenders (24% to 36%).
- Complex & Opaque Rules: Citizens struggle to understand whether they qualify based 
  on family income limits, caste certificates, and project cost limits.
- Unknown Monthly EMIs: Borrowers rarely know their repayment obligations or promoter 
  margins before visiting banks.
- Difficult Channel Partner Discovery: Central schemes flow through State Channelizing 
  Agencies (GSCDC), Public Sector Banks, and Regional Rural Banks. Citizens do not 
  know which local branches are authorized or restricted due to high NPA defaults.
- Language Barrier: Portals are often only in English, leaving regional speakers behind.

HOW SPARKLINE SOLVES THIS:
1. Deterministic Rule Engine: Instantly evaluates citizen profiles against official 
   NSFDC policies with clear "Why Matched" and "Why Rejected" explanations.
2. Transparent Financial EMI Calculator: Computes exact monthly EMI, promoter contribution, 
   interest accrued during moratorium grace periods, and full repayment tables.
3. Geo-Spatial Channel Partner Locator: Displays verified Gujarat branches on an 
   interactive map, calculates road distance in km, and flags high-NPA agencies.
4. Multilingual AI Assistant: Converses in English, Hindi (हिन्दी), and Gujarati 
   (ગુજરાતી) to guide users and extract inputs directly into the wizard.
5. End-to-End Application Dossier & PDF Generator: Summarizes the complete journey 
   into an official A4 Government Dossier with instant 1-click PDF printing.
6. Real-Time 5-Stage Tracking Portal: Tracks status from Submission -> Verification -> 
   Docs Approved -> Sanctioned -> DBT Disbursement with an audit trail.
7. Officer Admin Console: Enables officers to adjust income ceiling policies and 
   advance or sanction citizen dossiers live.
8. Strict Authentication Gating: Protects citizen eligibility, calculators, and tracking 
   behind verified mobile authentication.

================================================================================
2. HOW TO RUN THE WEBSITE (3 EASY METHODS)
================================================================================

--------------------------------------------------------------------------------
METHOD 1: 1-CLICK STANDALONE PORTABLE MODE (Zero Installation Required!)
--------------------------------------------------------------------------------
This is the fastest and easiest way to run SparkLine. No Node.js, no terminal, 
and no server setup needed!

1. Open this folder in Windows File Explorer.
2. Double-click on:
      SparkLine_Website.html
   (Or double-click "Launch_SparkLine.bat")
3. The website opens immediately in your default web browser (Chrome, Edge, Firefox).
4. Everything works 100% offline, including local storage persistence, eligibility 
   evaluations, EMI calculations, dossier generation, and application tracking!

--------------------------------------------------------------------------------
METHOD 2: FULL-STACK MODE (Node.js Express + SQLite Database)
--------------------------------------------------------------------------------
Use this method to run the live REST API and native SQLite persistent backend.

1. Double-click:
      start_backend.bat
2. A command prompt window opens and starts the Node.js server:
      - Server URL: http://localhost:5000
      - Database: backend/sparkline.db (Native SQLite - zero C++ dependencies)
3. Open "SparkLine_Website.html" in your browser.
4. The top navigation bar will show a green indicator: "● Live DB".
5. All citizen applications and officer actions are synchronized in real time with 
   the SQLite database!

--------------------------------------------------------------------------------
METHOD 3: DEVELOPER SERVER (For Modifying Source Code & Live Reloading)
--------------------------------------------------------------------------------
If you want to edit the React components and test with hot-reloading:

1. Open PowerShell or Command Prompt in this folder:
      cd "d:\Varun\Working website"
2. Install dependencies (first time only):
      npm install
3. Start the Vite development server:
      npm run dev
4. Open the displayed local URL (typically http://localhost:5173).
5. To compile new single-file distribution bundles after editing:
      npm run build
   This updates "dist/index.html" and "SparkLine_Website.html" automatically.

================================================================================
3. BRIEF DESCRIPTION OF ALL FILES & FOLDERS
================================================================================

ROOT DIRECTORY:
--------------------------------------------------------------------------------
• SparkLine_Website.html   : The complete standalone production website. All HTML, 
                             CSS, JavaScript, and icons are bundled into this single file.
• Launch_SparkLine.bat     : 1-click Windows batch script to launch the standalone website.
• start_backend.bat        : 1-click Windows batch script to launch the Node.js backend server.
• package.json             : Project manifest listing dependencies (React, Tailwind, Leaflet).
• vite.config.js           : Vite configuration with single-file bundling plugin.
• tailwind.config.js       : Tailwind CSS utility configuration and civic color themes.
• postcss.config.cjs       : PostCSS styling preprocessor configuration.
• index.html               : Entry HTML template used by the Vite build tool.
• README.txt               : This user and developer documentation file.
• README_FOR_DEVELOPERS.txt: Detailed architectural breakdown and background guide.

SRC/ DIRECTORY (FRONTEND CORE):
--------------------------------------------------------------------------------
• src/App.jsx              : Main application controller managing active tabs, user session, 
                             policy limits, and global navigation.
• src/main.jsx             : React DOM JavaScript mounting entry point.
• src/index.css            : Global CSS styles and Tailwind utility directives.

SRC/COMPONENTS/ (USER INTERFACE):
--------------------------------------------------------------------------------
• Navbar.jsx               : Sticky header with brand, navigation tabs, 3-language switcher 
                             (EN, हिन्दी, ગુજરાતી), user profile, and Admin Console trigger.
• Hero.jsx                 : Clean civic homepage with CTA buttons, scheme overview, 4-step 
                             workflow diagram, and official government portal links.
• EligibilityWizard.jsx    : 3-step questionnaire evaluating caste, purpose, district, 
                             project cost, and annual income.
• RecommendationCard.jsx   : Displays matching schemes with "Best Match" badge, reasons, 
                             document checklists, and structured ineligibility breakdowns.
• FinancialCalculator.jsx  : Interactive loan amortization calculator with sliders for cost, 
                             loan %, interest rate, tenure, and moratorium grace periods.
• PartnerMap.jsx           : Geo-spatial Leaflet map locating Gujarat channel partners, 
                             calculating distance in km, and filtering high-NPA agencies.
• ApplicationDossier.jsx   : Formal Government Loan Application Dossier modal with 
                             instant A4 "Print / Save as PDF" engine and portal submission.
• ApplicationTracker.jsx   : Real-time 5-stage tracking portal with interactive "Live Status" 
                             badge, animated progress bar (20%-100%), and audit timeline.
• AdminPanel.jsx           : Officer command center to review applications, advance stages, 
                             manage partner status, and adjust NSFDC family income ceilings.
• AuthModal.jsx            : Citizen login and registration dialog with password validation.
• ChatAssistant.jsx        : Multilingual AI Scheme Assistant powered by Google Gemini 3.6 Flash 
                             with built-in offline NSFDC scheme NLP fallback.
• Footer.jsx               : Portal footer with official NSFDC/PM-SURAJ links and disclaimers.

SRC/DATA/ (STATIC DATA STORES):
--------------------------------------------------------------------------------
• src/data/schemes.js      : Master dataset of NSFDC schemes (MFS, Term Loan, Udyam Nidhi, ELS).
• src/data/partners.js     : Authorized Gujarat Channel Partners (GSCDC, Lead Banks, RRBs).
• src/data/translations.js : Multilingual dictionary covering English, Hindi, and Gujarati.

SRC/UTILS/ (BUSINESS LOGIC & ENGINE):
--------------------------------------------------------------------------------
• src/utils/ruleEngine.js  : Deterministic scheme qualification logic and rejection breakdown.
• src/utils/calculator.js  : Financial mathematics for EMI, simple interest, and promoter margin.
• src/utils/api.js         : Dual-Mode API client with synchronous dual-write, automatic offline 
                             localStorage fallback, and fast 500ms health check timeouts.

BACKEND/ DIRECTORY (NODE.JS + SQLITE REST SERVER):
--------------------------------------------------------------------------------
• backend/server.js        : Express server on port 5000 with CORS and request logging.
• backend/db.js            : Native SQLite database engine (`sparkline.db`) with PBKDF2 
                             password hashing and token verification.
• backend/.env             : Server environment variables (port, JWT secret).
• backend/routes/auth.js   : User registration, login, and authentication verification.
• backend/routes/applications.js : Application submission and reference tracking endpoints.
• backend/routes/officer.js: Officer review portal, stage progression, and KPI metrics.
• backend/routes/policy.js : Dynamic NSFDC income ceiling update endpoints.
• backend/routes/ai.js     : Multilingual server-side AI proxy with offline scheme intelligence.

DIST/ & FINAL/ DIRECTORIES:
--------------------------------------------------------------------------------
• dist/index.html          : Compiled single-file production bundle generated by Vite.
• final/                   : Distribution folder containing the self-contained standalone 
                             website and backup backend files.

================================================================================
4. DEMO ACCOUNTS & APPLICATION REFERENCES FOR TESTING
================================================================================

CITIZEN BENEFICIARY LOGIN:
--------------------------------------------------------------------------------
• Mobile Number : 9876543210
• Password      : 1234
• Profile Name  : Ramesh Patel (District: Ahmedabad, SC Community Verified)
Note: You can also register any new citizen mobile number instantly via the "Sign Up" tab.

OFFICER / ADMIN CONSOLE:
--------------------------------------------------------------------------------
• How to Open   : Click the "Admin" button (gear icon) on the right of the navigation bar.
• Mobile Number : 9800000001
• Password      : admin123
• Role          : S. K. Mehta (GSCDC Scrutiny & Approval Officer)

PRE-SEEDED DEMO APPLICATION TRACKING NUMBERS:
--------------------------------------------------------------------------------
Enter these 16-character reference IDs in the "Track Application" tab:
1. SPARK-2026-GJ-88412 : Ramesh Vankar (Micro Financing Scheme, ₹1.4 Lakh)
                         Status: UNDER VERIFICATION (Stage 2 of 5 - 40% Complete)
2. SPARK-2026-GJ-35525 : Priya Solanki (Mahila Samriddhi Yojana, ₹1.4 Lakh)
                         Status: SANCTIONED (Stage 4 of 5 - 80% Complete)
3. SPARK-2026-GJ-61031 : Jayesh Parmar (Educational Loan Scheme, ₹15 Lakh)
                         Status: DISBURSED (Stage 5 of 5 - 100% Complete)

================================================================================
5. KEY FEATURES & TECHNICAL HIGHLIGHTS
================================================================================
• 100% Client-Side Portability: Runs completely offline without any internet connection.
• Dual-Mode Architecture: Automatically syncs with SQLite when backend is online, 
  and seamlessly uses browser localStorage when offline.
• Responsive UI: Designed for mobile phones, tablets, and desktop computers.
• Government Ready: Aligned with official NSFDC 2026 guidelines and Gujarat GSCDC norms.
• Accessible & Transparent: Clear explanations for all eligibility decisions.

================================================================================
            SparkLine SIH26092 • Empowering Marginalized Communities
================================================================================

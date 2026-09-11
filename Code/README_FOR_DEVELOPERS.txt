================================================================================
          SPARKLINE (SIH26092) - PROJECT BLUEPRINT & DEVELOPER GUIDE
================================================================================

This document explains:
1. THE PROBLEM: What real-world challenges this project solves.
2. THE SOLUTION: How SparkLine solves these problems step-by-step.
3. DESCRIPTION OF THE FILES: An exact breakdown of every file in the codebase.
4. HOW TO RUN THE PROJECT: Simple instructions to launch and test.

================================================================================
1. THE PROBLEM
================================================================================
In India, the National Scheduled Castes Finance and Development Corporation 
(NSFDC) provides concessional credit (loans with low interest rates between 
6.0% and 8.0%) to help marginalized Scheduled Caste (SC) entrepreneurs and 
students achieve economic self-reliance.

However, grassroots beneficiaries face severe real-world barriers:

A. Lack of Awareness & Information Asymmetry:
   Most marginalized youth and small artisans do not know which government 
   schemes exist. Because of this, they are often forced into high-interest 
   debt traps from informal private moneylenders (charging 24% to 36% interest).

B. Complex Eligibility Rules & Fear of Rejection:
   Official policies have specific criteria: caste certificates, family income 
   ceilings (Rs 5,00,000 per annum), project cost ceilings, and target trade 
   categories. Applicants do not know if they qualify and face frequent 
   rejections at bank branches without knowing why.

C. Opaque Financial Terms:
   Beneficiaries rarely know their monthly repayment (EMI), the interest accrued 
   during the grace period (moratorium), or how much cash margin (promoter 
   contribution) they must deposit before visiting an agency.

D. Difficulty Locating Channel Partners:
   Central schemes are not disbursed directly by the ministry; they flow through 
   State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), and Regional 
   Rural Banks (RRBs). Applicants do not know which nearby agency is currently 
   authorized, active, or temporarily suspended due to high audit overdues.

E. Language & Digital Divide:
   Most official portals are complex, bureaucratic, and available only in formal 
   English or Hindi, excluding grassroots regional speakers (such as Gujarati).

================================================================================
2. THE SOLUTION (SPARKLINE)
================================================================================
SparkLine is an AI-driven scheme matching and channel partner routing platform 
designed to be 100% accessible, fast, and transparent:

1. Deterministic Rule Matching Engine:
   Instantly evaluates the applicant's profile (SC status, district, purpose, 
   project cost, annual family income) against official NSFDC policy rules. 
   It shows EVERY eligible scheme and provides clear "Why Matched" and 
   "Why Rejected" explanations in plain language.

2. Transparent Financial & EMI Calculator:
   Calculates exact banking figures before applying:
   - Monthly EMI
   - Total Interest
   - Total Repayment
   - Promoter Margin Contribution (5% to 10%)
   - Moratorium (grace period where no principal is repaid)
   Clicking "Calculate EMI" on any scheme card automatically pre-fills that 
   scheme's exact interest rate, tenure, and limits.

3. Smart Geo-Spatial Partner Router:
   Locates verified Channel Partners (GSCDC, Lead Banks, Rural Banks) across 
   Gujarat. It calculates the exact distance in kilometers from the user, sorts 
   agencies by proximity, and automatically flags or filters out high-NPA or 
   restricted branches (SIH risk routing rule).

4. Multilingual Google Gemini AI Assistant:
   A conversational assistant powered by Google Gemini (gemini-3.6-flash). 
   Users can type their business or study plan in plain English, Hindi, or 
   Gujarati. Gemini explains the right scheme and provides a 1-click button 
   to auto-fill their answers directly into the Eligibility Wizard.

5. Localized & Zero-Dependency Architecture:
   Runs entirely client-side in a single portable file (SparkLine_Website.html). 
   Works 100% offline, requires no server hosting, and stores user signup data 
   securely in the browser's persistent storage.

6. Official End-to-End Application Dossier & PDF Generator:
   Provides the complete, end-to-end journey closure. Once the beneficiary finds 
   their scheme, calculates the EMI, and identifies their nearby Channel Partner, 
   they can generate a formal, consolidated Government Loan Application Dossier 
   summarizing everything from start to finish:
   - Beneficiary Profile & Income Verification status
   - Allocated NSFDC Scheme & Concessional Rate Card
   - Amortization Plan & Financial Breakdown (EMI, Margin, Repayment)
   - Designated Channel Partner Office details, address & phone
   - Mandatory Enclosure Document Checklist with verification checkboxes
   - Official Declarations, Applicant Signature, and Channel Partner Stamp Box
   - Instant "Print / Save as PDF" button cleanly styled for standard A4 paper.

================================================================================
3. DESCRIPTION OF THE FILES
================================================================================

--------------------------------------------------------------------------------
ROOT DIRECTORY FILES:
--------------------------------------------------------------------------------

1. SparkLine_Website.html
   - What it is: The complete, standalone, production-ready website bundle.
   - Purpose: Contains all HTML, compiled CSS, and JavaScript bundled into a single 
     file. Anyone can double-click it to run the entire website immediately in 
     Chrome, Edge, or Firefox without installing Node.js or running any server.

2. Launch_SparkLine.bat
   - What it is: A 1-click Windows batch script.
   - Purpose: Launches "SparkLine_Website.html" directly in the default browser 
     with a single click, eliminating the need to open any terminal.

3. index.html
   - What it is: The source web entry point for the Vite build tool.
   - Purpose: Sets page title, responsive viewport metadata, and root mounting 
     point (<div id="root"></div>) for the React application.

4. package.json & package-lock.json
   - What it is: Node.js project manifest and dependency lockfile.
   - Purpose: Lists all third-party libraries (React 18, Tailwind CSS, Leaflet maps, 
     Lucide icons, Canvas Confetti, and Vite Singlefile plugin).

5. vite.config.js
   - What it is: The Vite bundler configuration file.
   - Purpose: Configures the React compiler and the "vite-plugin-singlefile" 
     plugin, which inlines all styles, scripts, and assets into one single HTML file.

6. tailwind.config.js & postcss.config.cjs
   - What it is: Tailwind CSS styling configuration.
   - Purpose: Defines the color palette (civic blues, emeralds, slates), font 
     family hierarchy (Inter / System UI), and utility class compiler rules.

7. README_FOR_DEVELOPERS.txt
   - What it is: This developer guide file.

--------------------------------------------------------------------------------
SRC DIRECTORY (CORE SOURCE CODE):
--------------------------------------------------------------------------------

8. src/main.jsx
   - Purpose: The JavaScript entry point. Mounts the root <App /> component into 
     the browser DOM inside the "root" container.

9. src/index.css
   - Purpose: Global CSS file importing Tailwind base, component, and utility 
     styles, and custom styling for Leaflet map containers.

10. src/App.jsx
   - Purpose: The central controller and brain of the entire application.
   - Key Responsibilities:
     * Manages global state: activeTab, language ('en', 'hi', 'gu'), currentUser.
     * Stores applicant form answers (formData).
     * Connects all components (Navbar, Hero, Wizard, Calculator, Map, Chat, Auth).
     * Controls policy settings (activeIncomeCeiling, schemes, partners).
     * Coordinates navigation between scheme recommendations and the calculator.

--------------------------------------------------------------------------------
SRC/DATA DIRECTORY (DATA STORES):
--------------------------------------------------------------------------------

11. src/data/schemes.js
   - Purpose: Master database of official NSFDC loan schemes with full parameters:
     * Micro Financing Scheme (MFS) - Up to Rs 1.4L cost, 6.5% interest, 3 yrs.
     * Term Loan Scheme - Up to Rs 50L cost, 8.0% interest, 7 yrs.
     * Udyam Nidhi Scheme - Up to Rs 5L cost, 7.5% interest, 5 yrs.
     * Educational Loan Scheme (ELS) - Up to Rs 40L, 6.5% interest (6.0% for women).
     * Includes multilingual scheme names, target groups, and document checklists.

12. src/data/partners.js
   - Purpose: Master database of 8 authorized Channel Partners across Gujarat:
     * Gujarat Scheduled Castes Development Corporation (GSCDC) - Gandhinagar HQ
     * GSCDC District Offices (Ahmedabad, Vadodara, Surat)
     * Public Sector Banks: Bank of Baroda Lead Branch, SBI Lal Darwaja
     * Regional Rural Banks: Baroda Gujarat Gramin Bank (Sanand)
     * Restricted Demo Partner: Apex Cooperative Society (flagged for high NPA).
     * Contains GPS coordinates, supported schemes, contact numbers, and status.

13. src/data/translations.js
   - Purpose: Full multilingual dictionary providing translations across English, 
     Hindi (हिन्दी), and Gujarati (ગુજરાતી) for all UI labels, navigation buttons, 
     form questions, and disclaimers.

--------------------------------------------------------------------------------
SRC/UTILS DIRECTORY (BUSINESS LOGIC & ENGINES):
--------------------------------------------------------------------------------

14. src/utils/ruleEngine.js
   - Purpose: The deterministic scheme evaluation logic (No black-box guesses).
   - Functions:
     * evaluateSchemes(inputs): Checks SC category verification, enforces the 
       Rs 5,00,000 annual family income ceiling, matches business vs education 
       activities, validates project cost boundaries, and generates explicit 
       "Why this matches" criteria alongside comprehensive multi-point ineligibility 
       breakdowns (mandate mismatch, capital ceilings/floors, target group constraints, 
       and actionable "How you can qualify" advice for every unmatched scheme).

15. src/utils/calculator.js
   - Purpose: Standard banking mathematics utility.
   - Functions:
     * calculateLoanDetails(options): Calculates monthly EMI using the standard 
       amortization formula, adds moratorium grace period simple interest, and 
       computes promoter contribution (5% to 10%).
     * formatINR(amount): Formats numbers into Indian Rupee currency strings 
       (e.g., 800000 -> "Rs 8,00,000").

--------------------------------------------------------------------------------
SRC/COMPONENTS DIRECTORY (USER INTERFACE):
--------------------------------------------------------------------------------

16. src/components/Navbar.jsx
   - Purpose: Top navigation bar.
   - Features: SparkLine branding, tab navigation (Home, Check Eligibility, 
     Calculator, Find Partner), 3-language switcher (EN | हिन्दी | ગુજરાતી), 
     user login profile badge with logout, and the Admin Console button.

17. src/components/Hero.jsx
   - Purpose: The comprehensive homepage landing section.
   - Features: Main title and call-to-action buttons ("Find My Scheme", "Chat with 
     Assistant", "Calculate EMI"), quick-start cards for Business vs Education, 
     "How It Works" 4-step diagram, available NSFDC scheme cards, trust stats, 
     and links to official government portals (NSFDC & PM-SURAJ).

18. src/components/EligibilityWizard.jsx
   - Purpose: The 3-step eligibility questionnaire.
   - Step 1: SC Community verification and Gujarat district selection.
   - Step 2: Purpose selection (Business activities vs Higher Education courses).
   - Step 3: Project cost slider/presets and annual family income input with 
     real-time warning if income exceeds the Rs 5L ceiling.
   - Action: Submits answers to the Rule Engine and transitions to results.

19. src/components/RecommendationCard.jsx
   - Purpose: Displays the evaluation results after running the rule engine.
   - Features: Shows all qualifying schemes with "Best Match" star badge, 
     clear "Why this matches" criteria, required document checklists, and 
     action buttons ("Calculate EMI", "Find Partners", and "Application Dossier (PDF)").
   - Ineligibility Section ("Why other schemes did not match"):
     * Displays a structured, professional card for each non-qualifying scheme.
     * Profile vs Scheme comparison grid (Applicant purpose & cost vs Scheme scope & limits).
     * Multi-point ineligibility breakdown with clear titles (Mandate Mismatch, 
       Statutory Ceilings, Target Group & Policy Limits).
     * Actionable Guidance callout ("💡 How you can qualify") providing tailored advice 
       on budget restructuring, phasing, or course enrollment.

20. src/components/FinancialCalculator.jsx
   - Purpose: The interactive loan amortization and EMI calculator.
   - Features: Sliders for Project Cost, Loan %, Interest Rate, Tenure, and 
     Moratorium. Auto-fills with the exact parameters of whichever scheme was 
     clicked in the recommendations card. Features a scheme-switching bar and 
     a detailed financial repayment breakdown table.

21. src/components/PartnerMap.jsx
   - Purpose: The geo-spatial agency locator.
   - Features: Interactive visual Gujarat network map showing district clusters 
     (Gandhinagar, Ahmedabad, Sanand, Vadodara, Surat), Haversine formula distance 
     calculation from the user's location, scheme filtering, phone call buttons, 
     and automatic exclusion of high-overdue/restricted agencies.

22. src/components/ChatAssistant.jsx
   - Purpose: The AI conversational scheme assistant.
   - Features: Connects to Google Gemini 3.6 Flash using the official AI Studio API. 
     Maintains multi-turn context across multiple questions, responds in English, 
     Hindi, or Gujarati, and includes an offline fallback engine if internet is 
     disconnected. Extracts project parameters and offers a 1-click apply button.

23. src/components/AuthModal.jsx
   - Purpose: Beneficiary authentication and registration.
   - Features: Sign Up form (stores Name, Mobile, District, Password, and SC status 
     permanently in browser localStorage / SQLite) and Log In form (verifies entered mobile 
     and password against saved accounts). Pre-seeded citizen demo account: 
     Ramesh Patel (9876543210 / 1234).

24. src/components/AdminPanel.jsx
   - Purpose: Government policy and administrative control panel.
   - Features: Allows live adjustment of the NSFDC Income Ceiling (e.g., changing 
     from Rs 5L to Rs 6L), toggling Channel Partner operational statuses, viewing 
     the registered beneficiaries table, and exporting user data to "users.json".

25. src/components/Footer.jsx
   - Purpose: Bottom website footer with official links to NSFDC and PM-SURAJ, 
     disclaimers, copyright notice, and hackathon team credits.

26. src/components/ApplicationDossier.jsx
   - Purpose: The end-to-end formal Government Loan Application Dossier & PDF generator modal.
   - Features: Aggregates the complete user journey from start to finish into an official, 
     formal A4 document. Features a unique Application Reference Number 
     (e.g., SPARK-2026-GJ-XXXXX), applicant profile, scheme parameters, EMI & repayment 
     breakdown, assigned partner agency, mandatory document checklist with checkboxes, 
     and applicant/officer declaration and signature sections.
   - Triple Export Options:
     * "Print / Save as PDF": Instant native A4 printing via an isolated offscreen iframe 
       engine (bypasses modal clipping so no blank pages ever appear).
     * "Open Clean Tab": Opens the full printable dossier in a separate dedicated browser 
       tab for clean full-screen viewing and manual printing.
     * "Save File": Downloads an offline standalone HTML document directly to the user's PC.
     * "Submit to Portal": Registers the application directly into the backend SQLite 
       database (or local storage if offline) and provides an instant tracking link.

27. src/components/ApplicationTracker.jsx
    - Purpose: Live real-time citizen tracking portal.
    - Features:
      * Search by 16-character Reference ID (e.g., SPARK-2026-GJ-88412).
      * 5-stage visual progress stepper:
        Submitted -> Under Verification -> Docs Approved -> Loan Sanctioned -> Disbursed.
      * Displays sanctioned loan breakdown, monthly EMI, assigned channel partner, 
        and official scrutiny officer notes.
      * Chronological timeline and audit trail showing every stage change with timestamps.

28. src/utils/api.js
    - Purpose: Dual-Mode HTTP Client & Data Layer.
    - Features:
      * Automatically checks if the Node.js backend is active at http://localhost:5000/api/health.
      * If Online: Interacts with the real REST API and SQLite database.
      * If Offline: Transparently falls back to localStorage so SparkLine_Website.html 
        remains 100% functional without errors when opened as a standalone file.

29. backend/server.js
    - Purpose: Main Node.js Express server running on port 5000 with CORS and JSON parsing.
    - Mounts modular routers: /api/auth, /api/applications, /api/officer, /api/policy, /api/ai.

30. backend/db.js
    - Purpose: SQLite database engine using Node 24's native `node:sqlite` (zero C++ dependencies).
    - Database File: backend/sparkline.db
    - Tables: users, applications, application_history, policy_settings.
    - Built-in secure password hashing (PBKDF2-SHA512) and HMAC-SHA256 session tokens.

31. backend/routes/
    - auth.js: Citizen register, login, and profile retrieval.
    - applications.js: Dossier submission, reference ID generation, and tracking.
    - officer.js: Channel partner / officer review, statistics, and 1-click stage advancement.
    - policy.js: Dynamic income ceiling management.
    - ai.js: Secure server-side Gemini AI proxy with offline scheme NLP fallback.

32. start_backend.bat
    - Purpose: 1-click batch script to launch the Node.js backend on http://localhost:5000.

================================================================================
4. HOW TO RUN & TEST
================================================================================
There are TWO supported ways to run SparkLine:

METHOD 1: FULL-STACK MODE (Recommended - Real Backend + Database)
--------------------------------------------------------------------------------
1. Double-click "start_backend.bat" (or "Launch_SparkLine.bat").
   - The backend starts on http://localhost:5000 using SQLite (sparkline.db).
   - "SparkLine_Website.html" automatically opens in your web browser.
   - The top navigation displays a green badge: "● Backend Live".
2. Test the Citizen Journey:
   - Click "Log In / Sign Up" -> Log in with 9876543210 / 1234 or register a new citizen.
   - Click "Check Eligibility" -> Fill the 3 steps -> View eligible schemes.
   - Click "Generate Dossier (PDF)" on any scheme.
   - In the Dossier modal, click "Submit to Portal".
   - You will see a success message with your unique Reference ID (e.g. SPARK-2026-GJ-XXXXX).
   - Click "Track Status Live" to view the 5-stage tracking progress in real time!
3. Test the Officer Scrutiny & Approval Portal:
   - Click "Admin Control" (gear icon in top nav).
   - Go to the "Officer Loan Approvals" tab.
   - You will see your newly submitted application listed with live metrics!
   - Click "Start Verification" -> then "Approve Documents" -> then "Sanction Loan" -> then "Disburse Funds".
   - Switch back to the "Track Application" tab and search your reference ID to see 
     the 5-stage stepper and chronological audit trail update immediately!

METHOD 2: STANDALONE PORTABLE MODE (Zero Installation / Offline)
--------------------------------------------------------------------------------
1. Double-click "SparkLine_Website.html" directly in any browser (even without Node.js!).
2. The site automatically operates in offline mode using browser localStorage.
3. Every feature (eligibility wizard, EMI calculator, partner locator, offline AI assistant, 
   dossier PDF export, offline application tracking, and admin controls) continues to work 100%!

================================================================================
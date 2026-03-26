# DermIQ_NeelGajjar

• DermIQ 🧴

Evidence-backed, privacy-first skincare and haircare intelligence — runs entirely in your browser.
DermIQ replaces generic skincare advice with a local, rule-based intelligence system that reasons about your biology, routine, products, diet, and lifestyle — without sending a single byte to a remote server. Every recommendation is traceable, conflict-aware, and grounded in a curated knowledge base.

✨ Features

Multi-step Profile Assessment — Captures demographics, skin type, climate, lifestyle, budget, and concerns through a guided wizard.
Concern Analysis & Insights — Converts your concerns into severity-tagged cards with mechanisms, aggravators, root causes, and ingredient recommendations.
Routine Builder with Conflict Awareness — Builds structured AM / PM / hair routines, staggers new actives safely, and highlights ingredient conflicts (e.g. AHA + Retinol).
Product Intelligence — Scores and ranks budget-aware product picks against your concerns, skin type, and ingredient safety profile.
Nutrition & Lifestyle Coaching — Provides diet guidance and lifestyle tips directly tied to your skin and hair concerns.
Chat Expert System — A deterministic chat interface that answers questions about ingredients, routines, diets, and products using keyword-based intent classification — no LLM required.
Zero API, Zero Telemetry — Everything runs locally in the browser. Your profile lives only in localStorage.


🖥️ Tech Stack
LayerTechnologyFrameworkReact 19.2 + Vite 7.3RoutingReact Router DOM 7.13State / PersistenceReact Context + localStorageStylingCSS variables, glassmorphism utilitiesLintingESLint with React hooks & refresh pluginsBuild@vitejs/plugin-reactBackend / APIsNone — fully client-side

📁 Project Structure
src/
├── main.jsx              # Entry point — StrictMode + App
├── App.jsx               # BrowserRouter + ProfileProvider + routes
├── context/
│   └── ProfileContext.jsx  # Global profile state + localStorage persistence
├── data/
│   ├── skinKnowledge.js    # Central knowledge base (concerns, ingredients, products, diet)
│   ├── analysisEngine.js   # Derives routines, products, conflicts, costs from the knowledge base
│   └── chatEngine.js       # Keyword-based intent classifier and response generator
├── pages/
│   ├── Home.jsx / Home.css
│   ├── Profile.jsx / Profile.css
│   ├── Analysis.jsx / Analysis.css
│   ├── Routine.jsx / Routine.css
│   ├── Products.jsx / Products.css
│   └── Chat.jsx / Chat.css
└── components/
    ├── Navbar.jsx          # Sticky glass nav with profile indicator
    └── EvidenceBadge.jsx   # Evidence-level pill component

🚀 Live Demo
This repository hosts a static UI demo of DermIQ — pre-built HTML, CSS, and JS files served via GitHub Pages so you can explore the interface without any local setup.
https://anonymousneel.github.io/DermIQ_NeelGajjar/

🗺️ Usage Walkthrough

Profile — Complete the four-step wizard (basics → skin type → concerns → lifestyle). This unlocks all intelligence modules.
Analysis — Review concern cards with evidence badges, lifestyle status, and personalized diet tips.
Routine — See your tailored AM / PM / hair routine, conflict alerts, introduction schedule for new actives, and estimated monthly cost.
Products — Sort and filter recommended products, expand cards to read ingredient rationale and safety notes.
Chat — Ask questions like "What does niacinamide do?", "Is retinol safe for oily skin?", or "What should I eat for hyperpigmentation?" — or tap a quick-question chip.


🧠 How It Works
User Profile  ──▶  analysisEngine.js  ──▶  Routine / Products / Diet / Lifestyle
                        │
                   skinKnowledge.js
                  (concerns · ingredients
                   products · diet · factors)
                        │
                   chatEngine.js  ──▶  Chat responses
All modules are pure, deterministic functions that read from a single knowledge base (skinKnowledge.js). There are no network requests, no tokens, and no tracking.

⚙️ Internal APIs
FunctionDescriptionanalyzeProfile(profile)Returns { concerns, routine, products, diet, lifestyle, monthlyCost, introductionSchedule }processMessage(message, profile)Returns { text, type, ... } for the chat UI

🔒 Privacy
DermIQ stores your profile exclusively in your browser's localStorage under the key dermiq_profile. No data is transmitted anywhere. Clearing browser storage or using the Reset option wipes all data permanently.

📬 Contact
For more details, collaboration, or feedback — feel free to reach out!

📧 Email: gajjarneel25@gmail.com
💼 LinkedIn: Neel Gajjar  :  https://linkedin.com/in/neel-gajjar-a09b91261# DermIQ_NeelGajjar

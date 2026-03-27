# 🌶️ Paprika

![GitHub last commit](https://img.shields.io/github/last-commit/abdulmecidd/paprika?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

**🌐 Live Demo:** [https://paprikaa.netlify.app/](https://paprikaa.netlify.app/)

**Paprika** is a robust, multi-source academic search engine built with Next.js and Shadcn UI. It empowers researchers, students, and academics to instantly search across the world's most comprehensive open-access metadata graphs (*OpenAlex* and *Crossref*) from a single, unified interface.

---

## ✨ Features

- **Multi-Source Aggregation**: Runs concurrent background queries against major open-source research graphs (Crossref & OpenAlex).
- **Semantically Standardized**: Normalizes entirely discrepant API endpoints into a pristine, readable UI.
- **Bi-Lingual (i18n)**: Fully translated into English (EN) and Turkish (TR) with smart zero-flicker client-side locale detection.
- **Academic Metrics**: Instantly see "Open Access" flags, citation counts, DOIs, and Semantic Relevance scoring directly on the UI without clicking.
- **PWA Ready**: Beautiful mobile responsiveness complete with `Manifest.json` and a polite "Add to Home Screen" intelligent detection drawer.
- **Dark Mode**: Complete system-syncing Tailwind Dark mode support to save your eyes during midnight research sessions.

---

## 🚀 Quick Start

Ensure you have [Node.js](https://nodejs.org/) installed, then run the following commands:

1. **Clone the repo**
```bash
git clone https://github.com/abdulmecidd/paprika.git
cd paprika
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Architecture

Paprika pushes the limits of standard Next.js 15 client-render boundaries:
- `src/components/i18nProvider.tsx`: A completely synchronous locale-detector wrapper that patches the standard Next.js *hydration mismatch* issue.
- `src/app/api/search/route.ts`: A unified backend fetch protocol that resolves CrossRef and OpenAlex pagination cursors mathematically to create a blended `UnifiedArticle` interface.
- `src/components/filterAndSorting.tsx`: State-driven component bubbling to track complex start/end date logic flawlessly into search queries.

---

## 🎨 Tech Stack
- Frontend Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS & Vanilla CSS Utility Classes
- Components: Shadcn UI & Lucide Icons
- Translation: `react-i18next` 

---

## 🤝 Contributing

Contributions are 100% welcome! Feel free to open a Pull Request to support arXiv, PubMed, or other open-access endpoints to the aggregation API route!
---

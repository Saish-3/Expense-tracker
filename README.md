# 💰 Expense Tracker

A premium, feature-rich expense tracker built with **React 18** and **Vite**. Track income, expenses, set monthly budget limits, and visualize your finances with animated charts — all in a beautiful dark/light theme UI.

---

## ✨ Features

- **Add / Edit / Delete Transactions** — Log income and expenses with category, date, and description
- **Monthly Budget Limits** — Set spending caps with real-time progress tracking and alerts
- **Animated Analytics Charts** — Bar, line, and donut charts rendered on HTML5 Canvas
- **Smart Filtering & Search** — Filter by type, time period, custom date range, and keyword search
- **Sorting** — Sort transactions by date, amount, or category (ascending/descending)
- **Running Balance** — See cumulative balance alongside each transaction
- **CSV Export** — Download all transactions as a `.csv` file
- **Dark / Light Theme** — Toggle between themes with smooth transitions
- **Persistent Storage** — All data saved to `localStorage` automatically
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Keyboard Shortcuts** — `Esc` to close modals, `Ctrl/Cmd + Enter` to submit

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite 6 | Build tool & dev server |
| Vanilla CSS | Styling (injected via JS) |
| HTML5 Canvas | Chart rendering |
| localStorage | Data persistence |

---

## 📁 Project Structure

```
├── index.html                          # Vite entry HTML
├── package.json                        # Dependencies & scripts
├── vite.config.js                      # Vite configuration
└── src/
    ├── main.jsx                        # React DOM mount point
    ├── ExpenseTracker.jsx              # Root app component
    ├── constants/
    │   └── index.js                    # Storage keys, categories, palette, timing
    ├── utils/
    │   └── index.js                    # Pure helpers (date, format, stats, CSV, validation)
    ├── charts/
    │   └── index.js                    # Canvas chart drawing (bar, line, donut)
    ├── styles/
    │   └── globalCSS.js                # Global CSS (theme variables, layout, animations)
    └── components/
        ├── Modal/
        │   └── Modal.jsx               # Confirmation & alert modal
        ├── ChartPanel/
        │   └── ChartPanel.jsx          # Analytics section with chart tabs
        ├── TransactionForm/
        │   └── TransactionForm.jsx     # Add/edit form + budget limit controls
        ├── TransactionList/
        │   └── TransactionList.jsx     # Transaction list with running balances
        ├── FiltersBar/
        │   └── FiltersBar.jsx          # Search, sort, type & period filters
        └── Toast/
            └── toast.js                # Toast notification utility
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone or navigate to the project directory
cd expense-tracker

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 📊 Categories

### Income
💼 Salary · 💰 Business · 🎁 Gift · 💻 Freelance · 📊 Investment

### Expense
🍔 Food · 🚗 Transport · 🛒 Shopping · 💊 Health · 📚 Education · 🎬 Entertainment · 🏠 Rent · ⚡ Utilities · 📦 Other

---

## 🎨 Theming

The app supports **dark** and **light** themes using CSS custom properties. Toggle via the ☀️/🌙 button in the header. Theme preference is persisted in `localStorage`.

---

## 📄 License

This project is for personal/educational use.

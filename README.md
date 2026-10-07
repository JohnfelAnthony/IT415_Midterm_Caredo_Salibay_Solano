# CAMPUS HUB POS — Self-Service Touchscreen Kiosk System

**Course:** IT415 – Application Development and Emerging Technologies  
**Project:** Touchscreen Point of Sale (POS) Kiosk System  
**System Name:** Campus Hub POS  

---

## 📌 1. Project Overview & Scenario

The **Campus Hub POS** is a modern, touch-optimized self-service kiosk system designed for a campus food and merchandise outlet. It streamlines ordering, reduces long queues, eliminates manual cashier calculation errors, and gives students and faculty a seamless digital ordering experience.

The customer flow follows the 7 required transaction stages:
1. **Item Selection:** Browse products across categorized cards, adjust quantities (`+` / `−`), and monitor live cart totals.
2. **Order / Payment Summary:** Inspect an itemized order breakdown with subtotals before proceeding to payment.
3. **Payment Method Selection:** Choose between **Cash**, **QR Payment**, or **Credit/Debit Card**.
4. **Payment Processing & Validation:**
   - **Cash:** Real touchscreen numeric keypad, automatic change calculation, preset quick-cash buttons, and strict insufficient cash validation.
   - **QR Payment:** Simulated QR e-wallet scanning with dynamic reference code and confirmation control.
   - **Credit/Debit Card:** Simulated contactless/EMV chip terminal with realistic processing progress state.
5. **Payment Successful:** Instant confirmation with transaction reference number, payment method, amount paid, and change returned.
6. **Digital Receipt:** Itemized digital thermal receipt slip with full audit trail, timestamp, and printing support.
7. **New Transaction (Reset):** One-tap kiosk reset that clears all cart data, input buffers, and previous customer details for the next transaction.

---

## 🚀 2. Setup and Execution Instructions

The system is built using standard, zero-dependency web technologies, making it reliable, fast, and runnable on any operating system (Windows, macOS, Linux) and mobile/tablet kiosk screen.

### How to Run:
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd IT415_POS
   ```
2. **Open the application:**
   - Simply double-click `index.html` to open it in your default browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
   - Alternatively, right-click `index.html` $\rightarrow$ **Open with** $\rightarrow$ **Google Chrome** (or Edge).
   - Or serve with any local HTTP server (optional):
     ```bash
     # Using Python (if available):
     python -m http.server 8000
     # Then visit http://localhost:8000 in your browser.
     ```

---

## 💻 3. Technology Stack & Storage Rationale

- **Frontend Core:** Pure HTML5, Semantic Elements (`<header>`, `<main>`, `<section>`, `<aside>`)
- **Styling:** Modern CSS3 with CSS Custom Variables (Design Tokens), Flexbox, CSS Grid, and responsive touch layout.
- **Client-Side Logic:** Vanilla JavaScript (ES6+), Event-driven architecture, modular state management.
- **Storage Strategy:** 
  - **Runtime State:** In-memory reactive state variables (`cart`, `rawCashInput`, `completedTransaction`).
  - **Persistent Storage:** Browser `localStorage` (`campus_hub_pos_txns` key) to track sequential transaction reference numbering (`TXN-2026-00001`, `TXN-2026-00002`). If storage access is restricted, an automatic in-memory fallback ensures seamless operation.
  - **Rationale:** A full external SQL/NoSQL database is not necessary for an isolated self-service kiosk terminal. Local client-side persistence provides instant zero-latency responses, works completely offline, and eliminates server configuration overhead during practical examination.

---

## 🎨 4. Unique UI/UX Design Direction

While taking structural inspiration from the instructor's sample UI, the **Campus Hub POS** features a distinct, custom-crafted visual identity:
1. **Fresh Color Palette:** Built upon rich **Emerald Green** (`#047857`), warm **Amber Gold** (`#f59e0b`), and clean **Slate** (`#0f172a`), moving away from standard generic presets.
2. **Step Breadcrumb Stepper:** An interactive 4-stage pill indicator at the header showing live kiosk progress (`1 Order` $\rightarrow$ `2 Review` $\rightarrow$ `3 Payment` $\rightarrow$ `4 Receipt`).
3. **Category Tabs:** Filter between All Items, Beverages 🥤, Meals 🥪, and Snacks 🍪.
4. **Touchscreen Numeric Keypad:** Dedicated on-screen numpad for cash payment with `Clear`, `00`, and `⌫` controls, eliminating the need for a physical keyboard on touch kiosks.
5. **Live Financial Difference Feedback:** Dynamic preview box displaying live change due (in green) or remaining shortage (in red) as each bill/digit is entered.
6. **Contactless Card Terminal Graphic:** Dynamic contactless wave indicator and smooth progress bar simulating payment authorization.
7. **Perforated Thermal Receipt Slip:** High-contrast receipt display with formatted borders, printable via the browser's native print engine (`window.print()`).

---

## 📋 5. Acceptance Checklist & Test Matrix

| # | Test Item | Action | Expected Output | Status |
|---|---|---|---|---|
| 1 | Startup & Touch Selection | Open application | $\ge 6$ products with visible names and prices (8 included). Large touch cards. | ✅ Pass |
| 2 | Add Multiple Products | Add Coffee $\times 2$, Sandwich $\times 1$, Soft Drink $\times 1$ | Subtotals (₱90.00, ₱50.00, ₱35.00) and Total (₱175.00) calculated accurately. | ✅ Pass |
| 3 | Quantity Controls | Tap `+` and `−` on items | Quantity updates; subtotals and grand total update automatically; quantity never drops below 1 or negative. | ✅ Pass |
| 4 | Remove Item | Tap trash icon `🗑️` on Soft Drink | Item removed; cart total recalculates from ₱175.00 to ₱140.00. | ✅ Pass |
| 5 | Order Summary | Click "Review Order ➔" | Shows complete itemized table with matching items, quantities, prices, and grand total. | ✅ Pass |
| 6 | Back Navigation | Click "← Back / Modify Order" | Returns to Screen 1 with all cart items and quantities preserved. | ✅ Pass |
| 7 | Payment Method | Continue to Payment | 3 large touch buttons displayed: Cash, QR Payment, Credit/Debit Card. | ✅ Pass |
| 8 | Insufficient Cash | Enter ₱100 for ₱140 order and tap Pay Now | Rejected with clear alert banner: *"Insufficient payment. Please enter at least ₱140.00. You are short by ₱40.00."* Stays on screen. | ✅ Pass |
| 9 | Successful Cash | Enter ₱200 for ₱140 order | Calculates change = ₱60.00; proceeds to Payment Successful screen. Exact payment accepted with ₱0.00 change. | ✅ Pass |
| 10 | Confirmation Screen | Inspect Screen 5 | Displays transaction amount, payment method, amount paid, change, and unique transaction reference. | ✅ Pass |
| 11 | View Receipt | Tap "View Receipt" | Digital receipt displays full audit breakdown matching the order and payment. | ✅ Pass |
| 12 | QR Payment Simulation | Start new order, select QR Payment | Shows amount, QR graphic, instructions, and Confirm button. Receipt records "QR Payment" with ₱0.00 change. | ✅ Pass |
| 13 | Card Payment Simulation | Start new order, select Card | Shows tap/swipe instructions and simulated 1.5s "Processing payment..." progress bar. Receipt records "Credit/Debit Card". | ✅ Pass |
| 14 | New Transaction Reset | Tap "＋ New Transaction" on receipt | Entire cart, inputs, and previous receipt wiped; returns to clean empty Screen 1. | ✅ Pass |
| 15 | Unique Transaction IDs | Complete multiple transactions | Each transaction generates a unique sequential reference (`TXN-2026-00001`, `TXN-2026-00002`). | ✅ Pass |

---





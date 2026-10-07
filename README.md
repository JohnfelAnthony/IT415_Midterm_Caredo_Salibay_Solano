# CAMPUS HUB POS — Self-Service Touchscreen Kiosk System

**Course:** IT415 – Application Development and Emerging Technologies  
**Project:** Touchscreen Point of Sale (POS) Kiosk System  
**System Name:** Campus Hub POS  
**Group Project Title:** Caredo-Salibay-Solano POS System<br>
**Section:** BSIT 4D<br>
**Instructor:** Reban Cliff Fajardo<br>
**Repository:** [JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano](https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano)<br>
**Integration branch:** `main`

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
6. **Digital Receipt:** Itemized digital receipt with transaction details, timestamp, and browser printing support.
7. **New Transaction (Reset):** One-tap kiosk reset that clears all cart data, input buffers, and previous customer details for the next transaction.

QR and card payments are simulations. The application does not connect to a bank, e-wallet, payment gateway, or physical card reader. Saved transaction history remains available after resetting the current order.

---

## 🚀 2. Setup and Execution Instructions

The system is built using standard, zero-dependency web technologies, making it reliable, fast, and runnable on any operating system (Windows, macOS, Linux) and mobile/tablet kiosk screen.

### How to Run:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano.git
   cd IT415_Midterm_Caredo_Salibay_Solano
   ```
2. **Open the application:**
   - Simply double-click `index.html` to open it in your default browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
   - Alternatively, right-click `index.html` → **Open with** → **Google Chrome** (or Edge).
   - For consistent browser storage behavior, serve the repository with a local HTTP server:
     ```bash
     # Using Python (if available):
     python -m http.server 8000
     # Then visit http://localhost:8000 in your browser.
     ```

On Windows, `py -m http.server 8000` is an alternative when Python is available through the Python launcher. Keep the terminal running while using the kiosk; press `Ctrl+C` to stop the server. No package installation, build command, environment variables, or database setup are required.

### Project Files

```text
IT415_Midterm_Caredo_Salibay_Solano/
├── index.html       # Menu, checkout, receipt, and history screens
├── style.css        # Theme, responsive layout, and print styles
├── ui.js            # SVG icons and product illustrations
├── script.js        # Cart, payments, receipts, storage, and navigation
├── design.md        # Reference design direction
├── assets/fonts/    # Local font files and OFL licenses
└── README.md        # Setup, team contributions, and development evidence
```

---

## 💻 3. Technology Stack & Storage Rationale

- **Frontend Core:** Pure HTML5, Semantic Elements (`<header>`, `<main>`, `<section>`, `<aside>`)
- **Styling:** Modern CSS3 with CSS Custom Variables (Design Tokens), Flexbox, CSS Grid, and responsive touch layout.
- **Client-Side Logic:** Vanilla JavaScript (ES6+), Event-driven architecture, modular state management.
- **Storage Strategy:** 
  - **Runtime State:** In-memory reactive state variables (`cart`, `rawCashInput`, `completedTransaction`).
  - **Persistent Storage:** Browser `localStorage` (`campus_hub_pos_txns` key) saves completed transaction snapshots and supports sequential reference numbering in normal operation. An in-memory fallback is available when storage access fails; its known read/write failure limitation is documented below.
  - **Rationale:** A full external SQL/NoSQL database is not necessary for an isolated self-service kiosk terminal. Local client-side persistence provides instant zero-latency responses, works completely offline, and eliminates server configuration overhead during practical examination.

History belongs to the browser and website origin where the order was completed. Different devices, browser profiles, localhost addresses, and deployed domains have separate histories. Clearing site data removes the saved history; the in-memory fallback does not survive a reload. The system has no central database or cross-device synchronization.

---

## 🎨 4. Unique UI/UX Design Direction

While taking structural inspiration from the instructor's sample UI, the **Campus Hub POS** features a distinct, custom-crafted visual identity:
1. **Victorian brass and parchment:** The visual direction in `design.md` is adapted to the kiosk with parchment (`#F5DEB3`), mahogany (`#5C0000`), brass (`#B5A642`), copper, and teal details. Order tickets and checkout panels use engraved borders and subtle paper texture.
2. **Local typography and artwork:** IM Fell English provides the antique serif text; JetBrains Mono displays prices and transaction metadata. Font files and their OFL licenses are bundled in `assets/fonts/`. Product illustrations and interface icons are inline SVGs in `ui.js`, so the interface has no external font or image dependencies.
3. **Order progress:** Four numbered indicators show the current Order, Review, Payment, or Receipt stage.
4. **Touch and keyboard controls:** Product and payment cards are native buttons. Cart controls have descriptive accessible labels and 44px touch targets; focus rings and reduced-motion support are included. The menu collapses to two columns on small screens.
5. **Cash keypad and feedback:** The on-screen number pad includes Clear and Backspace. The application previews change or shortage and rejects insufficient payment with a visible alert and live status message.
6. **Payment and receipts:** A brass-framed card terminal displays the simulated processing state. Current and archived receipts share the same readable paper style. Print styles include only the active receipt.
7. **Transaction history:** Completed transactions are listed newest first and remain after refresh. Historical receipts use a separate screen and preserve any unfinished order. Missing or malformed storage and invalid records are handled without crashing.

---

## 📋 5. Acceptance Checklist & Test Matrix

These are development test results from the October 7, 2026 browser and logic review, not an instructor grade. The supplied Solano checklist marks the normal application flow as passing. The broader review also found the storage/reference edge cases documented below. This README update changes documentation only.

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
| 15 | Unique Transaction IDs | Complete multiple transactions | Normal sequential transactions produce different references. Storage failures or gaps in retained references can cause reuse. | Normal flow passes; edge cases unresolved |

### Known Limitations

1. **Storage write failure:** If existing history can be read but a new write fails, reopening history can replace the in-memory fallback with older saved data. The latest unsaved record can disappear from the list.
2. **Reference reuse:** References use stored record count plus one. Retained references ending `00001` and `00003` cause the next count-based reference to end `00003` again. The storage failure above can also allow reuse.

The normal exam checkout flow passes the recorded tests. These issues remain relevant to history reliability and the required unique-reference behavior. Browser printing is available, but physical printer output was not tested.

---

## 6. Group Members and Contributions

The member names, account URLs, and branch assignments below are recorded in the supplied `SOLANO_IT415-Acceptance-Checklist.pdf`. The team confirmed that Karen and Prille used the same laptop and worked together on one branch.

| ID | Member | GitHub Account | Feature Branch | Contribution |
|---|---|---|---|---|
| M1 | Johnfel Anthony Caredo | [JohnfelAnthony](https://github.com/JohnfelAnthony) | `feature/ui-redesign` | UI redesign, SVG icons/artwork, local fonts, responsive layouts, history navigation handlers, and integration of both feature branches |
| M2 | Karen B. Solano | [Dinosow](https://github.com/Dinosow) | `feature/transaction-history`, shared with M3 | Joint work with Prille on the initial application, HTML/CSS/JS separation, initial README, history layout, and storage fallback |
| M3 | Prille Vincent Salibay | [Prille](https://github.com/Prille) | `feature/transaction-history`, shared with M2 | Joint work with Karen on the initial application, HTML/CSS/JS separation, initial README, history layout, and storage fallback |

### Shared Laptop and Branch

Karen and Prille used the same laptop and the same `feature/transaction-history` branch. Their joint work is associated with four commits recorded under the Git author/account **Dinosow**: `9be9774`, `1d222fd`, `9dc4925`, and `30cf9d9`. Both members receive credit for the shared work in the contribution register; these remain **four distinct commits in total**, not four additional commits for each person.

Git records the account that saved the commits; it does not separately measure each member's participation on the shared laptop. Each member can explain their role through the code demonstration and contribution register. The Prille account is the member profile supplied in the checklist; the current Git history does not separately attribute these shared commits to that account.

### Pull Requests and Integration

| Pull Request | Branch and Target | Feature Work | PR Author and Merger | Status |
|---|---|---|---|---|
| [PR #1](https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano/pull/1) | `feature/transaction-history` → `main` | Karen and Prille's shared transaction-history work, recorded under Dinosow | JohnfelAnthony | Merged as `cb688c0` |
| [PR #2](https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano/pull/2) | `feature/ui-redesign` → `main` | Johnfel's redesign and history-handler implementation | JohnfelAnthony | Merged as `eb07efd` |

Both PRs were opened and merged by JohnfelAnthony. GitHub records inspected on October 7, 2026 contained no formal reviews, review comments, or issue comments for either PR. Merge evidence exists; a separate review before merge is not documented. Deleted feature branches can still be verified through their merged PRs and commits.

### Recorded Development History

The application review used integration commit `eb07efd166c7fd9f911e3d7f4344a65ece459b55`. The following history predates this README completion:

| Commit | Recorded Git Author | Change |
|---|---|---|
| `9be9774` | Dinosow | Initial touchscreen POS application |
| `1d222fd` | Dinosow | Separate HTML, CSS, and JavaScript files |
| `9dc4925` | Dinosow | Add the initial README |
| `30cf9d9` | Dinosow | Add transaction-history layout and storage fallback |
| `cb688c0` | Johnfel Anthony Caredo | Merge PR #1 into `main` |
| `486ceff` | Anthony | Apply the redesign, implement history handlers, and improve current-transaction reset |
| `eb07efd` | Johnfel Anthony Caredo | Merge PR #2 into `main` |

The register associates `486ceff` with Johnfel's redesign. Its Git author name is `Anthony`; GitHub does not link that commit to an account. The integration commits use Johnfel's full name.

This snapshot contains five development commits and two merge commits. Seven commit entries alone do not establish the seven distinct development stages requested by the process checklist. Further commits should record actual work rather than artificial changes made only to reach a count.

---

## 7. AI Assistance Record

Codex assisted with the following stages recorded in the project conversation. These entries summarize actual requests, responses, evaluation, and changes; they do not reconstruct missing prompts from the shared laptop.

| Stage | Prompt or Request | AI Response | Evaluation and Resulting Changes |
|---|---|---|---|
| Requirements review | Check the codebase against the IT415 practical exam and acceptance checklist | Compared the order, payment, receipt, and reset flow with the PDFs | Checked calculations and navigation; identified missing documentation and process evidence |
| Feature planning | Provide a prompt for `feature/transaction-history` | Prepared feature and branch guidance | Karen and Prille's shared feature branch was later merged through PR #1; the full shared-laptop AI transcript is not available here |
| UI generation and adaptation | Read `design.md`, inspect the supplied screenshot, and redesign the system | Implemented parchment/brass styling, SVG icons and products, bundled fonts, and consistent checkout screens | Adapted the landing-page reference to kiosk ordering; checked desktop and narrow-screen layouts and corrected overflow |
| Debugging and refactoring during redesign | Keep the redesigned checkout and transaction history working | Found missing history handlers; added history listing and archived-receipt functions; cleared current receipt details during reset; consolidated styling | Checked archived receipts without changing the active cart, malformed storage handling, escaped text, and reset; included in `486ceff` |
| Subsequent system audit | Recheck transaction history and completeness against the PDFs | Reproduced storage write-failure and reference-collision cases; checked Git and documentation evidence | Distinguished normal-flow passes from unresolved edge cases and recorded the limitations above |
| README completion | Read Solano's checklist and explain that two members share one branch and laptop | Added the supplied roster, joint-work attribution, corrected setup commands, PR/commit evidence, and this record | Counted shared commits once, separated Git authorship from team attribution, and preserved the known limitations |

AI-generated changes were evaluated through browser interaction, JavaScript syntax checks, and isolated logic checks covering cart calculations, payment validation, history isolation, malformed storage, and reference generation. No permanent automated test suite is included in the repository. Application tests were not rerun for this documentation-only update.

The original generation prompts and responses for Karen and Prille's initial application and shared-laptop work have not been supplied in this conversation. Their member-specific AI evidence can accompany the submission separately. This section records the available assistance and its evaluation; it does not claim to be a complete transcript for every member.

---

## 8. Submission Evidence

- [Shared repository](https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano)
- [Commit history on main](https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano/commits/main)
- [Repository network](https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano/network)
- [Merged history PR #1](https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano/pull/1)
- [Merged redesign PR #2](https://github.com/JohnfelAnthony/IT415_Midterm_Caredo_Salibay_Solano/pull/2)

Team and course details were transcribed from `SOLANO_IT415-Acceptance-Checklist.pdf`, with the shared-laptop arrangement confirmed by the team. Its listed evaluation date does not establish that an instructor evaluation has already occurred. Instructor access confirmation, live member explanations, and final grading remain part of the instructor's verification.

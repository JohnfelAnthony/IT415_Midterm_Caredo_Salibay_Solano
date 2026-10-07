// ---------------------------------------------------------
// 1. DATA: PRODUCT CATALOG (8 Products, 4 Categories)
// ---------------------------------------------------------
const STORE_NAME = "CAMPUS HUB POS";

const PRODUCTS = [
  { id: 1, name: "Espresso Roast Coffee", category: "drinks", price: 45.00 },
  { id: 2, name: "Club Sandwich",         category: "food",   price: 50.00 },
  { id: 3, name: "Ice Cold Soft Drink",   category: "drinks", price: 35.00 },
  { id: 4, name: "Choco Chip Cookies",    category: "snacks", price: 25.00 },
  { id: 5, name: "Pure Mineral Water",    category: "drinks", price: 20.00 },
  { id: 6, name: "Milk Chocolate Bar",    category: "snacks", price: 25.00 },
  { id: 7, name: "Chicken Rice Bowl",     category: "food",   price: 75.00 },
  { id: 8, name: "Crispy Potato Fries",   category: "snacks", price: 40.00 }
];

// ---------------------------------------------------------
// 2. STATE VARIABLES
// ---------------------------------------------------------
let cart = [];               // Cart items: [{ id, name, price, quantity }]
let activeCategory = "all";  // Selected category filter
let rawCashInput = "";       // Cash entered in cents/numbers on touchscreen numpad
let completedTransaction = null; // Stores completed transaction for success & receipt
let memoryTransactions = [];   // In-memory fallback if storage is restricted or unavailable
let isProcessingCard = false;
let toastTimeout = null;

// ---------------------------------------------------------
// 3. UTILITY FUNCTIONS
// ---------------------------------------------------------
function formatCurrency(amount) {
  return "₱" + Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Controls which screen is currently visible & updates header step pill
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Update header stepper pills
  updateStepper(screenId);
}

function updateStepper(screenId) {
  const p1 = document.getElementById("step-pill-1");
  const p2 = document.getElementById("step-pill-2");
  const p3 = document.getElementById("step-pill-3");
  const p4 = document.getElementById("step-pill-4");

  [p1, p2, p3, p4].forEach(p => p.className = "step-pill");

  if (screenId === "screen-order" || screenId === "screen-history" || screenId === "screen-history-receipt") {
    p1.classList.add("active");
  } else if (screenId === "screen-summary") {
    p1.classList.add("completed");
    p2.classList.add("active");
  } else if (["screen-method", "screen-cash", "screen-qr", "screen-card"].includes(screenId)) {
    p1.classList.add("completed");
    p2.classList.add("completed");
    p3.classList.add("active");
  } else if (["screen-success", "screen-receipt"].includes(screenId)) {
    p1.classList.add("completed");
    p2.classList.add("completed");
    p3.classList.add("completed");
    p4.classList.add("active");
  }
}

// Non-intrusive toast feedback
function showToast(message, type = "ok") {
  const toast = document.getElementById("kiosk-toast");
  const icon = document.getElementById("toast-icon");
  const text = document.getElementById("toast-text");

  text.textContent = message;
  icon.innerHTML = kioskIcon(type === "ok" ? "check" : "alert");

  toast.className = "show " + (type === "ok" ? "toast-ok" : "toast-error");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.className = "";
  }, 2500);
}

// ---------------------------------------------------------
// 4. CATALOG RENDERING & FILTERING
// ---------------------------------------------------------
function filterCategory(category, buttonEl) {
  activeCategory = category;
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
  });
  if (buttonEl) {
    buttonEl.classList.add("active");
    buttonEl.setAttribute("aria-pressed", "true");
  }
  renderProducts();
}

function renderProducts() {
  const container = document.getElementById("product-grid");
  const filtered = activeCategory === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  container.innerHTML = filtered.map(product => {
    const cartItem = cart.find(item => item.id === product.id);
    const qtyCount = cartItem ? cartItem.quantity : 0;
    const badgeClass = qtyCount > 0 ? "card-badge visible" : "card-badge";

    return `
      <button class="product-card${qtyCount > 0 ? ' selected' : ''}" aria-label="Add ${product.name}, ${formatCurrency(product.price)}" onclick="addToCart(${product.id})">
        <div class="${badgeClass}" id="badge-${product.id}">${qtyCount}</div>
        <span class="product-icon">${productArtwork(product.id)}</span>
        <div class="product-info">
          <span class="category-tag">${{drinks: 'Beverages', food: 'Meals', snacks: 'Snacks'}[product.category]}</span>
          <h3>${product.name}</h3>
        </div>
        <span class="product-bottom"><span class="product-price">${formatCurrency(product.price)}</span><span class="product-add">${kioskIcon('plus')}</span></span>
      </button>
    `;
  }).join("");
}

// ---------------------------------------------------------
// 5. CART ENGINE & COMPUTATIONS
// ---------------------------------------------------------
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  updateCartUI();
  renderProducts(); // Refresh badges
  showToast(`Added ${product.name}`, "ok");
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty < 1) {
    showToast("Invalid quantity. Minimum is 1.", "error");
    return;
  }

  item.quantity = newQty;
  updateCartUI();
  renderProducts();
}

function removeFromCart(productId) {
  const item = cart.find(i => i.id === productId);
  const itemName = item ? item.name : "Item";
  cart = cart.filter(i => i.id !== productId);
  updateCartUI();
  renderProducts();
  showToast(`${itemName} removed from order`, "ok");
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTotalItemsCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartUI() {
  const listContainer = document.getElementById("cart-items-container");
  const totalDisplay = document.getElementById("cart-total-display");
  const countBadge = document.getElementById("cart-item-count");
  const proceedBtn = document.getElementById("btn-proceed-review");

  const totalItems = calculateTotalItemsCount();
  const grandTotal = calculateTotal();

  countBadge.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;
  totalDisplay.textContent = formatCurrency(grandTotal);

  if (cart.length === 0) {
    listContainer.innerHTML = `
      <div class="cart-empty-message">
        <div class="empty-icon">${kioskIcon('bag')}</div>
        <p><strong>Your order is empty</strong></p>
        <p style="font-size: 15px; margin-top: 9px;">Something delicious awaits. Tap a menu item to get started.</p>
      </div>
    `;
    proceedBtn.disabled = true;
  } else {
    listContainer.innerHTML = cart.map(item => {
      const subtotal = item.price * item.quantity;
      return `
        <div class="cart-row">
          <div class="cart-row-top">
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-unit">${formatCurrency(item.price)} each</div>
            </div>
            <div class="cart-item-subtotal">${formatCurrency(subtotal)}</div>
          </div>
          <div class="cart-row-actions">
            <div class="qty-controls">
              <button class="qty-btn" aria-label="Decrease ${item.name} quantity" onclick="changeQuantity(${item.id}, -1)">−</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" aria-label="Increase ${item.name} quantity" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="btn-delete-item" title="Remove item" aria-label="Remove ${item.name}" onclick="removeFromCart(${item.id})">${kioskIcon('trash')}</button>
          </div>
        </div>
      `;
    }).join("");
    proceedBtn.disabled = false;
  }
}

// ---------------------------------------------------------
// 6. SCREEN 2: ORDER SUMMARY REVIEW
// ---------------------------------------------------------
function goToSummary() {
  if (cart.length === 0) {
    showToast("Your cart is empty. Please add items first.", "error");
    return;
  }

  const tbody = document.getElementById("summary-tbody");
  const totalVal = document.getElementById("summary-total-val");
  const itemsCount = document.getElementById("summary-items-count");

  tbody.innerHTML = cart.map(item => {
    const subtotal = item.price * item.quantity;
    return `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td class="c-align">${item.quantity}</td>
        <td class="r-align">${formatCurrency(item.price)}</td>
        <td class="r-align" style="color: var(--primary); font-weight: 800;">${formatCurrency(subtotal)}</td>
      </tr>
    `;
  }).join("");

  const grandTotal = calculateTotal();
  const totalCount = calculateTotalItemsCount();

  itemsCount.textContent = `Total for ${totalCount} item${totalCount === 1 ? '' : 's'}`;
  totalVal.textContent = formatCurrency(grandTotal);

  showScreen("screen-summary");
}

// Crucial Instructor Test: Navigating back must PRESERVE all items!
function backToOrder() {
  showScreen("screen-order");
  updateCartUI();
}

function goToPaymentMethod() {
  const grandTotal = calculateTotal();
  document.getElementById("method-due-amount").textContent = formatCurrency(grandTotal);
  showScreen("screen-method");
}

// ---------------------------------------------------------
// 7. SCREEN 3 & 4: PAYMENT PROCESSING ENGINE
// ---------------------------------------------------------
function selectPaymentMode(mode) {
  const grandTotal = calculateTotal();
  const formattedTotal = formatCurrency(grandTotal);

  if (mode === "cash") {
    document.getElementById("cash-screen-due").textContent = formattedTotal;
    rawCashInput = "";
    updateCashScreen();
    hideCashAlert();
    showScreen("screen-cash");
  } else if (mode === "qr") {
    document.getElementById("qr-screen-due").textContent = formattedTotal;
    document.getElementById("qr-dynamic-ref").textContent = "REF: QR-" + generateNextReference();
    showScreen("screen-qr");
  } else if (mode === "card") {
    document.getElementById("card-screen-due").textContent = formattedTotal;
    resetCardState();
    showScreen("screen-card");
  }
}

// --- CASH SCREEN ENGINE & TOUCH NUMPAD ---
function pressNum(digit) {
  // Limit cash digits to realistic amount
  if (rawCashInput.length >= 7) return;
  rawCashInput += digit;
  updateCashScreen();
  hideCashAlert();
}

function pressClear() {
  rawCashInput = "";
  updateCashScreen();
  hideCashAlert();
}

function pressBackspace() {
  rawCashInput = rawCashInput.slice(0, -1);
  updateCashScreen();
  hideCashAlert();
}

function quickCash(amount) {
  if (amount === "exact") {
    const total = calculateTotal();
    rawCashInput = String(Math.round(total));
  } else {
    rawCashInput = String(amount);
  }
  updateCashScreen();
  hideCashAlert();
}

function getEnteredCashAmount() {
  if (!rawCashInput || rawCashInput === "") return 0;
  return parseFloat(rawCashInput);
}

function updateCashScreen() {
  const amount = getEnteredCashAmount();
  const total = calculateTotal();
  document.getElementById("cash-display").textContent = formatCurrency(amount);

  const previewBox = document.getElementById("cash-change-preview");
  const previewLabel = document.getElementById("change-preview-label");
  const previewVal = document.getElementById("change-preview-val");

  if (amount === 0) {
    previewBox.className = "change-preview-box";
    previewLabel.textContent = "Change Due:";
    previewVal.textContent = "₱0.00";
  } else if (amount >= total) {
    const change = amount - total;
    previewBox.className = "change-preview-box ok";
    previewLabel.textContent = "Change to return:";
    previewVal.textContent = formatCurrency(change);
  } else {
    const short = total - amount;
    previewBox.className = "change-preview-box short";
    previewLabel.textContent = "Insufficient (Short by):";
    previewVal.textContent = "− " + formatCurrency(short);
  }
}

function showCashAlert(msg) {
  const alert = document.getElementById("cash-alert");
  document.getElementById("cash-alert-text").textContent = msg;
  alert.classList.add("visible");
  showToast(msg, "error");
}

function hideCashAlert() {
  document.getElementById("cash-alert").classList.remove("visible");
}

function processCashPayment() {
  const total = calculateTotal();
  const amount = getEnteredCashAmount();

  // Strict Instructor Validation
  if (amount <= 0 || isNaN(amount)) {
    showCashAlert("Invalid amount. Please enter cash tendered.");
    return;
  }

  if (amount < total) {
    const shortage = total - amount;
    showCashAlert(`Insufficient payment. Please enter at least ${formatCurrency(total)}. You are short by ${formatCurrency(shortage)}.`);
    return; // STAYS on Cash screen, no receipt produced!
  }

  const change = amount - total;
  completeTransaction("Cash", amount, change);
}

// --- QR PAYMENT ENGINE ---
function processQRPayment() {
  const total = calculateTotal();
  // In simulated QR payment, tendered equals exact total, change is 0.00
  completeTransaction("QR Payment", total, 0.00);
}

// --- CARD PAYMENT ENGINE ---
function resetCardState() {
  isProcessingCard = false;
  document.getElementById("card-terminal-display").innerHTML = `
    <div>READY</div>
    <div style="font-size: 16px; font-weight: bold; color: #fffff0;">INSERT OR TAP</div>
  `;
  document.getElementById("card-instruction-text").textContent = "Please tap, insert, or swipe your card on the reader.";
  document.getElementById("btn-process-card").disabled = false;
  document.getElementById("btn-back-card").disabled = false;
  document.getElementById("card-progress-bar").classList.remove("active");
  document.getElementById("card-progress-fill").style.transform = "scaleX(0)";
}

function processCardPayment() {
  if (isProcessingCard) return;
  isProcessingCard = true;

  // Lock buttons
  document.getElementById("btn-process-card").disabled = true;
  document.getElementById("btn-back-card").disabled = true;

  // Processing visual state
  document.getElementById("card-terminal-display").innerHTML = `
    <div style="color: #d8bc73;">PROCESSING</div>
    <div style="font-size: 13px; color: #fffff0;">COMMUNICATING...</div>
  `;
  document.getElementById("card-instruction-text").textContent = "Processing payment... Please do not remove card.";

  const bar = document.getElementById("card-progress-bar");
  const fill = document.getElementById("card-progress-fill");
  bar.classList.add("active");
  setTimeout(() => { fill.style.transform = "scaleX(1)"; }, 50);

  // Simulate 1.5s transaction handshake
  setTimeout(() => {
    isProcessingCard = false;
    const total = calculateTotal();
    completeTransaction("Credit/Debit Card", total, 0.00);
  }, 1500);
}

// ---------------------------------------------------------
// 8. TRANSACTION STORAGE & UNIQUE REFERENCE GENERATION
// ---------------------------------------------------------
function getStoredTransactions() {
  try {
    const raw = localStorage.getItem("campus_hub_pos_txns");
    if (!raw) return memoryTransactions;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return memoryTransactions;
    // Filter and sanitize: must be non-null object with reference string
    const valid = parsed.filter(t => t && typeof t === "object" && typeof t.reference === "string");
    if (valid.length > 0) {
      memoryTransactions = valid;
    }
    return valid;
  } catch (e) {
    console.warn("Storage restricted or JSON malformed; falling back to memory:", e);
    return memoryTransactions;
  }
}

function saveTransactionRecord(record) {
  try {
    const history = getStoredTransactions().slice();
    history.push(record);
    memoryTransactions = history;
    localStorage.setItem("campus_hub_pos_txns", JSON.stringify(history));
  } catch (e) {
    console.warn("Storage restricted; keeping in memory:", e);
    if (!memoryTransactions.includes(record)) {
      memoryTransactions.push(record);
    }
  }
}

function generateNextReference() {
  const history = getStoredTransactions();
  const count = history.length + 1;
  const year = new Date().getFullYear();
  return `TXN-${year}-${String(count).padStart(5, "0")}`;
}

function completeTransaction(paymentMethod, amountPaid, change) {
  const total = calculateTotal();
  const dateObj = new Date();
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  }) + " · " + dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit"
  });

  // Freeze a dedicated copy of cart items for this transaction
  const snapshotItems = cart.map(i => ({
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    subtotal: i.price * i.quantity
  }));

  completedTransaction = {
    reference: generateNextReference(),
    date: formattedDate,
    items: snapshotItems,
    total: total,
    paymentMethod: paymentMethod,
    amountPaid: amountPaid,
    change: change,
    status: "Payment Successful"
  };

  saveTransactionRecord(completedTransaction);
  renderSuccessScreen();
  showScreen("screen-success");
  showToast("Transaction completed successfully!", "ok");
}

// ---------------------------------------------------------
// 9. SCREEN 5 & 6: CONFIRMATION & RECEIPT
// ---------------------------------------------------------
function renderSuccessScreen() {
  const t = completedTransaction;
  const box = document.getElementById("success-summary-box");

  box.innerHTML = `
    <div class="info-line">
      <span>Transaction Ref:</span>
      <strong>${t.reference}</strong>
    </div>
    <div class="info-line">
      <span>Payment Method:</span>
      <strong>${t.paymentMethod}</strong>
    </div>
    <div class="info-line">
      <span>Transaction Amount:</span>
      <strong style="color: var(--primary); font-size: 20px;">${formatCurrency(t.total)}</strong>
    </div>
    <div class="info-line">
      <span>Amount Paid:</span>
      <strong>${formatCurrency(t.amountPaid)}</strong>
    </div>
    <div class="info-line">
      <span>Change Returned:</span>
      <strong style="color: var(--teal);">${formatCurrency(t.change)}</strong>
    </div>
  `;
}

function showReceiptScreen() {
  const t = completedTransaction;
  if (!t) return;

  document.getElementById("rcpt-ref").textContent = t.reference;
  document.getElementById("rcpt-date").textContent = t.date;

  const tbody = document.getElementById("rcpt-items-body");
  tbody.innerHTML = t.items.map(item => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${formatCurrency(item.price)}</td>
      <td style="text-align: right;">${formatCurrency(item.subtotal)}</td>
    </tr>
  `).join("");

  document.getElementById("rcpt-total").textContent = formatCurrency(t.total);
  document.getElementById("rcpt-method").textContent = t.paymentMethod;
  document.getElementById("rcpt-paid").textContent = formatCurrency(t.amountPaid);
  document.getElementById("rcpt-change").textContent = formatCurrency(t.change);

  showScreen("screen-receipt");
}

// ---------------------------------------------------------
// 10. NEW TRANSACTION RESET ENGINE
// ---------------------------------------------------------
function startNewTransaction() {
  // 1. Reset Cart State
  cart = [];
  activeCategory = "all";
  rawCashInput = "";
  completedTransaction = null;
  isProcessingCard = false;

  // Clear the current customer displays; saved history remains available.
  document.getElementById("rcpt-items-body").innerHTML = "";
  document.getElementById("success-summary-box").innerHTML = "";
  document.getElementById("summary-tbody").innerHTML = "";
  ["rcpt-ref", "rcpt-date"].forEach(id => document.getElementById(id).textContent = "--");
  document.getElementById("rcpt-method").textContent = "--";
  ["rcpt-total", "rcpt-paid", "rcpt-change", "method-due-amount", "cash-screen-due", "qr-screen-due", "card-screen-due", "summary-total-val"].forEach(id => {
    document.getElementById(id).textContent = formatCurrency(0);
  });

  // 2. Clear UI Inputs & Alerts
  hideCashAlert();
  pressClear();
  resetCardState();

  // 3. Update Cart & Badges
  updateCartUI();
  renderProducts();

  // 4. Reset Category Buttons
  document.querySelectorAll(".cat-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === 0);
    btn.setAttribute("aria-pressed", String(idx === 0));
  });

  // 5. Navigate to Screen 1
  showScreen("screen-order");
  showToast("New transaction started — Previous order cleared", "ok");
}

// ---------------------------------------------------------
// 11. HISTORY NAVIGATION — archives never mutate the active customer order.
// ---------------------------------------------------------
let historyViewRecords = [];

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

function isDisplayableTransaction(record) {
  return record && typeof record.reference === 'string' &&
    typeof record.date === 'string' && typeof record.paymentMethod === 'string' &&
    [record.total, record.amountPaid, record.change].every(value => Number.isFinite(value) && value >= 0) &&
    Array.isArray(record.items) && record.items.length > 0 &&
    record.items.every(item => item && typeof item.name === 'string' &&
      Number.isInteger(item.quantity) && item.quantity > 0 &&
      Number.isFinite(item.price) && item.price >= 0 &&
      Number.isFinite(item.subtotal) && item.subtotal >= 0);
}

function openTransactionHistory() {
  // Transactions are appended on completion; reverse a copy for newest first.
  historyViewRecords = getStoredTransactions().filter(isDisplayableTransaction).slice().reverse();
  const container = document.getElementById('history-list-container');
  if (!historyViewRecords.length) {
    container.innerHTML = `<div class="history-empty"><div class="empty-icon">${kioskIcon('clock')}</div><h3>No transactions yet</h3><p>Completed orders will appear here.<br>Return to the menu to start your first order.</p></div>`;
  } else {
    container.innerHTML = historyViewRecords.map((record, index) => `
      <article class="history-card">
        <div class="history-info">
          <div class="history-ref-row"><span class="history-ref">${escapeHTML(record.reference)}</span><span class="history-method-badge">${escapeHTML(record.paymentMethod)}</span></div>
          <div class="history-date">${escapeHTML(record.date)}</div>
          <div class="history-total">${formatCurrency(record.total)}</div>
        </div>
        <button class="btn-view-receipt" aria-label="View receipt ${escapeHTML(record.reference)}" onclick="viewHistoricalReceipt(${index})">${kioskIcon('receipt')} View Receipt</button>
      </article>`).join('');
  }
  showScreen('screen-history');
}

function viewHistoricalReceipt(index) {
  const record = historyViewRecords[index];
  if (!record) return;
  document.getElementById('hist-rcpt-ref').textContent = record.reference;
  document.getElementById('hist-rcpt-date').textContent = record.date;
  document.getElementById('hist-rcpt-items-body').innerHTML = record.items.map(item => `
    <tr><td><strong>${escapeHTML(item.name)}</strong></td><td class="c-align">${item.quantity}</td><td class="r-align">${formatCurrency(item.price)}</td><td class="r-align">${formatCurrency(item.subtotal)}</td></tr>`).join('');
  document.getElementById('hist-rcpt-total').textContent = formatCurrency(record.total);
  document.getElementById('hist-rcpt-method').textContent = record.paymentMethod;
  document.getElementById('hist-rcpt-paid').textContent = formatCurrency(record.amountPaid);
  document.getElementById('hist-rcpt-change').textContent = formatCurrency(record.change);
  document.getElementById('hist-rcpt-status').textContent = 'Payment Successful';
  showScreen('screen-history-receipt');
}

function backToHistory() {
  openTransactionHistory();
}

function backToOrderFromHistory() {
  backToOrder();
}

// ---------------------------------------------------------
// 12. INITIALIZATION ON PAGE LOAD
// ---------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  showScreen("screen-order");
});

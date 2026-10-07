// ---------------------------------------------------------
// 1. DATA: PRODUCT CATALOG (8 Products, 4 Categories)
// ---------------------------------------------------------
const STORE_NAME = "CAMPUS HUB POS";

const PRODUCTS = [
  { id: 1, name: "Espresso Roast Coffee", category: "drinks", price: 45.00, icon: "☕" },
  { id: 2, name: "Club Sandwich",         category: "food",   price: 50.00, icon: "🥪" },
  { id: 3, name: "Ice Cold Soft Drink",   category: "drinks", price: 35.00, icon: "🥤" },
  { id: 4, name: "Choco Chip Cookies",    category: "snacks", price: 25.00, icon: "🍪" },
  { id: 5, name: "Pure Mineral Water",    category: "drinks", price: 20.00, icon: "💧" },
  { id: 6, name: "Milk Chocolate Bar",    category: "snacks", price: 25.00, icon: "🍫" },
  { id: 7, name: "Chicken Rice Bowl",     category: "food",   price: 75.00, icon: "🍗" },
  { id: 8, name: "Crispy Potato Fries",   category: "snacks", price: 40.00, icon: "🍟" }
];

// ---------------------------------------------------------
// 2. STATE VARIABLES
// ---------------------------------------------------------
let cart = [];               // Cart items: [{ id, name, price, quantity }]
let activeCategory = "all";  // Selected category filter
let rawCashInput = "";       // Cash entered in cents/numbers on touchscreen numpad
let completedTransaction = null; // Stores completed transaction for success & receipt
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

  if (screenId === "screen-order") {
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
  icon.textContent = type === "ok" ? "✓" : "⚠️";

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
  document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
  if (buttonEl) buttonEl.classList.add("active");
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
      <div class="product-card" onclick="addToCart(${product.id})">
        <div class="${badgeClass}" id="badge-${product.id}">${qtyCount}</div>
        <div class="product-icon">${product.icon}</div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <span class="category-tag">${product.category}</span>
        </div>
        <div class="product-price">${formatCurrency(product.price)}</div>
      </div>
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
        <div class="empty-icon">🛍️</div>
        <p><strong>Your order is empty</strong></p>
        <p style="font-size: 14px; margin-top: 4px;">Tap any product on the left to add it.</p>
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
              <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="btn-delete-item" title="Remove item" onclick="removeFromCart(${item.id})">🗑️</button>
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
    <div style="font-size: 16px; font-weight: bold; color: #fff;">INSERT OR TAP</div>
  `;
  document.getElementById("card-instruction-text").textContent = "Please tap, insert, or swipe your card on the reader.";
  document.getElementById("btn-process-card").disabled = false;
  document.getElementById("btn-back-card").disabled = false;
  document.getElementById("card-progress-bar").classList.remove("active");
  document.getElementById("card-progress-fill").style.width = "0%";
}

function processCardPayment() {
  if (isProcessingCard) return;
  isProcessingCard = true;

  // Lock buttons
  document.getElementById("btn-process-card").disabled = true;
  document.getElementById("btn-back-card").disabled = true;

  // Processing visual state
  document.getElementById("card-terminal-display").innerHTML = `
    <div style="color: #f59e0b;">PROCESSING</div>
    <div style="font-size: 13px; color: #fff;">COMMUNICATING...</div>
  `;
  document.getElementById("card-instruction-text").textContent = "Processing payment... Please do not remove card.";

  const bar = document.getElementById("card-progress-bar");
  const fill = document.getElementById("card-progress-fill");
  bar.classList.add("active");
  setTimeout(() => { fill.style.width = "100%"; }, 50);

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
    return JSON.parse(localStorage.getItem("campus_hub_pos_txns")) || [];
  } catch (e) {
    return [];
  }
}

function saveTransactionRecord(record) {
  try {
    const history = getStoredTransactions();
    history.push(record);
    localStorage.setItem("campus_hub_pos_txns", JSON.stringify(history));
  } catch (e) {
    console.warn("Storage restricted; keeping in memory.");
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
      <strong style="color: #047857;">${formatCurrency(t.change)}</strong>
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
  });

  // 5. Navigate to Screen 1
  showScreen("screen-order");
  showToast("New transaction started — Previous order cleared", "ok");
}

// ---------------------------------------------------------
// 11. INITIALIZATION ON PAGE LOAD
// ---------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  showScreen("screen-order");
});

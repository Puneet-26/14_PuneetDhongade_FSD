/**
 * Full Stack Development – Programming Exercise (Bus Pass Management System)
 * Student Roll No. 14: Puneet Dhongade | Semester V | B.Tech AI&DS
 * Program 1: Vanilla JavaScript with DOM Manipulation, Fetch API & Async/Await
 */

// Offline fallback seed data (used if file:// protocol blocks Fetch API)
const FALLBACK_SEED_PASSES = [
  {
    id: "BP-101",
    passengerName: "Puneet Dhongade",
    route: "Andheri Station (W) to Bandra Kurla Complex (BKC)",
    passType: "Student",
    validityDays: 90,
    issueDate: "2026-11-01",
    expiryDate: "2027-01-30",
    status: "Active",
    price: 450
  },
  {
    id: "BP-102",
    passengerName: "Aarav Mehta",
    route: "Thane Station to CSMT (Fort)",
    passType: "Monthly",
    validityDays: 30,
    issueDate: "2026-11-05",
    expiryDate: "2026-12-05",
    status: "Active",
    price: 750
  },
  {
    id: "BP-103",
    passengerName: "Sunita Patil",
    route: "Borivali (E) to Dadar TT Circle",
    passType: "Senior Citizen",
    validityDays: 180,
    issueDate: "2026-10-15",
    expiryDate: "2027-04-13",
    status: "Active",
    price: 600
  },
  {
    id: "BP-104",
    passengerName: "Rohan Deshmukh",
    route: "Kurla West to Vashi Bus Depot",
    passType: "Student",
    validityDays: 30,
    issueDate: "2026-11-10",
    expiryDate: "2026-12-10",
    status: "Active",
    price: 250
  },
  {
    id: "BP-105",
    passengerName: "Pooja Sharma",
    route: "Ghatkopar Station (E) to Powai Hiranandani",
    passType: "Monthly",
    validityDays: 60,
    issueDate: "2026-10-20",
    expiryDate: "2026-12-19",
    status: "Active",
    price: 800
  }
];

// Application State
let passes = [];
let passCounter = 106;

// DOM Elements
const passForm = document.getElementById("passForm");
const passengerNameInput = document.getElementById("passengerName");
const routeSelect = document.getElementById("routeSelect");
const customRouteGroup = document.getElementById("customRouteGroup");
const customRouteInput = document.getElementById("customRoute");
const passTypeSelect = document.getElementById("passType");
const validityDaysSelect = document.getElementById("validityDays");
const fareEstimate = document.getElementById("fareEstimate");
const fareNote = document.getElementById("fareNote");

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const filterType = document.getElementById("filterType");
const passesContainer = document.getElementById("passesContainer");
const emptyState = document.getElementById("emptyState");
const activeCountBadge = document.getElementById("activeCountBadge");

const metricTotal = document.getElementById("metricTotal");
const metricStudent = document.getElementById("metricStudent");
const metricMonthly = document.getElementById("metricMonthly");
const metricFare = document.getElementById("metricFare");

const consoleLogs = document.getElementById("consoleLogs");
const clearConsoleBtn = document.getElementById("clearConsoleBtn");
const refreshBtn = document.getElementById("refreshBtn");

// Form Error Elements
const nameError = document.getElementById("nameError");
const routeError = document.getElementById("routeError");
const customRouteError = document.getElementById("customRouteError");

/**
 * Log simulated HTTP request/response to the activity console
 */
function logHttp(method, status, message) {
  const timestamp = new Date().toLocaleTimeString();
  const entry = document.createElement("div");
  entry.className = "console-entry";

  const statusClass = `s${status}`;
  const methodClass = method.toLowerCase();

  entry.innerHTML = `
    <span class="log-time">[${timestamp}]</span>
    <span class="log-method ${methodClass}">${method}</span>
    <span class="log-status ${statusClass}">${status}</span>
    <span class="log-msg">${escapeHtml(message)}</span>
  `;

  consoleLogs.prepend(entry);
}

/**
 * Calculate pass fare based on type and validity
 */
function calculateFare(type, days) {
  const baseMonthly = 750;
  const multiplier = days / 30;
  let rawFare = baseMonthly * multiplier;

  if (type === "Student") {
    rawFare *= 0.5; // 50% Student concession
  } else if (type === "Senior Citizen") {
    rawFare *= 0.6; // 40% Senior citizen concession
  }

  return Math.round(rawFare);
}

/**
 * Update live fare preview
 */
function updateFarePreview() {
  const type = passTypeSelect.value;
  const days = parseInt(validityDaysSelect.value, 10);
  const fare = calculateFare(type, days);

  fareEstimate.textContent = `₹${fare}`;

  if (type === "Student") {
    fareNote.textContent = `Student concession (50% OFF) for ${days} days.`;
  } else if (type === "Senior Citizen") {
    fareNote.textContent = `Senior Citizen concession (40% OFF) for ${days} days.`;
  } else {
    fareNote.textContent = `Standard monthly tariff for ${days} days.`;
  }
}

/**
 * Load initial passes using Fetch API with async/await
 */
async function loadPasses() {
  logHttp("GET", "PENDING", "Fetching initial bus pass records from sample_passes.json...");

  try {
    const response = await fetch("sample_passes.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    passes = [...data];
    logHttp("GET", 200, `Successfully retrieved ${passes.length} bus pass records from sample_passes.json`);
  } catch (error) {
    console.warn("Fetch failed (likely file:// protocol without local server). Using offline fallback data:", error);
    passes = [...FALLBACK_SEED_PASSES];
    logHttp("GET", 200, `Loaded ${passes.length} sample records via offline memory fallback (file:// protocol safe)`);
  }

  renderPasses();
  updateMetrics();
}

/**
 * Update aggregate dashboard metrics
 */
function updateMetrics() {
  const total = passes.length;
  const studentCount = passes.filter(p => p.passType === "Student").length;
  const monthlyCount = passes.filter(p => p.passType === "Monthly").length;
  const totalFare = passes.reduce((sum, p) => sum + (p.price || 0), 0);

  metricTotal.textContent = total;
  metricStudent.textContent = studentCount;
  metricMonthly.textContent = monthlyCount;
  metricFare.textContent = `₹${totalFare.toLocaleString()}`;
}

/**
 * Helper to escape HTML characters
 */
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/**
 * Render passes grid based on current filters and search
 */
function renderPasses() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedType = filterType.value;

  const filtered = passes.filter(pass => {
    const matchesSearch =
      pass.passengerName.toLowerCase().includes(searchTerm) ||
      pass.route.toLowerCase().includes(searchTerm) ||
      pass.id.toLowerCase().includes(searchTerm);

    const matchesType = selectedType === "ALL" || pass.passType === selectedType;

    return matchesSearch && matchesType;
  });

  activeCountBadge.textContent = `${filtered.length} of ${passes.length} Passes`;

  passesContainer.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");

    filtered.forEach(pass => {
      const card = document.createElement("div");
      const typeClass = pass.passType === "Student" ? "student" : pass.passType === "Monthly" ? "monthly" : "senior";
      card.className = `pass-card ${typeClass}-pass`;

      card.innerHTML = `
        <div class="pass-top">
          <span class="pass-id">${escapeHtml(pass.id)}</span>
          <span class="category-tag ${typeClass}">${escapeHtml(pass.passType)}</span>
        </div>

        <h3 class="passenger-title">${escapeHtml(pass.passengerName)}</h3>
        <p class="route-desc">📍 ${escapeHtml(pass.route)}</p>

        <div class="pass-meta">
          <div class="meta-item">
            <span>Issued</span>
            <strong>${formatDate(pass.issueDate)}</strong>
          </div>
          <div class="meta-item">
            <span>Valid Until</span>
            <strong>${formatDate(pass.expiryDate)}</strong>
          </div>
          <div class="meta-item">
            <span>Validity</span>
            <strong>${pass.validityDays} Days</strong>
          </div>
          <div class="meta-item">
            <span>Status</span>
            <strong style="color: #059669;">● ${escapeHtml(pass.status || "Active")}</strong>
          </div>
        </div>

        <div class="pass-footer">
          <span class="pass-price">₹${pass.price}</span>
          <button class="delete-btn" data-id="${pass.id}" title="Revoke Pass">
            🗑️ Revoke
          </button>
        </div>
      `;

      passesContainer.appendChild(card);
    });
  }
}

/**
 * Form Validation
 */
function validateForm() {
  let isValid = true;

  // Clear previous errors
  nameError.textContent = "";
  routeError.textContent = "";
  customRouteError.textContent = "";
  passengerNameInput.closest(".form-group").classList.remove("has-error");
  routeSelect.closest(".form-group").classList.remove("has-error");
  if (customRouteGroup) customRouteGroup.classList.remove("has-error");

  const nameValue = passengerNameInput.value.trim();
  if (!nameValue) {
    nameError.textContent = "Passenger name is required.";
    passengerNameInput.closest(".form-group").classList.add("has-error");
    isValid = false;
  } else if (nameValue.length < 3) {
    nameError.textContent = "Name must be at least 3 characters long.";
    passengerNameInput.closest(".form-group").classList.add("has-error");
    isValid = false;
  } else if (!/^[A-Za-z\s.'-]+$/.test(nameValue)) {
    nameError.textContent = "Name can only contain alphabetic letters and spaces.";
    passengerNameInput.closest(".form-group").classList.add("has-error");
    isValid = false;
  }

  const routeValue = routeSelect.value;
  if (!routeValue) {
    routeError.textContent = "Please select a bus route.";
    routeSelect.closest(".form-group").classList.add("has-error");
    isValid = false;
  } else if (routeValue === "custom") {
    const customValue = customRouteInput.value.trim();
    if (!customValue || customValue.length < 5) {
      customRouteError.textContent = "Custom route description must be at least 5 characters.";
      customRouteGroup.classList.add("has-error");
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Form Submission Handler (Simulates POST /api/passes)
 */
function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    logHttp("POST", 400, "Validation Failed: Form contains invalid passenger/route fields");
    return;
  }

  const passengerName = passengerNameInput.value.trim();
  const route = routeSelect.value === "custom" ? customRouteInput.value.trim() : routeSelect.value;
  const passType = passTypeSelect.value;
  const validityDays = parseInt(validityDaysSelect.value, 10);
  const price = calculateFare(passType, validityDays);

  const issueDateObj = new Date();
  const expiryDateObj = new Date();
  expiryDateObj.setDate(issueDateObj.getDate() + validityDays);

  const newPass = {
    id: `BP-${passCounter++}`,
    passengerName,
    route,
    passType,
    validityDays,
    issueDate: issueDateObj.toISOString().split("T")[0],
    expiryDate: expiryDateObj.toISOString().split("T")[0],
    status: "Active",
    price
  };

  // Add to in-memory collection
  passes.unshift(newPass);

  // Simulated HTTP POST log
  logHttp("POST", 201, `Created pass ${newPass.id} for "${newPass.passengerName}" (₹${newPass.price})`);

  // Reset form
  passForm.reset();
  customRouteGroup.classList.add("hidden");
  updateFarePreview();

  // Re-render
  renderPasses();
  updateMetrics();
}

/**
 * Delete / Revoke Pass Handler (Simulates DELETE /api/passes/:id)
 */
function handleDeletePass(id) {
  const targetPass = passes.find(p => p.id === id);
  if (!targetPass) return;

  const confirmDelete = confirm(`Are you sure you want to revoke pass ${id} for ${targetPass.passengerName}?`);
  if (!confirmDelete) return;

  passes = passes.filter(p => p.id !== id);

  // Simulated HTTP DELETE log
  logHttp("DELETE", 200, `Revoked pass ${id} (${targetPass.passengerName})`);

  renderPasses();
  updateMetrics();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadPasses();
  updateFarePreview();

  // Form submit
  passForm.addEventListener("submit", handleFormSubmit);

  // Input changes for live fare update
  passTypeSelect.addEventListener("change", updateFarePreview);
  validityDaysSelect.addEventListener("change", updateFarePreview);

  // Custom route toggle
  routeSelect.addEventListener("change", () => {
    if (routeSelect.value === "custom") {
      customRouteGroup.classList.remove("hidden");
      customRouteInput.focus();
    } else {
      customRouteGroup.classList.add("hidden");
    }
  });

  // Search input with live debouncing/input event
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim()) {
      clearSearchBtn.classList.remove("hidden");
    } else {
      clearSearchBtn.classList.add("hidden");
    }
    renderPasses();
  });

  // Clear search
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.classList.add("hidden");
    renderPasses();
    searchInput.focus();
  });

  // Filter dropdown
  filterType.addEventListener("change", renderPasses);

  // Card action delegation (Delete)
  passesContainer.addEventListener("click", e => {
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      const id = deleteBtn.getAttribute("data-id");
      handleDeletePass(id);
    }
  });

  // Console actions
  clearConsoleBtn.addEventListener("click", () => {
    consoleLogs.innerHTML = "";
    logHttp("INFO", "CLEAR", "Console cleared by user");
  });

  // Refresh passes
  refreshBtn.addEventListener("click", () => {
    loadPasses();
  });
});


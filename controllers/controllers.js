/* ================================================
   🌍 ULTIMATE JAVASCRIPT API CONTROLLER v3.0
   Author: ChatGPT (GPT-5)
   Features:
   - Full CRUD, Upload, Auth
   - Auto Toastify injection
   - Loading spinner
   - Offline detection
   - Auto-retry failed requests
   - Cache, debounce, pagination
   ================================================ */

// ⚙️ CONFIGURATION
const BASE_URL = "https://apiii-backend.great-site.net"; // <-- replace this

// ----------------------------------------------------
// 🚀 AUTO-INJECT TOASTIFY LIBRARY (CSS + JS)
// ----------------------------------------------------
(function injectToastify() {
  if (!window.Toastify) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/toastify-js";
    // script.onload = () => console.log("✅ Toastify loaded");
    document.head.appendChild(script);
  }
})();

// ----------------------------------------------------
// ⏳ AUTO-INJECT LOADING SPINNER
// ----------------------------------------------------
(function createSpinner() {
  if (!document.getElementById("loadingSpinner")) {
    const spinner = document.createElement("div");
    spinner.id = "loadingSpinner";
    spinner.style.cssText = `
      display:none;position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.3);z-index:9999;align-items:center;justify-content:center;
    `;
    spinner.innerHTML = `
      <div style="
        width:60px;height:60px;border:6px solid #ccc;
        border-top-color:#4BB543;border-radius:50%;
        animation:spin 1s linear infinite;">
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(spinner);
  }
})();

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "flex";
}
function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

// ----------------------------------------------------
// 🔔 TOASTIFY WRAPPER
// ----------------------------------------------------
function showToast(type, message) {
  const colors = {
    success: "#4BB543",
    error: "#FF3333",
    info: "#0078FF",
    warning: "#FFC107",
  };
  const show = () => {
    window.Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: colors[type] || "#333",
      close: true,
      stopOnFocus: true,
    }).showToast();
  };
  if (window.Toastify) show();
  else setTimeout(show, 500); // wait until Toastify loads
}

// ----------------------------------------------------
// 🌐 OFFLINE DETECTION
// ----------------------------------------------------
window.addEventListener("offline", () =>
  showToast("error", "You are offline. Some actions may not work.")
);
window.addEventListener("online", () => showToast("info", "Back online!"));

// ----------------------------------------------------
// 🧠 CORE HELPER FUNCTIONS
// ----------------------------------------------------
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  return response.json();
}

async function retryFetch(url, options = {}, retries = 3, delay = 1500) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      return await handleResponse(response);
    } catch (error) {
      if (attempt === retries - 1) throw error;
      showToast("warning", `Retrying... (${attempt + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// ----------------------------------------------------
// 🔐 AUTHENTICATION FUNCTIONS
// ----------------------------------------------------
export async function loginUser(endpoint, credentials) {
  showSpinner();
  try {
    const data = await retryFetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    localStorage.setItem("token", data.token);
    showToast("success", "Login successful!");
    return data;
  } catch (error) {
    showToast("error", `Login failed: ${error.message}`);
    return null;
  } finally {
    hideSpinner();
  }
}

export async function authorizedFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  return retryFetch(`${BASE_URL}/${endpoint}`, { ...options, headers });
}

// ----------------------------------------------------
// 🔁 CRUD OPERATIONS
// ----------------------------------------------------
export async function fetchData(endpoint) {
  showSpinner();
  try {
    const data = await retryFetch(`${BASE_URL}/${endpoint}`);
    showToast("info", "Data fetched successfully.");
    // console.log(data);
    return data;
    
  } catch (error) {
    showToast("error", `Fetch error: ${error.message}`);
    return null;
  } finally {
    hideSpinner();
  }
}

export async function fetchById(endpoint, id) {
  showSpinner();
  try {
    return await retryFetch(`${BASE_URL}/${endpoint}/${id}`);
  } catch (error) {
    showToast("error", `Fetch by ID failed: ${error.message}`);
    return null;
  } finally {
    hideSpinner();
  }
}

export async function uploadData(endpoint, payload) {
  showSpinner();
  try {
    const data = await retryFetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    showToast("success", "Data uploaded successfully!");
    return data;
  } catch (error) {
    showToast("error", `Upload failed: ${error.message}`);
    return null;
  } finally {
    hideSpinner();
  }
}

export async function uploadFormData(endpoint, formData) {
  showSpinner();
  try {
    const data = await retryFetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      body: formData,
    });
    showToast("success", "Form submitted successfully!");
    return data;
  } catch (error) {
    showToast("error", `Form upload failed: ${error.message}`);
    return null;
  } finally {
    hideSpinner();
  }
}

export async function editData(endpoint, id, payload) {
  showSpinner();
  try {
    const data = await retryFetch(`${BASE_URL}/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    showToast("success", "Record updated successfully!");
    return data;
  } catch (error) {
    showToast("error", `Edit failed: ${error.message}`);
    return null;
  } finally {
    hideSpinner();
  }
}

export async function deleteData(endpoint, id) {
  showSpinner();
  try {
    await retryFetch(`${BASE_URL}/${endpoint}/${id}`, { method: "DELETE" });
    showToast("warning", `Item ${id} deleted successfully.`);
    return true;
  } catch (error) {
    showToast("error", `Delete failed: ${error.message}`);
    return false;
  } finally {
    hideSpinner();
  }
}

// ----------------------------------------------------
// 🔍 SEARCH, PAGINATION, CACHING
// ----------------------------------------------------
export async function searchData(endpoint, queryParams = {}) {
  showSpinner();
  const query = new URLSearchParams(queryParams).toString();
  try {
    const data = await retryFetch(`${BASE_URL}/${endpoint}?${query}`);
    showToast("info", "Search completed.");
    return data;
  } catch (error) {
    showToast("error", `Search failed: ${error.message}`);
    return [];
  } finally {
    hideSpinner();
  }
}

export function paginateData(array, page = 1, perPage = 10) {
  const start = (page - 1) * perPage;
  return array.slice(start, start + perPage);
}

export function cacheData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  showToast("info", `Cached: ${key}`);
}

export function getCachedData(key) {
  return JSON.parse(localStorage.getItem(key));
}

// ----------------------------------------------------
// ⚡ UTILITIES
// ----------------------------------------------------
export function debounce(fn, delay = 500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function testSystem() {
  showToast("success", "✅ Ultimate API Controller Active!");
  showSpinner();
  setTimeout(() => {
    hideSpinner();
    showToast("info", "All systems operational.");
  }, 1500);
}

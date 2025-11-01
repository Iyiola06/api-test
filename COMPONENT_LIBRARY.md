# 🧩 Component Library Documentation

## Overview
This document provides detailed specifications for all UI components used in the API Management Platform. Each component includes visual specifications, behavior descriptions, code examples, and Figma variant guidelines.

---

## Table of Contents
1. [Buttons](#buttons)
2. [Form Elements](#form-elements)
3. [Cards](#cards)
4. [Navigation](#navigation)
5. [Feedback Components](#feedback-components)
6. [Data Display](#data-display)
7. [Layout Components](#layout-components)
8. [Utility Components](#utility-components)

---

## 1. Buttons

### Primary Button

**Purpose:** Main call-to-action buttons for critical actions like "Send Request", "Login", "Save".

**Specifications:**
```css
.button-primary {
  height: 40px;
  padding: 0 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  background-color: #0078FF;
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.button-primary:hover {
  background-color: #0066DD;
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button-primary:active {
  background-color: #0055BB;
  transform: scale(0.98);
}

.button-primary:disabled {
  background-color: #E0E0E0;
  color: #9E9E9E;
  cursor: not-allowed;
}

.button-primary:focus-visible {
  outline: 2px solid #0078FF;
  outline-offset: 2px;
}
```

**Figma Variants:**
- State: Default | Hover | Active | Disabled | Loading | Focus
- Size: Small (32px) | Medium (40px) | Large (48px)
- Width: Hug | Fill | Fixed

**Usage Example:**
```jsx
<button className="button-primary" onClick={handleSendRequest}>
  Send Request
</button>

<button className="button-primary" disabled>
  Send Request
</button>

<button className="button-primary button-loading">
  <Spinner size="small" /> Sending...
</button>
```

**Accessibility:**
- Minimum touch target: 44x44px
- Keyboard accessible (Tab + Enter)
- Focus visible indicator
- aria-label for icon-only buttons
- aria-busy="true" when loading

---

### Secondary Button

**Purpose:** Secondary actions like "Cancel", "Reset", "Export".

**Specifications:**
```css
.button-secondary {
  height: 40px;
  padding: 0 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  background-color: #FFFFFF;
  color: #212121;
  border: 1px solid #E0E0E0;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.button-secondary:hover {
  border-color: #BDBDBD;
  background-color: #FAFAFA;
}

.button-secondary:active {
  background-color: #F5F5F5;
}
```

---

### Icon Button

**Purpose:** Compact actions in toolbars, headers, or alongside text.

**Specifications:**
```css
.button-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

.button-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.button-icon:active {
  background-color: rgba(0, 0, 0, 0.1);
}

.button-icon svg {
  width: 20px;
  height: 20px;
  color: #616161;
}
```

**Figma Variants:**
- State: Default | Hover | Active | Disabled | Focus
- Icon: Close | Edit | Delete | More | Copy | Download
- Size: Small (32px) | Medium (40px) | Large (48px)

---

### Button Group

**Purpose:** Group related actions together.

**Example:**
```jsx
<div className="button-group">
  <button className="button-secondary">Copy</button>
  <button className="button-secondary">Save</button>
  <button className="button-secondary">Export</button>
</div>
```

```css
.button-group {
  display: inline-flex;
  gap: 8px;
}

.button-group .button-secondary:not(:last-child) {
  border-right: none;
}
```

---

## 2. Form Elements

### Text Input

**Purpose:** Single-line text entry for URLs, parameters, values.

**Specifications:**
```css
.input-text {
  height: 40px;
  padding: 8px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  color: #212121;
  background-color: #FFFFFF;
  transition: all 150ms ease-out;
}

.input-text:hover {
  border-color: #BDBDBD;
}

.input-text:focus {
  outline: none;
  border: 2px solid #0078FF;
  padding: 7px 11px; /* Adjust for border width change */
}

.input-text.error {
  border: 2px solid #FF3333;
}

.input-text:disabled {
  background-color: #F5F5F5;
  color: #9E9E9E;
  cursor: not-allowed;
}
```

**HTML Structure:**
```html
<div class="input-group">
  <label for="api-url" class="input-label">API Endpoint</label>
  <input 
    type="text" 
    id="api-url" 
    class="input-text" 
    placeholder="https://api.example.com/users"
    aria-describedby="url-helper"
  />
  <span id="url-helper" class="input-helper">
    Enter the full API endpoint URL
  </span>
</div>
```

**Figma Variants:**
- State: Default | Hover | Focus | Error | Disabled | Filled
- Size: Small (32px) | Medium (40px) | Large (48px)
- Type: Text | Email | Password | Number | URL

**Accessibility:**
- Always include `<label>` with `for` attribute
- Use `aria-describedby` for helper text
- Use `aria-invalid="true"` for errors
- Error messages should be programmatically associated

---

### Textarea

**Purpose:** Multi-line text entry for JSON bodies, descriptions.

**Specifications:**
```css
.input-textarea {
  min-height: 120px;
  padding: 12px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 14px;
  font-family: 'Fira Code', 'Consolas', monospace;
  color: #212121;
  resize: vertical;
  transition: border-color 150ms ease-out;
}

.input-textarea:focus {
  outline: none;
  border: 2px solid #0078FF;
  padding: 11px; /* Adjust for border */
}

/* Syntax highlighting for JSON */
.input-textarea.json {
  background-color: #1E1E1E;
  color: #E0E0E0;
  line-height: 1.6;
}
```

---

### Select Dropdown

**Purpose:** Choose from predefined options (HTTP methods, environments).

**Specifications:**
```css
.input-select {
  height: 40px;
  padding: 8px 36px 8px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 14px;
  background-color: #FFFFFF;
  background-image: url('data:image/svg+xml;utf8,<svg>...</svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  appearance: none;
  cursor: pointer;
}

.input-select:hover {
  border-color: #BDBDBD;
}

.input-select:focus {
  outline: none;
  border: 2px solid #0078FF;
}
```

**Custom Dropdown Component:**
```jsx
<div className="dropdown">
  <button className="dropdown-trigger">
    GET <ChevronDown />
  </button>
  <div className="dropdown-menu">
    <div className="dropdown-item active">GET</div>
    <div className="dropdown-item">POST</div>
    <div className="dropdown-item">PUT</div>
    <div className="dropdown-item">DELETE</div>
  </div>
</div>
```

---

### Checkbox

**Purpose:** Toggle options on/off, enable/disable parameters.

**Specifications:**
```css
.checkbox {
  width: 20px;
  height: 20px;
  border: 1px solid #9E9E9E;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 150ms ease-out;
}

.checkbox:hover {
  border-color: #616161;
}

.checkbox:checked {
  background-color: #0078FF;
  border-color: #0078FF;
}

.checkbox:checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox:focus-visible {
  outline: 2px solid #0078FF;
  outline-offset: 2px;
}
```

**Usage:**
```html
<label class="checkbox-label">
  <input type="checkbox" class="checkbox" />
  <span>Enable this parameter</span>
</label>
```

---

### Radio Button

**Purpose:** Select one option from multiple choices.

**Specifications:**
```css
.radio {
  width: 20px;
  height: 20px;
  border: 1px solid #9E9E9E;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
}

.radio:checked {
  border-color: #0078FF;
  border-width: 2px;
}

.radio:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 4px;
  width: 10px;
  height: 10px;
  background-color: #0078FF;
  border-radius: 50%;
}
```

---

### Toggle Switch

**Purpose:** Enable/disable features, settings.

**Specifications:**
```css
.toggle {
  width: 48px;
  height: 24px;
  background-color: #E0E0E0;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

.toggle.checked {
  background-color: #4BB543;
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background-color: #FFFFFF;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 150ms ease-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.toggle.checked .toggle-thumb {
  transform: translateX(24px);
}
```

---

## 3. Cards

### Request Card

**Purpose:** Container for API request configuration.

**Specifications:**
```css
.card-request {
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 16px;
  transition: all 200ms ease-out;
}

.card-request:hover {
  border-color: #BDBDBD;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F5F5F5;
}

.card-body {
  padding: 12px 0;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
}
```

**HTML Structure:**
```html
<div class="card-request">
  <div class="card-header">
    <span class="badge-method badge-get">GET</span>
    <span class="endpoint-url">/api/users</span>
  </div>
  <div class="card-body">
    <!-- Tabs and content -->
  </div>
  <div class="card-footer">
    <button class="button-secondary">Cancel</button>
    <button class="button-primary">Send</button>
  </div>
</div>
```

---

### Response Card

**Purpose:** Display API response data.

**Specifications:**
```css
.card-response {
  background-color: #FAFAFA;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 16px;
}

.card-response.success {
  border-left: 4px solid #4BB543;
}

.card-response.error {
  border-left: 4px solid #FF3333;
  background-color: #FFF5F5;
}

.response-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #FFFFFF;
  border-radius: 4px;
  margin-bottom: 16px;
}

.response-body {
  background-color: #1E1E1E;
  color: #E0E0E0;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}
```

---

### Collection Card

**Purpose:** Display saved request collections in a grid view.

**Specifications:**
```css
.card-collection {
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.card-collection:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.collection-icon {
  width: 48px;
  height: 48px;
  background-color: #E3F2FD;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.collection-title {
  font-size: 16px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 4px;
}

.collection-count {
  font-size: 12px;
  color: #757575;
}
```

---

## 4. Navigation

### Header/Navbar

**Specifications:**
```css
.header {
  height: 64px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #0078FF;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #E8F5E9;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #388E3C;
}

.connection-status.offline {
  background-color: #FFEBEE;
  color: #D32F2F;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}
```

---

### Sidebar

**Specifications:**
```css
.sidebar {
  width: 240px;
  height: calc(100vh - 64px);
  background-color: #FAFAFA;
  border-right: 1px solid #E0E0E0;
  overflow-y: auto;
  padding: 16px 0;
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-heading {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar-item {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 150ms ease-out;
  color: #424242;
  font-size: 14px;
}

.sidebar-item:hover {
  background-color: #F5F5F5;
}

.sidebar-item.active {
  background-color: #E3F2FD;
  color: #0078FF;
  border-left: 3px solid #0078FF;
}

.sidebar-item-icon {
  width: 20px;
  height: 20px;
  color: currentColor;
}
```

---

### Tabs

**Purpose:** Switch between different content areas (Params, Headers, Body, Auth).

**Specifications:**
```css
.tabs {
  display: flex;
  border-bottom: 1px solid #E0E0E0;
  gap: 4px;
}

.tab {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #757575;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.tab:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #424242;
}

.tab.active {
  color: #0078FF;
  border-bottom-color: #0078FF;
}

.tab:focus-visible {
  outline: 2px solid #0078FF;
  outline-offset: -2px;
}
```

---

### Breadcrumbs

**Purpose:** Show navigation hierarchy, especially in nested collections.

**Specifications:**
```css
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #757575;
  text-decoration: none;
  transition: color 150ms ease-out;
}

.breadcrumb-item:hover {
  color: #0078FF;
}

.breadcrumb-item.active {
  color: #212121;
  pointer-events: none;
}

.breadcrumb-separator {
  color: #BDBDBD;
}
```

---

## 5. Feedback Components

### Toast Notification

**Purpose:** Temporary messages for user feedback.

**Specifications:**
```css
.toast {
  width: 320px;
  min-height: 60px;
  padding: 16px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  animation: slideInRight 300ms ease-out;
}

.toast.success {
  border-left: 4px solid #4BB543;
}

.toast.error {
  border-left: 4px solid #FF3333;
}

.toast.info {
  border-left: 4px solid #0078FF;
}

.toast.warning {
  border-left: 4px solid #FFC107;
}

.toast-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  color: #212121;
}

.toast-close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  opacity: 0.6;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: currentColor;
  animation: progress 3s linear;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
```

---

### Loading Spinner

**Purpose:** Indicate loading states.

**Specifications:**
```css
.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #E0E0E0;
  border-top-color: #4BB543;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner.small {
  width: 20px;
  height: 20px;
  border-width: 3px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Full-page overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
```

---

### Modal/Dialog

**Purpose:** Display focused content that requires user interaction.

**Specifications:**
```css
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 300ms ease-out;
}

.modal {
  max-width: 600px;
  width: 90%;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  animation: scaleIn 300ms ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #212121;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

### Progress Bar

**Purpose:** Show upload/download progress.

**Specifications:**
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #E0E0E0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4BB543;
  transition: width 300ms ease-out;
}

.progress-bar.indeterminate .progress-fill {
  width: 30%;
  animation: indeterminate 1.5s ease-in-out infinite;
}

@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(350%); }
  100% { transform: translateX(-100%); }
}
```

---

## 6. Data Display

### Badge

**Purpose:** Display HTTP methods, status codes, tags.

**Specifications:**
```css
/* HTTP Method Badges */
.badge-method {
  height: 24px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
}

.badge-get {
  background-color: #E3F2FD;
  color: #0078FF;
}

.badge-post {
  background-color: #E8F5E9;
  color: #4BB543;
}

.badge-put {
  background-color: #FFF8E1;
  color: #FFC107;
}

.badge-delete {
  background-color: #FFEBEE;
  color: #FF3333;
}

/* Status Badges */
.badge-status {
  height: 20px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}
```

---

### Code Block

**Purpose:** Display formatted code, JSON, XML responses.

**Specifications:**
```css
.code-block {
  background-color: #1E1E1E;
  color: #E0E0E0;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  position: relative;
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #3C3C3C;
}

.code-language {
  font-size: 12px;
  color: #9E9E9E;
  text-transform: uppercase;
}

.code-copy-button {
  padding: 4px 8px;
  font-size: 12px;
  background-color: #2C2C2C;
  border: 1px solid #3C3C3C;
  border-radius: 4px;
  color: #E0E0E0;
  cursor: pointer;
}

.code-copy-button:hover {
  background-color: #3C3C3C;
}

/* Syntax highlighting (example) */
.code-string { color: #CE9178; }
.code-number { color: #B5CEA8; }
.code-boolean { color: #569CD6; }
.code-null { color: #569CD6; }
.code-key { color: #9CDCFE; }
```

---

### Table

**Purpose:** Display parameters, headers in tabular format.

**Specifications:**
```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: #FAFAFA;
  border-bottom: 2px solid #E0E0E0;
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #F5F5F5;
}

.table tbody tr:hover {
  background-color: #FAFAFA;
}

.table-input {
  width: 100%;
  height: 32px;
  padding: 4px 8px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 14px;
}
```

---

### JSON Tree Viewer

**Purpose:** Collapsible JSON structure display.

**Specifications:**
```css
.json-tree {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.json-node {
  margin-left: 20px;
}

.json-key {
  color: #9CDCFE;
  cursor: pointer;
}

.json-key:hover {
  text-decoration: underline;
}

.json-value {
  color: #CE9178;
}

.json-value.number {
  color: #B5CEA8;
}

.json-value.boolean {
  color: #569CD6;
}

.json-value.null {
  color: #569CD6;
}

.json-toggle {
  cursor: pointer;
  user-select: none;
  margin-right: 4px;
  color: #9E9E9E;
}

.json-toggle.collapsed::before {
  content: '▶';
}

.json-toggle.expanded::before {
  content: '▼';
}
```

---

## 7. Layout Components

### Container

**Purpose:** Max-width wrapper for content.

**Specifications:**
```css
.container {
  max-width: 1920px;
  min-width: 600px;
  margin: 0 auto;
  padding: 0 24px;
}

.container-fluid {
  width: 100%;
  padding: 0 24px;
}
```

---

### Grid

**Purpose:** Responsive grid layout for cards, collections.

**Specifications:**
```css
.grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .grid,
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}
```

---

### Divider

**Purpose:** Visual separation between sections.

**Specifications:**
```css
.divider {
  height: 1px;
  background-color: #E0E0E0;
  margin: 24px 0;
}

.divider-vertical {
  width: 1px;
  height: 100%;
  background-color: #E0E0E0;
  margin: 0 16px;
}
```

---

## 8. Utility Components

### Empty State

**Purpose:** Display when no data is available.

**Specifications:**
```css
.empty-state {
  text-align: center;
  padding: 64px 32px;
  color: #757575;
}

.empty-state-icon {
  width: 96px;
  height: 96px;
  margin: 0 auto 24px;
  opacity: 0.3;
}

.empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
  margin-bottom: 8px;
}

.empty-state-description {
  font-size: 14px;
  margin-bottom: 24px;
}
```

---

### Skeleton Loader

**Purpose:** Loading placeholder for content.

**Specifications:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #F5F5F5 0%,
    #EEEEEE 50%,
    #F5F5F5 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  margin-bottom: 12px;
}

.skeleton-card {
  height: 200px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

### Tooltip

**Purpose:** Contextual help on hover.

**Specifications:**
```css
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: #212121;
  color: #FFFFFF;
  font-size: 12px;
  white-space: nowrap;
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease-out;
}

.tooltip:hover .tooltip-content {
  opacity: 1;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #212121;
}
```

---

## Component Usage Best Practices

### General Guidelines

1. **Consistency**: Always use the same component for the same purpose
2. **Accessibility**: Ensure all components are keyboard accessible and screen reader friendly
3. **Responsiveness**: Test components at all breakpoints
4. **Performance**: Lazy load large components, use virtualization for long lists
5. **States**: Always handle all interactive states (hover, active, focus, disabled)

### Do's and Don'ts

✅ **DO:**
- Use semantic HTML elements
- Provide clear labels and helper text
- Include loading and error states
- Test with keyboard only
- Use consistent spacing
- Follow the design tokens

❌ **DON'T:**
- Mix different component styles
- Skip focus indicators
- Use ambiguous labels
- Hard-code colors or sizes
- Forget responsive behavior
- Ignore accessibility

---

**Last Updated:** 2025-11-01  
**Version:** 1.0  
**Status:** Complete & Production-Ready

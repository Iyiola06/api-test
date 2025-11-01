# 📐 Figma Wireframes & User Flow Documentation

## Table of Contents
1. [Low-Fidelity Wireframes](#low-fidelity-wireframes)
2. [User Flow Diagrams](#user-flow-diagrams)
3. [Interaction States](#interaction-states)
4. [Prototype Links & Navigation](#prototype-links--navigation)

---

## 🎯 Low-Fidelity Wireframes

### 1. Dashboard - Desktop View

```
┌────────────────────────────────────────────────────────────────────┐
│ ☰ API Tester        🟢 Online    [+ New] [Import] [@User ▼]       │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                         │
│ 📁 My     │  GET  ▼│ https://api.example.com/users        │[Send] │
│   Colls   │  ──────────────────────────────────────────────────    │
│           │  ┌─────────────────────────────────────────────────┐  │
│ > User    │  │ Params │ Headers │ Body │ Auth │                 │  │
│   > GET   │  ├─────────────────────────────────────────────────┤  │
│   > POST  │  │                                                  │  │
│           │  │ KEY              VALUE                  ✓  ✗    │  │
│ > Auth    │  │ ┌──────────┐    ┌──────────┐           ☐  ☐   │  │
│   > Login │  │ │          │    │          │           ☐  ☐   │  │
│           │  │ └──────────┘    └──────────┘           ☐  ☐   │  │
│ 🕐 History│  │ + Add Parameter                                  │  │
│           │  │                                                  │  │
│ ⭐ Favs   │  └─────────────────────────────────────────────────┘  │
│           │                                                         │
│ ⚙️ Settings│ ═══════════════════════════════════════════════════   │
│           │                                                         │
│           │  Status: 200 OK ✓ │ Time: 234ms │ Size: 2.1 KB       │
│           │  ──────────────────────────────────────────────────    │
│           │  ┌─────────────────────────────────────────────────┐  │
│           │  │ Body │ Headers │ Cookies │ Raw │                 │  │
│           │  ├─────────────────────────────────────────────────┤  │
│           │  │ {                                   [Copy] [▼]  │  │
│           │  │   "status": "success",                           │  │
│           │  │   "data": [                                      │  │
│           │  │     { "id": 1, "name": "John" },                │  │
│           │  │     { "id": 2, "name": "Jane" }                 │  │
│           │  │   ]                                              │  │
│           │  │ }                                                │  │
│           │  │                                                  │  │
│           │  └─────────────────────────────────────────────────┘  │
│           │                                                         │
└───────────┴────────────────────────────────────────────────────────┘

Dimensions:
- Sidebar: 240px fixed
- Header: 64px height
- Request panel: 50% of content area
- Response panel: 50% of content area
- Min content width: 600px
```

### 2. Dashboard - Mobile View (< 768px)

```
┌──────────────────────────────┐
│ ☰  API Tester    🟢  [@] │
├──────────────────────────────┤
│                               │
│ [GET ▼]                      │
│ ┌──────────────────────────┐ │
│ │ https://api.example.com  │ │
│ └──────────────────────────┘ │
│            [Send]            │
│                               │
│ [ Params ▼ ]                 │
│ ┌──────────────────────────┐ │
│ │ KEY        VALUE     ✓ ✗│ │
│ │ ┌────┐    ┌────┐    ☐ ☐│ │
│ │ │    │    │    │    ☐ ☐│ │
│ │ └────┘    └────┘    ☐ ☐│ │
│ │ + Add Parameter          │ │
│ └──────────────────────────┘ │
│                               │
│ ─────────────────────────     │
│                               │
│ Response ▼                    │
│ ┌──────────────────────────┐ │
│ │ ✓ 200 OK │ 234ms         │ │
│ ├──────────────────────────┤ │
│ │ {                         │ │
│ │   "status": "success",   │ │
│ │   "data": [...]          │ │
│ │ }                         │ │
│ └──────────────────────────┘ │
│                               │
├──────────────────────────────┤
│ 🏠  📁  🕐  ⚙️             │
└──────────────────────────────┘

Features:
- Collapsible sections
- Bottom navigation
- Full-width layout
- Touch-friendly targets (min 44px)
```

### 3. Collections Sidebar (Expanded)

```
┌─────────────────────────────┐
│ Collections    [+] [⚙️]     │
├─────────────────────────────┤
│                              │
│ 🔍 Search collections...    │
│                              │
│ 📁 My Workspace          ▼  │
│   └─ 📂 User Management   ▼ │
│       ├─ GET List Users     │
│       ├─ POST Create User   │
│       ├─ PUT Update User    │
│       └─ DEL Delete User    │
│                              │
│   └─ 📂 Authentication    ▶ │
│   └─ 📂 Blog Posts        ▶ │
│                              │
│ 🕐 History (Recent)      ▼  │
│   ├─ GET /home (now)        │
│   ├─ POST /users (2m ago)   │
│   └─ GET /posts (5m ago)    │
│                              │
│ ⭐ Favorites             ▼  │
│   └─ GET /users             │
│                              │
│ ─────────────────────────    │
│ [Import] [Export]           │
└─────────────────────────────┘

Interactions:
- Click folder to expand/collapse
- Drag to reorder
- Right-click for context menu
- Hover shows edit/delete icons
- Color coding for methods:
  • GET: Blue
  • POST: Green
  • PUT: Orange
  • DELETE: Red
```

### 4. Request Builder - All Tabs

#### Params Tab
```
┌────────────────────────────────────────────────┐
│ Query Parameters                  [Bulk Edit]  │
├────────────────────────────────────────────────┤
│                                                 │
│ ┌─────────────┬──────────────┬───────┬─────┐  │
│ │ ☑ KEY       │ VALUE        │ DESC  │     │  │
│ ├─────────────┼──────────────┼───────┼─────┤  │
│ │ ☑│page    │ │ 1          │ │      │ │ × ││  │
│ │ ☑│limit   │ │ 10         │ │      │ │ × ││  │
│ │ ☐│filter  │ │            │ │      │ │ × ││  │
│ └─────────────┴──────────────┴───────┴─────┘  │
│                                                 │
│ + Add Parameter                                │
│ + Paste from URL                               │
│                                                 │
│ Preview: ?page=1&limit=10                      │
└────────────────────────────────────────────────┘
```

#### Headers Tab
```
┌────────────────────────────────────────────────┐
│ Request Headers             [+ Add Common]     │
├────────────────────────────────────────────────┤
│                                                 │
│ Common Headers:                                │
│ [Content-Type] [Authorization] [Accept]        │
│                                                 │
│ ┌─────────────┬──────────────────────┬─────┐  │
│ │ ☑ KEY       │ VALUE                │     │  │
│ ├─────────────┼──────────────────────┼─────┤  │
│ │ ☑│Cont-Type││ application/json   ││ × ││  │
│ │ ☑│Auth     ││ Bearer token...    ││ × ││  │
│ │ ☐│User-Agt ││ Custom/1.0         ││ × ││  │
│ └─────────────┴──────────────────────┴─────┘  │
│                                                 │
│ + Add Header                                   │
│                                                 │
│ 💡 Tip: Authorization header auto-populated    │
│    if logged in                                │
└────────────────────────────────────────────────┘
```

#### Body Tab
```
┌────────────────────────────────────────────────┐
│ Request Body                                   │
├────────────────────────────────────────────────┤
│                                                 │
│ Body Type:                                     │
│ ○ none  ● raw  ○ form-data  ○ x-www-form      │
│                                                 │
│ Format: [JSON ▼]   [Beautify] [Validate]      │
│                                                 │
│ ┌──────────────────────────────────────────┐  │
│ │  1 {                                      │  │
│ │  2   "name": "John Doe",                 │  │
│ │  3   "email": "john@example.com",        │  │
│ │  4   "role": "admin"                     │  │
│ │  5 }                                      │  │
│ │                                           │  │
│ │                                           │  │
│ │                                           │  │
│ │                                           │  │
│ └──────────────────────────────────────────┘  │
│                                                 │
│ ✓ Valid JSON                                   │
│ Size: 84 bytes                                 │
└────────────────────────────────────────────────┘

Features:
- Syntax highlighting
- Line numbers
- Auto-complete
- Format/beautify
- Validation
- Templates (click to load)
```

#### Auth Tab
```
┌────────────────────────────────────────────────┐
│ Authentication                                 │
├────────────────────────────────────────────────┤
│                                                 │
│ Type: [Bearer Token ▼]                         │
│                                                 │
│ Token                                          │
│ ┌──────────────────────────────────────────┐  │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │  │
│ └──────────────────────────────────────────┘  │
│                                                 │
│ Prefix: Bearer                                 │
│                                                 │
│ [Use Token from Login]  [Get New Token]        │
│                                                 │
│ ─────────────────────────────────────────      │
│                                                 │
│ Other Auth Types:                              │
│ • No Auth                                      │
│ • Basic Auth (username/password)               │
│ • API Key (header/query param)                 │
│ • OAuth 2.0 (coming soon)                      │
│                                                 │
│ 💡 Token is automatically included in          │
│    Authorization header                        │
└────────────────────────────────────────────────┘
```

### 5. Response Viewer - Success State

```
┌────────────────────────────────────────────────┐
│ ✓ 200 OK  │  234ms  │  2.1 KB                 │
│ [Copy All] [Download] [Save to Collection]     │
├────────────────────────────────────────────────┤
│ Body │ Headers (8) │ Cookies (0) │ Raw │      │
├────────────────────────────────────────────────┤
│                                                 │
│ ┌─> {                                  [Copy]  │
│ │     "status": "success",                     │
│ │     "message": "Data fetched",               │
│ │   > "data": [2 items]                        │
│ │       ┌─> 0: {                               │
│ │       │     "id": 1,                         │
│ │       │     "name": "John Doe",              │
│ │       │     "email": "john@example.com"      │
│ │       │   }                                  │
│ │       └─> 1: {...}                           │
│ │     "timestamp": "2025-11-01T10:30:00Z"      │
│ └   }                                           │
│                                                 │
│ 🔍 Search in response...                       │
│                                                 │
│ [< Collapse All]  [> Expand All]               │
└────────────────────────────────────────────────┘

Features:
- Collapsible JSON tree
- Syntax highlighting
- Click to copy values
- Search/filter
- Pretty print
- Raw view toggle
```

### 6. Response Viewer - Error State

```
┌────────────────────────────────────────────────┐
│ ✗ 404 Not Found  │  123ms                     │
│ [Copy Error] [Report Issue]                    │
├────────────────────────────────────────────────┤
│                                                 │
│ ⚠️  Error Details                              │
│                                                 │
│ Message:                                       │
│ The requested resource was not found           │
│                                                 │
│ Response Body:                                 │
│ ┌──────────────────────────────────────────┐  │
│ │ {                                         │  │
│ │   "error": "Resource not found",          │  │
│ │   "path": "/api/users/999",              │  │
│ │   "timestamp": "2025-11-01T10:30:00Z"    │  │
│ │ }                                         │  │
│ └──────────────────────────────────────────┘  │
│                                                 │
│ 💡 Possible Solutions:                         │
│ • Verify the endpoint URL is correct           │
│ • Check if the resource ID exists              │
│ • Ensure you have proper authentication        │
│ • Review API documentation                     │
│                                                 │
│ [View Docs] [Try Different Endpoint]           │
└────────────────────────────────────────────────┘

Visual treatment:
- Red accent border on left
- Error icon
- Helpful suggestions
- Link to docs
```

### 7. Login Modal

```
        ┌───────────────────────────┐
        │ Login to Continue     [×] │
        ├───────────────────────────┤
        │                            │
        │  Email                     │
        │  ┌──────────────────────┐ │
        │  │ user@example.com     │ │
        │  └──────────────────────┘ │
        │                            │
        │  Password                  │
        │  ┌──────────────────────┐ │
        │  │ ••••••••••           │ │
        │  └──────────────────────┘ │
        │                            │
        │  ☑ Remember me             │
        │                            │
        │  [     Login     ]         │
        │                            │
        │  Don't have an account?    │
        │  Sign up                   │
        │                            │
        │  Forgot password?          │
        │                            │
        └───────────────────────────┘

Specs:
- Width: 400px
- Backdrop: rgba(0,0,0,0.5)
- Center aligned
- Close on backdrop click
- Esc to close
- Enter to submit
```

### 8. Toast Notifications

```
Position: Top-right, 16px from edges

┌─────────────────────────────────┐
│ ✓  Login successful!        [×] │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░         │
└─────────────────────────────────┘
Type: Success (green)

┌─────────────────────────────────┐
│ ✗  Upload failed: File too...  [×]│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░         │
└─────────────────────────────────┘
Type: Error (red)

┌─────────────────────────────────┐
│ ⚠  Retrying... (2/3)          [×]│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░         │
└─────────────────────────────────┘
Type: Warning (orange)

┌─────────────────────────────────┐
│ ℹ️  Data fetched successfully  [×]│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░         │
└─────────────────────────────────┘
Type: Info (blue)

Features:
- Auto-dismiss after 3s
- Progress bar shows remaining time
- Stack multiple toasts (16px gap)
- Click to dismiss
- Slide in from right
- Fade out on dismiss
```

### 9. Settings Page

```
┌────────────────────────────────────────────────┐
│ ← Back to Dashboard                            │
│                                                 │
│ Settings                                       │
├──────────┬─────────────────────────────────────┤
│ General  │                                      │
│ Appear   │ General Settings                     │
│ Environ  │                                      │
│ Advance  │ Theme                                │
│ About    │ ○ Light  ● Dark  ○ System           │
│          │                                      │
│          │ Language                             │
│          │ [English ▼]                          │
│          │                                      │
│          │ Default Request Timeout              │
│          │ [5000          ] ms                  │
│          │                                      │
│          │ Request History                      │
│          │ Keep last [50 ▼] requests            │
│          │                                      │
│          │ Features                             │
│          │ ☑ Auto-save requests                 │
│          │ ☑ Auto-retry failed requests (3x)    │
│          │ ☑ Show toast notifications           │
│          │ ☑ Offline mode                       │
│          │ ☐ Beta features                      │
│          │                                      │
│          │ [Reset to Defaults] [Save Changes]   │
└──────────┴─────────────────────────────────────┘
```

---

## 🔄 User Flow Diagrams

### Flow 1: First-Time User Onboarding

```
┌─────────┐
│ Landing │
│  Page   │
└────┬────┘
     │
     v
┌─────────────┐      No     ┌──────────┐
│ Has Account?├─────────────>│  Sign Up │
└────┬────────┘              └────┬─────┘
     │ Yes                        │
     v                            v
┌─────────┐                  ┌─────────┐
│  Login  │<─────────────────┤ Complete│
└────┬────┘                  │ Profile │
     │                       └─────────┘
     v
┌──────────────┐
│  Dashboard   │
│ (Empty State)│
└────┬─────────┘
     │
     v
┌───────────────┐
│ Tutorial      │
│ Overlay       │
│ - Create req  │
│ - Use sidebar │
│ - View resp   │
└───────┬───────┘
        │
        v
┌───────────────┐
│ Create First  │
│ Request       │
└───────────────┘
```

### Flow 2: Making an API Request

```
┌──────────┐
│Dashboard │
└────┬─────┘
     │
     v
┌─────────────────┐
│ Choose Action   │
│ • New Request   │
│ • From Coll     │
│ • From History  │
└────┬────────────┘
     │
     v
┌──────────────────┐
│ Configure Req    │
│ 1. Method        │
│ 2. URL           │
│ 3. Params/Body   │
│ 4. Auth          │
└────┬─────────────┘
     │
     v
┌──────────────┐
│ Click Send   │
└────┬─────────┘
     │
     v
┌──────────────┐      Yes    ┌──────────┐
│ Online?      ├────────────>│ Show     │
└────┬─────────┘             │ Spinner  │
     │ No                    └────┬─────┘
     v                            │
┌──────────────┐                 v
│ Show Offline │           ┌───────────┐
│ Toast        │           │ API Call  │
│ Disable Send │           └────┬──────┘
└──────────────┘                │
                                v
                          ┌────────────┐
                          │ Response?  │
                          └──┬─────┬───┘
                    Success │     │ Error
                            v     v
                      ┌─────────┐ ┌──────────┐
                      │ Success │ │  Error   │
                      │ Toast   │ │  Toast   │
                      └────┬────┘ └────┬─────┘
                           │           │
                           v           v
                      ┌──────────────────┐
                      │ Display Response │
                      │ - Body           │
                      │ - Headers        │
                      │ - Stats          │
                      └────┬─────────────┘
                           │
                           v
                      ┌──────────┐
                      │ Add to   │
                      │ History  │
                      └──────────┘
```

### Flow 3: Managing Collections

```
┌──────────┐
│Dashboard │
└────┬─────┘
     │
     v
┌──────────────┐
│ Open Sidebar │
│ Collections  │
└────┬─────────┘
     │
     v
┌─────────────────────┐
│ User Action?        │
│ • Create Collection │
│ • Edit Collection   │
│ • Delete Collection │
│ • Load Request      │
└────┬────────────────┘
     │
     ├──── Create ────>┌───────────────┐
     │                 │ Modal: Name   │
     │                 │ + Description │
     │                 └───────┬───────┘
     │                         │
     │                         v
     │                 ┌───────────────┐
     │                 │ New Collection│
     │                 │ Created       │
     │                 └───────────────┘
     │
     ├──── Edit ──────>┌───────────────┐
     │                 │ Edit Modal    │
     │                 │ - Rename      │
     │                 │ - Move        │
     │                 │ - Delete      │
     │                 └───────────────┘
     │
     └──── Load ──────>┌───────────────┐
                       │ Load Request  │
                       │ into Editor   │
                       └───────┬───────┘
                               │
                               v
                       ┌───────────────┐
                       │ Ready to Send │
                       └───────────────┘
```

### Flow 4: Authentication Flow

```
┌──────────┐
│Dashboard │
│ (Logged  │
│  Out)    │
└────┬─────┘
     │
     v
┌────────────────┐
│ Click Login    │
│ in Header      │
└────┬───────────┘
     │
     v
┌────────────────┐
│ Login Modal    │
│ Opens          │
└────┬───────────┘
     │
     v
┌────────────────┐
│ Enter Creds    │
│ - Email        │
│ - Password     │
└────┬───────────┘
     │
     v
┌────────────────┐
│ Submit Form    │
└────┬───────────┘
     │
     v
┌────────────────┐
│ Button Loading │
│ State          │
└────┬───────────┘
     │
     v
┌────────────────┐      Success    ┌──────────────┐
│ API Response   ├────────────────>│ Save Token   │
└────┬───────────┘                 │ to Storage   │
     │ Error                       └──────┬───────┘
     v                                    │
┌────────────────┐                       v
│ Show Error     │              ┌─────────────────┐
│ Message        │              │ Success Toast   │
│ Below Input    │              └────┬────────────┘
└────────────────┘                   │
                                     v
                              ┌──────────────────┐
                              │ Close Modal      │
                              │ Update Header    │
                              │ Show User Name   │
                              └────┬─────────────┘
                                   │
                                   v
                              ┌──────────────────┐
                              │ Auth Token Now   │
                              │ Auto-included in │
                              │ All Requests     │
                              └──────────────────┘
```

---

## 🎭 Interaction States

### Button States

#### Primary Button
```
Default:     [  Send Request  ]    bg: #0078FF
Hover:       [  Send Request  ]    bg: #0066DD, scale: 1.02
Active:      [  Send Request  ]    bg: #0055BB, scale: 0.98
Disabled:    [  Send Request  ]    bg: #E0E0E0, cursor: not-allowed
Loading:     [  ⟳ Sending...  ]    bg: #0078FF, spinner animate
Focus:       [  Send Request  ]    outline: 2px #0078FF + 2px offset
```

### Input States

#### Text Input
```
Default:     [________________]    border: 1px #E0E0E0
Hover:       [________________]    border: 1px #BDBDBD
Focus:       [________________]    border: 2px #0078FF, shadow
Error:       [________________]    border: 2px #FF3333, red text
Disabled:    [________________]    bg: #F5F5F5, opacity: 0.6
Filled:      [user@example.com]    border: 1px #9E9E9E
```

### Card States

#### Request/Response Cards
```
Default:     ┌─────────────┐       border: 1px #E0E0E0
             │             │       shadow: none
             └─────────────┘

Hover:       ┌─────────────┐       border: 1px #BDBDBD
             │             │       shadow: md, scale: 1.01
             └─────────────┘

Active:      ┌─────────────┐       border: 2px #0078FF
             │   SELECTED  │       shadow: lg
             └─────────────┘

Loading:     ┌─────────────┐       skeleton shimmer
             │ ▓▓▓▓▓       │       animated
             │   ▓▓▓▓▓▓    │
             └─────────────┘
```

### Collection Tree Items

```
Default:     📁 User Management
Hover:       ▓▓▓ User Management    bg: rgba(0,0,0,0.05)
Active:      ▓▓▓ User Management    bg: #E3F2FD, blue accent
Expanded:    📂 User Management     arrow rotated 90°
             └─ GET /users
Collapsed:   📁 User Management ▶   arrow points right
```

### Toggle States

#### Checkbox
```
Unchecked:   ☐    border: 1px #9E9E9E
Checked:     ☑    bg: #0078FF, white checkmark
Indeterminate: ☐   bg: #0078FF, white dash
Disabled:    ☐    opacity: 0.4, cursor: not-allowed
```

#### Radio Button
```
Unselected:  ○    border: 1px #9E9E9E
Selected:    ●    outer: #0078FF, inner: white + blue dot
Disabled:    ○    opacity: 0.4
```

#### Switch/Toggle
```
Off:         [○━━━━]    bg: #E0E0E0, circle left
On:          [━━━━●]    bg: #4BB543, circle right
Transition:  150ms ease-out
```

---

## 🔗 Prototype Links & Navigation

### Navigation Map

```
┌──────────────────────────────────────────────┐
│                  DASHBOARD                    │
│  (Main hub - all features accessible)         │
└─────┬────────────┬────────────┬──────────────┘
      │            │            │
      v            v            v
┌──────────┐  ┌────────┐  ┌──────────┐
│Collections│ │Settings│ │  History  │
│  Sidebar  │ │  Page  │ │  Drawer  │
└─────┬─────┘ └───┬────┘ └────┬─────┘
      │           │            │
      │           │            └───> Click item to load request
      │           │
      │           └─> Sections:
      │               • General
      │               • Appearance
      │               • Environment
      │               • Advanced
      │
      └─> Actions:
          • Click collection → expand/collapse
          • Click request → load in editor
          • Right-click → context menu
          • Drag → reorder

┌──────────────────────────────────────────────┐
│              REQUEST BUILDER                  │
│  (Loaded from dashboard/collections)          │
└─────┬────────────────────────────────────────┘
      │
      ├─> Send Button → Execute Request
      ├─> Save Button → Save to Collection
      └─> Tabs: Params | Headers | Body | Auth
          (Click to switch)

┌──────────────────────────────────────────────┐
│              RESPONSE VIEWER                  │
│  (Appears after request execution)            │
└─────┬────────────────────────────────────────┘
      │
      ├─> Copy Button → Copy to clipboard
      ├─> Download → Save as file
      ├─> Save → Add to collection
      └─> Tabs: Body | Headers | Cookies | Raw
```

### Interaction Patterns

#### Hover Interactions
- **Buttons**: Scale 1.02, shadow increase, color darken
- **Cards**: Lift with shadow, border color change
- **Links**: Underline, color change
- **Icons**: Background circle fade in
- **Collection Items**: Background tint, show action buttons

#### Click Interactions
- **Send Request**: Button loading state → spinner
- **Expand JSON**: Smooth rotation of arrow icon (90°)
- **Select Method**: Dropdown opens below, selected highlighted
- **Toast Close**: Fade out + slide right (200ms)
- **Modal Open**: Backdrop fade in + modal scale 0.9→1 (300ms)
- **Modal Close**: Reverse of open animation

#### Keyboard Shortcuts
```
Global:
- Ctrl/Cmd + Enter : Send request
- Ctrl/Cmd + S     : Save request
- Ctrl/Cmd + K     : Quick search
- Ctrl/Cmd + /     : Toggle sidebar
- Ctrl/Cmd + ,     : Open settings
- Esc              : Close modal/drawer

Editor:
- Ctrl/Cmd + Space : Auto-complete
- Ctrl/Cmd + /     : Comment/uncomment
- Tab              : Indent
- Shift + Tab      : Outdent
```

### Prototype Hotspots (Figma)

#### Dashboard Screen
1. **Send Button** → Response screen (with loading)
2. **Collections item** → Load request
3. **New Request** → Clear/reset form
4. **Login button** → Login modal
5. **Settings icon** → Settings page
6. **Tab clicks** → Switch tab content

#### Modals
1. **Backdrop click** → Close modal
2. **X button** → Close modal
3. **Submit button** → Success/error state
4. **Esc key** → Close modal

#### Animations to Prototype
- Button hover states (all)
- Toast slide-in/out
- Modal fade in/out
- Spinner rotation
- Skeleton shimmer
- JSON tree expand/collapse
- Sidebar expand/collapse (mobile)

---

## 📝 Design Handoff Checklist

### For Figma File
- [ ] All artboards properly named
- [ ] Components organized in library
- [ ] All variants created for states
- [ ] Auto-layout applied everywhere
- [ ] Constraints set correctly
- [ ] Design tokens exported
- [ ] Prototype flows connected
- [ ] Annotations added for complex interactions
- [ ] Responsive frames for mobile
- [ ] Assets exported (icons, logos)

### For Developers
- [ ] Component props documented
- [ ] State variations mapped
- [ ] Animation specifications defined
- [ ] Responsive breakpoints noted
- [ ] Accessibility requirements listed
- [ ] Integration points with controller.js identified
- [ ] API response handling documented
- [ ] Error state handling specified

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-01  
**Status:** Ready for Figma Implementation

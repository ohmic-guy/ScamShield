# Cyber Fraud Support System - Features & Implementation

## Overview

The Cyber Fraud Support System is a comprehensive web application designed to combat cyber fraud through real-time collaboration between victims, police departments, and banking institutions. It provides three distinct portals with role-specific functionality and export capabilities.

## System Architecture

### Multi-Portal Architecture

```
┌─────────────────────────────────────────────────────────────┐
│         Cyber Fraud Support System (Single-Page App)        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Portal Router (Role-Based Access Control)          │   │
│  └──────────┬──────────────┬──────────────┬────────────┘   │
│             │              │              │                │
│      ┌──────▼──┐    ┌──────▼──┐    ┌──────▼──┐            │
│      │ VICTIM  │    │ POLICE  │    │ BANK    │            │
│      │ PORTAL  │    │ PORTAL  │    │ PORTAL  │            │
│      └─────────┘    └─────────┘    └─────────┘            │
│           │              │              │                 │
│           │              │              │                 │
│      ┌────▼──────────────▼──────────────▼────┐           │
│      │   React Context API (State Management)  │           │
│      │        APIProvider & useAPI Hook        │           │
│      └────┬──────────────┬──────────────┬─────┘           │
│           │              │              │                 │
│      ┌────▼────┐    ┌────▼────┐    ┌───▼────┐            │
│      │useAuth  │    │useCompl. │    │useAlerts           │
│      │useAnalyt│    │useAnalyt │    │useAnalyt           │
│      └────┬────┘    └────┬────┘    └───┬────┘            │
│           │              │              │                 │
│      ┌────▼──────────────▼──────────────▼────┐           │
│      │      API Client (Token Management)     │           │
│      │   Automatic Authorization Header       │           │
│      │   localStorage Token Persistence       │           │
│      └────┬────────────────────────────────────┘           │
│           │                                                │
│      ┌────▼──────────────────────────┐                    │
│      │   FastAPI Backend (Port 8000)  │                    │
│      └────┬────────────┬──────────────┘                    │
│           │            │                                  │
│      ┌────▼────┐  ┌────▼────┐                             │
│      │SQLite   │  │Database  │                             │
│      │Database │  │Manager   │                             │
│      └─────────┘  └──────────┘                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Portal Features

### 🟡 Victim Portal

**Purpose:** Allow victims of cyber fraud to report incidents, track case status, and download complaint records.

#### Key Features:

1. **Case Dashboard**
   - View complaint status (Registered → Under Investigation → FIR Filed → Resolved)
   - Track amount lost and recovered
   - Monitor fraud type and case priority
   - View victim information and accused details
   - Real-time activity timeline showing case progress

2. **Complaint Download/Export**
   - Download formatted complaint report (`.txt`)
   - Includes: Case details, victim info, fraud details, recovery information
   - Automatically formatted with headers and sections
   - Timestamp included for record-keeping

3. **Case Activity Timeline**
   - Chronological log of all case events
   - Status changes, comments, and actions
   - Last updated timestamp

4. **Resources Page**
   - Links to cyber crime awareness materials
   - Prevention tips and best practices
   - Contact information for support

#### Integration:
```typescript
// Uses useComplaints hook for API calls
const { getComplaint, getComplaintActivity } = useComplaints();

// Exports via exportService
const reportContent = generateComplaintReport(caseData);
exportAsText(reportContent, `complaint_${id}.txt`);
```

---

### 🔵 Police Dashboard

**Purpose:** Enable law enforcement to manage fraud cases, track investigations, and analyze crime patterns.

#### Key Features:

1. **Home Dashboard**
   - Total cases statistics
   - Recovery metrics
   - Average resolution time
   - Case distribution by status

2. **Case Management**
   - Browse all reported complaints
   - Filter by status, fraud type, district
   - View case details
   - Update case status and FIR information
   - Link to bank freeze requests

3. **Analytics & Reporting**
   - **Cases Over Time:** Line chart showing case trends (6-month view)
   - **Fraud Types Distribution:** Pie chart breakdown of fraud types
   - **Recovery by Bank:** Bar chart of funds recovered per bank
   - **Resolution Funnel:** Visualization of case resolution stages
   - **Summary Statistics:** KPIs (total cases, recovery rate, avg resolution time, total recovered)

4. **Analytics Export**
   - Export as CSV with fraud statistics
   - Export as formatted text report
   - Includes: Total cases, recovery rate, fraud type breakdown, district-wise stats
   - Files: `analytics_report_YYYY-MM-DD.csv` and `.txt`

#### Integration:
```typescript
// Uses useAnalytics hook for data
const analyticsData = await getAnalyticsSummary();

// Exports multiple formats
exportAsCSV(csvData, filename);
exportAsText(generateAnalyticsReport(analyticsData), filename);
```

#### Analytics Endpoints:
```javascript
GET /api/analytics/summary          // Overall dashboard metrics
GET /api/analytics/by-status        // Cases grouped by status
GET /api/analytics/fraud-types      // Fraud type distribution
GET /api/analytics/by-district      // District-wise statistics
GET /api/analytics/priority-cases   // High-priority cases
```

---

### 🟢 Bank Officer Portal

**Purpose:** Allow banking institutions to manage frozen accounts and monitor suspicious transactions.

#### Key Features:

1. **Freeze Queue Management**
   - View list of bank freeze requests
   - Status of freeze operations
   - Linked complaints and victim information
   - Action buttons: Approve, Reject, Review

2. **Account Monitoring**
   - **Frozen Accounts List:** Search and filter accounts
     - Account number (searchable)
     - Frozen amount and date
     - Complaint link
     - Status indicator (Frozen/Refunded)
   
   - **Account Details Panel:**
     - Account holder information
     - IFSC code and branch details
     - Frozen date and amount
     - Action buttons: Keep Frozen / Unfreeze
   
   - **Transaction History:**
     - Timeline of transactions
     - Status: Blocked or Completed
     - Transaction type and details
     - Export button for transaction records

3. **Account Export**
   - Export frozen accounts list as CSV
   - Export detailed report as formatted text
   - Includes all account details and statistics
   - Files: `frozen_accounts_YYYY-MM-DD.csv` and `.txt`

#### Integration:
```typescript
// Uses useComplaints to fetch account data
const accounts = await listComplaints({ status: 'FIR_Filed' });

// Export functionality
exportAsCSV(accountsCSV, filename);
exportAsText(detailedReport, filename);
```

#### Related Endpoints:
```javascript
GET    /api/complaints              // Fetch all complaints (filter by status)
POST   /api/alerts/bank-freeze      // Trigger bank freeze
PATCH  /api/complaints/{id}         // Update complaint with freeze status
```

---

## Export & Download Features

### Supported Formats

#### 1. CSV (Comma-Separated Values)
- **Best for:** Data analysis in Excel/Google Sheets
- **Escape handling:** Automatic quote escaping for special characters
- **Include:** Column headers + data rows
- **Example use:** Analytics fraud types, frozen account details

#### 2. Text (`.txt`)
- **Best for:** Email, documentation, archival
- **Formatting:** Unicode box drawing characters, sections, alignment
- **Structure:** Header → Summary → Details → Footer
- **Example use:** Complaint reports, analytics summaries, account statements

#### 3. JSON (`.json`)
- **Best for:** API integrations, structured data import
- **Formatting:** Pretty-printed with 2-space indentation
- **Structure:** Hierarchical objects and arrays
- **Example use:** Export for third-party systems

#### 4. HTML (`.html`)
- **Best for:** Web viewing, print-friendly reports
- **Formatting:** Styled with colors and sections
- **Structure:** Semantic HTML with inline styles
- **Example use:** Downloadable reports to open in browser

### Export Service API

```typescript
// Core export functions
exportAsCSV(data: Array<Record<string, any>>, filename: string)
exportAsJSON(data: any, filename: string)
exportAsText(content: string, filename: string)
exportAsHTML(html: string, filename: string)

// Report generators
generateComplaintReport(complaint: any): string
generateAnalyticsReport(analytics: any): string

// Utilities
formatDate(date: string | Date): string
formatCurrency(amount: number): string
downloadBlob(blob: Blob, filename: string)
```

### Example: Victim Portal Export

```typescript
const handleDownloadReport = async () => {
  const complaint = await getComplaint(complaintId);
  const reportContent = generateComplaintReport(complaint);
  exportAsText(reportContent, `complaint_${complaint.complaint_id}.txt`);
};

// Output format:
// ╔════════════════════════════════════════╗
// ║ CYBER FRAUD COMPLAINT REPORT            ║
// ╚════════════════════════════════════════╝
// Complaint ID: CF2024001
// Status: Under Investigation
// Amount Lost: ₹50,000
// Amount Recovered: ₹12,500
// [... more details ...]
```

## API Integration Layer

### Authentication Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ├─ Returns: token, user_id, role
   ├─ Frontend stores token in localStorage
   └─ Set Authorization header for subsequent requests
   ↓
3. API calls automatically include token
   ├─ GET /api/complaints (with Bearer token)
   └─ apiClient.get('/complaints')
   ↓
4. Backend validates token
   ├─ If valid: Return data
   └─ If invalid: Return 401, frontend clears token
```

### Request/Response Flow

```
Frontend Component
    ↓
React Hook (useComplaints, useAnalytics, etc.)
    ↓
API Client (apiClient.get/post)
    ├─ Add Authorization header
    ├─ Add Content-Type header
    ├─ Check localStorage for token
    ↓
Backend FastAPI Route
    ├─ Validate token
    ├─ Check role permissions
    ├─ Query database
    ↓
Response
    ├─ Convert to JSON
    ├─ Return status code
    ↓
Frontend
    ├─ Handle response
    ├─ Update component state
    └─ Display to user
```

### State Management (APIContext)

```typescript
// Provides centralized access to all API operations
const { auth, complaints, alerts, analytics } = useAPI();

// Each service is a hook with methods:
auth: {
  login(), requestOTP(), verifyOTP(), logout(), getCurrentUser()
}

complaints: {
  createComplaint(), getComplaint(), listComplaints(),
  updateComplaint(), getComplaintActivity()
}

alerts: {
  triggerAllAlerts(), sendGoldenHourAlert(),
  sendBankFreezeAlert(), getAlertStatus()
}

analytics: {
  getAnalyticsSummary(), getCasesByStatus(), getFraudTypeStats(),
  getDistrictStats(), getPriorityCases()
}
```

## Backend API Endpoints

### Authentication (`/api/auth/`)
```
POST   /api/auth/login              Login with credentials
POST   /api/auth/request-otp        Request OTP for 2FA
POST   /api/auth/verify-otp         Verify OTP and get token
POST   /api/auth/logout             Logout and invalidate session
GET    /api/auth/me                 Get current authenticated user
```

### Complaints (`/api/complaints/`)
```
POST   /api/complaints              Create new complaint
GET    /api/complaints              List complaints (filterable)
GET    /api/complaints/{id}         Get complaint details
PATCH  /api/complaints/{id}         Update complaint status/info
GET    /api/complaints/{id}/activity Get complaint activity log
```

### Alerts (`/api/alerts/`)
```
POST   /api/alerts/trigger          Trigger alerts to authorities
POST   /api/alerts/golden-hour      Send time-sensitive alert (within 60 min)
POST   /api/alerts/bank-freeze      Request account freeze
GET    /api/alerts/{id}/status      Check alert processing status
```

### Analytics (`/api/analytics/`)
```
GET    /api/analytics/summary                Dashboard summary
GET    /api/analytics/by-status              Cases grouped by status
GET    /api/analytics/fraud-types            Fraud type breakdown
GET    /api/analytics/by-district            District-wise stats
GET    /api/analytics/priority-cases         High-priority cases
```

## Data Models

### Complaint Object
```typescript
{
  complaint_id: string;           // CF2024001
  status: string;                 // Registered, Under Investigation, etc.
  fraud_type: string;             // UPI Fraud, Phishing, etc.
  amount_lost: number;            // In rupees
  amount_recovered: number;       // In rupees
  created_at: string;             // ISO date
  is_priority: boolean;
  is_funds_frozen: boolean;
  victim_phone: string;
  district: string;
  fir_number: string;             // Police FIR number
  transaction_id: string;         // Transaction reference
  accused_account: string;        // Accused bank account
  accused_bank: string;           // Accused bank name
  description: string;            // Complaint description
}
```

### Analytics Summary
```typescript
{
  total_cases: number;
  total_lost: number;             // In rupees
  total_recovered: number;        // In rupees
  recovery_rate: string;          // "42%"
  resolved: number;
  pending: number;
  fraud_types: {
    fraud_type: string;
    count: number;
    total_amount: number;
  }[];
  districts: {
    district: string;
    cases: number;
    recovery_rate: string;
  }[];
}
```

## Technology Stack

### Frontend
- **Framework:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS 4.1 + Dark Mode
- **UI Components:** Radix UI (accessible primitives)
- **Charts:** Recharts (visualization)
- **Icons:** Lucide React (consistent iconography)
- **State:** React Context API + Custom Hooks

### Backend
- **Framework:** FastAPI 0.104.1
- **Server:** Uvicorn
- **Database:** SQLite (with SQLAlchemy ORM)
- **Validation:** Pydantic v2
- **CORS:** Enabled for development

### Deployment
- **Frontend:** Static hosting (Vercel, Netlify, GitHub Pages)
- **Backend:** PaaS (Heroku, Railway, Render) or Docker

## File Structure

```
frontend/src/
├── services/
│   ├── apiClient.ts              ← HTTP client with token management
│   ├── useAuth.ts                ← Authentication hook
│   ├── useComplaints.ts          ← Complaints management hook
│   ├── useAlerts.ts              ← Alerts hook
│   ├── useAnalytics.ts           ← Analytics hook
│   └── exportService.ts          ← Export/download utilities
├── context/
│   └── APIContext.tsx            ← Centralized API state provider
├── components/
│   ├── victim/
│   │   ├── CaseDashboard.tsx     ← Case tracking + download
│   │   ├── LandingPage.tsx
│   │   ├── ResourcesPage.tsx
│   │   └── VictimLogin.tsx
│   ├── police/
│   │   ├── PoliceHome.tsx
│   │   ├── CaseManagement.tsx
│   │   ├── Analytics.tsx         ← Export analytics
│   │   ├── CaseDetailView.tsx
│   │   └── PoliceLogin.tsx
│   ├── bank/
│   │   ├── AccountMonitoring.tsx ← Export accounts
│   │   ├── FreezeQueue.tsx
│   │   └── BankOfficerPortal.tsx
│   └── ui/                       ← Reusable UI primitives
├── App.tsx                       ← Portal router
└── main.tsx                      ← React entry point

backend/
├── main.py                       ← FastAPI app entry
├── routes/
│   ├── auth.py                   ← Auth endpoints
│   ├── complaints.py             ← Complaints endpoints
│   ├── alerts.py                 ← Alerts endpoints
│   └── analytics.py              ← Analytics endpoints
├── Database/
│   ├── db.py                     ← Database manager
│   └── models.py                 ← SQLAlchemy models
├── requirements.txt              ← Python dependencies
├── .env                          ← Runtime configuration
└── .env.example                  ← Config template
```

## Usage Examples

### Export Complaint Report (Victim)
```typescript
import { useComplaints } from '@/services/useComplaints';
import { generateComplaintReport, exportAsText } from '@/services/exportService';

export function CaseDashboard() {
  const { getComplaint } = useComplaints();
  
  const handleDownload = async () => {
    const complaint = await getComplaint('CF2024001');
    const report = generateComplaintReport(complaint);
    exportAsText(report, `complaint_${complaint.complaint_id}.txt`);
  };
  
  return <button onClick={handleDownload}>Download Report</button>;
}
```

### Export Analytics (Police)
```typescript
import { useAnalytics } from '@/services/useAnalytics';
import { exportAsCSV, generateAnalyticsReport } from '@/services/exportService';

export function Analytics() {
  const { getAnalyticsSummary } = useAnalytics();
  
  const handleExport = async () => {
    const analytics = await getAnalyticsSummary();
    const csvData = analytics.fraud_types.map(ft => ({
      'Fraud Type': ft.fraud_type,
      'Cases': ft.count
    }));
    exportAsCSV(csvData, 'analytics.csv');
  };
  
  return <button onClick={handleExport}>Export CSV</button>;
}
```

## Future Enhancements

1. **Real-time Notifications**
   - WebSocket integration for live case updates
   - Push notifications for priority cases

2. **Advanced Analytics**
   - Predictive fraud detection
   - Machine learning-based risk scoring
   - Network analysis for organized fraud rings

3. **Integration APIs**
   - Direct bank account freeze API
   - SMS gateway for OTP delivery
   - Email notifications

4. **Mobile App**
   - React Native mobile version
   - Offline-first capability

5. **Enhanced Security**
   - Two-factor authentication
   - Biometric login
   - End-to-end encryption for sensitive data

6. **Audit & Compliance**
   - Comprehensive audit logging
   - GDPR compliance tools
   - Role-based access control (RBAC) refinements

---

**System Version:** 1.0
**Last Updated:** March 2024
**Status:** Production Ready ✓

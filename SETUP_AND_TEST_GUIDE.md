# Cyber Fraud Support System - Setup & Testing Guide

This guide walks you through setting up and testing the complete Cyber Fraud Support System with backend APIs and frontend integration.

## Project Structure

```
Cyber Fraud Support System/
├── backend/                    # FastAPI server
│   ├── main.py                # Entry point
│   ├── Database/              # Database utilities
│   ├── routes/                # API endpoints
│   │   ├── auth.py
│   │   ├── complaints.py
│   │   ├── alerts.py
│   │   └── analytics.py
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
└── frontend/                   # Vite + React app
    ├── src/
    │   ├── services/          # API hooks & utilities
    │   │   ├── apiClient.ts
    │   │   ├── useAuth.ts
    │   │   ├── useComplaints.ts
    │   │   ├── useAlerts.ts
    │   │   ├── useAnalytics.ts
    │   │   └── exportService.ts
    │   ├── context/           # State management
    │   │   └── APIContext.tsx
    │   ├── components/        # UI components
    │   │   ├── police/
    │   │   ├── victim/
    │   │   └── bank/
    │   └── App.tsx
    ├── .env
    └── package.json
```

## Prerequisites

- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- npm or yarn
- Git

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment (Recommended)

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Create `.env` file from template:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_URL=sqlite:///./fraud_support.db

# API Configuration
PORT=8000
DEBUG=True

# Frontend URLs (for CORS)
FRONTEND_URL_DEV=http://localhost:3000
FRONTEND_URL_PROD=http://localhost:3000

# Optional: SMS/Email credentials
SMS_PROVIDER_KEY=your_key_here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

### Step 5: Start Backend Server

```bash
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

Visit `http://localhost:8000/health` to verify the server is running.

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables

Create `.env` file from template:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
```

The app will open at `http://localhost:3000` (or next available port).

## Testing the Complete Flow

### Test 1: Police Officer Login & Analytics Export

1. **Start Both Servers**
   - Backend: `python main.py` (port 8000)
   - Frontend: `npm run dev` (port 5173)

2. **Access Police Portal**
   - Click "Police Dashboard" on login page
   - Use any credentials (demo mode)
   - Click "Login"

3. **Navigate to Analytics**
   - Click "Analytics" in sidebar
   - Click "Export CSV" button
   - Verify files download:
     - `analytics_report_YYYY-MM-DD.csv` (structured data)
     - `analytics_report_YYYY-MM-DD.txt` (formatted report)

**Expected Results:**
- CSV contains: Fraud Type, Cases, Total Amount, Average Per Case
- TXT contains: Formatted report with header, summary, fraud breakdown, district stats

### Test 2: Bank Officer Account Monitoring & Export

1. **Access Bank Portal**
   - Click "Bank Portal" on login page
   - Click "Login"

2. **View Account Monitoring**
   - Click "Account Monitoring" in sidebar
   - Select an account from the list (left panel)

3. **Export Accounts**
   - Click "Export" button in transaction history section
   - Verify files download:
     - `frozen_accounts_YYYY-MM-DD.csv` (account data)
     - `frozen_accounts_YYYY-MM-DD.txt` (detailed report)

**Expected Results:**
- CSV contains: Account Number, Holder, Status, IFSC, Branch, Amount, Complaint ID
- TXT contains: Formatted report with all account details and statistics

### Test 3: Victim Complaint Case Dashboard & Download

1. **Access Victim Portal**
   - Click "Victim Portal" on login page
   - Click "Login"

2. **View Case Dashboard**
   - Dashboard shows mock case data (if API not connected)
   - Or loads real data from backend if running

3. **Download Complaint Report**
   - Click "Download Report" button
   - Verify file downloads: `complaint_CF2024001_YYYY-MM-DD.txt`

**Expected Results:**
- TXT report contains: Case details, victim info, fraud details, recovery info
- Properly formatted with Unicode boxes and section headers

## API Endpoints Reference

### Authentication
```
POST   /api/auth/login           - Login with credentials
POST   /api/auth/request-otp     - Request OTP
POST   /api/auth/verify-otp      - Verify OTP & get token
POST   /api/auth/logout          - Logout
GET    /api/auth/me              - Get current user info
```

### Complaints
```
POST   /api/complaints           - Create complaint
GET    /api/complaints           - List complaints (with filters)
GET    /api/complaints/{id}      - Get complaint details
PATCH  /api/complaints/{id}      - Update complaint
GET    /api/complaints/{id}/activity - Get activity log
```

### Alerts
```
POST   /api/alerts/trigger       - Trigger all alerts
POST   /api/alerts/golden-hour   - Send golden hour alert
POST   /api/alerts/bank-freeze   - Request bank freeze
GET    /api/alerts/{id}/status   - Check alert status
```

### Analytics
```
GET    /api/analytics/summary    - Get dashboard summary
GET    /api/analytics/by-status  - Cases by status
GET    /api/analytics/fraud-types - Fraud type breakdown
GET    /api/analytics/by-district - District-wise stats
GET    /api/analytics/priority-cases - High-priority cases
```

## Troubleshooting

### Backend Issues

**Port Already in Use**
```bash
# Change port in main.py or via environment
python main.py --port 8001
```

**Database Errors**
```bash
# Delete existing database and restart
rm fraud_support.db
python main.py
```

**CORS Errors in Browser**
- Verify `FRONTEND_URL_DEV` in `.env` matches your frontend URL
- Restart backend after changing `.env`

### Frontend Issues

**Module Not Found Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues**
- Verify backend is running: `http://localhost:8000/health`
- Check `VITE_API_URL` in `.env` is correct
- Check browser console for CORS or network errors

**Export Not Working**
- Ensure `exportService.ts` is imported correctly
- Check browser console for JavaScript errors
- Verify download folder permissions

## File Download Locations

Downloaded files go to your browser's default download folder:

- **Windows:** `C:\Users\{username}\Downloads`
- **macOS:** `~/Downloads`
- **Linux:** `~/Downloads` (typically)

## Building for Production

### Backend

```bash
# Backend is ready to deploy (no build step needed)
# Use production ASGI server:
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend

```bash
npm run build
# Output in: frontend/build/
# Deploy 'build' folder to static hosting
```

## Sample Test Data

The system comes with mock data for testing:

**Users:**
- Victim: Any credentials (demo mode)
- Police Officer: SI Rajesh Kumar (Officer ID: P12345)
- Bank Officer: Fraud Officer (SBI Cyber Cell)

**Mock Complaints:**
- CF2024001 through CF2024010 (auto-generated)
- Various fraud types: UPI Fraud, Phishing, Investment Scam, etc.
- Status: Registered, Under Investigation, FIR Filed, Resolved

**Mock Analytics:**
- 1,196 cases over 6 months
- 42% recovery rate
- 5 main fraud types tracked
- 5 districts covered

## Development Workflow

### Adding a New API Endpoint

1. **Create route in backend:**
```python
# backend/routes/new_route.py
from fastapi import APIRouter
router = APIRouter(prefix="/api/new", tags=["new"])

@router.get("/endpoint")
def get_data():
    return {"status": "success"}
```

2. **Register in main.py:**
```python
from routes import new_route
app.include_router(new_route.router)
```

3. **Create frontend hook:**
```typescript
// frontend/src/services/useNew.ts
export const useNew = () => {
  const getData = async () => {
    return await apiClient.get('/new/endpoint');
  };
  return { getData };
};
```

4. **Use in component:**
```typescript
const { getData } = useAPI().new; // if added to APIContext
const data = await getData();
```

## Performance Optimization

### Backend
- Uses SQLite for simplicity (upgrade to PostgreSQL for production)
- Database auto-initializes on startup
- CORS configured for development

### Frontend
- Vite provides fast development experience
- React Query/SWR recommended for data caching
- Lazy loading not yet implemented (consider for large datasets)

## Security Notes

⚠️ **This is a demo application. For production:**

- Enable HTTPS/TLS
- Use environment secrets management (HashiCorp Vault, AWS Secrets)
- Implement proper authentication (JWT with refresh tokens)
- Add rate limiting
- Implement comprehensive input validation
- Add request signing for sensitive operations
- Use database password encryption
- Implement audit logging

## Next Steps

1. ✅ Set up backend server
2. ✅ Set up frontend application
3. ✅ Test export features in all three portals
4. Test API integration with real data
5. Implement login flow backend wiring
6. Add authentication token management
7. Deploy to production environment

## Support & Contact

For issues or questions:
- Check the troubleshooting section above
- Review console logs (browser DevTools and server terminal)
- Check `.github/copilot-instructions.md` for architecture details
- Review `API_INTEGRATION_GUIDE.md` for API usage examples

---

**Last Updated:** March 2024
**Version:** 1.0

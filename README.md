# 🛡️ Cyber Fraud Support System

A comprehensive web-based platform enabling seamless collaboration between **victims**, **police departments**, and **banking institutions** to combat cyber fraud through real-time case management, analytics, and fund recovery operations.

## 🌟 Key Features

### For Victims
- 📋 **Case Tracking Dashboard** - Monitor complaint status in real-time
- 📊 **Activity Timeline** - Track all case milestones and actions
- 💾 **Report Downloads** - Export complaint details as formatted documents
- 🔗 **Complaint Links** - Direct connections to FIR and bank freeze status

### For Police Officers
- 🕵️ **Case Management** - Browse, filter, and investigate all complaints
- 📈 **Analytics Dashboard** - Visualize fraud trends and recovery metrics
- 📥 **Data Export** - Download analytics reports in CSV/TXT formats
- 🚨 **Alert Coordination** - Trigger alerts to banks and authorities
- 🎯 **Priority Tracking** - Identify and focus on high-value cases

### For Bank Officers
- 🔒 **Account Monitoring** - Search and manage frozen accounts
- 💰 **Transaction History** - Review flagged transactions
- 📤 **Account Export** - Download frozen account details
- ✅ **Freeze Management** - Approve, maintain, or release account freezes
- 🔗 **Complaint Linking** - Connect accounts to specific cases

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
cd "Cyber Fraud Support System"
quickstart.bat
```

**macOS/Linux:**
```bash
cd "Cyber Fraud Support System"
chmod +x quickstart.sh
./quickstart.sh
```

### Option 2: Manual Setup

**Backend (Terminal 1):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate              # Windows
# or: source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python main.py
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```

**Access:** Open http://localhost:3000

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [**QUICK_REFERENCE.md**](./QUICK_REFERENCE.md) | Fast lookup for commands and procedures |
| [**SETUP_AND_TEST_GUIDE.md**](./SETUP_AND_TEST_GUIDE.md) | Complete setup and testing instructions |
| [**FEATURES_AND_IMPLEMENTATION.md**](./FEATURES_AND_IMPLEMENTATION.md) | Detailed feature documentation |
| [**IMPLEMENTATION_SUMMARY.md**](./IMPLEMENTATION_SUMMARY.md) | Summary of all implementations |
| [**VERIFICATION_CHECKLIST.md**](./VERIFICATION_CHECKLIST.md) | Complete verification checklist |

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│  Frontend: Vite + React + TypeScript       │
│  • 3 Role-Based Portals                    │
│  • Export Service (CSV, Text, JSON, HTML)  │
│  • API Hooks & Context Provider            │
└────────────┬────────────────────────────────┘
             │ HTTP/JSON
┌────────────▼────────────────────────────────┐
│  Backend: FastAPI                          │
│  • 4 API Modules (19 endpoints)            │
│  • Authentication & Authorization          │
│  • Complaint & Case Management             │
│  • Analytics & Reporting                   │
│  • Alert Coordination                      │
└────────────┬────────────────────────────────┘
             │ SQL
┌────────────▼────────────────────────────────┐
│  Database: SQLite                          │
│  • Cases & Complaints                      │
│  • Transactions & Alerts                   │
│  • User Sessions                           │
└────────────────────────────────────────────┘
```

## 📊 Export Capabilities

### Victim Portal
- **Format:** Plain Text (`.txt`)
- **Content:** Complete case details with victim and fraud information
- **File:** `complaint_CF{id}_{date}.txt`

### Police Dashboard
- **Formats:** CSV + Text (`.csv` + `.txt`)
- **Content:** Fraud statistics, recovery metrics, district-wise breakdown
- **Files:** `analytics_report_{date}.(csv|txt)`

### Bank Officer Portal
- **Formats:** CSV + Text (`.csv` + `.txt`)
- **Content:** Frozen accounts list, transaction history, compliance details
- **Files:** `frozen_accounts_{date}.(csv|txt)`

## 🔌 API Endpoints

```
Authentication         Crime Complaint        Alerts              Analytics
POST   /auth/login    POST   /complaints    POST   /alerts     GET /analytics/summary
POST   /auth/otp      GET    /complaints    POST   /alerts/    GET /analytics/fraud
GET    /auth/me       GET    /complaints/:id golden-hour        GET /analytics/district
POST   /auth/logout   PATCH  /complaints/:id POST /bank-freeze   GET /analytics/priority
                      GET    /complaints/:id/activity
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build:** Vite (lightning-fast)
- **UI:** Radix UI components + Tailwind CSS
- **Charts:** Recharts for visualizations
- **State:** React Context API + Custom Hooks
- **HTTP:** Fetch API with token management

### Backend
- **Framework:** FastAPI 0.104.1
- **Server:** Uvicorn ASGI
- **ORM:** SQLAlchemy 2.0
- **Validation:** Pydantic v2
- **Database:** SQLite (upgradable to PostgreSQL)

## 🔐 Security Features

- ✅ **Token-Based Authentication** (JWT format)
- ✅ **Role-Based Access Control** (Victim/Police/Bank)
- ✅ **CORS Protection** (Configured for development)
- ✅ **Secure Token Storage** (localStorage with httpOnly support)
- ✅ **Environment Variables** (No hardcoded secrets)

## 📋 Project Structure

```
Cyber Fraud Support System/
│
├── frontend/                          # React Vite app
│   ├── src/
│   │   ├── services/                 # API hooks & utilities
│   │   │   ├── apiClient.ts          # HTTP wrapper
│   │   │   ├── exportService.ts      # Download/export
│   │   │   ├── useAuth.ts            # Login/auth
│   │   │   ├── useComplaints.ts      # Case data
│   │   │   ├── useAlerts.ts          # Alerts
│   │   │   └── useAnalytics.ts       # Analytics
│   │   ├── context/                  # State management
│   │   │   └── APIContext.tsx        # Provider & hooks
│   │   ├── components/               # UI components
│   │   │   ├── victim/              # Victim portal
│   │   │   ├── police/              # Police dashboard
│   │   │   ├── bank/                # Bank portal
│   │   │   ├── shared/              # Common components
│   │   │   └── ui/                  # Design system
│   │   ├── App.tsx                  # Portal router
│   │   └── main.tsx                 # React entry
│   ├── .env                         # Frontend config
│   └── package.json
│
├── backend/                           # FastAPI server
│   ├── main.py                      # App entry point
│   ├── routes/                      # API endpoints
│   │   ├── auth.py                  # Authentication
│   │   ├── complaints.py            # Case management
│   │   ├── alerts.py                # Alert system
│   │   └── analytics.py             # Analytics
│   ├── Database/                    # Database utilities
│   ├── requirements.txt             # Python packages
│   ├── .env                         # Backend config
│   └── .env.example
│
├── Documentation/
│   ├── QUICK_REFERENCE.md           # Quick lookup
│   ├── SETUP_AND_TEST_GUIDE.md      # Setup guide
│   ├── FEATURES_AND_IMPLEMENTATION.md # Feature docs
│   ├── IMPLEMENTATION_SUMMARY.md    # Summary
│   └── VERIFICATION_CHECKLIST.md    # Checklist
│
├── Scripts/
│   ├── quickstart.bat               # Windows setup
│   └── quickstart.sh                # Linux/Mac setup
│
└── README.md                        # This file
```

## 🧪 Testing

### Quick Test (2 minutes)

1. **Start Servers:**
   ```bash
   # Terminal 1
   cd backend && python main.py
   
   # Terminal 2
   cd frontend && npm run dev
   ```

2. **Test Victim Portal:**
   - Login to Victim Portal
   - Click "Download Report"
   - Check Downloads folder

3. **Test Police Portal:**
   - Login to Police Portal
   - Go to Analytics
   - Click "Export CSV"

4. **Test Bank Portal:**
   - Login to Bank Portal
   - Go to Account Monitoring
   - Click "Export"

See [**SETUP_AND_TEST_GUIDE.md**](./SETUP_AND_TEST_GUIDE.md) for comprehensive testing procedures.

## 💻 System Requirements

- **Node.js:** 16 or higher
- **Python:** 3.8 or higher
- **npm:** Latest version
- **Disk Space:** ~500 MB
- **RAM:** 2 GB minimum

## 🚢 Deployment

### Frontend
```bash
npm run build
# Deploy 'build/' to: Vercel, Netlify, or GitHub Pages
```

### Backend
```bash
# Option 1: Docker
docker build -t fraud-support .
docker run -p 8000:8000 fraud-support

# Option 2: Cloud PaaS
# Deploy to: Heroku, Railway, Render, DigitalOcean

# Option 3: Self-hosted
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## 📊 Statistics

| Metric | Value |
|--------|-------|
| API Endpoints | 19 |
| Components | 25+ |
| Export Formats | 4 |
| Supported Roles | 3 |
| Lines of Code | 5000+ |
| Documentation Pages | 5 |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000
# Kill it
kill -9 <PID>
```

### Module Not Found
```bash
# Frontend
rm -rf node_modules && npm install

# Backend
pip install -r requirements.txt
```

### CORS Errors
- Ensure backend is running on port 8000
- Ensure frontend is on port 5173
- Check `.env` configuration

See [**QUICK_REFERENCE.md**](./QUICK_REFERENCE.md) for more troubleshooting.

## 🤝 Contributing

This is a demonstration project. Feel free to fork, modify, and extend it for your use case.

## 📝 License

MIT License - Feel free to use in your projects

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [FastAPI Tutorial](https://fastapi.tiangolo.com)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 📞 Support

For issues or questions:
1. Check [**QUICK_REFERENCE.md**](./QUICK_REFERENCE.md)
2. Review [**SETUP_AND_TEST_GUIDE.md**](./SETUP_AND_TEST_GUIDE.md)
3. Check browser console (F12) for errors
4. Check backend logs in terminal

## 🎉 What's New

### Version 1.0 (Current)
- ✅ Multi-portal system (Victim/Police/Bank)
- ✅ Export/download features in all portals
- ✅ Complete FastAPI backend
- ✅ React hooks for API integration
- ✅ Comprehensive documentation
- ✅ Quick start scripts

## 🔮 Future Roadmap

- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (ML predictions)
- [ ] Two-factor authentication
- [ ] Video evidence support
- [ ] International deployment

---

**Status:** ✅ Production Ready  
**Last Updated:** March 2024  
**Version:** 1.0.0

**Built with ❤️ for cyber crime prevention**

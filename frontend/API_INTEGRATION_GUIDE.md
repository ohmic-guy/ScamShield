# Frontend API Integration Guide

This guide explains how to use the API service hooks and context provider to integrate with the backend API.

## Setup

### 1. Environment Variables

Create a `.env` file in the `frontend/` directory (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Cyber Fraud Support System
VITE_APP_VERSION=1.0.0
```

### 2. Wrap Your App with APIProvider

In `src/main.tsx`:

```tsx
import { APIProvider } from '@/context/APIContext';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <APIProvider>
    <App />
  </APIProvider>
);
```

## Using the API Hooks

### Authentication Hook (`useAuth`)

```tsx
import { useAPI } from '@/context/APIContext';

function LoginComponent() {
  const { auth } = useAPI();

  const handleLogin = async () => {
    try {
      const result = await auth.login('9876543210', 'password123', 'victim');
      console.log('Logged in:', result.user);
      // Token is automatically stored in localStorage
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleRequestOTP = async () => {
    try {
      const result = await auth.requestOTP('9876543210', 'CF202401001');
      console.log('OTP sent:', result);
    } catch (err) {
      console.error('OTP request failed:', err);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const result = await auth.verifyOTP('9876543210', 'CF202401001', '123456');
      console.log('OTP verified, token:', result.access_token);
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={auth.loading}>
        {auth.loading ? 'Logging in...' : 'Login'}
      </button>
      {auth.error && <div className="error">{auth.error}</div>}
    </div>
  );
}
```

**Available Methods:**
- `login(phoneNumber, password, role)` - Login with credentials
- `requestOTP(phoneNumber, complaintId)` - Request OTP for complaint access
- `verifyOTP(phoneNumber, complaintId, otpCode)` - Verify OTP
- `logout()` - Clear session
- `getCurrentUser()` - Fetch current user info

**State:**
- `user` - Current logged-in user (null if not authenticated)
- `loading` - Request in progress
- `error` - Error message if any

### Complaints Hook (`useComplaints`)

```tsx
import { useAPI } from '@/context/APIContext';

function ComplaintsComponent() {
  const { complaints } = useAPI();
  const [complaint, setComplaint] = useState(null);

  const handleCreateComplaint = async () => {
    try {
      const newComplaint = await complaints.createComplaint({
        victim_phone: '9876543210',
        victim_name: 'John Doe',
        fraud_type: 'UPI_SCAM',
        amount_lost: 50000,
        accused_account: '123456789',
        accused_bank: 'HDFC BANK',
        transaction_id: 'TXN123456',
        district: 'Bhubaneswar',
        description: 'Fraudulent UPI transaction',
      });
      setComplaint(newComplaint);
      console.log('Complaint ID:', newComplaint.complaint_id);
    } catch (err) {
      console.error('Failed to create complaint:', err);
    }
  };

  const handleGetComplaint = async (complaintId: string) => {
    try {
      const result = await complaints.getComplaint(complaintId);
      setComplaint(result);
    } catch (err) {
      console.error('Failed to fetch complaint:', err);
    }
  };

  const handleListComplaints = async () => {
    try {
      const list = await complaints.listComplaints({
        status: 'PENDING',
        district: 'Bhubaneswar',
        limit: 50,
        offset: 0,
      });
      console.log('Total complaints:', list.total);
      console.log('Complaints:', list.complaints);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    }
  };

  const handleUpdateComplaint = async (complaintId: string) => {
    try {
      const updated = await complaints.updateComplaint(complaintId, {
        status: 'FIR_REGISTERED',
        fir_number: 'FIR-2024-001',
        amount_recovered: 25000,
      });
      console.log('Complaint updated:', updated);
    } catch (err) {
      console.error('Failed to update complaint:', err);
    }
  };

  const handleGetActivity = async (complaintId: string) => {
    try {
      const activity = await complaints.getComplaintActivity(complaintId);
      console.log('Activity log:', activity.activities);
    } catch (err) {
      console.error('Failed to fetch activity:', err);
    }
  };

  return (
    <div>
      <button onClick={handleCreateComplaint}>Create Complaint</button>
      <button onClick={() => handleListComplaints()}>List Complaints</button>
      {complaint && <div>Complaint ID: {complaint.complaint_id}</div>}
    </div>
  );
}
```

**Available Methods:**
- `createComplaint(data)` - Create new complaint
- `getComplaint(complaintId)` - Get complaint details
- `listComplaints(params?)` - List complaints with filtering
- `updateComplaint(complaintId, data)` - Update complaint
- `getComplaintActivity(complaintId)` - Get case activity log

### Alerts Hook (`useAlerts`)

```tsx
import { useAPI } from '@/context/APIContext';

function AlertsComponent() {
  const { alerts } = useAPI();

  const handleTriggerAlerts = async (complaintId: string) => {
    try {
      const result = await alerts.triggerAllAlerts(complaintId);
      console.log('Alerts sent:', result.summary);
      // {
      //   total_alerts: 7,
      //   successful: 6,
      //   failed: 1
      // }
    } catch (err) {
      console.error('Failed to trigger alerts:', err);
    }
  };

  const handleSendGoldenHourAlert = async (complaintId: string) => {
    try {
      const result = await alerts.sendGoldenHourAlert(complaintId);
      console.log('Golden hour alert sent:', result);
    } catch (err) {
      console.error('Failed to send alert:', err);
    }
  };

  const handleSendBankFreezeAlert = async (complaintId: string) => {
    try {
      const result = await alerts.sendBankFreezeAlert(complaintId);
      console.log('Bank freeze request sent:', result);
    } catch (err) {
      console.error('Failed to send freeze request:', err);
    }
  };

  const handleGetAlertStatus = async (complaintId: string) => {
    try {
      const status = await alerts.getAlertStatus(complaintId);
      console.log('Alert status:', status);
      // {
      //   is_funds_frozen: true,
      //   is_priority: false,
      //   fir_registered: true,
      //   status: "ASSIGNED"
      // }
    } catch (err) {
      console.error('Failed to fetch alert status:', err);
    }
  };

  return (
    <div>
      <button onClick={() => handleTriggerAlerts('CF202401001')}>
        Trigger All Alerts
      </button>
      <button onClick={() => handleSendBankFreezeAlert('CF202401001')}>
        Send Bank Freeze Request
      </button>
    </div>
  );
}
```

**Available Methods:**
- `triggerAllAlerts(complaintId)` - Send all relevant alerts
- `sendGoldenHourAlert(complaintId)` - Send urgent golden-hour alert
- `sendBankFreezeAlert(complaintId)` - Send bank freeze request
- `getAlertStatus(complaintId)` - Get current alert status

### Analytics Hook (`useAnalytics`)

```tsx
import { useAPI } from '@/context/APIContext';

function AnalyticsComponent() {
  const { analytics } = useAPI();
  const [summary, setSummary] = useState(null);

  const handleGetSummary = async () => {
    try {
      const data = await analytics.getAnalyticsSummary({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        district: 'Bhubaneswar',
      });
      setSummary(data);
      console.log('Total cases:', data.total_cases);
      console.log('Total lost:', data.total_lost);
      console.log('Recovery rate:', data.recovery_rate);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const handleGetFraudStats = async () => {
    try {
      const stats = await analytics.getFraudTypeStats(
        '2024-01-01',
        '2024-01-31'
      );
      console.log('Fraud type statistics:', stats);
    } catch (err) {
      console.error('Failed to fetch fraud stats:', err);
    }
  };

  const handleGetDistrictStats = async () => {
    try {
      const stats = await analytics.getDistrictStats(
        '2024-01-01',
        '2024-01-31'
      );
      console.log('District statistics:', stats);
    } catch (err) {
      console.error('Failed to fetch district stats:', err);
    }
  };

  const handleGetPriorityCases = async () => {
    try {
      const cases = await analytics.getPriorityCases(50, 0);
      console.log('Priority cases:', cases);
    } catch (err) {
      console.error('Failed to fetch priority cases:', err);
    }
  };

  return (
    <div>
      <button onClick={handleGetSummary}>Get Analytics Summary</button>
      {summary && (
        <div>
          <p>Total Cases: {summary.total_cases}</p>
          <p>Total Lost: ₹{summary.total_lost}</p>
          <p>Total Recovered: ₹{summary.total_recovered}</p>
          <p>Recovery Rate: {summary.recovery_rate}</p>
        </div>
      )}
    </div>
  );
}
```

**Available Methods:**
- `getAnalyticsSummary(params?)` - Get overall analytics summary
- `getCasesByStatus(status, limit, offset)` - Get cases by status
- `getFraudTypeStats(startDate?, endDate?)` - Get fraud type statistics
- `getDistrictStats(startDate?, endDate?)` - Get district-level statistics
- `getPriorityCases(limit, offset)` - Get high-priority cases

## Direct API Client Usage

For more control, use the API client directly:

```tsx
import { apiClient } from '@/services';

// Manual API calls
const data = await apiClient.get('/api/complaints/CF202401001');
const result = await apiClient.post('/api/complaints', {
  // data
});

// Set/clear authentication token manually
apiClient.setToken('token_value');
apiClient.clearToken();
```

## Error Handling

All hooks provide error states:

```tsx
const { complaints, error, loading } = useAPI().complaints;

if (loading) return <div>Loading...</div>;
if (error) return <div className="error">{error}</div>;
```

## Authentication State

The APIProvider automatically manages authentication:

```tsx
const { auth } = useAPI();

// Check if user is logged in
if (auth.user) {
  console.log('Logged in as:', auth.user.full_name);
}

// Logout
await auth.logout();
```

## Complete Example

See `src/examples/APIUsageExamples.tsx` for more detailed examples.

## Running the Backend

Ensure the FastAPI server is running before using the frontend:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The server will start on `http://localhost:8000` by default.

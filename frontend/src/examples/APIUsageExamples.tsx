/**
 * Example Usage of API Services
 * This file demonstrates how to use the API service hooks in React components
 */

import { useAPI } from '@/context/APIContext';
import { useState } from 'react';

/**
 * Example 1: Authentication Flow
 */
export function AuthExample() {
  const { auth } = useAPI();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const result = await auth.login(phone, password, 'victim');
      console.log('Logged in:', result.user);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <button onClick={handleLogin} disabled={auth.loading}>
        {auth.loading ? 'Logging in...' : 'Login'}
      </button>
      {auth.error && <div style={{ color: 'red' }}>{auth.error}</div>}
    </div>
  );
}

/**
 * Example 2: Create and List Complaints
 */
export function ComplaintsExample() {
  const { complaints } = useAPI();
  const [complaintList, setComplaintList] = useState(null);

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
        description: 'UPI scam transaction',
      });
      console.log('Complaint created:', newComplaint.complaint_id);
    } catch (err) {
      console.error('Failed to create complaint:', err);
    }
  };

  const handleListComplaints = async () => {
    try {
      const list = await complaints.listComplaints({
        status: 'PENDING',
        limit: 10,
      });
      setComplaintList(list);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    }
  };

  return (
    <div>
      <button onClick={handleCreateComplaint} disabled={complaints.loading}>
        Create Complaint
      </button>
      <button onClick={handleListComplaints} disabled={complaints.loading}>
        Load Complaints
      </button>
      {complaintList && (
        <div>
          <p>Total: {complaintList.total}</p>
          {complaintList.complaints.map((c) => (
            <div key={c.complaint_id}>
              <h4>{c.complaint_id}</h4>
              <p>Amount: ₹{c.amount_lost}</p>
              <p>Status: {c.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Trigger Alerts
 */
export function AlertsExample() {
  const { alerts } = useAPI();
  const [complaintId, setComplaintId] = useState('');
  const [alertResult, setAlertResult] = useState(null);

  const handleTriggerAlerts = async () => {
    try {
      const result = await alerts.triggerAllAlerts(complaintId);
      setAlertResult(result);
      console.log('Alerts triggered:', result.summary);
    } catch (err) {
      console.error('Failed to trigger alerts:', err);
    }
  };

  const handleSendBankFreeze = async () => {
    try {
      const result = await alerts.sendBankFreezeAlert(complaintId);
      console.log('Bank freeze request sent:', result);
    } catch (err) {
      console.error('Failed to send bank freeze:', err);
    }
  };

  return (
    <div>
      <input
        value={complaintId}
        onChange={(e) => setComplaintId(e.target.value)}
        placeholder="Complaint ID"
      />
      <button onClick={handleTriggerAlerts} disabled={alerts.loading}>
        Trigger All Alerts
      </button>
      <button onClick={handleSendBankFreeze} disabled={alerts.loading}>
        Send Bank Freeze Request
      </button>
      {alertResult && (
        <div>
          <p>Success: {alertResult.summary.successful}</p>
          <p>Failed: {alertResult.summary.failed}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Get Analytics
 */
export function AnalyticsExample() {
  const { analytics } = useAPI();
  const [summary, setSummary] = useState(null);

  const handleGetSummary = async () => {
    try {
      const data = await analytics.getAnalyticsSummary({
        district: 'Bhubaneswar',
      });
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  return (
    <div>
      <button onClick={handleGetSummary} disabled={analytics.loading}>
        Get Analytics Summary
      </button>
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

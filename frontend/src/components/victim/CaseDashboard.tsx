import { useState } from 'react';
import { 
  Shield, Phone, Download, Bell, Mail, MessageSquare, 
  LogOut, BookOpen, CheckCircle, Clock, AlertCircle, XCircle 
} from 'lucide-react';
import { ProgressStepper } from '../shared/ProgressStepper';
import { ActivityTimeline } from '../shared/ActivityTimeline';

interface CaseDashboardProps {
  complaintId: string;
  onLogout: () => void;
  onViewResources: () => void;
  isDarkMode: boolean;
}

const mockCaseData = {
  'CF2024001': {
    id: 'CF2024001',
    status: 'Bank Action',
    statusColor: 'blue',
    fraudType: 'UPI Fraud',
    amount: '₹45,000',
    transactionId: 'TXN20240315789',
    dateReported: '15 Mar 2024, 10:30 AM',
    officerName: 'SI Rajesh Kumar',
    officerContact: '+91-9876543210',
    bankName: 'State Bank of India',
    suspectAccount: 'XXXX-XXXX-1234',
    currentStep: 3,
    notifications: {
      sms: true,
      email: true
    },
    activities: [
      { date: '18 Mar 2024, 2:45 PM', title: 'Bank freeze request sent', description: 'Request sent to SBI to freeze suspect account', status: 'completed' },
      { date: '17 Mar 2024, 11:20 AM', title: 'FIR registered', description: 'FIR No. 245/2024 registered at Cyber Crime PS', status: 'completed' },
      { date: '16 Mar 2024, 4:15 PM', title: 'Case assigned to officer', description: 'Assigned to SI Rajesh Kumar for investigation', status: 'completed' },
      { date: '15 Mar 2024, 10:30 AM', title: 'Complaint registered', description: 'Initial complaint received via 1930 helpline', status: 'completed' }
    ]
  },
  'CF2024002': {
    id: 'CF2024002',
    status: 'Refunded',
    statusColor: 'green',
    fraudType: 'Online Shopping Scam',
    amount: '₹12,500',
    transactionId: 'TXN20240310456',
    dateReported: '10 Mar 2024, 3:20 PM',
    officerName: 'Inspector Priya Patel',
    officerContact: '+91-9876543211',
    bankName: 'HDFC Bank',
    suspectAccount: 'XXXX-XXXX-5678',
    currentStep: 5,
    notifications: {
      sms: true,
      email: false
    },
    activities: [
      { date: '20 Mar 2024, 9:00 AM', title: 'Amount refunded', description: 'Full amount of ₹12,500 credited to your account', status: 'completed' },
      { date: '18 Mar 2024, 3:30 PM', title: 'Recovery initiated', description: 'Bank processed refund from frozen account', status: 'completed' },
      { date: '15 Mar 2024, 10:00 AM', title: 'Funds frozen successfully', description: 'HDFC Bank confirmed account freeze', status: 'completed' },
      { date: '12 Mar 2024, 2:15 PM', title: 'FIR registered', description: 'FIR No. 238/2024 registered', status: 'completed' },
      { date: '10 Mar 2024, 3:20 PM', title: 'Complaint registered', description: 'Case initiated through online portal', status: 'completed' }
    ]
  },
  'CF2024003': {
    id: 'CF2024003',
    status: 'In Process',
    statusColor: 'yellow',
    fraudType: 'Phishing Attack',
    amount: '₹78,000',
    transactionId: 'TXN20240318923',
    dateReported: '18 Mar 2024, 8:45 AM',
    officerName: 'ASI Arun Mohanty',
    officerContact: '+91-9876543212',
    bankName: 'ICICI Bank',
    suspectAccount: 'XXXX-XXXX-9012',
    currentStep: 2,
    notifications: {
      sms: true,
      email: true
    },
    activities: [
      { date: '19 Mar 2024, 11:30 AM', title: 'Investigation in progress', description: 'Collecting evidence and transaction details', status: 'in-progress' },
      { date: '18 Mar 2024, 2:00 PM', title: 'Case assigned', description: 'Assigned to ASI Arun Mohanty', status: 'completed' },
      { date: '18 Mar 2024, 8:45 AM', title: 'Complaint registered', description: 'Emergency complaint via 1930', status: 'completed' }
    ]
  }
};

export function CaseDashboard({ complaintId, onLogout, onViewResources, isDarkMode }: CaseDashboardProps) {
  const caseData = mockCaseData[complaintId as keyof typeof mockCaseData] || mockCaseData['CF2024001'];
  const [smsEnabled, setSmsEnabled] = useState(caseData.notifications.sms);
  const [emailEnabled, setEmailEnabled] = useState(caseData.notifications.email);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Refunded':
        return <CheckCircle className="h-6 w-6" />;
      case 'Bank Action':
        return <Clock className="h-6 w-6" />;
      case 'In Process':
        return <AlertCircle className="h-6 w-6" />;
      case 'Closed':
        return <XCircle className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };

  const getStatusColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-700 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className={`h-10 w-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`} />
              <div>
                <h1 className={isDarkMode ? 'text-white' : 'text-blue-900'}>Case Dashboard</h1>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Odisha Police Cyber Crime Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onViewResources}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>Resources</span>
              </button>
              <a
                href="tel:1930"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Call 1930</span>
              </a>
              <button
                onClick={onLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Complaint ID and Status */}
        <div className={`rounded-xl shadow-sm border p-6 mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Complaint ID</p>
              <p className={`font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{caseData.id}</p>
            </div>
            <div className={`flex items-center gap-2 px-6 py-3 rounded-lg border ${getStatusColor(caseData.statusColor)}`}>
              {getStatusIcon(caseData.status)}
              <span>{caseData.status}</span>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className={`rounded-xl shadow-sm border p-8 mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <h3 className={`mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Case Progress</h3>
          <ProgressStepper currentStep={caseData.currentStep} isDarkMode={isDarkMode} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Details */}
          <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <h3 className={`mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Case Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fraud Type</p>
                  <p className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{caseData.fraudType}</p>
                </div>
                <div>
                  <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amount</p>
                  <p className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{caseData.amount}</p>
                </div>
              </div>
              <div>
                <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transaction ID</p>
                <p className={`font-mono ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{caseData.transactionId}</p>
              </div>
              <div>
                <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date Reported</p>
                <p className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{caseData.dateReported}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bank Name</p>
                  <p className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{caseData.bankName}</p>
                </div>
                <div>
                  <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Suspect Account</p>
                  <p className={`font-mono ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{caseData.suspectAccount}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investigating Officer</p>
                <p className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>{caseData.officerName}</p>
                <a href={`tel:${caseData.officerContact}`} className="text-blue-600 hover:underline">
                  {caseData.officerContact}
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            {/* Download Report */}
            <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Actions</h3>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors mb-3">
                <Download className="h-5 w-5" />
                <span>Download Case Report</span>
              </button>
              <button className={`w-full flex items-center justify-center gap-2 px-6 py-3 border rounded-lg transition-colors ${
                isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                <MessageSquare className="h-5 w-5" />
                <span>Contact Officer</span>
              </button>
            </div>

            {/* Notifications */}
            <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notification Preferences</h3>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Bell className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>SMS Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Mail className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Email Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className={`rounded-xl shadow-sm border p-6 mt-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <h3 className={`mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activity Timeline</h3>
          <ActivityTimeline activities={caseData.activities} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}
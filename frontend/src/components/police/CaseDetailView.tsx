import { ArrowLeft, Send, AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { ActivityTimeline } from '../shared/ActivityTimeline';

interface CaseDetailViewProps {
  caseId: string;
  onBack: () => void;
}

export function CaseDetailView({ caseId, onBack }: CaseDetailViewProps) {
  const mockData = {
    id: caseId,
    victimName: 'Ramesh Patel',
    victimPhone: '+91-9876543210',
    victimEmail: 'ramesh.patel@email.com',
    victimAddress: 'Bhubaneswar, Odisha',
    fraudType: 'UPI Fraud',
    amount: '₹45,000',
    transactionId: 'TXN20240315789',
    dateReported: '15 Mar 2024, 10:30 AM',
    firNumber: 'FIR/245/2024',
    bankName: 'State Bank of India',
    suspectAccount: '1234567890',
    suspectIFSC: 'SBIN0001234',
    officerAssigned: 'SI Rajesh Kumar',
    status: 'Bank Action',
    cfcfrmsStatus: 'Synced',
    cctnsStatus: 'Linked',
    bankApiStatus: 'Connected',
    description: 'Victim received a call from someone claiming to be from SBI asking to verify an unauthorized transaction. The caller asked for OTP which the victim shared. Subsequently, ₹45,000 was debited from the account.',
    activities: [
      { date: '18 Mar 2024, 2:45 PM', title: 'Bank freeze request sent', description: 'Request sent to SBI to freeze suspect account', status: 'completed' },
      { date: '17 Mar 2024, 11:20 AM', title: 'FIR registered', description: 'FIR No. 245/2024 registered at Cyber Crime PS', status: 'completed' },
      { date: '16 Mar 2024, 4:15 PM', title: 'Case assigned to officer', description: 'Assigned to SI Rajesh Kumar for investigation', status: 'completed' },
      { date: '15 Mar 2024, 10:30 AM', title: 'Complaint registered', description: 'Initial complaint received via 1930 helpline', status: 'completed' }
    ]
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Cases</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Case Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-gray-900">{mockData.fraudType}</h1>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                {mockData.status}
              </span>
            </div>
            <p className="text-gray-900 font-mono mb-4">{mockData.id}</p>
            <p className="text-gray-700">{mockData.description}</p>
          </div>

          {/* Victim Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="mb-4 text-gray-900">Victim Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Name</p>
                <p className="text-gray-900">{mockData.victimName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Phone</p>
                <p className="text-gray-900">{mockData.victimPhone}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Email</p>
                <p className="text-gray-900">{mockData.victimEmail}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Address</p>
                <p className="text-gray-900">{mockData.victimAddress}</p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="mb-4 text-gray-900">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Amount</p>
                <p className="text-gray-900">{mockData.amount}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Transaction ID</p>
                <p className="text-gray-900 font-mono">{mockData.transactionId}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Date Reported</p>
                <p className="text-gray-900">{mockData.dateReported}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">FIR Number</p>
                <p className="text-gray-900">{mockData.firNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Bank Name</p>
                <p className="text-gray-900">{mockData.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Suspect Account</p>
                <p className="text-gray-900 font-mono">{mockData.suspectAccount}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">IFSC Code</p>
                <p className="text-gray-900 font-mono">{mockData.suspectIFSC}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Assigned Officer</p>
                <p className="text-gray-900">{mockData.officerAssigned}</p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="mb-6 text-gray-900">Activity Timeline</h3>
            <ActivityTimeline activities={mockData.activities} />
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="mb-4 text-gray-900">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <AlertCircle className="h-5 w-5" />
                <span>Send Bank Freeze Alert</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                <FileText className="h-5 w-5" />
                <span>Update FIR</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Send className="h-5 w-5" />
                <span>Request Recovery</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <XCircle className="h-5 w-5" />
                <span>Close Case</span>
              </button>
            </div>
          </div>

          {/* System Integration Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="mb-4 text-gray-900">Integration Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">CFCFRMS</span>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>{mockData.cfcfrmsStatus}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">CCTNS</span>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>{mockData.cctnsStatus}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Bank API</span>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>{mockData.bankApiStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="mb-4 text-gray-900">Add Note</h3>
            <textarea
              placeholder="Add investigation notes..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button className="w-full mt-3 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

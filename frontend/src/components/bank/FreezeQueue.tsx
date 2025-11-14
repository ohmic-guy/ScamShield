import { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

export function FreezeQueue() {
  const [requests, setRequests] = useState([
    {
      id: 'FR2024001',
      complaintId: 'CF2024001',
      accountNumber: '1234567890',
      accountHolder: 'Unknown',
      amount: '₹45,000',
      requestedBy: 'SI Rajesh Kumar',
      requestTime: '18 Mar 2024, 2:45 PM',
      priority: 'high',
      timeRemaining: '4h 15m',
      status: 'pending'
    },
    {
      id: 'FR2024002',
      complaintId: 'CF2024004',
      accountNumber: '9876543210',
      accountHolder: 'Unknown',
      amount: '₹2,50,000',
      requestedBy: 'Inspector Priya Patel',
      requestTime: '18 Mar 2024, 1:20 PM',
      priority: 'critical',
      timeRemaining: '3h 5m',
      status: 'pending'
    },
    {
      id: 'FR2024003',
      complaintId: 'CF2024007',
      accountNumber: '5555666677',
      accountHolder: 'Unknown',
      amount: '₹95,000',
      requestedBy: 'ASI Arun Mohanty',
      requestTime: '18 Mar 2024, 11:00 AM',
      priority: 'high',
      timeRemaining: '0h 50m',
      status: 'pending'
    },
    {
      id: 'FR2024004',
      complaintId: 'CF2024006',
      accountNumber: '1111222233',
      accountHolder: 'Unknown',
      amount: '₹18,000',
      requestedBy: 'SI Manoj Das',
      requestTime: '18 Mar 2024, 9:30 AM',
      priority: 'medium',
      timeRemaining: '6h 20m',
      status: 'pending'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'border-red-500 bg-red-50',
      high: 'border-orange-500 bg-orange-50',
      medium: 'border-yellow-500 bg-yellow-50',
      low: 'border-green-500 bg-green-50'
    };
    return colors[priority as keyof typeof colors];
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[priority as keyof typeof colors];
  };

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
  };

  const handleNeedInfo = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'info-needed' } : req
    ));
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Account Freeze Queue</h1>
        <p className="text-gray-600">Review and approve freeze requests from Odisha Police</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-6 w-6 text-orange-500" />
            <p className="text-gray-600">Pending Requests</p>
          </div>
          <p className="text-gray-900">{pendingRequests.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <p className="text-gray-600">Approved Today</p>
          </div>
          <p className="text-gray-900">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <p className="text-gray-600">Critical Priority</p>
          </div>
          <p className="text-gray-900">1</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-6 w-6 text-blue-500" />
            <p className="text-gray-600">Avg Response Time</p>
          </div>
          <p className="text-gray-900">1.8 hrs</p>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-6">Pending Requests</h2>
        <div className="grid grid-cols-1 gap-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor(request.priority)} p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{request.id}</h3>
                    <span className={`px-3 py-1 rounded-full ${getPriorityBadge(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600">Complaint ID: {request.complaintId}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg">
                  <Clock className="h-5 w-5" />
                  <span>{request.timeRemaining}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 mb-1">Suspect Account</p>
                  <p className="text-gray-900 font-mono">{request.accountNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Amount Involved</p>
                  <p className="text-gray-900">{request.amount}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Requested By</p>
                  <p className="text-gray-900">{request.requestedBy}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Request Time</p>
                  <p className="text-gray-900">{request.requestTime}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Approve Freeze</span>
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleNeedInfo(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Info className="h-5 w-5" />
                  <span>Need Info</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-6">Recently Processed</h2>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700">Request ID</th>
                  <th className="px-6 py-4 text-left text-gray-700">Account</th>
                  <th className="px-6 py-4 text-left text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-gray-700">Processed At</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {processedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-900">{request.id}</td>
                    <td className="px-6 py-4 font-mono text-gray-700">{request.accountNumber}</td>
                    <td className="px-6 py-4 text-gray-900">{request.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-700' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.status === 'approved' ? 'Approved' :
                         request.status === 'rejected' ? 'Rejected' :
                         'Info Needed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Just now</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

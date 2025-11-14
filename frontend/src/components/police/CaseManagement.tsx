import { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';

interface CaseManagementProps {
  onViewCase: (caseId: string) => void;
}

export function CaseManagement({ onViewCase }: CaseManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  const cases = [
    { id: 'CF2024001', name: 'Ramesh Patel', date: '15 Mar 2024', type: 'UPI Fraud', amount: '₹45,000', status: 'Bank Action', district: 'Bhubaneswar', bank: 'SBI' },
    { id: 'CF2024002', name: 'Priya Sharma', date: '10 Mar 2024', type: 'Shopping Scam', amount: '₹12,500', status: 'Refunded', district: 'Cuttack', bank: 'HDFC' },
    { id: 'CF2024003', name: 'Arun Mohanty', date: '18 Mar 2024', type: 'Phishing', amount: '₹78,000', status: 'In Process', district: 'Puri', bank: 'ICICI' },
    { id: 'CF2024004', name: 'Sneha Das', date: '12 Mar 2024', type: 'Investment Scam', amount: '₹2,50,000', status: 'Bank Action', district: 'Bhubaneswar', bank: 'Axis' },
    { id: 'CF2024005', name: 'Vikram Singh', date: '08 Mar 2024', type: 'OTP Fraud', amount: '₹35,000', status: 'Closed', district: 'Berhampur', bank: 'PNB' },
    { id: 'CF2024006', name: 'Anjali Nayak', date: '20 Mar 2024', type: 'Social Media', amount: '₹18,000', status: 'Pending', district: 'Sambalpur', bank: 'SBI' },
    { id: 'CF2024007', name: 'Manoj Kumar', date: '16 Mar 2024', type: 'Banking Fraud', amount: '₹95,000', status: 'In Process', district: 'Bhubaneswar', bank: 'HDFC' },
    { id: 'CF2024008', name: 'Sunita Mishra', date: '14 Mar 2024', type: 'UPI Fraud', amount: '₹28,500', status: 'Refunded', district: 'Cuttack', bank: 'ICICI' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-red-100 text-red-700',
      'In Process': 'bg-yellow-100 text-yellow-700',
      'Bank Action': 'bg-blue-100 text-blue-700',
      'Refunded': 'bg-green-100 text-green-700',
      'Closed': 'bg-gray-100 text-gray-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesDistrict = selectedDistrict === 'all' || c.district === selectedDistrict;
    return matchesSearch && matchesStatus && matchesDistrict;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Case Management</h1>
          <p className="text-gray-600">Manage and track all cyber fraud cases</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Process">In Process</option>
            <option value="Bank Action">Bank Action</option>
            <option value="Refunded">Refunded</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Districts</option>
            <option value="Bhubaneswar">Bhubaneswar</option>
            <option value="Cuttack">Cuttack</option>
            <option value="Puri">Puri</option>
            <option value="Berhampur">Berhampur</option>
            <option value="Sambalpur">Sambalpur</option>
          </select>

          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Case ID</th>
                <th className="px-6 py-4 text-left text-gray-700">Victim Name</th>
                <th className="px-6 py-4 text-left text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-gray-700">Fraud Type</th>
                <th className="px-6 py-4 text-left text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-gray-700">District</th>
                <th className="px-6 py-4 text-left text-gray-700">Bank</th>
                <th className="px-6 py-4 text-left text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCases.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-gray-900">{caseItem.id}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{caseItem.name}</td>
                  <td className="px-6 py-4 text-gray-600">{caseItem.date}</td>
                  <td className="px-6 py-4 text-gray-700">{caseItem.type}</td>
                  <td className="px-6 py-4 text-gray-900">{caseItem.amount}</td>
                  <td className="px-6 py-4 text-gray-700">{caseItem.district}</td>
                  <td className="px-6 py-4 text-gray-700">{caseItem.bank}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewCase(caseItem.id)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-gray-600">Showing {filteredCases.length} of {cases.length} cases</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

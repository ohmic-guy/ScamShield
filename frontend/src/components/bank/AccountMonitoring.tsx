import { useState } from 'react';
import { Search, Lock, Unlock, Eye, Download } from 'lucide-react';

export function AccountMonitoring() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const frozenAccounts = [
    {
      accountNumber: '1234567890',
      accountHolder: 'Suspicious Account #1',
      frozenDate: '18 Mar 2024',
      frozenAmount: '₹45,000',
      complaintId: 'CF2024001',
      status: 'Frozen',
      ifsc: 'SBIN0001234',
      branch: 'Bhubaneswar Main'
    },
    {
      accountNumber: '9876543210',
      accountHolder: 'Suspicious Account #2',
      frozenDate: '17 Mar 2024',
      frozenAmount: '₹2,50,000',
      complaintId: 'CF2024004',
      status: 'Frozen',
      ifsc: 'SBIN0001234',
      branch: 'Bhubaneswar Main'
    },
    {
      accountNumber: '5555666677',
      accountHolder: 'Suspicious Account #3',
      frozenDate: '16 Mar 2024',
      frozenAmount: '₹95,000',
      complaintId: 'CF2024007',
      status: 'Frozen',
      ifsc: 'SBIN0001234',
      branch: 'Cuttack'
    },
    {
      accountNumber: '3344556677',
      accountHolder: 'Refunded Account',
      frozenDate: '10 Mar 2024',
      frozenAmount: '₹12,500',
      complaintId: 'CF2024002',
      status: 'Refunded',
      ifsc: 'SBIN0005678',
      branch: 'Puri'
    }
  ];

  const transactions = [
    { date: '18 Mar 2024, 14:32', type: 'UPI Debit', amount: '₹45,000', to: 'Unknown', status: 'Blocked' },
    { date: '18 Mar 2024, 09:15', type: 'NEFT Credit', amount: '₹75,000', from: 'XYZ Corp', status: 'Completed' },
    { date: '17 Mar 2024, 16:20', type: 'UPI Debit', amount: '₹15,000', to: 'Unknown', status: 'Blocked' },
    { date: '17 Mar 2024, 11:45', type: 'ATM Withdrawal', amount: '₹10,000', location: 'Bhubaneswar', status: 'Blocked' },
    { date: '16 Mar 2024, 13:30', type: 'IMPS Credit', amount: '₹50,000', from: 'ABC Ltd', status: 'Completed' }
  ];

  const filteredAccounts = frozenAccounts.filter(acc =>
    acc.accountNumber.includes(searchQuery) ||
    acc.complaintId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Account Monitoring</h1>
        <p className="text-gray-600">Search and monitor frozen accounts</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by account number or complaint ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frozen Accounts List */}
        <div className="lg:col-span-1">
          <h2 className="text-gray-900 mb-4">Frozen Accounts ({filteredAccounts.length})</h2>
          <div className="space-y-3">
            {filteredAccounts.map((account) => (
              <div
                key={account.accountNumber}
                onClick={() => setSelectedAccount(account.accountNumber)}
                className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-all ${
                  selectedAccount === account.accountNumber
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-mono">{account.accountNumber}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    account.status === 'Frozen'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {account.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">{account.accountHolder}</p>
                <p className="text-gray-500">Amount: {account.frozenAmount}</p>
                <p className="text-gray-500">{account.complaintId}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2">
          {selectedAccount ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-gray-900">Account Details</h2>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      <Lock className="h-5 w-5" />
                      <span>Keep Frozen</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Unlock className="h-5 w-5" />
                      <span>Unfreeze</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {frozenAccounts
                    .filter(acc => acc.accountNumber === selectedAccount)
                    .map(account => (
                      <>
                        <div key={`${account.accountNumber}-1`}>
                          <p className="text-gray-600 mb-1">Account Number</p>
                          <p className="text-gray-900 font-mono">{account.accountNumber}</p>
                        </div>
                        <div key={`${account.accountNumber}-2`}>
                          <p className="text-gray-600 mb-1">IFSC Code</p>
                          <p className="text-gray-900 font-mono">{account.ifsc}</p>
                        </div>
                        <div key={`${account.accountNumber}-3`}>
                          <p className="text-gray-600 mb-1">Branch</p>
                          <p className="text-gray-900">{account.branch}</p>
                        </div>
                        <div key={`${account.accountNumber}-4`}>
                          <p className="text-gray-600 mb-1">Frozen Date</p>
                          <p className="text-gray-900">{account.frozenDate}</p>
                        </div>
                        <div key={`${account.accountNumber}-5`}>
                          <p className="text-gray-600 mb-1">Frozen Amount</p>
                          <p className="text-gray-900">{account.frozenAmount}</p>
                        </div>
                        <div key={`${account.accountNumber}-6`}>
                          <p className="text-gray-600 mb-1">Complaint ID</p>
                          <p className="text-gray-900 font-mono">{account.complaintId}</p>
                        </div>
                      </>
                    ))}
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">Transaction History</h3>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="h-5 w-5" />
                    <span>Export</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {transactions.map((txn, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        txn.status === 'Blocked'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900">{txn.type}</span>
                        <span className={`px-3 py-1 rounded-full ${
                          txn.status === 'Blocked'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-gray-600">
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p>{txn.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="text-gray-900">{txn.amount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">
                            {txn.to ? 'To' : txn.from ? 'From' : 'Location'}
                          </p>
                          <p>{txn.to || txn.from || (txn as any).location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-12 flex flex-col items-center justify-center text-center">
              <Eye className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-gray-900 mb-2">Select an Account</h3>
              <p className="text-gray-600">
                Choose an account from the list to view details and transaction history
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

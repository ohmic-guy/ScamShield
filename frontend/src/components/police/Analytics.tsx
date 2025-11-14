import { Download, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Analytics() {
  const casesOverTime = [
    { month: 'Oct', cases: 145 },
    { month: 'Nov', cases: 178 },
    { month: 'Dec', cases: 203 },
    { month: 'Jan', cases: 189 },
    { month: 'Feb', cases: 234 },
    { month: 'Mar', cases: 247 }
  ];

  const fraudTypes = [
    { name: 'UPI Fraud', value: 35 },
    { name: 'Phishing', value: 25 },
    { name: 'Investment Scam', value: 18 },
    { name: 'Shopping Scam', value: 12 },
    { name: 'Others', value: 10 }
  ];

  const recoveryByBank = [
    { bank: 'SBI', recovered: 12.4 },
    { bank: 'HDFC', recovered: 8.7 },
    { bank: 'ICICI', recovered: 6.2 },
    { bank: 'Axis', recovered: 5.1 },
    { bank: 'PNB', recovered: 3.8 }
  ];

  const resolutionFunnel = [
    { stage: 'Registered', count: 1000 },
    { stage: 'FIR Filed', count: 850 },
    { stage: 'Bank Notified', count: 720 },
    { stage: 'Frozen', count: 580 },
    { stage: 'Refunded', count: 420 }
  ];

  const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6'];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Statistical insights and trends</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">Last 6 Months</span>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases Over Time */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="mb-6 text-gray-900">Cases Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={casesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cases"
                stroke="#1e3a8a"
                strokeWidth={3}
                dot={{ fill: '#1e3a8a', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fraud Types Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="mb-6 text-gray-900">Fraud Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fraudTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {fraudTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recovery by Bank */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="mb-6 text-gray-900">Recovery by Bank (in Lakhs)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recoveryByBank}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bank" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="recovered" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Funnel */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="mb-6 text-gray-900">Resolution Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutionFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="stage" type="category" stroke="#6b7280" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-gray-600 mb-2">Total Cases (6 months)</p>
          <p className="text-gray-900">1,196</p>
          <p className="text-green-600 mt-2">↑ 18% from previous period</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-gray-600 mb-2">Recovery Rate</p>
          <p className="text-gray-900">42%</p>
          <p className="text-green-600 mt-2">↑ 5% improvement</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-gray-600 mb-2">Avg Resolution Time</p>
          <p className="text-gray-900">12.4 days</p>
          <p className="text-green-600 mt-2">↓ 2 days faster</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-gray-600 mb-2">Total Recovered</p>
          <p className="text-gray-900">₹36.2 L</p>
          <p className="text-green-600 mt-2">↑ 22% increase</p>
        </div>
      </div>
    </div>
  );
}

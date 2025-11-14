import { TrendingUp, Clock, DollarSign, AlertCircle, MapPin, Bell } from 'lucide-react';

interface PoliceHomeProps {
  onViewCase: (caseId: string) => void;
}

export function PoliceHome({ onViewCase }: PoliceHomeProps) {
  const kpis = [
    { label: 'Active Cases', value: '247', change: '+12', icon: AlertCircle, color: 'orange' },
    { label: 'Resolved Today', value: '18', change: '+5', icon: TrendingUp, color: 'green' },
    { label: 'Amount Frozen', value: '₹12.4L', change: '+2.1L', icon: DollarSign, color: 'blue' },
    { label: 'Pending Actions', value: '42', change: '-8', icon: Clock, color: 'purple' }
  ];

  const districtData = [
    { district: 'Bhubaneswar', cases: 89, color: 'bg-red-500' },
    { district: 'Cuttack', cases: 67, color: 'bg-orange-500' },
    { district: 'Puri', cases: 45, color: 'bg-yellow-500' },
    { district: 'Berhampur', cases: 34, color: 'bg-green-500' },
    { district: 'Sambalpur', cases: 12, color: 'bg-blue-500' }
  ];

  const recentAlerts = [
    { id: 'CF2024156', time: '5 min ago', type: 'UPI Fraud', amount: '₹85,000', priority: 'high' },
    { id: 'CF2024157', time: '12 min ago', type: 'Phishing', amount: '₹42,000', priority: 'medium' },
    { id: 'CF2024158', time: '18 min ago', type: 'Investment Scam', amount: '₹2,50,000', priority: 'high' },
    { id: 'CF2024159', time: '25 min ago', type: 'Online Shopping', amount: '₹15,000', priority: 'low' },
    { id: 'CF2024160', time: '32 min ago', type: 'Banking Fraud', amount: '₹1,20,000', priority: 'high' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      orange: 'from-orange-400 to-orange-600',
      green: 'from-green-400 to-green-600',
      blue: 'from-blue-400 to-blue-600',
      purple: 'from-purple-400 to-purple-600'
    };
    return colors[color as keyof typeof colors];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Real-time case monitoring and statistics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorClasses(kpi.color)}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full ${kpi.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-gray-600 mb-1">{kpi.label}</p>
              <p className="text-gray-900">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Heatmap */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-blue-900" />
            <h3 className="text-gray-900">Case Distribution by District</h3>
          </div>
          <div className="space-y-4">
            {districtData.map((district, index) => {
              const maxCases = Math.max(...districtData.map(d => d.cases));
              const percentage = (district.cases / maxCases) * 100;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">{district.district}</span>
                    <span className="text-gray-900">{district.cases} cases</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${district.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Alerts */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-orange-500" />
            <h3 className="text-gray-900">Live Alerts (1930)</h3>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div
                key={index}
                onClick={() => onViewCase(alert.id)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-mono">{alert.id}</span>
                  <span className={`px-2 py-1 rounded-full border text-xs ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>{alert.type}</span>
                  <span>{alert.amount}</span>
                </div>
                <p className="text-gray-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft, Video, FileText, AlertTriangle, Shield, BookOpen } from 'lucide-react';

interface ResourcesPageProps {
  onBack: () => void;
}

export function ResourcesPage({ onBack }: ResourcesPageProps) {
  const videos = [
    { title: 'How to Identify UPI Fraud', duration: '5:23', thumbnail: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { title: 'Protecting Your Bank Account', duration: '7:15', thumbnail: 'bg-gradient-to-br from-green-400 to-green-600' },
    { title: 'What to Do After Being Scammed', duration: '6:42', thumbnail: 'bg-gradient-to-br from-orange-400 to-orange-600' },
    { title: 'Social Media Safety Tips', duration: '4:58', thumbnail: 'bg-gradient-to-br from-purple-400 to-purple-600' }
  ];

  const guides = [
    { title: 'Complete Guide to Cyber Safety', size: '2.4 MB', icon: Shield },
    { title: 'How to File a Cyber Crime Complaint', size: '1.8 MB', icon: FileText },
    { title: 'Understanding Different Types of Fraud', size: '3.1 MB', icon: BookOpen },
    { title: 'Emergency Response Checklist', size: '850 KB', icon: AlertTriangle }
  ];

  const alerts = [
    {
      title: 'New WhatsApp Scam Alert',
      date: '15 Mar 2024',
      severity: 'high',
      description: 'Scammers impersonating family members asking for urgent money transfers'
    },
    {
      title: 'Fake Bank Website Warning',
      date: '12 Mar 2024',
      severity: 'critical',
      description: 'Multiple fake banking websites detected. Always verify URLs before login'
    },
    {
      title: 'Investment Fraud on Social Media',
      date: '08 Mar 2024',
      severity: 'medium',
      description: 'Be cautious of guaranteed return schemes advertised on social platforms'
    }
  ];

  const tips = [
    'Never share your OTP, PIN, CVV, or passwords with anyone',
    'Always verify payment details before making transactions',
    'Report suspicious calls/messages to 1930 immediately',
    'Use strong, unique passwords for different accounts',
    'Enable two-factor authentication wherever possible',
    'Be cautious of too-good-to-be-true offers',
    'Verify website URLs before entering sensitive information',
    'Keep your devices and apps updated with latest security patches'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-900">Cyber Safety Resources</h1>
              <p className="text-gray-600">Educational materials and fraud alerts</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Educational Videos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Video className="h-6 w-6 text-blue-900" />
            <h2 className="text-gray-900">Educational Videos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className={`${video.thumbnail} h-40 flex items-center justify-center`}>
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-gray-900 mb-2">{video.title}</h4>
                  <p className="text-gray-600">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Downloadable Guides */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-blue-900" />
            <h2 className="text-gray-900">Downloadable Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-900" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{guide.title}</h4>
                      <p className="text-gray-600">PDF • {guide.size}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fraud Alerts */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <h2 className="text-gray-900">Recent Fraud Alerts</h2>
            </div>
            <div className="space-y-4">
              {alerts.map((alert, index) => {
                const severityColors = {
                  critical: 'border-l-red-500 bg-red-50',
                  high: 'border-l-orange-500 bg-orange-50',
                  medium: 'border-l-yellow-500 bg-yellow-50'
                };
                return (
                  <div key={index} className={`bg-white rounded-xl shadow-sm border-l-4 ${severityColors[alert.severity as keyof typeof severityColors]} p-6`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gray-900">{alert.title}</h4>
                      <span className="px-3 py-1 bg-white rounded-full text-gray-600 border border-gray-200">
                        {alert.date}
                      </span>
                    </div>
                    <p className="text-gray-700">{alert.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Prevention Tips */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-gray-900">Prevention Tips</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-green-100 rounded-full flex-shrink-0">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

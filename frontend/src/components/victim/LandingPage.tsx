import { useState } from 'react';
import { Search, Phone, Shield, TrendingUp, Clock, Users, ChevronLeft, ChevronRight, Globe } from 'lucide-react';

interface LandingPageProps {
  onTrackCase: (id: string) => void;
  onViewResources: () => void;
}

export function LandingPage({ onTrackCase, onViewResources }: LandingPageProps) {
  const [searchId, setSearchId] = useState('');
  const [currentTip, setCurrentTip] = useState(0);
  const [language, setLanguage] = useState<'en' | 'od' | 'hi'>('en');

  const safetyTips = [
    {
      title: "Never Share OTP",
      description: "Bank officials will never ask for your OTP, PIN, or CVV over phone or email."
    },
    {
      title: "Verify Before Payment",
      description: "Always verify UPI IDs and account numbers before making any transaction."
    },
    {
      title: "Report Immediately",
      description: "Call 1930 within 24 hours of fraud for better chances of fund recovery."
    },
    {
      title: "Check Website URLs",
      description: "Ensure you're on legitimate websites. Look for HTTPS and correct domain names."
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      onTrackCase(searchId.trim());
    }
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % safetyTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + safetyTips.length) % safetyTips.length);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="h-12 w-12" />
              <div>
                <h1 className="font-bold">Odisha Police</h1>
                <p className="text-blue-200">Cyber Fraud Support System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    const langs: ('en' | 'od' | 'hi')[] = ['en', 'od', 'hi'];
                    const currentIndex = langs.indexOf(language);
                    setLanguage(langs[(currentIndex + 1) % langs.length]);
                  }}
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === 'en' ? 'English' : language === 'od' ? 'ଓଡ଼ିଆ' : 'हिंदी'}</span>
                </button>
              </div>
              <a
                href="tel:1930"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Call 1930</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-6">Track Your Cyber Fraud Case</h2>
            <p className="text-blue-100 mb-8">
              Get real-time updates on your complaint status and fund recovery progress
            </p>
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Enter your Complaint ID (e.g., CF2024001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full px-6 py-4 pr-14 rounded-xl text-gray-900 shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </form>
            <p className="mt-4 text-blue-200">
              Don't have a complaint ID?{' '}
              <button className="underline hover:text-white transition-colors">
                Register New Complaint
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-green-600 mb-1">Cases Resolved</p>
                  <p className="text-green-900">12,847</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-blue-600 mb-1">Amount Recovered</p>
                  <p className="text-blue-900">₹45.2 Cr</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-orange-600 mb-1">Avg Response Time</p>
                  <p className="text-orange-900">2.4 hrs</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-purple-600 mb-1">Active Cases</p>
                  <p className="text-purple-900">3,421</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center mb-8 text-gray-900">Cyber Safety Tips</h3>
          <div className="max-w-3xl mx-auto relative">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                  <Shield className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-2">{safetyTips[currentTip].title}</h4>
                  <p className="text-gray-600">{safetyTips[currentTip].description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2">
                  {safetyTips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTip(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentTip ? 'w-8 bg-orange-500' : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevTip}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextTip}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={onViewResources}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              View All Resources
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Register Complaint</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Case</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Contact</h4>
              <ul className="space-y-2 text-blue-200">
                <li>National Helpline: 1930</li>
                <li>Email: cybercrime@odishapolice.gov.in</li>
                <li>Website: www.odishapolice.gov.in</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Important Links</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">CFCFRMS Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">NCRP</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CCTNS</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-800 text-center text-blue-200">
            <p>&copy; 2024 Odisha Police. All rights reserved. | Cyber Crime Investigation Cell</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

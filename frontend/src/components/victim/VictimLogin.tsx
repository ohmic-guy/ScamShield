import { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';

interface VictimLoginProps {
  onLogin: () => void;
  isDarkMode: boolean;
}

export function VictimLogin({ onLogin, isDarkMode }: VictimLoginProps) {
  const [loginMethod, setLoginMethod] = useState<'complaint' | 'email'>('complaint');
  const [complaintId, setComplaintId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, verify credentials here
    onLogin();
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-16 w-16" />
            <div>
              <h1 className="text-white">Odisha Police</h1>
              <p className="text-blue-200">Cyber Fraud Support System</p>
            </div>
          </div>
          <div className="space-y-6 mt-12">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-800 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white mb-2">Secure Platform</h3>
                <p className="text-blue-200">Your case information is protected with bank-level security</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-800 rounded-lg">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white mb-2">24/7 Support</h3>
                <p className="text-blue-200">Call 1930 anytime for emergency assistance</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-700 pt-6">
          <p className="text-blue-200">
            © 2024 Odisha Police. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Victim Portal Login
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Access your case dashboard
            </p>
          </div>

          {/* Login Method Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMethod('complaint')}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                loginMethod === 'complaint'
                  ? 'bg-blue-900 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Complaint ID
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                loginMethod === 'email'
                  ? 'bg-blue-900 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Email/Password
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginMethod === 'complaint' ? (
              <div>
                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Complaint ID
                </label>
                <input
                  type="text"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  placeholder="e.g., CF2024001"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enter the Complaint ID you received after filing your case
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Login to Dashboard
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <a href="#" className={`block hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Forgot Complaint ID?
            </a>
            <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Don't have a case yet?{' '}
                <a href="#" className={`hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  File a Complaint
                </a>
              </p>
            </div>
            <div className={`pt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Emergency? Call <a href="tel:1930" className="text-orange-500 hover:underline">1930</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

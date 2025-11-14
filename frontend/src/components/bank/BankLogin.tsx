import React, { useState } from 'react';
import { Building2, User, Lock, Eye, EyeOff } from 'lucide-react';

interface BankLoginProps {
  onLogin: () => void;
  isDarkMode: boolean;
}

export function BankLogin({ onLogin, isDarkMode }: BankLoginProps) {
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: any) => {
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
            <Building2 className="h-16 w-16" />
            <div>
              <h1 className="text-white">State Bank of India</h1>
              <p className="text-blue-200">Cyber Fraud Prevention Unit</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-800/50 rounded-xl border border-blue-700">
            <h3 className="text-white mb-4">Bank Officer Portal Access</h3>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                Account freeze management
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                Fraud transaction monitoring
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                Police coordination tools
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                Real-time alerts dashboard
              </li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
            <p className="text-orange-200">
              <strong>Security Notice:</strong> This portal is restricted to authorized bank officers only. All access is logged and monitored.
            </p>
          </div>
        </div>

        <div className="border-t border-blue-700 pt-6">
          <p className="text-blue-200">
            State Bank of India Cyber Fraud Prevention Unit
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-blue-100'
            }`}>
              <Building2 className="h-8 w-8 text-blue-900" />
            </div>
            <h2 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Bank Officer Login
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Secure access to fraud management system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Officer ID
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e: any) => setOfficerId(e.target.value)}
                  placeholder="e.g., B12345"
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
                  onChange={(e: any) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Remember me
                </span>
              </label>
              <a href="#" className={`hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Demo Credentials:
            </p>
            <p className={`font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Officer ID: B12345<br />
              Password: demo123
            </p>
          </div>

          <div className={`mt-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Need access? Contact your system administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

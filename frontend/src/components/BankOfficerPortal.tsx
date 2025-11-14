import { useState } from 'react';
import { FreezeQueue } from './bank/FreezeQueue';
import { AccountMonitoring } from './bank/AccountMonitoring';
import { Building2, Shield, AlertCircle, Search, LogOut } from 'lucide-react';

type View = 'freeze' | 'monitoring';

interface BankOfficerPortalProps {
  onLogout: () => void;
  isDarkMode: boolean;
}

export function BankOfficerPortal({ onLogout, isDarkMode }: BankOfficerPortalProps) {
  const [currentView, setCurrentView] = useState<View>('freeze');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`w-64 text-white flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-blue-900'}`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-blue-800'}`}>
          <div className="flex items-center gap-3">
            <Building2 className="h-10 w-10" />
            <div>
              <h2 className="text-white">Bank Portal</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-blue-200'}>State Bank of India</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setCurrentView('freeze')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'freeze' 
                ? isDarkMode ? 'bg-gray-700' : 'bg-blue-800'
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-800'
            }`}
          >
            <AlertCircle className="h-5 w-5" />
            <span>Freeze Queue</span>
          </button>
          <button
            onClick={() => setCurrentView('monitoring')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'monitoring' 
                ? isDarkMode ? 'bg-gray-700' : 'bg-blue-800'
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-800'
            }`}
          >
            <Search className="h-5 w-5" />
            <span>Account Monitoring</span>
          </button>
        </nav>

        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-blue-800'}`}>
          <div className={`flex items-center gap-3 p-3 rounded-lg mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-800'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-blue-700'}`}>
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p>Fraud Officer</p>
              <p className={isDarkMode ? 'text-gray-400' : 'text-blue-200'}>SBI Cyber Cell</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-800 hover:bg-blue-700'
            }`}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {currentView === 'freeze' && <FreezeQueue isDarkMode={isDarkMode} />}
        {currentView === 'monitoring' && <AccountMonitoring isDarkMode={isDarkMode} />}
      </main>
    </div>
  );
}
// App.tsx - COMPLETE REPLACEMENT
import { useState } from 'react';
import { VictimPortal } from './components/VictimPortal';
import { PoliceDashboard } from './components/PoliceDashboard';
import { BankOfficerPortal } from './components/BankOfficerPortal';
import { VictimLogin } from './components/victim/VictimLogin';
import { PoliceLogin } from './components/police/PoliceLogin';
import { BankLogin } from './components/bank/BankLogin';
import { ChatbotWidget } from './components/shared/ChatbotWidget';

type PortalType = 'victim' | 'police' | 'bank';
type ViewType = 'landing' | 'login' | 'portal';

export default function App() {
  const [activePortal, setActivePortal] = useState<PortalType>('victim');
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [isVictimLoggedIn, setIsVictimLoggedIn] = useState(false);
  const [isPoliceLoggedIn, setIsPoliceLoggedIn] = useState(false);
  const [isBankLoggedIn, setIsBankLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handlePortalSelect = (portal: PortalType) => {
    setActivePortal(portal);
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    if (activePortal === 'victim') setIsVictimLoggedIn(true);
    if (activePortal === 'police') setIsPoliceLoggedIn(true);
    if (activePortal === 'bank') setIsBankLoggedIn(true);
    setCurrentView('portal');
  };

  const handleLogout = () => {
    if (activePortal === 'victim') setIsVictimLoggedIn(false);
    if (activePortal === 'police') setIsPoliceLoggedIn(false);
    if (activePortal === 'bank') setIsBankLoggedIn(false);
    setCurrentView('landing');
  };

  // LANDING PAGE (NEW)
  if (currentView === 'landing') {
    return (
      // Changed 'bg-gray-100' to 'bg-white' for a pure white background
      <div className="min-h-screen bg-white"> 

        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 fade-in">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 max-w-3xl">
            {/* Using deep purple for headline */}
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-purple-900">
              Cyber Fraud Support System
            </h1>
            <p className="text-lg sm:text-xl text-purple-700">
              Report, investigate, and resolve cyber fraud incidents across multiple agencies
            </p>
          </div>

          {/* Portal Selection Cards - perfectly centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl">
            {/* Victim Portal Card */}
            <button
              onClick={() => handlePortalSelect('victim')}
              // Card background is white, hover border is purple
              className="group p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white border border-gray-200 hover:border-purple-500"
            >
              <div className="flex flex-col items-center text-center">
                {/* Purple icon background and icon color */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-purple-100">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Victim Portal</h2>
                <p className="text-sm text-gray-600">
                  Report cyber fraud incidents, upload evidence, and track your case status
                </p>
              </div>
            </button>

            {/* Police Dashboard Card */}
            <button
              onClick={() => handlePortalSelect('police')}
              // Card background is white, hover border is purple
              className="group p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white border border-gray-200 hover:border-purple-500"
            >
              <div className="flex flex-col items-center text-center">
                {/* Purple icon background and icon color */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-purple-100">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Police Dashboard</h2>
                <p className="text-sm text-gray-600">
                  Manage investigations, coordinate with banks, and track case progress
                </p>
              </div>
            </button>

            {/* Bank Portal Card */}
            <button
              onClick={() => handlePortalSelect('bank')}
              // Card background is white, hover border is purple
              className="group p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white border border-gray-200 hover:border-purple-500"
            >
              <div className="flex flex-col items-center text-center">
                {/* Purple icon background and icon color */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-purple-100">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Bank Portal</h2>
                <p className="text-sm text-gray-600">
                  Process fraud reports, freeze accounts, and collaborate with law enforcement
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN PAGE
  if (currentView === 'login') {
    return (
      // Login page still uses a very light gray (bg-gray-50) which is close to white
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-between items-center p-4 sm:p-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            ← Back to Home
          </button>
        </div>
        <div className="flex items-center justify-center p-4 sm:p-8">
          {activePortal === 'victim' && <VictimLogin onLogin={handleLoginSuccess} isDarkMode={isDarkMode} />}
          {activePortal === 'police' && <PoliceLogin onLogin={handleLoginSuccess} isDarkMode={isDarkMode} />}
          {activePortal === 'bank' && <BankLogin onLogin={handleLoginSuccess} isDarkMode={isDarkMode} />}
        </div>
      </div>
    );
  }

  // PORTAL PAGE (MAIN APP)
  return (
    // Portal content still uses a very light gray (bg-gray-50) which is close to white
    <div className="min-h-screen bg-gray-50">
      {/* NEW: Clean header with back button - NO OVERLAP */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center p-4 sm:p-6 max-w-7xl mx-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Portal Content - NO LONGER OVERLAPPED */}
      <div className="p-4 sm:p-6 lg:p-8">
        {activePortal === 'victim' && <VictimPortal onLogout={handleLogout} isDarkMode={isDarkMode} />}
        {activePortal === 'police' && <PoliceDashboard onLogout={handleLogout} isDarkMode={isDarkMode} />}
        {activePortal === 'bank' && <BankOfficerPortal onLogout={handleLogout} isDarkMode={isDarkMode} />}
      </div>

      <ChatbotWidget isDarkMode={isDarkMode} />
    </div>
  );
}
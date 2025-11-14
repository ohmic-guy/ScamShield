import { useState } from 'react';
import { PoliceHome } from './police/PoliceHome';
import { CaseManagement } from './police/CaseManagement';
import { CaseDetailView } from './police/CaseDetailView';
import { Analytics } from './police/Analytics';
import { LayoutDashboard, FolderOpen, BarChart3, Shield, LogOut } from 'lucide-react';

type View = 'home' | 'cases' | 'analytics' | 'detail';

interface PoliceDashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
}

export function PoliceDashboard({ onLogout, isDarkMode }: PoliceDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView('detail');
  };

  const handleBackToCases = () => {
    setCurrentView('cases');
    setSelectedCaseId(null);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`w-64 text-white flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-blue-900'}`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-blue-800'}`}>
          <div className="flex items-center gap-3">
            <Shield className="h-10 w-10" />
            <div>
              <h2 className="text-white">Odisha Police</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-blue-200'}>Cyber Crime Cell</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'home' 
                ? isDarkMode ? 'bg-gray-700' : 'bg-blue-800' 
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-800'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('cases')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'cases' || currentView === 'detail' 
                ? isDarkMode ? 'bg-gray-700' : 'bg-blue-800'
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-800'
            }`}
          >
            <FolderOpen className="h-5 w-5" />
            <span>Case Management</span>
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'analytics' 
                ? isDarkMode ? 'bg-gray-700' : 'bg-blue-800'
                : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-800'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Analytics</span>
          </button>
        </nav>

        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-blue-800'}`}>
          <div className={`flex items-center gap-3 p-3 rounded-lg mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-800'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-blue-700'}`}>
              <span>SI</span>
            </div>
            <div>
              <p>SI Rajesh Kumar</p>
              <p className={isDarkMode ? 'text-gray-400' : 'text-blue-200'}>Officer ID: P12345</p>
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
        {currentView === 'home' && <PoliceHome onViewCase={handleViewCase} isDarkMode={isDarkMode} />}
        {currentView === 'cases' && <CaseManagement onViewCase={handleViewCase} isDarkMode={isDarkMode} />}
        {currentView === 'analytics' && <Analytics isDarkMode={isDarkMode} />}
        {currentView === 'detail' && selectedCaseId && (
          <CaseDetailView caseId={selectedCaseId} onBack={handleBackToCases} isDarkMode={isDarkMode} />
        )}
      </main>
    </div>
  );
}
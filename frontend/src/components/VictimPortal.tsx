import { useState } from 'react';
import { LandingPage } from './victim/LandingPage';
import { CaseDashboard } from './victim/CaseDashboard';
import { ResourcesPage } from './victim/ResourcesPage';

interface VictimPortalProps {
  onLogout: () => void;
  isDarkMode: boolean;
}

export function VictimPortal({ onLogout, isDarkMode }: VictimPortalProps) {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'resources'>('dashboard');
  const [complaintId, setComplaintId] = useState('CF2024001');

  const handleTrackCase = (id: string) => {
    setComplaintId(id);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setComplaintId('');
    onLogout();
  };

  return (
    <div>
      {currentView === 'landing' && (
        <LandingPage 
          onTrackCase={handleTrackCase}
          onViewResources={() => setCurrentView('resources')}
          isDarkMode={isDarkMode}
        />
      )}
      {currentView === 'dashboard' && (
        <CaseDashboard 
          complaintId={complaintId}
          onLogout={handleLogout}
          onViewResources={() => setCurrentView('resources')}
          isDarkMode={isDarkMode}
        />
      )}
      {currentView === 'resources' && (
        <ResourcesPage 
          onBack={() => setCurrentView(currentView === 'dashboard' ? 'dashboard' : 'landing')}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
/**
 * API Context Provider
 * Provides centralized API state and functions across the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, useComplaints, useAlerts, useAnalytics } from '@/services';

interface APIContextType {
  auth: ReturnType<typeof useAuth>;
  complaints: ReturnType<typeof useComplaints>;
  alerts: ReturnType<typeof useAlerts>;
  analytics: ReturnType<typeof useAnalytics>;
}

const APIContext = createContext<APIContextType | undefined>(undefined);

export const APIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const complaints = useComplaints();
  const alerts = useAlerts();
  const analytics = useAnalytics();

  return (
    <APIContext.Provider
      value={{
        auth,
        complaints,
        alerts,
        analytics,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within APIProvider');
  }
  return context;
};

export default APIContext;

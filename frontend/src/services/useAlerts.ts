/**
 * Alerts Service Hooks
 * React hooks for alert triggering operations
 */

import { useState, useCallback } from 'react';
import { apiClient } from './apiClient';

export interface AlertStatus {
  alert_type: string;
  status: boolean;
  message: string;
}

export interface TriggerAlertsResponse {
  complaint_id: string;
  alerts: AlertStatus[];
  summary: {
    total_alerts: number;
    successful: number;
    failed: number;
  };
}

export interface SingleAlertResponse {
  complaint_id: string;
  alert_type: string;
  status: 'sent' | 'failed';
  message: string;
  bank?: string;
  account?: string;
}

export interface ComplaintAlertStatus {
  complaint_id: string;
  is_funds_frozen: boolean;
  is_priority: boolean;
  fir_registered: boolean;
  status: string;
}

export const useAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerAllAlerts = useCallback(async (complaintId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<TriggerAlertsResponse>('/api/alerts/trigger', {
        complaint_id: complaintId,
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to trigger alerts';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendGoldenHourAlert = useCallback(async (complaintId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<SingleAlertResponse>(
        '/api/alerts/golden-hour',
        {
          complaint_id: complaintId,
        }
      );
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send golden hour alert';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendBankFreezeAlert = useCallback(async (complaintId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<SingleAlertResponse>(
        '/api/alerts/bank-freeze',
        {
          complaint_id: complaintId,
        }
      );
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send bank freeze alert';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAlertStatus = useCallback(async (complaintId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ComplaintAlertStatus>(
        `/api/alerts/${complaintId}/status`
      );
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch alert status';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    triggerAllAlerts,
    sendGoldenHourAlert,
    sendBankFreezeAlert,
    getAlertStatus,
  };
};

export default useAlerts;

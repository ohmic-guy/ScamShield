/**
 * Analytics Service Hooks
 * React hooks for analytics and reporting operations
 */

import { useState, useCallback } from 'react';
import { apiClient } from './apiClient';

export interface AnalyticsSummary {
  total_cases: number;
  total_lost: number;
  total_recovered: number;
  resolved: number;
  pending: number;
  recovery_rate: string;
  period: {
    start_date: string;
    end_date: string;
    district: string;
  };
}

export interface CaseByStatus {
  total: number;
  limit: number;
  offset: number;
  status: string;
  cases: Array<{
    complaint_id: string;
    fraud_type: string;
    amount_lost: number;
    amount_recovered: number;
    created_at: string;
    is_priority: boolean;
  }>;
}

export interface FraudTypeStats {
  fraud_type: string;
  count: number;
  total_amount: number;
  average_amount: number;
}

export interface FraudTypeAnalytics {
  period: {
    start_date: string;
    end_date: string;
  };
  fraud_types: FraudTypeStats[];
}

export interface DistrictStats {
  district: string;
  cases: number;
  total_lost: number;
  total_recovered: number;
  recovery_rate: string;
}

export interface DistrictAnalytics {
  period: {
    start_date: string;
    end_date: string;
  };
  districts: DistrictStats[];
}

export interface PriorityCaseItem {
  complaint_id: string;
  fraud_type: string;
  amount_lost: number;
  accused_account: string | null;
  accused_bank: string;
  created_at: string;
}

export interface PriorityCasesResponse {
  total: number;
  limit: number;
  offset: number;
  priority_cases: PriorityCaseItem[];
}

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAnalyticsSummary = useCallback(
    async (params?: {
      startDate?: string;
      endDate?: string;
      district?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (params?.startDate) queryParams.append('start_date', params.startDate);
        if (params?.endDate) queryParams.append('end_date', params.endDate);
        if (params?.district) queryParams.append('district', params.district);

        const endpoint = `/api/analytics/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get<AnalyticsSummary>(endpoint);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch analytics summary';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getCasesByStatus = useCallback(
    async (status: string, limit = 50, offset = 0) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          status,
          limit: limit.toString(),
          offset: offset.toString(),
        });

        const response = await apiClient.get<CaseByStatus>(
          `/api/analytics/by-status?${queryParams.toString()}`
        );
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch cases by status';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getFraudTypeStats = useCallback(
    async (startDate?: string, endDate?: string) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('start_date', startDate);
        if (endDate) queryParams.append('end_date', endDate);

        const endpoint = `/api/analytics/fraud-types${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get<FraudTypeAnalytics>(endpoint);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch fraud type stats';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getDistrictStats = useCallback(
    async (startDate?: string, endDate?: string) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('start_date', startDate);
        if (endDate) queryParams.append('end_date', endDate);

        const endpoint = `/api/analytics/by-district${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get<DistrictAnalytics>(endpoint);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch district stats';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getPriorityCases = useCallback(
    async (limit = 50, offset = 0) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });

        const response = await apiClient.get<PriorityCasesResponse>(
          `/api/analytics/priority-cases?${queryParams.toString()}`
        );
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch priority cases';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getAnalyticsSummary,
    getCasesByStatus,
    getFraudTypeStats,
    getDistrictStats,
    getPriorityCases,
  };
};

export default useAnalytics;

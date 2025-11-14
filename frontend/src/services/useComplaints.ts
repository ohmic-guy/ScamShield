/**
 * Complaints Service Hooks
 * React hooks for complaint management operations
 */

import { useState, useCallback } from 'react';
import { apiClient } from './apiClient';

export interface Complaint {
  id: number;
  complaint_id: string;
  victim_phone: string;
  fraud_type: string;
  amount_lost: number;
  status: string;
  created_at: string;
  is_priority: boolean;
  is_funds_frozen: boolean;
}

export interface ComplaintCreateData {
  victim_phone: string;
  victim_name: string;
  fraud_type: string;
  amount_lost: number;
  accused_account?: string;
  accused_bank?: string;
  transaction_id?: string;
  transaction_date?: string;
  district: string;
  description: string;
}

export interface ComplaintUpdateData {
  status?: string;
  fir_number?: string;
  amount_recovered?: number;
}

export interface ComplaintListResponse {
  total: number;
  limit: number;
  offset: number;
  complaints: Complaint[];
}

export interface ActivityLog {
  id: number;
  action_type: string;
  description: string;
  remarks: string;
  created_at: string;
  created_by: string;
}

export interface ActivityListResponse {
  complaint_id: string;
  activities: ActivityLog[];
}

export const useComplaints = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComplaint = useCallback(async (data: ComplaintCreateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<Complaint>('/api/complaints', data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create complaint';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getComplaint = useCallback(async (complaintId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Complaint>(`/api/complaints/${complaintId}`);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch complaint';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const listComplaints = useCallback(
    async (params?: {
      status?: string;
      district?: string;
      limit?: number;
      offset?: number;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.district) queryParams.append('district', params.district);
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.offset) queryParams.append('offset', params.offset.toString());

        const endpoint = `/api/complaints${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiClient.get<ComplaintListResponse>(endpoint);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch complaints';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateComplaint = useCallback(
    async (complaintId: string, data: ComplaintUpdateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.patch<Complaint>(
          `/api/complaints/${complaintId}`,
          data
        );
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update complaint';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getComplaintActivity = useCallback(async (complaintId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ActivityListResponse>(
        `/api/complaints/${complaintId}/activity`
      );
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch activity log';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createComplaint,
    getComplaint,
    listComplaints,
    updateComplaint,
    getComplaintActivity,
  };
};

export default useComplaints;

/**
 * Auth Service Hooks
 * React hooks for authentication operations
 */

import { useState, useCallback } from 'react';
import { apiClient } from './apiClient';

export interface User {
  id: number;
  phone_number: string;
  role: 'victim' | 'police' | 'bank';
  full_name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
  role: string;
}

export interface OTPResponse {
  message: string;
  expires_in: number;
  phone: string;
}

export interface VerifyOTPResponse {
  access_token: string;
  token_type: string;
  complaint_id: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (phoneNumber: string, password: string, role: 'victim' | 'police' | 'bank') => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post<LoginResponse>('/api/auth/login', {
          phone_number: phoneNumber,
          password,
          role,
        });
        
        apiClient.setToken(response.access_token);
        setUser(response.user);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const requestOTP = useCallback(async (phoneNumber: string, complaintId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<OTPResponse>('/api/auth/request-otp', {
        phone_number: phoneNumber,
        complaint_id: complaintId,
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request OTP';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(
    async (phoneNumber: string, complaintId: string, otpCode: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post<VerifyOTPResponse>('/api/auth/verify-otp', {
          phone_number: phoneNumber,
          complaint_id: complaintId,
          otp_code: otpCode,
        });
        
        apiClient.setToken(response.access_token);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'OTP verification failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      apiClient.clearToken();
      setUser(null);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<User>('/api/auth/me');
      setUser(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    requestOTP,
    verifyOTP,
    logout,
    getCurrentUser,
  };
};

export default useAuth;

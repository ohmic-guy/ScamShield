/**
 * Services Index
 * Centralized export of all service hooks
 */

export { useAuth } from './useAuth';
export type { User, LoginResponse, OTPResponse, VerifyOTPResponse } from './useAuth';

export { useComplaints } from './useComplaints';
export type {
  Complaint,
  ComplaintCreateData,
  ComplaintUpdateData,
  ComplaintListResponse,
  ActivityLog,
  ActivityListResponse,
} from './useComplaints';

export { useAlerts } from './useAlerts';
export type {
  AlertStatus,
  TriggerAlertsResponse,
  SingleAlertResponse,
  ComplaintAlertStatus,
} from './useAlerts';

export { useAnalytics } from './useAnalytics';
export type {
  AnalyticsSummary,
  CaseByStatus,
  FraudTypeStats,
  FraudTypeAnalytics,
  DistrictStats,
  DistrictAnalytics,
  PriorityCaseItem,
  PriorityCasesResponse,
} from './useAnalytics';

export { apiClient } from './apiClient';

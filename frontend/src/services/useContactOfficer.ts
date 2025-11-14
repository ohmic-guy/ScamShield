import { apiClient } from './apiClient';

export interface ContactRequest {
  complaint_id: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  contact_method: 'email' | 'phone' | 'sms';
}

export interface ContactResponse {
  success: boolean;
  message: string;
  ticket_id?: string;
  officer_contact?: string;
}

export const useContactOfficer = () => {
  const sendContactRequest = async (data: ContactRequest): Promise<ContactResponse> => {
    try {
      const response = await apiClient.post<ContactResponse>('/api/complaints/contact-officer', data);
      return response;
    } catch (error) {
      console.error('Failed to send contact request:', error);
      throw error;
    }
  };

  const getOfficerDetails = async (complaintId: string) => {
    try {
      const response = await apiClient.get(`/api/complaints/${complaintId}`);
      return {
        officer_name: response.officer_name || 'Not assigned',
        officer_phone: response.officer_phone || 'N/A',
        officer_email: response.officer_email || 'N/A',
        station: response.station || 'N/A'
      };
    } catch (error) {
      console.error('Failed to fetch officer details:', error);
      throw error;
    }
  };

  return {
    sendContactRequest,
    getOfficerDetails
  };
};

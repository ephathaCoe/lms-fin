import axios from 'axios';
import { LoanApplication } from '../types';

const API_URL = '/api';

export const fetchLoanApplications = async (token: string): Promise<LoanApplication[]> => {
  const response = await axios.get(`${API_URL}/loan-applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createLoanApplication = async (token: string, formData: FormData): Promise<LoanApplication> => {
  const response = await axios.post(`${API_URL}/loan-applications`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ... (implement other loan application related API calls)
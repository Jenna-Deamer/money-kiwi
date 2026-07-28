import apiRequest from '@/utils/api/core';
const BASE = '/api/dashboardAnalytics';

export function fetchCashflowAnyaltics() {
  return apiRequest(`${BASE}/`, {
      method: 'GET',
  });
}

import apiRequest from '@/utils/api/core';
const BASE = '/api/dashboardAnalytics';

export function fetchCashflowAnalytics(start, end) {
  return apiRequest(`${BASE}/?start=${start}&end=${end}`, {
    method: 'GET',
  });
}

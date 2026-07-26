import apiRequest from '@/utils/api/core';
const BASE = '/api/overviewSummary';

export function fetchOverviewTransactionData() {
  return apiRequest(`${BASE}/`, {
      method: 'GET',
  });
}

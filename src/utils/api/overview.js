import apiRequest from '@/utils/api/core';
const BASE = '/api/overviewSummary';

export function fetchOverviewTransactionTotals() {
  return apiRequest(`${BASE}/`, {
      method: 'GET',
  });
}

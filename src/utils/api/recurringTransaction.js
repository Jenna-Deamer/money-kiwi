import apiRequest from '@/utils/api/core';
const BASE = '/api/recurring';

export function fetchRecurringTransactions() {
  return apiRequest(`${BASE}/`, {
      method: 'GET',
  });
}

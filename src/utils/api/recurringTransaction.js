import apiRequest from '@/utils/api/core';
const BASE = '/api/recurring';

export function fetchRecurringTransactions() {
  return apiRequest(`${BASE}/`, {
    method: 'GET',
  });
}

export function updateReccuringTransactionTemplate(data) {
  return apiRequest(`${BASE}/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

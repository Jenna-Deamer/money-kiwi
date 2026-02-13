import apiRequest from './core';
const BASE = '/api/transactions';

export function fetchTransactions() {
    return apiRequest(`${BASE}/`, {
        method: 'GET',
    });
}

export function getTransactionByUserId(id) {
    return apiRequest(`${BASE}/account/${id}`, {
        method: 'GET',
    });
}

export function getTransactionByAccountId(id) {
    return apiRequest(`${BASE}/${id}`, {
        method: 'GET',
    });
}
import apiRequest from './core';
const BASE = '/api/transactions';

export function fetchTransactions(filters) {
    const queryParams = new URLSearchParams(filters || {}).toString();
    const url = queryParams ? `${BASE}/?${queryParams}` : `${BASE}/`;

    return apiRequest(url, {
        method: 'GET',
    });
}

export function getTransaction(id) {
    return apiRequest(`${BASE}/${id}`, {
        method: 'GET',
    });
}

export function getTransactionByAccount(id) {
    return apiRequest(`${BASE}/account/${id}`, {
        method: 'GET',
    });
}

export function createTransaction(data) {
    return apiRequest(`${BASE}/`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function updateTransaction(data) {
    return apiRequest(`${BASE}/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function deleteTransaction(data) {
    return apiRequest(`${BASE}/${data.id}`, {
        method: 'DELETE',
        body: JSON.stringify(data),
    });
}
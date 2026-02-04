import apiRequest from './core';
const BASE = '/accounts';

export function createAccount(data) {
    console.log(data);
    return apiRequest(`${BASE}/`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function fetchAccounts() {
    return apiRequest(`${BASE}/`, {
        method: 'GET',
    });
}

export function getAccount(id) {
    return apiRequest(`${BASE}/${id}`, {
        method: 'GET',
    });
}

export function updateAccount(data) {
    const id = data.id;
    return apiRequest(`${BASE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
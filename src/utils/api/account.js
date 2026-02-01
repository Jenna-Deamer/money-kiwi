import apiRequest from './core';

export function createAccount(data) {
    console.log(data);
    return apiRequest('/add-account', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function fetchAccounts() {
    return apiRequest('/accounts', {
        method: 'GET',
    });
}

export function getAccount(id) {
    return apiRequest(`/accounts/${id}`, {
        method: 'GET',
    });
}

export function updateAccount(data) {
    const id = data.id;
    return apiRequest(`/accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
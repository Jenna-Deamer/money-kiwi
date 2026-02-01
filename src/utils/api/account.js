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
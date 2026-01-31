import apiRequest from './core';

export function createAccount(name, institution, category, registration) {
    return apiRequest('/add-account', {
        method: 'POST',
        body: JSON.stringify({ name, institution, category, registration }),
    });
}
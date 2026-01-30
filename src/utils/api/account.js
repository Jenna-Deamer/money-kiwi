import apiRequest from './core';

export function createAccount(name, insutiution, category, registration) {
    return apiRequest('/add-account', {
        method: 'POST',
        body: JSON.stringify({ name, insutiution, category, registration }),
    });
}
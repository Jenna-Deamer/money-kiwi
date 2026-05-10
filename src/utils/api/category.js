import apiRequest from './core';
const BASE = '/api/categories';

export function createCategory(data) {
    return apiRequest(`${BASE}/`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export function fetchCategories() {
    return apiRequest(`${BASE}/`, {
        method: 'GET',
    });
};

export function getCategory(id) {
    return apiRequest(`${BASE}/${id}`, {
        method: 'GET',
    });
};

export function updateCategory(data) {
    return apiRequest(`${BASE}/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
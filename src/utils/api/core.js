const API_URL = import.meta.env.VITE_API_URL;

export default async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error('Error: ' + data.errors[0].msg || 'API Error');
        error.responseErrors = data.errors;

        throw error;
    }

    return data;
}

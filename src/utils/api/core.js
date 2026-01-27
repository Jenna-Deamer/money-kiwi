const API_URL = import.meta.env.VITE_API_URL;

export default async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'API Error');
        error.responseErrors = data.errors;

        throw error;
    }

    return data;
}
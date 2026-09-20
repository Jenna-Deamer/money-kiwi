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

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Unable to connect to the server');
  }

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.msg ||
      data?.message ||
      'Something went wrong while communicating with the server';

    const error = new Error(message);
    error.responseErrors = data?.errors;

    throw error;
  }

  return data;
}

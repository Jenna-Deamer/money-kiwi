import apiRequest from '@/utils/api/core';
const BASE = '/api/users';

export function login(email, password) {
  return apiRequest(`${BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function demoSession() {
  return apiRequest(`${BASE}/demo`, {
    method: 'POST',
  });
}

export function signup(firstName, email, password, confirmPassword) {
  return apiRequest(`${BASE}/sign-up`, {
    method: 'POST',
    body: JSON.stringify({ firstName, email, password, confirmPassword }),
  });
}

export function resendVerificationEmail(email) {
  return apiRequest(`${BASE}/resend-verification`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export function forgotPassword(email) {
  return apiRequest(`${BASE}/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function resetPassword(token, password) {
  return apiRequest(`${BASE}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export function validate() {
  return apiRequest(`${BASE}/validate`, {
    method: 'GET'
  });
}

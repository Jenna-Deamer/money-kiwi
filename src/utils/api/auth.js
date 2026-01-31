import apiRequest from './core';

export function login(email, password) {
    return apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export function signup(name, email, password, confirmPassword) {
    return apiRequest('/sign-up', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, confirmPassword }),
    });
}
export function resendVerificationEmail(email) {
    return apiRequest('/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
};

export function forgotPassword(email) {
    return apiRequest('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
    });
}

export function resetPassword(token, password) {
    return apiRequest('/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
    });
}

export function valiadate() {
    return apiRequest('/validate', {
        method: 'GET'
    });
}
import { createContext, useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { validate } from '@/utils/api/auth';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();
    const [token, setToken] = useState(localStorage.getItem('token'));


    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        queryClient.clear(); // Wipes all data from cache
    };


    const { data: user, isLoading } = useQuery({
        queryKey: ['authUser', token],
        queryFn: async () => {
            if (!token) return null;
            try {
                return await validate();
            } catch (error) {
                if (error.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    handleLogout();
                }
                throw error;
            }
        },
        retry: false, // if token is bad don't retry
    });


    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
        isVerifying: isLoading && !!token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

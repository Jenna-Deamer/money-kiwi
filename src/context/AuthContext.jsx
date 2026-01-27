import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

// Check for token in localStorage on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        // decode token and set user info
        if (token) {
            setIsAuthenticated(true);
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);
                setUser(decoded);
            } catch {
                setUser(null);
            }
        } else { // no token found
            setIsAuthenticated(false);
            setUser(null);
        }
        setIsLoading(false);
    }, []);

    const login = (token) => {
        // set token in localStorage & set user state
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch {
            setUser(null);
        }
    };

    const logout = () => {
        // remove token & reset state
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
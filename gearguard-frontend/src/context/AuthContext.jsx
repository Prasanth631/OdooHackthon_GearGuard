import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token: authToken, ...userData } = response.data;
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const setupAdmin = async (data) => {
        const response = await api.post('/auth/setup-admin', data);
        const { token: authToken, ...userData } = response.data;
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setUser(userData);
        return userData;
    };

    const createUser = async (data) => {
        const response = await api.post('/auth/create-user', data);
        return response.data;
    };

    const checkAdminExists = async () => {
        const response = await api.get('/auth/check-admin');
        return response.data.adminExists;
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        setupAdmin,
        createUser,
        checkAdminExists,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'ADMIN',
        isManager: user?.role === 'MANAGER',
        isTechnician: user?.role === 'TECHNICIAN',
        isUser: user?.role === 'USER'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

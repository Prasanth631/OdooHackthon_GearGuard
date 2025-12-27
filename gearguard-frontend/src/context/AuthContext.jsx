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
                    // Verify token and get current user from backend
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Auth verification failed:', error);
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
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token: authToken, ...userData } = response.data;

            localStorage.setItem('token', authToken);
            setToken(authToken);
            setUser(userData);
            return userData;
        } catch (error) {
            const message = error.response?.data?.message || 'Authentication failed';
            throw new Error(message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const setupAdmin = async (data) => {
        try {
            const response = await api.post('/auth/setup-admin', data);
            const { token: authToken, ...userData } = response.data;

            localStorage.setItem('token', authToken);
            setToken(authToken);
            setUser(userData);
            return userData;
        } catch (error) {
            const message = error.response?.data?.message || 'Setup failed';
            throw new Error(message);
        }
    };

    const createUser = async (data) => {
        try {
            const response = await api.post('/auth/create-user', data);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'User creation failed';
            throw new Error(message);
        }
    };

    const checkAdminExists = async () => {
        try {
            const response = await api.get('/auth/check-admin');
            return response.data.adminExists;
        } catch (error) {
            console.error('Error checking admin:', error);
            return false;
        }
    };

    const updateProfile = async (updates) => {
        if (!user) throw new Error('Not authenticated');

        try {
            const response = await api.put('/auth/profile', updates);
            setUser(response.data);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            throw new Error(message);
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        if (!user) throw new Error('Not authenticated');

        try {
            await api.post('/auth/change-password', { currentPassword, newPassword });
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Password change failed';
            throw new Error(message);
        }
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
        updateProfile,
        changePassword,
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

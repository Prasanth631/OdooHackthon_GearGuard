import { createContext, useContext, useState, useEffect } from 'react';
import {
    authenticateUser,
    updateUserProfile,
    changeUserPassword,
    getStoredUsers,
    saveUsers,
    MOCK_USERS
} from '../data/mockUsers';

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
                    // Get stored user from localStorage
                    const storedUser = localStorage.getItem('gearguard_current_user');
                    if (storedUser) {
                        const parsedUser = JSON.parse(storedUser);
                        // Refresh user data from stored users (in case profile was updated)
                        const users = getStoredUsers();
                        const freshUser = users.find(u => u.id === parsedUser.id);
                        if (freshUser) {
                            const { password: _, ...userWithoutPassword } = freshUser;
                            setUser(userWithoutPassword);
                        } else {
                            setUser(parsedUser);
                        }
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('gearguard_current_user');
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
            const userData = authenticateUser(email, password);
            const authToken = `mock_token_${userData.id}_${Date.now()}`;
            localStorage.setItem('token', authToken);
            localStorage.setItem('gearguard_current_user', JSON.stringify(userData));
            setToken(authToken);
            setUser(userData);
            return userData;
        } catch (error) {
            throw new Error(error.message || 'Authentication failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('gearguard_current_user');
        setToken(null);
        setUser(null);
    };

    const setupAdmin = async (data) => {
        // For mock auth, just create a new admin user
        const users = getStoredUsers();
        const newUser = {
            id: users.length + 1,
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            username: data.username || data.email.split('@')[0],
            role: 'ADMIN',
            phone: '',
            department: 'Administration',
            avatar: null,
            joinDate: new Date().toISOString().split('T')[0],
            stats: {
                totalUsers: 1,
                totalEquipment: 0,
                totalTeams: 0,
                activeRequests: 0
            }
        };
        users.push(newUser);
        saveUsers(users);

        const { password: _, ...userWithoutPassword } = newUser;
        const authToken = `mock_token_${newUser.id}_${Date.now()}`;
        localStorage.setItem('token', authToken);
        localStorage.setItem('gearguard_current_user', JSON.stringify(userWithoutPassword));
        setToken(authToken);
        setUser(userWithoutPassword);
        return userWithoutPassword;
    };

    const createUser = async (data) => {
        const users = getStoredUsers();

        // Check if email already exists
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
            throw new Error('User with this email already exists');
        }

        const newUser = {
            id: users.length + 1,
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            username: data.username || data.email.split('@')[0],
            role: data.role,
            phone: '',
            department: '',
            avatar: null,
            joinDate: new Date().toISOString().split('T')[0],
            stats: getDefaultStats(data.role)
        };
        users.push(newUser);
        saveUsers(users);

        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    };

    const checkAdminExists = async () => {
        const users = getStoredUsers();
        return users.some(u => u.role === 'ADMIN');
    };

    const updateProfile = async (updates) => {
        if (!user) throw new Error('Not authenticated');

        const updatedUser = updateUserProfile(user.id, updates);
        localStorage.setItem('gearguard_current_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
    };

    const changePassword = async (currentPassword, newPassword) => {
        if (!user) throw new Error('Not authenticated');

        return changeUserPassword(user.id, currentPassword, newPassword);
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

// Helper to get default stats based on role
const getDefaultStats = (role) => {
    switch (role) {
        case 'ADMIN':
            return { totalUsers: 0, totalEquipment: 0, totalTeams: 0, activeRequests: 0 };
        case 'MANAGER':
            return { teamSize: 0, activeRequests: 0, equipmentAssigned: 0, completedThisMonth: 0 };
        case 'TECHNICIAN':
            return { tasksCompleted: 0, pendingTasks: 0, avgCompletionTime: '0 hrs', efficiency: 0 };
        case 'USER':
            return { requestsSubmitted: 0, requestsResolved: 0, requestsPending: 0, avgResponseTime: '0 hrs' };
        default:
            return {};
    }
};

export default AuthContext;

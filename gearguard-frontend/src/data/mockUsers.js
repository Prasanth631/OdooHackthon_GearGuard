// Mock user data for frontend-only authentication
// Each user has a password that can be changed (stored in localStorage)

export const MOCK_USERS = [
    {
        id: 1,
        email: 'admin@gearguard.com',
        password: 'admin123',
        fullName: 'Alex Johnson',
        username: 'admin',
        role: 'ADMIN',
        phone: '+1 (555) 123-4567',
        department: 'IT Administration',
        avatar: null,
        joinDate: '2023-01-15',
        stats: {
            totalUsers: 12,
            totalEquipment: 47,
            totalTeams: 4,
            activeRequests: 23
        }
    },
    {
        id: 2,
        email: 'manager@gearguard.com',
        password: 'manager123',
        fullName: 'Sarah Williams',
        username: 'manager',
        role: 'MANAGER',
        phone: '+1 (555) 234-5678',
        department: 'Maintenance Operations',
        avatar: null,
        joinDate: '2023-03-20',
        stats: {
            teamSize: 8,
            activeRequests: 15,
            equipmentAssigned: 23,
            completedThisMonth: 42
        }
    },
    {
        id: 3,
        email: 'tech@gearguard.com',
        password: 'tech123',
        fullName: 'Mike Chen',
        username: 'tech',
        role: 'TECHNICIAN',
        phone: '+1 (555) 345-6789',
        department: 'Field Operations',
        avatar: null,
        joinDate: '2023-06-10',
        stats: {
            tasksCompleted: 156,
            pendingTasks: 5,
            avgCompletionTime: '2.3 hrs',
            efficiency: 94
        }
    },
    {
        id: 4,
        email: 'user@gearguard.com',
        password: 'user123',
        fullName: 'Emily Davis',
        username: 'user',
        role: 'USER',
        phone: '+1 (555) 456-7890',
        department: 'Manufacturing',
        avatar: null,
        joinDate: '2023-09-05',
        stats: {
            requestsSubmitted: 12,
            requestsResolved: 10,
            requestsPending: 2,
            avgResponseTime: '4.5 hrs'
        }
    }
];

// Helper to get users from localStorage or default mock data
export const getStoredUsers = () => {
    const stored = localStorage.getItem('gearguard_users');
    if (stored) {
        return JSON.parse(stored);
    }
    return MOCK_USERS;
};

// Helper to save users to localStorage
export const saveUsers = (users) => {
    localStorage.setItem('gearguard_users', JSON.stringify(users));
};

// Authenticate user by email and password
export const authenticateUser = (email, password) => {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        throw new Error('User not found');
    }
    
    if (user.password !== password) {
        throw new Error('Invalid password');
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Update user profile
export const updateUserProfile = (userId, updates) => {
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
};

// Change user password
export const changeUserPassword = (userId, currentPassword, newPassword) => {
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    
    if (users[userIndex].password !== currentPassword) {
        throw new Error('Current password is incorrect');
    }
    
    users[userIndex].password = newPassword;
    saveUsers(users);
    
    return true;
};

export default MOCK_USERS;

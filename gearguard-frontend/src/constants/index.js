export const USER_ROLES = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    TECHNICIAN: 'TECHNICIAN',
    USER: 'USER'
};

export const REQUEST_STAGES = {
    NEW: 'NEW',
    IN_PROGRESS: 'IN_PROGRESS',
    REPAIRED: 'REPAIRED',
    SCRAP: 'SCRAP'
};

export const REQUEST_TYPES = {
    CORRECTIVE: 'CORRECTIVE',
    PREVENTIVE: 'PREVENTIVE'
};

export const PRIORITY_LEVELS = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};

export const EQUIPMENT_STATUS = {
    ACTIVE: 'ACTIVE',
    MAINTENANCE: 'MAINTENANCE',
    INACTIVE: 'INACTIVE',
    SCRAPPED: 'SCRAPPED'
};

export const ROUTES = {
    LOGIN: '/login',
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        EQUIPMENT: '/admin/equipment',
        TEAMS: '/admin/teams',
        REQUESTS: '/admin/requests',
        CALENDAR: '/admin/calendar'
    },
    MANAGER: {
        DASHBOARD: '/manager/dashboard',
        EQUIPMENT: '/manager/equipment',
        TEAMS: '/manager/teams',
        REQUESTS: '/manager/requests',
        CALENDAR: '/manager/calendar'
    },
    TECHNICIAN: {
        DASHBOARD: '/technician/dashboard',
        REQUESTS: '/technician/requests',
        CALENDAR: '/technician/calendar'
    },
    USER: {
        DASHBOARD: '/user/dashboard'
    }
};

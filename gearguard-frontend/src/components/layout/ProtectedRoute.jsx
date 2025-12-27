import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        const dashboardRoutes = {
            ADMIN: ROUTES.ADMIN.DASHBOARD,
            MANAGER: ROUTES.MANAGER.DASHBOARD,
            TECHNICIAN: ROUTES.TECHNICIAN.DASHBOARD,
            USER: ROUTES.USER.DASHBOARD
        };
        return <Navigate to={dashboardRoutes[user?.role] || ROUTES.LOGIN} replace />;
    }

    return children;
};

export default ProtectedRoute;

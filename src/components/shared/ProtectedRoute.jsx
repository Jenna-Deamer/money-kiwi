import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

function ProtectedRoute({children}) {
    const {isAuthenticated,isLoading, user} = useAuth();
    const location = useLocation();

    if(isLoading){
        return <div>Loading...</div>;
    }

    // Not authenticated, redirect to login
    if(!isAuthenticated){
        // state={{from: location}} to remember the page user tried to access so they can be redirected back after login
        return <Navigate to="/login" state={{from: location}} replace />;
    }

    if(user && !user.isVerified){
        return <Navigate to="/verify-notice" />;
    }
    // authenticated, render children
    return children;
}

export default ProtectedRoute;
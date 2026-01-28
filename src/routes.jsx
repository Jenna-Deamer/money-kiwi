import App from "../App";
import Home from "./components/pages/Home";
import Signup from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard";
import VerifyEmailNotice from "./components/auth/VerifyEmailNotice";
import ResendVerfication from "./components/auth/ResendVerification";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AcccountMangement from "./components/pages/accounts/AccountManagement";
import AddAccountForm from "./components/pages/accounts/AddAccountForm";
import Error from "./components/pages/Error";

const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'sign-up', element: <Signup /> },
            { path: 'login', element: <Login /> },
            { path: 'verify-notice', element: <VerifyEmailNotice /> },
            { path: 'resend-verification', element: <ResendVerfication /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'reset-password', element: <ResetPassword /> },
            {
                path: 'dashboard',
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: 'accounts',
                element: (
                    <ProtectedRoute>
                        <AcccountMangement />
                    </ProtectedRoute>
                )
            },
            {
                path: 'accounts/add-account',
                element: (
                    <ProtectedRoute>
                        <AddAccountForm />
                    </ProtectedRoute>
                )
            },
            // catch all 404 route
            { path: '*', element: <Error /> }
        ]
    }
]

export default routes;
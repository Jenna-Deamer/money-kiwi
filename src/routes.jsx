import App from '../App';
import Home from '@/components/pages/Home';
import Signup from '@/components/auth/SignUp';
import Login from '@/components/auth/Login';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Dashboard from '@/components/pages/dashboard/Dashboard';
import Overview from '@/components/pages/Overview';
import VerifyEmailNotice from '@/components/auth/VerifyEmailNotice';
import ResendVerification from '@/components/auth/ResendVerification';
import ForgotPassword from '@/components/auth/ForgotPassword';
import ResetPassword from '@/components/auth/ResetPassword';
import AccountManagement from '@/components/pages/accounts/AccountManagement';
import TransactionOverview from '@/components/pages/transactions/TransactionsOverview';
import AccountForm from '@/components/pages/accounts/AccountForm';
import TransactionForm from '@/components/pages/transactions/TransactionForm';
import CategoryManagement from '@/components/pages/categories/CategoryManagement';
import CategoryForm from '@/components/pages/categories/CategoryCreateForm';
import RecurringTransactions from '@/components/pages/recurringTransactions/RecurringTransactions';

import NotFound from '@/components/shared/ui/NotFound';
import Error from '@/components/shared/ui/Error';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sign-up', element: <Signup /> },
      { path: 'login', element: <Login /> },
      { path: 'verify-notice', element: <VerifyEmailNotice /> },
      { path: 'resend-verification', element: <ResendVerification /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      {
        path: 'overview',
        element: (
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        )
      },
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
            <AccountManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'accounts/form/:id?',
        element: (
          <ProtectedRoute>
            <AccountForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'transactions',
        element: (
          <ProtectedRoute>
            <TransactionOverview />
          </ProtectedRoute>
        )
      },
      {
        path: 'transactions/form/:id?',
        element: (
          <ProtectedRoute>
            <TransactionForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'categories/',
        element: (
          <ProtectedRoute>
            <CategoryManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'categories/form',
        element: (
          <ProtectedRoute>
            <CategoryForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'recurring/',
        element: (
          <ProtectedRoute>
            <RecurringTransactions />
          </ProtectedRoute>
        )
      },
      // catch all 404 route
      { path: '*', element: <NotFound /> }
    ]
  }
];

export default routes;

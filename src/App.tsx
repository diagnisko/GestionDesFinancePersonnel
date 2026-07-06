import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

const BASENAME = import.meta.env.PROD ? '/GestionDesFinancePersonnel' : '';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import DashboardPage from './pages/Dashboard';
import TransactionsPage from './pages/Transactions';
import StatisticsPage from './pages/Statistics';
import ProfilePage from './pages/Profile';
import SavingsGoalsPage from './pages/SavingsGoals';
import BudgetsPage from './pages/Budgets';
import AccountsPage from './pages/Accounts';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`${BASENAME}/login`} state={{ from: location }} replace />;
  }

  return children;
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={`${BASENAME}/dashboard`} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={<AuthRedirect><LoginPage /></AuthRedirect>}
      />
      <Route
        path="/register"
        element={<AuthRedirect><RegisterPage /></AuthRedirect>}
      />
      <Route
        path="/forgot-password"
        element={<AuthRedirect><ForgotPasswordPage /></AuthRedirect>}
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/transactions"
        element={
          <RequireAuth>
            <TransactionsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/statistics"
        element={
          <RequireAuth>
            <StatisticsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route
        path="/savings-goals"
        element={
          <RequireAuth>
            <SavingsGoalsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/budgets"
        element={
          <RequireAuth>
            <BudgetsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/accounts"
        element={
          <RequireAuth>
            <AccountsPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to={`${BASENAME}/`} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router basename={BASENAME}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

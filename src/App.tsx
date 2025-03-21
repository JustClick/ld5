import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import AccountingPage from './pages/AccountingPage'
import FieldServicePage from './pages/FieldServicePage'
import FieldServiceDetails from './pages/FieldServiceDetails'
import ClientsPage from './pages/ClientsPage'
import ClientProfilePage from './pages/ClientProfilePage'
import UsersPage from './pages/UsersPage'
import SettingsPage from './pages/SettingsPage'
import PrivateRoute from './components/auth/PrivateRoute'
import { useAuthStore } from './stores/authStore'

export default function App() {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="accounting" element={<AccountingPage />} />
        <Route path="field-service" element={<FieldServicePage />} />
        <Route path="field-service/:id" element={<FieldServiceDetails />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/:id" element={<ClientProfilePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  )
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PoliticiansPage from './pages/PoliticiansPage';
import OfficesPage from './pages/OfficesPage';
import RankingsPage from './pages/RankingsPage';
import PollsPage from './pages/PollsPage';
import BlogsPage from './pages/BlogsPage';
import ContactsPage from './pages/ContactsPage';
import UsersPage from './pages/UsersPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN' && user?.role !== 'MODERATOR')) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="politicians" element={<PoliticiansPage />} />
            <Route path="offices" element={<OfficesPage />} />
            <Route path="rankings" element={<RankingsPage />} />
            <Route path="polls" element={<PollsPage />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;

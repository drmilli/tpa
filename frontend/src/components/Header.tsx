import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="The Peoples Affairs" className="h-20 w-20" />
            <span className="text-xl font-bold text-primary-700">The Peoples Affairs</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/politicians" className="text-gray-700 hover:text-primary-600 transition">
              Politicians
            </Link>
            <Link to="/rankings" className="text-gray-700 hover:text-primary-600 transition">
              Rankings
            </Link>
            <Link to="/polls" className="text-gray-700 hover:text-primary-600 transition">
              Polls
            </Link>
            <Link to="/blogs" className="text-gray-700 hover:text-primary-600 transition">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user?.firstName || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/politicians" className="text-gray-700 hover:text-primary-600">
                Politicians
              </Link>
              <Link to="/rankings" className="text-gray-700 hover:text-primary-600">
                Rankings
              </Link>
              <Link to="/polls" className="text-gray-700 hover:text-primary-600">
                Polls
              </Link>
              <Link to="/blogs" className="text-gray-700 hover:text-primary-600">
                Blog
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-600">
                Contact
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-700 hover:text-primary-600">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

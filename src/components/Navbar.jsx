import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/UserContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { profile, logout } = useUser();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/treatment', label: 'Treatment' },
    { path: '/chat', label: 'Care Assistant' },
    { path: '/video-consult', label: 'Video Consult' }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">H</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              HealSync
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            {menuItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                  isActive(path)
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User profile and logout button */}
          {profile && (
            <div className="hidden md:flex items-center">
              <button
                onClick={logout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu panel */}
        {isOpen && (
          <div className="md:hidden py-4 px-4 bg-white/80 backdrop-blur-sm border-t">
            {menuItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl mb-2 transition-all ${
                  isActive(path)
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            ))}
            {profile && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={logout}
                  className="btn btn-secondary"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

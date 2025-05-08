import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Search, PlusSquare, User, LogOut } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/create', icon: PlusSquare, label: 'Create' },
    { path: `/profile/${currentUser?.id || ''}`, icon: User, label: 'Profile' },
  ];

  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between md:hidden">
        <Logo />
        <div className="flex items-center gap-4">
          <button 
            onClick={() => logout()}
            className="text-gray-700 hover:text-gray-900 p-1"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col py-6 px-4 border-r border-gray-200 h-screen sticky top-0">
          <div className="mb-10 px-2">
            <Logo />
          </div>
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-purple-50 text-purple-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={24} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="mt-6">
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={24} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="mt-auto">
            <div className="px-4 py-2 text-sm text-gray-500">
              © 2025 Instaclone
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <div className="max-w-2xl mx-auto py-4 px-4 sm:py-6 sm:px-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex flex-col items-center p-2 ${
                  isActive(item.path) ? 'text-purple-600' : 'text-gray-600'
                }`}
              >
                <item.icon size={24} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom spacing for mobile */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default Layout;
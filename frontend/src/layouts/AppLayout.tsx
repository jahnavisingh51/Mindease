import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, MessageSquare, LineChart, LogOut, User, Menu, X, Heart } from 'lucide-react';
import { authService } from '../services/auth.service';
import { cn } from '../utils/cn';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Chat Support', path: '/chat', icon: MessageSquare },
    { name: 'Mood Tracker', path: '/mood', icon: LineChart },
  ];

  const activePath = location.pathname;

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar for Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white border-r border-neutral-200 lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-8 border-b border-neutral-100">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">MindEase</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                  activePath === item.path
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-neutral-100 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-xl">
              <div className="bg-neutral-200 w-8 h-8 rounded-full flex items-center justify-center text-neutral-600">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 truncate">
                                    <p className="text-sm font-semibold text-neutral-900 truncate">{user?.fullName}</p>
                                    <p className="text-xs text-neutral-500 truncate">{user?.email}</p>              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar for Mobile */}
        <header className="lg:hidden h-16 bg-white border-b border-neutral-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-neutral-900">MindEase</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>

      {/* Backdrop for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;

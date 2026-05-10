import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, Moon, Sun, Mail, Shield, User, LogOut, Store } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import SlideOver from '../ui/SlideOver';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { storeName } = useSettingsStore();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="flex-1 flex justify-between items-center">
          <div className="flex-1 flex items-center">
            <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900/30">
              <Store className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-black text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                {storeName}
              </span>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6 space-x-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="relative flex items-center space-x-3">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.roles.join(', ')}</span>
              </div>
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <UserCircle className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SlideOver 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        title="User Profile"
      >
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <UserCircle className="h-16 w-16 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300 mt-1">
              {user?.roles[0]}
            </span>
          </div>

          <div className="space-y-4 border-t dark:border-gray-700 pt-6">
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Username: {user?.username}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
              <Mail className="h-5 w-5" />
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Role: {user?.roles.join(', ')}</span>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-6">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </SlideOver>
    </>
  );
}

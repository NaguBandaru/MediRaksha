import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Database, 
  BarChart3, 
  Wrench, 
  Save, 
  ShieldCheck, 
  Cpu, 
  HelpCircle, 
  LogOut,
  Menu,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const navigation = [
  { name: 'MySpace', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Masters', href: '/medicines', icon: Database },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Tools', href: '/tools', icon: Wrench },
  { name: 'Backup', href: '/backup', icon: Save },
  { name: 'Security', href: '/users', icon: ShieldCheck, role: 'Admin' },
  { name: 'Automation', href: '/automation', icon: Cpu },
  { name: 'Help', href: '/help', icon: HelpCircle },
  { name: 'Quit', href: '#', icon: LogOut, action: 'logout' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const handleAction = (item: typeof navigation[0]) => {
    if (item.action === 'logout') {
      if (window.confirm('Are you sure you want to quit?')) {
        logout();
        navigate('/login');
      }
      return;
    }
  };

  return (
    <div 
      className={`flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 h-full transition-all duration-200 ease-in-out relative z-30 overflow-x-hidden`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} h-16 px-4 flex-shrink-0`}>
        {!isSidebarCollapsed && (
          <span className="text-xl font-black text-primary-600 tracking-tighter truncate animate-in fade-in duration-500">
            MediRaksha
          </span>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <nav className="space-y-2 px-3">
          {navigation.map((item) => {
            if (item.role && !user?.roles.includes(item.role)) return null;
            
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            const content = (
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
                <Icon
                  className={`flex-shrink-0 h-6 w-6 transition-all ${
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-500'
                  } ${isSidebarCollapsed ? '' : 'mr-3'}`}
                  aria-hidden="true"
                />
                {!isSidebarCollapsed && (
                  <span className="font-bold text-sm tracking-tight truncate whitespace-nowrap animate-in slide-in-from-left-2 duration-300">
                    {item.name}
                  </span>
                )}
                {isSidebarCollapsed && (
                   <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>
            );

            const baseClass = `group relative flex items-center h-11 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 hover:text-primary-600'
            } ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'}`;

            if (item.action) {
              return (
                <button
                  key={item.name}
                  onClick={() => handleAction(item)}
                  className={`${baseClass} w-full text-left`}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                className={baseClass}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer - Only visible when fully opened */}
      {!isSidebarCollapsed && (
        <div className="p-4 border-t dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center space-x-3 mb-2">
             <div className="flex items-center justify-center w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 shadow-sm">
                <Shield className="h-6 w-6 text-green-600" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase leading-none">ISO 9001:2015</span>
                <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Certified System</span>
             </div>
          </div>
          <div className="mt-3">
            <p className="text-[9px] text-gray-400 font-medium leading-tight">
              © {new Date().getFullYear()} All rights reserved by<br />
              <span className="text-gray-500 dark:text-gray-300 font-bold uppercase tracking-tighter">Etukas Technologies</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

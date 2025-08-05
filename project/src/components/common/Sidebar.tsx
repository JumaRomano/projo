import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  MessageSquare,
  Home,
  UserCheck,
  Bell,
  Package
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Dashboard', icon: Home, href: '/', current: location.pathname === '/' },
      { name: 'Events', icon: Calendar, href: '/events', current: location.pathname.startsWith('/events') },
      { name: 'Notifications', icon: Bell, href: '/notifications', current: location.pathname === '/notifications' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...commonItems,
          { name: 'Users', icon: Users, href: '/users', current: location.pathname === '/users' },
          { name: 'Analytics', icon: BarChart3, href: '/analytics', current: location.pathname === '/analytics' },
          { name: 'Settings', icon: Settings, href: '/settings', current: location.pathname === '/settings' },
        ];
      case 'organizer':
        return [
          ...commonItems,
          { name: 'Tasks', icon: CheckSquare, href: '/tasks', current: location.pathname === '/tasks' },
          { name: 'Registrations', icon: UserCheck, href: '/registrations', current: location.pathname === '/registrations' },
          { name: 'Feedback', icon: MessageSquare, href: '/feedback', current: location.pathname === '/feedback' },
        ];
      case 'vendor':
        return [
          ...commonItems,
          { name: 'My Tasks', icon: CheckSquare, href: '/tasks', current: location.pathname === '/tasks' },
          { name: 'My Services', icon: Package, href: '/services', current: location.pathname === '/services' },
        ];
      case 'attendee':
        return [
          ...commonItems,
          { name: 'My Registrations', icon: UserCheck, href: '/registrations', current: location.pathname === '/registrations' },
        ];
      default:
        return commonItems;
    }
  };

  const navigation = getNavigationItems();

  return (
    <div className="bg-white w-64 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-blue-600 rounded-lg p-2">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">EventMS</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                item.current
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-md transition-colors duration-200`}
            >
              <Icon
                className={`${
                  item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 h-5 w-5 transition-colors duration-200`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
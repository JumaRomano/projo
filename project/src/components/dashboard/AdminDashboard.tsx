import React from 'react';
import { Users, Calendar, TrendingUp, AlertCircle, BarChart3, UserCheck } from 'lucide-react';
import { mockEvents, mockTasks, mockRegistrations } from '../../data/mockData';

const AdminDashboard = () => {
  const totalEvents = mockEvents.length;
  const activeEvents = mockEvents.filter(e => e.status === 'published').length;
  const totalRegistrations = mockRegistrations.length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;

  const stats = [
    {
      name: 'Total Events',
      value: totalEvents,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Active Events',
      value: activeEvents,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Total Registrations',
      value: totalRegistrations,
      icon: UserCheck,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase',
    },
    {
      name: 'Completion Rate',
      value: `${Math.round((completedTasks / mockTasks.length) * 100)}%`,
      icon: BarChart3,
      color: 'bg-amber-500',
      change: '+5%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
          <div className="space-y-4">
            {mockEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">
                    {event.date.toLocaleDateString()} • {event.registeredCount} registered
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  event.status === 'published' ? 'bg-green-100 text-green-800' :
                  event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">High Registration Volume</p>
                <p className="text-xs text-gray-500">
                  Tech Conference 2025 is approaching capacity limit
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Overdue Tasks</p>
                <p className="text-xs text-gray-500">
                  3 tasks are past their due date and need attention
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">System Update</p>
                <p className="text-xs text-gray-500">
                  New features available for event feedback collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Manage Users</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Create Event</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">View Analytics</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <AlertCircle className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
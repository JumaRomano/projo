import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download, Eye } from 'lucide-react';
import { mockEvents, mockRegistrations, mockTasks } from '../../data/mockData';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30');

  const totalEvents = mockEvents.length;
  const totalRegistrations = mockRegistrations.length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const avgRegistrationsPerEvent = Math.round(totalRegistrations / totalEvents);

  const eventsByCategory = mockEvents.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventsByStatus = mockEvents.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = [
    { month: 'Jan', events: 5, registrations: 120 },
    { month: 'Feb', events: 8, registrations: 180 },
    { month: 'Mar', events: 12, registrations: 250 },
    { month: 'Apr', events: 6, registrations: 140 },
    { month: 'May', events: 10, registrations: 200 },
    { month: 'Jun', events: 15, registrations: 320 },
  ];

  const exportAnalytics = () => {
    const analyticsData = {
      summary: {
        totalEvents,
        totalRegistrations,
        completedTasks,
        avgRegistrationsPerEvent,
      },
      eventsByCategory,
      eventsByStatus,
      monthlyData,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={exportAnalytics}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEvents}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-semibold text-gray-900">{totalRegistrations}</p>
              <p className="text-sm text-green-600">+18% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Registrations</p>
              <p className="text-2xl font-semibold text-gray-900">{avgRegistrationsPerEvent}</p>
              <p className="text-sm text-green-600">+5% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-amber-500 rounded-lg p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Task Completion</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round((completedTasks / mockTasks.length) * 100)}%
              </p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Category */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Events by Category</h3>
          <div className="space-y-4">
            {Object.entries(eventsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / totalEvents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events by Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Events by Status</h3>
          <div className="space-y-4">
            {Object.entries(eventsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'published' ? 'bg-green-600' :
                        status === 'draft' ? 'bg-yellow-600' :
                        status === 'completed' ? 'bg-blue-600' :
                        'bg-gray-600'
                      }`}
                      style={{ width: `${(count / totalEvents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Month</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Events</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Registrations</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Avg. per Event</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data) => (
                <tr key={data.month} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{data.month}</td>
                  <td className="py-3 text-sm text-gray-900">{data.events}</td>
                  <td className="py-3 text-sm text-gray-900">{data.registrations}</td>
                  <td className="py-3 text-sm text-gray-900">
                    {Math.round(data.registrations / data.events)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Events</h3>
        <div className="space-y-4">
          {mockEvents
            .sort((a, b) => b.registeredCount - a.registeredCount)
            .slice(0, 5)
            .map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                    <p className="text-xs text-gray-500">{event.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {event.registeredCount} registrations
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round((event.registeredCount / event.capacity) * 100)}% capacity
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckSquare, Users, Clock, Plus, TrendingUp } from 'lucide-react';
import { mockEvents, mockTasks, mockRegistrations } from '../../data/mockData';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const myEvents = mockEvents.filter(e => e.organizerId === '2');
  const myTasks = mockTasks.filter(t => t.createdBy === '2');
  const upcomingEvents = myEvents.filter(e => e.date > new Date());
  const pendingTasks = myTasks.filter(t => t.status === 'pending' || t.status === 'in-progress');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
        <button 
          onClick={() => navigate('/events/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Events</p>
              <p className="text-2xl font-semibold text-gray-900">{myEvents.length}</p>
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
              <p className="text-2xl font-semibold text-gray-900">
                {myEvents.reduce((sum, event) => sum + event.registeredCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-amber-500 rounded-lg p-3">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">My Events</h3>
            <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {myEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  <p className="text-xs text-gray-500">
                    {event.date.toLocaleDateString()} • {event.registeredCount}/{event.capacity} registered
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

        {/* Task Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
            <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {myTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'in-progress' ? 'bg-blue-500' :
                  task.status === 'overdue' ? 'bg-red-500' :
                  'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                  <p className="text-xs text-gray-500">
                    Due: {task.dueDate.toLocaleDateString()} • Assigned to: {task.assignedToName}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myEvents.map((event) => (
            <div key={event.id} className="text-center">
              <h4 className="text-sm font-medium text-gray-900 mb-2">{event.title}</h4>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {Math.round((event.registeredCount / event.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-600">
                      {event.registeredCount}/{event.capacity}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
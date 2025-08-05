import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Star, Ticket } from 'lucide-react';
import { mockEvents, mockRegistrations } from '../../data/mockData';

const AttendeeDashboard = () => {
  const navigate = useNavigate();
  const myRegistrations = mockRegistrations.filter(r => r.userId === '4');
  const registeredEventIds = myRegistrations.map(r => r.eventId);
  const registeredEvents = mockEvents.filter(e => registeredEventIds.includes(e.id));
  const availableEvents = mockEvents.filter(e => e.status === 'published' && !registeredEventIds.includes(e.id));
  const upcomingEvents = registeredEvents.filter(e => e.date > new Date());
  const pastEvents = registeredEvents.filter(e => e.date < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <div className="text-sm text-gray-500">
          You're registered for {registeredEvents.length} events
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Registered Events</p>
              <p className="text-2xl font-semibold text-gray-900">{registeredEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attended</p>
              <p className="text-2xl font-semibold text-gray-900">{pastEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-amber-500 rounded-lg p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Network Connections</p>
              <p className="text-2xl font-semibold text-gray-900">47</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Registered
                    </span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200">
                        View Details
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors duration-200">
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h4>
            <p className="text-gray-600">Browse and register for new events to see them here.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              onClick={() => navigate('/events')}
              Browse Events
            </button>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Past Events</h3>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  <p className="text-xs text-gray-500">
                    {event.date.toLocaleDateString()} • {event.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100 transition-colors duration-200">
                    View Summary
                  </button>
                  <button className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100 transition-colors duration-200">
                    Leave Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeDashboard;
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Edit, Trash2, UserPlus, Download } from 'lucide-react';
import TicketModal from '../tickets/TicketModal';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, registrations, addRegistration, deleteEvent, updateEvent } = useApp();
  const { user } = useAuth();
  const [showTicketModal, setShowTicketModal] = useState(false);

  const event = events.find(e => e.id === id);
  const isRegistered = registrations.some(r => r.eventId === id && r.userId === user?.id);
  const userRegistration = registrations.find(r => r.eventId === id && r.userId === user?.id);

  if (!event) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Event not found</h3>
        <button
          onClick={() => navigate('/events')}
          className="text-blue-600 hover:text-blue-500"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || (user?.role === 'organizer' && event.organizerId === user.id);
  const canRegister = user?.role === 'attendee' && !isRegistered && event.registeredCount < event.capacity;

  const handleRegister = () => {
    if (!user) return;

    const registration = {
      id: Date.now().toString(),
      eventId: event.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      registeredAt: new Date(),
      status: 'confirmed' as const,
    };

    addRegistration(registration);
    setShowTicketModal(true);
  };

  const handlePublish = () => {
    updateEvent(event.id, { status: 'published' });
    alert('Event published successfully!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
      navigate('/events');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>
        
        {canEdit && (
          <div className="flex space-x-2">
            {event.status === 'draft' && (
              <button
                onClick={handlePublish}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Publish Event
              </button>
            )}
            <button
              onClick={() => navigate(`/events/${event.id}/edit`)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm rounded-full ${
                event.status === 'published' ? 'bg-green-100 text-green-800' :
                event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {event.status}
              </span>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full capitalize">
                {event.category}
              </span>
            </div>
            
            {isRegistered && (
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  Registered
                </span>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  View Ticket
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-6">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-gray-600">
                    {event.date.toLocaleDateString()}
                    {event.endDate && ` - ${event.endDate.toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-sm text-gray-600">
                    {event.registeredCount}/{event.capacity} registered
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Organized by</p>
                <p className="font-medium text-gray-900">{event.organizerName}</p>
              </div>
              
              {canRegister && (
                <button
                  onClick={handleRegister}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Register for Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTicketModal && userRegistration && (
        <TicketModal
          event={event}
          registration={userRegistration}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
};

export default EventDetail;
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Star, Calendar, User, Download } from 'lucide-react';

const FeedbackList = () => {
  const { feedback, events } = useApp();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState('all');

  const getUserFeedback = () => {
    switch (user?.role) {
      case 'admin':
        return feedback;
      case 'organizer':
        const organizerEvents = events.filter(e => e.organizerId === user.id);
        return feedback.filter(f => organizerEvents.some(e => e.id === f.eventId));
      default:
        return [];
    }
  };

  const filteredFeedback = getUserFeedback().filter(f => 
    selectedEvent === 'all' || f.eventId === selectedEvent
  );

  const getAverageRating = () => {
    if (filteredFeedback.length === 0) return 0;
    return filteredFeedback.reduce((sum, f) => sum + f.rating, 0) / filteredFeedback.length;
  };

  const getCategoryAverages = () => {
    if (filteredFeedback.length === 0) return { organization: 0, content: 0, venue: 0, catering: 0 };
    
    return {
      organization: filteredFeedback.reduce((sum, f) => sum + f.categories.organization, 0) / filteredFeedback.length,
      content: filteredFeedback.reduce((sum, f) => sum + f.categories.content, 0) / filteredFeedback.length,
      venue: filteredFeedback.reduce((sum, f) => sum + f.categories.venue, 0) / filteredFeedback.length,
      catering: filteredFeedback.reduce((sum, f) => sum + f.categories.catering, 0) / filteredFeedback.length,
    };
  };

  const exportFeedback = () => {
    const csvContent = [
      ['Event', 'Attendee', 'Overall Rating', 'Organization', 'Content', 'Venue', 'Catering', 'Comment', 'Date'],
      ...filteredFeedback.map(f => {
        const event = events.find(e => e.id === f.eventId);
        return [
          event?.title || 'Unknown',
          f.userName,
          f.rating,
          f.categories.organization,
          f.categories.content,
          f.categories.venue,
          f.categories.catering,
          f.comment.replace(/,/g, ';'), // Replace commas to avoid CSV issues
          f.submittedAt.toLocaleDateString()
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback-report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const categoryAverages = getCategoryAverages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Event Feedback</h1>
        <button
          onClick={exportFeedback}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="block w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Events</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredFeedback.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900 mr-2">
                  {getAverageRating().toFixed(1)}
                </p>
                <div className="flex">
                  {renderStars(Math.round(getAverageRating()))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Organization</p>
          <div className="flex items-center">
            <p className="text-xl font-semibold text-gray-900 mr-2">
              {categoryAverages.organization.toFixed(1)}
            </p>
            <div className="flex">
              {renderStars(Math.round(categoryAverages.organization))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Content</p>
          <div className="flex items-center">
            <p className="text-xl font-semibold text-gray-900 mr-2">
              {categoryAverages.content.toFixed(1)}
            </p>
            <div className="flex">
              {renderStars(Math.round(categoryAverages.content))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Venue</p>
          <div className="flex items-center">
            <p className="text-xl font-semibold text-gray-900 mr-2">
              {categoryAverages.venue.toFixed(1)}
            </p>
            <div className="flex">
              {renderStars(Math.round(categoryAverages.venue))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((feedbackItem) => {
          const event = events.find(e => e.id === feedbackItem.eventId);
          return (
            <div key={feedbackItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{feedbackItem.userName}</p>
                    <p className="text-sm text-gray-500">{event?.title || 'Unknown Event'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(feedbackItem.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {feedbackItem.submittedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{feedbackItem.comment}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Organization</p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{feedbackItem.categories.organization}</span>
                    <div className="flex">
                      {renderStars(feedbackItem.categories.organization)}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Content</p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{feedbackItem.categories.content}</span>
                    <div className="flex">
                      {renderStars(feedbackItem.categories.content)}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Venue</p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{feedbackItem.categories.venue}</span>
                    <div className="flex">
                      {renderStars(feedbackItem.categories.venue)}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Catering</p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{feedbackItem.categories.catering}</span>
                    <div className="flex">
                      {renderStars(feedbackItem.categories.catering)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFeedback.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
          <p className="text-gray-600">No feedback has been submitted for the selected events yet.</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
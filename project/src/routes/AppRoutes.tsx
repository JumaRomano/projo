import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/common/Layout';
import LoginForm from '../components/auth/LoginForm';
import Dashboard from '../components/dashboard/Dashboard';
import EventList from '../components/events/EventList';
import EventDetail from '../components/events/EventDetail';
import CreateEvent from '../components/events/CreateEvent';
import TaskList from '../components/tasks/TaskList';
import CreateTask from '../components/tasks/CreateTask';
import RegistrationList from '../components/registrations/RegistrationList';
import FeedbackList from '../components/feedback/FeedbackList';
import NotificationList from '../components/notifications/NotificationList';
import UserManagement from '../components/admin/UserManagement';
import Analytics from '../components/admin/Analytics';
import Settings from '../components/admin/Settings';
import ProfileSettings from '../components/profile/ProfileSettings';
import VendorServices from '../components/vendor/VendorServices';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/registrations" element={<RegistrationList />} />
        <Route path="/feedback" element={<FeedbackList />} />
        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/services" element={<VendorServices />} />
      </Routes>
    </Layout>
  );
}

export default AppContent;
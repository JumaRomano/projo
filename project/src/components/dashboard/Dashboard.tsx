import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import OrganizerDashboard from './OrganizerDashboard';
import VendorDashboard from './VendorDashboard';
import AttendeeDashboard from './AttendeeDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'organizer':
        return <OrganizerDashboard />;
      case 'vendor':
        return <VendorDashboard />;
      case 'attendee':
        return <AttendeeDashboard />;
      default:
        return <div>Loading...</div>;
    }
  };

  return <div className="space-y-6">{renderDashboard()}</div>;
};

export default Dashboard;
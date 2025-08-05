import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, Task, Registration, Feedback, Notification } from '../types';
import { mockEvents, mockTasks, mockRegistrations, mockFeedback, mockNotifications } from '../data/mockData';

interface AppContextType {
  events: Event[];
  tasks: Task[];
  registrations: Registration[];
  feedback: Feedback[];
  notifications: Notification[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  addRegistration: (registration: Registration) => void;
  cancelRegistration: (id: string) => void;
  addFeedback: (feedback: Feedback) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (id: string, eventUpdate: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventUpdate } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (id: string, taskUpdate: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...taskUpdate } : task
    ));
  };

  const addRegistration = (registration: Registration) => {
    setRegistrations(prev => [...prev, registration]);
    // Update event registered count
    updateEvent(registration.eventId, {
      registeredCount: events.find(e => e.id === registration.eventId)?.registeredCount + 1 || 1
    });
  };

  const cancelRegistration = (id: string) => {
    const registration = registrations.find(r => r.id === id);
    if (registration) {
      setRegistrations(prev => prev.filter(r => r.id !== id));
      // Update event registered count
      updateEvent(registration.eventId, {
        registeredCount: Math.max(0, (events.find(e => e.id === registration.eventId)?.registeredCount || 1) - 1)
      });
    }
  };

  const addFeedback = (feedbackItem: Feedback) => {
    setFeedback(prev => [...prev, feedbackItem]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const value: AppContextType = {
    events,
    tasks,
    registrations,
    feedback,
    notifications,
    addEvent,
    updateEvent,
    deleteEvent,
    addTask,
    updateTask,
    addRegistration,
    cancelRegistration,
    addFeedback,
    markNotificationAsRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
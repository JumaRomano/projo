export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'organizer' | 'vendor' | 'attendee';
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  organizerId: string;
  organizerName: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  category: 'corporate' | 'academic' | 'community' | 'other';
  tags: string[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: Date;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  checkInTime?: Date;
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  categories: {
    organization: number;
    content: number;
    venue: number;
    catering: number;
  };
  submittedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: User['role']) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
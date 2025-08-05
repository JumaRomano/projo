import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Plus, Edit, Trash2, Star, DollarSign, Clock, MapPin } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  reviews: number;
  availability: boolean;
  images: string[];
  features: string[];
}

const VendorServices = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Professional Catering Service',
      description: 'Full-service catering for corporate events, conferences, and special occasions. We provide high-quality meals with professional presentation.',
      category: 'Catering',
      price: 25,
      duration: '4-8 hours',
      location: 'On-site',
      rating: 4.8,
      reviews: 127,
      availability: true,
      images: ['https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'],
      features: ['Professional staff', 'Custom menus', 'Dietary accommodations', 'Setup & cleanup'],
    },
    {
      id: '2',
      name: 'Audio Visual Equipment Rental',
      description: 'Complete AV solutions including projectors, sound systems, microphones, and lighting for events of all sizes.',
      category: 'Equipment',
      price: 150,
      duration: 'Full day',
      location: 'Delivery available',
      rating: 4.6,
      reviews: 89,
      availability: true,
      images: ['https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg'],
      features: ['Professional equipment', 'Technical support', 'Setup included', 'Backup equipment'],
    },
  ]);

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'Catering',
    price: '',
    duration: '',
    location: '',
    features: '',
  });

  const categories = ['Catering', 'Equipment', 'Photography', 'Entertainment', 'Decoration', 'Transportation', 'Security', 'Other'];

  const handleCreateService = () => {
    if (!newService.name || !newService.description || !newService.price) {
      alert('Please fill in all required fields');
      return;
    }

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description,
      category: newService.category,
      price: parseFloat(newService.price),
      duration: newService.duration,
      location: newService.location,
      rating: 0,
      reviews: 0,
      availability: true,
      images: ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'],
      features: newService.features.split(',').map(f => f.trim()).filter(f => f),
    };

    setServices(prev => [...prev, service]);
    setNewService({ name: '', description: '', category: 'Catering', price: '', duration: '', location: '', features: '' });
    setShowCreateModal(false);
    alert('Service created successfully!');
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  const toggleAvailability = (serviceId: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, availability: !s.availability } : s
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-semibold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {services.length > 0 ? (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">
                {services.reduce((sum, s) => sum + s.reviews, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-amber-500 rounded-lg p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-semibold text-gray-900">
                {services.filter(s => s.availability).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <img
              src={service.images[0]}
              alt={service.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {service.category}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  service.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {service.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${service.price}/person
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {service.duration}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {service.location}
                </div>
              </div>

              {service.rating > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {renderStars(Math.round(service.rating))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {service.rating} ({service.reviews} reviews)
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {feature}
                    </span>
                  ))}
                  {service.features.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{service.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleAvailability(service.id)}
                  className={`px-3 py-1 text-xs rounded ${
                    service.availability
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  } transition-colors duration-200`}
                >
                  {service.availability ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Service</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter service name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your service"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Person ($) *
                  </label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newService.duration}
                    onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 4-8 hours, Full day"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location/Delivery
                  </label>
                  <input
                    type="text"
                    value={newService.location}
                    onChange={(e) => setNewService(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., On-site, Delivery available"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={newService.features}
                  onChange={(e) => setNewService(prev => ({ ...prev, features: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Professional staff, Custom menus, Setup included"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateService}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorServices;
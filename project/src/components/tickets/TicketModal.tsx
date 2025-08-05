import React, { useRef } from 'react';
import { X, Download, Calendar, MapPin, Clock, User, Mail, Hash } from 'lucide-react';
import { Event, Registration } from '../../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TicketModalProps {
  event: Event;
  registration: Registration;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ event, registration, onClose }) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ticket-${event.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating ticket PDF. Please try again.');
    }
  };

  const downloadReceipt = () => {
    const receiptData = {
      eventTitle: event.title,
      registrationId: registration.id,
      userName: registration.userName,
      userEmail: registration.userEmail,
      registrationDate: registration.registeredAt.toLocaleDateString(),
      eventDate: event.date.toLocaleDateString(),
      eventTime: event.time,
      eventLocation: event.location,
      ticketPrice: 'Free', // You can modify this based on your pricing logic
      transactionId: `TXN-${registration.id}`,
    };

    const receiptContent = `
EVENTMS - REGISTRATION RECEIPT
================================

Event: ${receiptData.eventTitle}
Registration ID: ${receiptData.registrationId}
Transaction ID: ${receiptData.transactionId}

Attendee Information:
Name: ${receiptData.userName}
Email: ${receiptData.userEmail}

Event Details:
Date: ${receiptData.eventDate}
Time: ${receiptData.eventTime}
Location: ${receiptData.eventLocation}

Registration Date: ${receiptData.registrationDate}
Ticket Price: ${receiptData.ticketPrice}

Thank you for registering!
For support, contact: support@eventms.com

================================
This is an automatically generated receipt.
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${event.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Event Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div
            ref={ticketRef}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">EventMS</h3>
                <p className="text-blue-100">Official Event Ticket</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Ticket ID</p>
                <p className="font-mono text-lg">{registration.id}</p>
              </div>
            </div>

            <div className="border-t border-blue-400 pt-6">
              <h4 className="text-xl font-semibold mb-4">{event.title}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-100">Date</p>
                    <p className="font-medium">{event.date.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-100">Time</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-100">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-100">Attendee</p>
                    <p className="font-medium">{registration.userName}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-blue-400 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-200" />
                    <span className="text-sm">{registration.userEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 mr-2 text-blue-200" />
                    <span className="text-sm">Registered: {registration.registeredAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-400 text-center">
              <p className="text-sm text-blue-100">
                Please present this ticket at the event entrance
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={downloadTicket}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Ticket (PDF)
            </button>
            <button
              onClick={downloadReceipt}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
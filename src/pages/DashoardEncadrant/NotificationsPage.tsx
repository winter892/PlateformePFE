
import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { notifications as initialNotifications } from '@/lib/mock-data';
import NotificationItem from '@/components/NotificationItem';
import { Trash2, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(n => !n.read) 
      : notifications.filter(n => n.read);
  
  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success("Notification marquée comme lue");
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success("Toutes les notifications ont été marquées comme lues");
  };
  
  const handleDeleteRead = () => {
    setNotifications(notifications.filter(notification => !notification.read));
    toast.success("Notifications lues supprimées");
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-violet-900">Notifications</h1>
        
        <div className="flex space-x-3">
          <button 
            className="flex items-center px-4 py-2 text-sm font-medium text-violet-700 bg-violet-100 rounded-lg hover:bg-violet-200 transition-colors"
            onClick={handleMarkAllAsRead}
          >
            <CheckSquare size={16} className="mr-2" />
            Tout marquer comme lu
          </button>
          <button 
            className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            onClick={handleDeleteRead}
          >
            <Trash2 size={16} className="mr-2" />
            Supprimer les lus
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'all' 
              ? 'bg-violet-100 text-violet-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          Toutes
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'unread' 
              ? 'bg-violet-100 text-violet-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('unread')}
        >
          Non lues
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            filter === 'read' 
              ? 'bg-violet-100 text-violet-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('read')}
        >
          Lues
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-violet-100 shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-violet-100">
            {filteredNotifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={handleMarkAsRead} 
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-violet-500">Aucune notification {filter !== 'all' ? (filter === 'unread' ? 'non lue' : 'lue') : ''}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;

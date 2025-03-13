import React from 'react';
import { Notification } from '../types';
import { CheckSquare, FileEdit, MessageSquare } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'task':
        return <CheckSquare className="text-primary-500" size={18} />;
      case 'project':
        return <FileEdit className="text-secondary-500" size={18} />;
      case 'comment':
        return <MessageSquare className="text-blue-500" size={18} />;
      default:
        return null;
    }
  };

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'à l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours} heure${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `il y a ${days} jour${days !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-purple-50' : ''}`}>
      <div className="flex items-start">
        <div className="mr-3 mt-1">{getIcon()}</div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-800">{notification.content}</p>
          <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(notification.timestamp)}</p>
        </div>
        
        {!notification.read && (
          <button 
            className="text-xs text-violet-600 hover:text-violet-800"
            onClick={() => onMarkAsRead(notification.id)}
          >
            Marquer comme lu
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;

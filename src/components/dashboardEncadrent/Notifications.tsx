
import { notifications } from '@/lib/mock-data';
import { Bell, MessageSquare, AlertTriangle, FileText } from 'lucide-react';

const Notifications = () => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'task':
        return <FileText size={16} className="text-green-500" />;
      case 'project':
        return <Bell size={16} className="text-violet-500" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-violet-500" />;
    }
  };

  return (
    <div className="dashboard-card h-full">
      <div className="p-5 border-b border-violet-100 flex justify-between items-center">
        <h2 className="text-lg font-medium text-violet-900">Notifications</h2>
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-violet-500 rounded-full">
          {notifications.filter(n => !n.read).length}
        </span>
      </div>
      <div className="divide-y divide-violet-100 max-h-[400px] overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-4 notification-item ${!notification.read ? 'bg-violet-50' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-violet-900 mb-1">{notification.title}</h3>
                <p className="text-sm text-violet-600 mb-2">{notification.description}</p>
                <div className="text-xs text-violet-500">{notification.time}</div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-violet-500 mt-1"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-violet-100">
        <button className="w-full py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-md transition-colors text-sm font-medium">
          Marquer tout comme lu
        </button>
      </div>
    </div>
  );
};

export default Notifications;

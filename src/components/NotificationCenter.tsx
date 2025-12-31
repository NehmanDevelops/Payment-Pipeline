'use client';

import { motion } from 'framer-motion';
import { 
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePipeline } from '@/context/PipelineContext';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

export function NotificationCenter() {
  const { state } = usePipeline();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Watch for transaction completions and failures
  useEffect(() => {
    const lastTx = state.transactions[0];
    if (!lastTx) return;
    
    if (lastTx.status === 'completed') {
      addNotification({
        type: 'success',
        message: `Transaction ${lastTx.id.slice(0, 12)}... completed successfully`,
      });
    } else if (lastTx.status === 'failed') {
      const lastStage = lastTx.stages[lastTx.stages.length - 1];
      addNotification({
        type: 'error',
        message: `Transaction failed at ${lastStage?.stage}: ${lastStage?.message}`,
      });
    }
  }, [state.transactions[0]?.status]);
  
  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
  };
  
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  
  const unreadCount = notifications.filter(
    (n) => n.timestamp > new Date(Date.now() - 30000)
  ).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <span className="font-semibold text-white">Notifications</span>
            <button 
              onClick={() => setNotifications([])}
              className="text-xs text-gray-500 hover:text-white"
            >
              Clear all
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 border-b border-gray-800 hover:bg-gray-800/50 flex items-start gap-3"
                >
                  {getIcon(notif.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notif.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notif.id)}
                    className="text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

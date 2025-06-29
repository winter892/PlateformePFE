import React, { useState } from 'react';
import { Bell, Clock, CheckCircle2, AlertCircle, FileText, User, MessageSquare, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Notifications = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      title: 'Date limite approchante',
      description: 'La tâche "Développer le prototype" doit être terminée dans 2 jours',
      time: 'Il y a 2 heures',
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      read: false
    },
    {
      id: 2,
      type: 'deliverable',
      title: 'Nouveau commentaire',
      description: 'L\'encadrant a commenté votre livrable "Rapport d\'analyse.pdf"',
      time: 'Il y a 1 jour',
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      read: false
    },
    {
      id: 3,
      type: 'task',
      title: 'Tâche terminée',
      description: 'La tâche "Analyser les besoins du projet" a été marquée comme terminée',
      time: 'Il y a 3 jours',
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      read: true
    },
    {
      id: 4,
      type: 'deliverable',
      title: 'Nouveau livrable requis',
      description: 'Un nouveau livrable est requis pour la tâche "Concevoir l\'architecture"',
      time: 'Il y a 5 jours',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      read: true
    },
    {
      id: 5,
      type: 'system',
      title: 'Compte créé',
      description: 'Bienvenue sur StudyTrack! Votre compte a été créé avec succès.',
      time: 'Il y a 2 semaines',
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      read: true
    },
  ]);

  // Filtrage
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  // Marquer tout comme lu
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Supprimer les notifications lues
  const deleteRead = () => {
    setNotifications(notifications.filter(n => !n.read));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6 ml-64 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.h1 
            className="text-3xl font-bold text-gray-800 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Bell className="mr-3 h-7 w-7 text-green-600" />
            Notifications
          </motion.h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-sm"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
            <Button
              variant="destructive"
              className="text-sm flex items-center"
              onClick={deleteRead}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Supprimer les lus
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-violet-100 text-violet-700'
                : 'bg-white text-violet-700 border border-violet-100'
            }`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-violet-100 text-violet-700'
                : 'bg-white text-violet-700 border border-violet-100'
            }`}
            onClick={() => setFilter('unread')}
          >
            Non lues
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'read'
                ? 'bg-violet-100 text-violet-700'
                : 'bg-white text-violet-700 border border-violet-100'
            }`}
            onClick={() => setFilter('read')}
          >
            Lues
          </button>
        </div>

        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                variants={item}
                className={`w-full p-4 border ${
                  notification.read ? 'bg-white' : 'bg-green-50'
                } rounded-lg shadow-sm relative ${
                  notification.read ? '' : 'border-green-200'
                } flex items-center`} // <-- allonge la carte
              >
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500"></div>
                )}
                <div className={`${notification.bgColor} p-3 rounded-full mr-4 flex-shrink-0`}>
                  <notification.icon className={`h-5 w-5 ${notification.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{notification.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{notification.description}</p>
                  <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="text-center py-12 bg-white rounded-lg border"
              variants={item}
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">Aucune notification</h3>
              <p className="text-gray-500 mt-2">Vous serez notifié ici de toute activité importante</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;

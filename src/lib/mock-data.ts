
// Mock data for dashboard

import { Project, Task, Group, Notification, Comment } from '../types';

// Projects
export const projects: Project[] = [
  {
    id: 1,
    title: "Système de gestion de bibliothèque",
    description: "Développement d'un système complet de gestion de bibliothèque avec suivi des emprunts",
    progress: 75,
    status: "in_progress",
    groupId: 1,
    lastUpdated: "2025-04-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Application de reconnaissance d'images",
    description: "Création d'une application utilisant l'IA pour la reconnaissance d'objets dans des images",
    progress: 45,
    status: "in_progress",
    groupId: 2,
    lastUpdated: "2025-04-14T14:20:00Z"
  },
  {
    id: 3,
    title: "Plateforme d'apprentissage en ligne",
    description: "Développement d'une plateforme e-learning avec suivi de progression et quiz interactifs",
    progress: 90,
    status: "in_progress",
    groupId: 3,
    lastUpdated: "2025-04-16T09:15:00Z"
  },
  {
    id: 4,
    title: "Système de réservation de salles",
    description: "Application permettant la gestion et la réservation de salles de cours",
    progress: 100,
    status: "completed",
    groupId: 4,
    lastUpdated: "2025-04-10T16:45:00Z"
  },
  {
    id: 5,
    title: "Application de gestion de budget étudiant",
    description: "Outil d'aide à la gestion financière pour les étudiants",
    progress: 60,
    status: "in_progress",
    groupId: 5,
    lastUpdated: "2025-04-13T11:20:00Z"
  }
];

// Tasks
export const tasks: Task[] = [
  {
    id: 1,
    title: "Révision du modèle de données",
    description: "Examiner et valider le modèle de données proposé par le groupe",
    status: "in_progress",
    projectId: 1,
    dueDate: "2025-04-20T23:59:59Z",
    comments: [
      {
        id: 1,
        content: "Le modèle semble cohérent mais il manque des relations entre certaines entités",
        author: "Dr. Martin",
        timestamp: "2025-04-16T14:30:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Validation de l'architecture système",
    description: "Vérifier que l'architecture proposée répond aux exigences du projet",
    status: "completed",
    projectId: 2,
    dueDate: "2025-04-15T23:59:59Z",
    comments: [
      {
        id: 2,
        content: "Architecture validée, bonne utilisation des microservices",
        author: "Dr. Martin",
        timestamp: "2025-04-15T10:15:00Z"
      }
    ]
  },
  {
    id: 3,
    title: "Évaluation de l'interface utilisateur",
    description: "Examiner les maquettes d'interface et suggérer des améliorations",
    status: "problem",
    projectId: 3,
    dueDate: "2025-04-18T23:59:59Z",
    comments: [
      {
        id: 3,
        content: "L'interface manque d'accessibilité pour les utilisateurs malvoyants",
        author: "Dr. Martin",
        timestamp: "2025-04-17T09:45:00Z"
      }
    ]
  },
  {
    id: 4,
    title: "Vérification du rapport final",
    description: "Examiner le rapport final avant soumission",
    status: "in_progress",
    projectId: 4,
    dueDate: "2025-04-22T23:59:59Z",
    comments: []
  },
  {
    id: 5,
    title: "Validation des tests unitaires",
    description: "Vérifier la couverture et la qualité des tests unitaires",
    status: "in_progress",
    projectId: 5,
    dueDate: "2025-04-19T23:59:59Z",
    comments: []
  }
];

// Groups
export const groups: Group[] = [
  {
    id: 1,
    name: "Groupe Alpha",
    members: ["Jean Dupont", "Marie Martin", "Lucas Bernard"],
    projectId: 1
  },
  {
    id: 2,
    name: "Groupe Beta",
    members: ["Sophie Dubois", "Thomas Leroy", "Emma Petit"],
    projectId: 2
  },
  {
    id: 3,
    name: "Groupe Gamma",
    members: ["Hugo Moreau", "Chloé Lefebvre", "Nathan Roux"],
    projectId: 3
  },
  {
    id: 4,
    name: "Groupe Delta",
    members: ["Léa Fournier", "Jules Girard", "Manon Lambert"],
    projectId: 4
  },
  {
    id: 5,
    name: "Groupe Epsilon",
    members: ["Camille Bonnet", "Louis Mercier", "Inès Durand"],
    projectId: 5
  }
];

// Notifications
export const notifications: Notification[] = [
  {
    id: 1,
    type: "task",
    content: "Nouvelle tâche assignée: Révision du modèle de données",
    timestamp: "2025-04-16T08:30:00Z",
    read: false,
    groupId: 1
  },
  {
    id: 2,
    type: "project",
    content: "Le groupe Beta a mis à jour leur projet",
    timestamp: "2025-04-15T16:45:00Z",
    read: false,
    groupId: 2
  },
  {
    id: 3,
    type: "comment",
    content: "Nouveau commentaire sur le projet Plateforme d'apprentissage",
    timestamp: "2025-04-17T09:50:00Z",
    read: false,
    groupId: 3
  },
  {
    id: 4,
    type: "project",
    content: "Le groupe Delta a soumis leur rapport final",
    timestamp: "2025-04-14T14:20:00Z",
    read: true,
    groupId: 4
  },
  {
    id: 5,
    type: "task",
    content: "Rappel: Validation des tests unitaires à effectuer",
    timestamp: "2025-04-16T10:15:00Z",
    read: true,
    groupId: 5
  }
];

// Dashboard stats
export const dashboardStats = {
  totalProjects: projects.length,
  projectsInProgress: projects.filter(p => p.status === "in_progress").length,
  projectsCompleted: projects.filter(p => p.status === "completed").length,
  pendingTasks: tasks.filter(t => t.status === "in_progress").length,
  unreadNotifications: notifications.filter(n => !n.read).length,
  averageProgress: Math.round(projects.reduce((acc, project) => acc + project.progress, 0) / projects.length),
  tasks: tasks // Add tasks array to dashboardStats
};

// Project status counts for chart
export const projectStatusCounts = {
  pending: projects.filter(p => p.status === "in_progress").length,
  inProgress: projects.filter(p => p.status === "in_progress").length,
  completed: projects.filter(p => p.status === "completed").length,
  issue: 0,
};

// Project status data for chart
export const projectStatusData = [
  { name: 'En attente', value: projectStatusCounts.pending },
  { name: 'En cours', value: projectStatusCounts.inProgress },
  { name: 'Terminés', value: projectStatusCounts.completed },
  { name: 'Problèmes', value: projectStatusCounts.issue }
];

// Monthly progress data for chart
export const monthlyProgressData = [
  { name: 'Jan', progress: 20 },
  { name: 'Fév', progress: 35 },
  { name: 'Mars', progress: 45 },
  { name: 'Avril', progress: 60 },
  { name: 'Mai', progress: 75 },
  { name: 'Juin', progress: 85 }
];

// Project progress data for chart
export const projectProgressData = projects.map(project => ({
  name: project.title.substring(0, 15) + (project.title.length > 15 ? '...' : ''),
  progress: project.progress
}));


export interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'in_progress' | 'completed';
  groupId: number;
  lastUpdated: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'in_progress' | 'completed' | 'problem';
  projectId: number;
  dueDate: string;
  comments: Comment[];
  priority?: 'low' | 'medium' | 'high'; // Added for TasksList compatibility
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  timestamp: string;
}

export interface Group {
  id: number;
  name: string;
  members: string[];
  projectId: number;
  progress?: number; // Added for GroupPanel compatibility
  project?: string; // Added for GroupPanel compatibility
}

export interface Notification {
  id: number;
  type: 'task' | 'project' | 'comment';
  content: string;
  timestamp: string;
  read: boolean;
  groupId: number;
  title?: string; // Added for Notifications compatibility
  description?: string; // Added for Notifications compatibility
  time?: string; // Added for Notifications compatibility
}

export interface StatFilter {
  group?: number;
  date?: string;
  lastTask?: number;
}

export interface Deliverable {
  id: number;
  title: string;
  description: string;
  type: 'pdf' | 'code' | 'document';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedAt: string;
  submittedBy: string;
  fileUrl: string;
  annotations: Annotation[];
  comments: DeliverableComment[];
}

export interface Annotation {
  id: string;
  content: string;
  pageNumber: number;
  position: {
    x: number;
    y: number;
  };
  createdAt: string;
  createdBy: string;
}

export interface DeliverableComment {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  type: 'text' | 'annotation' | 'system';
  annotationId?: string;
}

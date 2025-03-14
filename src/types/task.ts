<<<<<<< HEAD
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'à faire' | 'en cours' | 'terminé';
    dueDate: string;
  }
  
  export interface Deliverable {
    id: string;
    taskId: string;
    name: string;
    fileUrl: string;
    submittedAt: string;
  }
  
  export interface Comment {
    id: string;
    deliverableId: string;
    author: string;
    text: string;
    timestamp: string;
  }
  
=======

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'à faire' | 'en cours' | 'terminé';
  dueDate: string;
}

export interface Deliverable {
  id: string;
  taskId: string;
  name: string;
  fileUrl: string;
  submittedAt: string;
}

export interface Comment {
  id: string;
  deliverableId: string;
  author: string;
  text: string;
  timestamp: string;
}
>>>>>>> master

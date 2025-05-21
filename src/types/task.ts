
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'à faire' | 'en cours' | 'terminé';
  dueDate: String;
  
}

export interface LivrableResponse {
  id: string;
  nom_Fichier: string;
  descreption: string;
  date_Soumission: string; // <-- tu la reçois ici
  tache_id: string;
}
export interface LivrableCreate {
  nom_Fichier: string;
  descreption: string;
  tache_id: string;
}

export interface Comment {
  id: string;
  deliverableId: string;
  author: string;
  text: string;
  timestamp: string;
}

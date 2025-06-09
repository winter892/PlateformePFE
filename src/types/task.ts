
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'à faire' | 'en cours' | 'terminé';
  dueDate: string;
  
}

export interface LivrableResponse {
  id: string;
  nom_fichier: string;
  descreption: string;
  tache: {
    id: number;
    titre: string;
    statut: string;
    dateLimite: string;
    description: string;
  };
  fichier: Fichier;
}

export interface Fichier {
  id: number;
  chemin: string;
  dateCreation: string;
  nom: string;
  taille: number;
  type: string;
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

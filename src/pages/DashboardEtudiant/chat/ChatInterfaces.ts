export interface Auteur {
  id: number;
  nom: string;
  role: 'ETUDIANT' | 'ENCADRANT';
}

export interface RawMessage {
  id: number;
  contenu: string;
  dateEnvoi: string;
  auteur: Auteur;
}

export interface Message {
  id: number;
  content: string;
  timestamp: Date;
  sender: 'self' | 'teacher' | 'other';
  senderName: string;
}

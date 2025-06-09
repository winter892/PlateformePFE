import axios from "axios";

// Configuration Axios globale
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fonctions existantes (avec légères optimisations)
export const getUserById = async (UserId: number) => {
  try {
    const response = await api.get(`/UserById/${UserId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${UserId}:`, error);
    return null;
  }
};

export const getDepartements = async (): Promise<any[]> => {
  try {
    const response = await api.get("/departements");
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des départements:", error);
    return [];
  }
};

export const getFilieres = async (departementId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/filieres/${departementId}`);
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des filières:", error);
    return [];
  }
};

export const getEncadrants = async (departementId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/Encadrants/${departementId}`);
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des encadrants:", error);
    return [];
  }
};

export const getEtudiants = async (filiereId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/Etudiants/${filiereId}`);
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
    return [];
  }
};

export const getGroupesByFiliere = async (filiereId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/groupe/Groupes/${filiereId}`);
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
    return [];
  }
};

export const getGroupes = async (): Promise<any[]> => {
  try {
    const response = await api.get("/groupe");
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes:", error);
    return [];
  }
};

export const getProjectName = async (GroupeId: number): Promise<string> => {
  try {
    const response = await api.get(`/groupe/ProjetctName/${GroupeId}`);
    return response.data || "";
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    return "";
  }
};

export const getEncadrantName = async (GroupeId: number): Promise<string> => {
  try {
    const response = await api.get(`/groupe/EncadrantName/${GroupeId}`);
    return response.data || "";
  } catch (error) {
    console.error("Erreur lors de la récupération de l'encadrant:", error);
    return "";
  }
};

export const getJurys = async (): Promise<any[]> => {
  try {
    const response = await api.get("/Jurys");
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des jurys:", error);
    return [];
  }
};

export const getEtudiantsByGroupe = async (GroupeId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/Etudiants/${GroupeId}`);
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
    return [];
  }
};

// Nouvelles fonctions pour le planning des soutenances
export const getBlocs = async (): Promise<any[]> => {
  try {
    const response = await api.get("/bloc");
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des blocs:", error);
    return [];
  }
};

export const getSallesByBloc = async (blocId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/salle/byBloc/${blocId}`);
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error);
    return [];
  }
};

export const getSoutenances = async (): Promise<any[]> => {
  try {
    const response = await api.get("/soutenances");
    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des soutenances:", error);
    return [];
  }
};

export const addSoutenance = async (soutenanceData: any): Promise<any> => {
  try {
    const response = await api.post("/soutenances", soutenanceData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la soutenance:", error);
    throw error;
  }
};

export const updateSoutenance = async (id: number, soutenanceData: any): Promise<any> => {
  try {
    const response = await api.put(`/soutenances/${id}`, soutenanceData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la soutenance:", error);
    throw error;
  }
};

export const deleteSoutenance = async (id: number): Promise<void> => {
  try {
    await api.delete(`/soutenances/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la soutenance:", error);
    throw error;
  }
};

// Fonction pour récupérer les détails complets d'une soutenance
export const getSoutenanceDetails = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`/soutenances/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails:", error);
    throw error;
  }
};


// Ajoutez cette fonction à userService.ts
export const getAdminStats = async (): Promise<any> => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return {
      totalEtudiants: 0,
      totalEncadrants: 0,
      totalDepartements: 0,
      totalFilieres: 0,
      projetsEnCours: 0,
      projetsTermines: 0
    };
  }
};
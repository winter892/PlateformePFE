import axios from "axios";

export const getUserById = async (UserId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/UserById/${UserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données de l'utilisateur avec l'id", UserId, ":", error);
    return null;
  }
};

//recuperer les departement du via ComptesController qui est dans le backEnd
export const getDepartements = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/departements`);
    console.log("Réponse de l'API:", response);  // Afficher la réponse entière
    return Array.isArray(response.data) ? response.data : [];  // Vérifier que la réponse est bien un tableau
  } catch (error) {
    console.error("Erreur lors de la récupération des départements :", error);
    return [];
  }
};
//pour les filieres

export const getFilieres = async (departementId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/filieres/${departementId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des filières :", error);
    return [];
  }
};
//pour les encadrants 
export const getEncadrants = async (departementId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/Encadrants/${departementId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des encadrants :", error);
    return [];
  }
};
//pour les etudiants 
export const getEtudiants = async (filiereId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/Etudiants/${filiereId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des etudiants :", error);
    return [];
  }
};
//pour les groupes par filieres
export const getGroupesByFiliere=async(filiere_Id)=>{
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/groupe/Groupes/${filiere_Id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    return [];
  }

}
//pour les groupes 
export const getGroupes=async()=>{
  try {
    const response = await axios.get(`http://localhost:8080/api/groupe`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    return [];
  }

}
//recupere le titre d'un proet d'un groupe donné
export const getProjectName = async(Groupe_Id)=>{
  try {
    const response = await axios.get(`http://localhost:8080/api/groupe/ProjetctName/${Groupe_Id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des donneés :", error);
    return [];
  }


}
//recuperer le nom d'encadrant d'un groupe
export const getEncadrantName =async(Groupe_id)=>{
  try {
    const response = await axios.get(`http://localhost:8080/api/groupe/EncadrantName/${Groupe_id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des donneés :", error);
    return [];
  }
}
//récuperer tout les jurys 
export const getJurys = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/Jurys`);
    console.log("Réponse de l'API:", response);  // Afficher la réponse entière
    return Array.isArray(response.data) ? response.data : [];  // Vérifier que la réponse est bien un tableau
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des jurys :", error);
    return [];
  }
};
//recuperer les etudiants d'un groupe 
export const getEtudiantsByGroupe = async (GroupeId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/Etudiants/${GroupeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des etudiants :", error);
    return [];
  }
};
//inserer les novelle soutenance 

export const addSoutenance = async (soutenanceData) => {
  return await axios.post("/api/soutenances", soutenanceData);
};
//réccuperer une tache par id
export const getTacheById = async (tacheId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/TachesById/${tacheId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche :", error);
    return null;
  }
};

//update le statut d'une tache
export const updateTacheStatut = async (tacheId :number, statut: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:8080/api/updateStatutTache/${tacheId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ statut }), 
  });

  if (!response.ok) {
    throw new Error("Échec de la mise à jour du statut de la tâche");
  }

  return await response.text();
};

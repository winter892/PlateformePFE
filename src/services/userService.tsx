import axios from "axios";



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
    const response = await axios.get(`http://localhost:8080/api/Etudiants/${filiereId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des etudiants :", error);
    return [];
  }
};
//pour les etudiants
export const getGroupes=async(filiere_Id)=>{
  try {
    const response = await axios.get(`http://localhost:8080/api/Groupes/${filiere_Id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    return [];
  }

}
//recupere le titre d'un proet d'un groupe donné
export const getProjectName = async(Groupe_Id)=>{
  try {
    const response = await axios.get(`http://localhost:8080/api/ProjetctName/${Groupe_Id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des donneés :", error);
    return [];
  }


}
//recuperer le nom d'encadrant d'un groupe
export const getEncadrantName =async(Groupe_id)=>{
  try {
    const response = await axios.get(`http://localhost:8080/api/EncadrantName/${Groupe_id}`);
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

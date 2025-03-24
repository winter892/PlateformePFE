import axios from "axios";

const REST_API_BASE_URL="http://localhost:8080/api";

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
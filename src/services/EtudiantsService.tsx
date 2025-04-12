import axios from "axios";



//recuperer les taches 
export const getTaches = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/Taches`);
    console.log("Réponse de l'API:", response);  // Afficher la réponse entière
    return Array.isArray(response.data) ? response.data : [];  // Vérifier que la réponse est bien un tableau
  } catch (error) {
    console.error("Erreur lors de la récupération des départements :", error);
    return [];
  }
};
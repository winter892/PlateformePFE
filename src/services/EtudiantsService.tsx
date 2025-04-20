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

//ajouter une atche a la base de donneé 
interface TaskPayload {
  titre: string;
  description: string;
  statut: string;
  dateLimite: String; // format "YYYY-MM-DD"
  projet_id: number;
}

export const AddTache = async (task: TaskPayload) => {
  try {
    const response = await axios.post(`http://localhost:8080/api/AddTache`, {
      titre: task.titre,
      description: task.description,
      statut: task.statut,
      dateLimite: task.dateLimite,
      projet: {
        id: task.projet_id
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’ajout de la tâche :', error);
    throw error;
  }
};

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
 
// Supprimer une tâche

export const deleteTache = async (id: string | number) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/DeletTache/${id}`);
    console.log('Tâche supprimée avec succès.');
    return response.data; // même si en général un DELETE ne retourne rien (204)
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche :', error);
    throw error; // permet au composant React de gérer l'erreur aussi
  }
};

//la liste des livrable d'une tache
export const getLivrableByTacheid = async (TacheId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/Livrables/${TacheId}`);
    console.log("Réponse de l'API:", response);  // Afficher la réponse entière
    return Array.isArray(response.data) ? response.data : [];  // Vérifier que la réponse est bien un tableau
  } catch (error) {
    console.error("Erreur lors de la récupération des livrables :", error);
    return [];
  }
};


//ajouter une livrable
interface Livrable {
  nom_Fichier: string;
  descreption: string;
  tache_id: string;
}

export const AjouterUneLivrable = async (Liv: Livrable) => {
  try {
    const response = await axios.post(`http://localhost:8080/api/AddLivrable`, {
      nom_Fichier: Liv.nom_Fichier,
      description: Liv.descreption,
      tache : {
        id: Number(Liv.tache_id)    }
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de l ajout de livrable:', error);
    throw error;
  }
};



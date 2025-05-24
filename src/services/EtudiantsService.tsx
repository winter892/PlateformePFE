import axios from "axios";

//récuperer les taches de l'etudiant connecté
export const getTaches = async (etudiantId: number) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(`http://localhost:8080/api/taches/${etudiantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Réponse de l'API:", response);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
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
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `http://localhost:8080/api/AddTache`,
      {
        titre: task.titre,
        description: task.description,
        statut: task.statut,
        dateLimite: task.dateLimite,
        projet: {
          id: task.projet_id
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’ajout de la tâche :', error);
    console.error('Erreur :', error.response?.data || error.message);

    throw error;
  }
};

// Supprimer une tâche

export const deleteTache = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`http://localhost:8080/api/DeletTache/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/Livrables/${TacheId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Réponse de l'API:", response);  // Afficher la réponse entière
    return Array.isArray(response.data) ? response.data : [];  // Vérifier que la réponse est bien un tableau
  } catch (error) {
    console.error("Erreur lors de la récupération des livrables :", error);
    return [];
  }
};
// Supprimer une livrable et son fichier asosier

export const deletLivrableAndFile = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`http://localhost:8080/api/DeleteLivrable/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('livrable et le fichier sont supprimée avec succès.');
    return response.data; // même si en général un DELETE ne retourne rien (204)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error; // permet au composant React de gérer l'erreur aussi
  }
};


//ajouter une livrable

export const AjouterUneLivrable = (formData: FormData) => {
  try{
     const token = localStorage.getItem('token');
  return axios.post("http://localhost:8080/api/AddLivrable", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    }
  });

  }catch (error) {
      console.error('Erreur lors de l ajout de livrable:', error);
      throw error;
  }
 
};

//récuperer un livrable (le fichier) avec n'inport quel format 

export const getFichierFromDeliverable = async (deliverableId: string): Promise<Blob> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8080/api/fichiers/livrable/${deliverableId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // Vérifiez si la réponse est correcte 
  if (!response.ok) {
    throw new Error("Erreur lors du chargement du fichier.");
  }
  return await response.blob(); // On récupère le fichier en tant que Blob
};

//récuperer les information d'un livrable par son id 
export const getLivrableById = async (livrableId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/livrable/${livrableId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    throw error;
  }
};
//récupérer id du projet par l'id de l'utilisateur
export const getProjetIdByUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8080/api/etudiant/${userId}/projet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.projet_id;
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    throw error;
  }
};
//récuperer les info des status des tache et progression
export async function getTacheStats(ProjetId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/stats/${ProjetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération des statistiques');
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    throw error;
  }
}





import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getDepartements, getFilieres, getEncadrants, getEtudiants,getGroupes } from "@/services/userService";

// Type pour les données de soutenance
interface Soutenance {
  id: string;
  Groupe: string;
  projet: string;
  date: string;
  heure: string;
  salle: string;
  jury: string[];
}

const PlanningSoutenances = () => {
  const [departments, setDepartments] = useState<any[]>([]); // Liste des départements récupérés
  const [filieres, setFilieres] = useState<any[]>([]); // Liste des filières récupérées
  const [groupes, setGroupes] = useState<any[]>([]); // Liste des groupes récupérées

  const [soutenances, setSoutenances] = useState<Soutenance[]>([]); // Liste des soutenances récupérées
  const [selectedDepartement, setSelectedDepartement] = useState<string | number>(""); // ID du département sélectionné
  const [selectedFiliere, setSelectedFiliere] = useState<string>(""); // Département sélectionné

  // pour la navigation
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer les départements et soutenances lors du chargement initial
  useEffect(() => {
    const fetchDepartementsAndSoutenances = async () => {
      try {
        const departementsData = await getDepartements();

        console.log("Départements récupérés:", departementsData);

        setDepartments(departementsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchDepartementsAndSoutenances();
  }, []);

  // Récupérer les filières en fonction du département sélectionné
  const handleDepartementChange = async (e) => {
    const departementId = e.target.value; // Récupérer l'ID du département sélectionné
    setSelectedDepartement(departementId); // Mettre à jour l’état

    if (departementId) {
      try {
        const filieresData = await getFilieres(departementId); // Charger les filières de ce département
        setFilieres(filieresData);
      } catch (error) {
        console.error("Erreur lors de la récupération des filières :", error);
        setFilieres([]); // En cas d'erreur, on vide la liste
      }
    } else {
      setFilieres([]); // Si aucun département n'est sélectionné, on vide la liste
    }
  };
  //Récuperer les groupes d'une filiere
   // Récupérer les filières en fonction du département sélectionné
   const handlFiliereChange = async (e) => {
    const filiereId = e.target.value; // Récupérer l'ID du département sélectionné
    setSelectedFiliere(filiereId); // Mettre à jour l’état

    if (filiereId) {
      try {
        const GroupeData = await getGroupes(filiereId); // Charger les filières de ce département
        setGroupes(GroupeData);
      } catch (error) {
        console.error("Erreur lors de la récupération des filières :", error);
        setGroupes([]); // En cas d'erreur, on vide la liste
      }
    } else {
      setGroupes([]); // Si aucun département n'est sélectionné, on vide la liste
    }
  }; 

  // État pour le formulaire d'ajout
  const [showForm, setShowForm] = useState(false);
  const [newSoutenance, setNewSoutenance] = useState<Omit<Soutenance, 'id'>>({
    Groupe: "",
    projet: "",
    date: "",
    heure: "",
    salle: "",
    jury: []
  });

  // Fonction pour ajouter une nouvelle soutenance
  const handleAddSoutenance = async () => {
    const id = Math.random().toString(36).substr(2, 9); // Générer un ID aléatoire pour la soutenance
    try {
     // await getSoutenances(); // Vous pouvez appeler une fonction d'ajout de soutenance ici, ou envoyer à votre API
      setSoutenances([...soutenances, { id, ...newSoutenance }]);
      setNewSoutenance({
        Groupe: "",
        projet: "",
        date: "",
        heure: "",
        salle: "",
        jury: []
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la soutenance:", error);
    }
  };

  // Fonction pour supprimer une soutenance
  const handleDeleteSoutenance = async (id:string) => {
    try {
     // await getSoutenances(); // Vous pouvez appeler une fonction de suppression de soutenance ici
      setSoutenances(soutenances.filter(s => s.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la soutenance:", error);
    }
  };

  return (
    <Layout>
      <button onClick={() => navigate('/gestion-horaires')} className="mb-8 flex items-center p-2 rounded-md transition border bg-blue-100 hover:bg-blue-200">
        <ArrowLeft className="w-5 h-5 mr-2" /> Retour
      </button>
      <Header title="Planning des soutenances" />
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendrier des soutenances</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une soutenance
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="bg-blue-100 p-4 rounded-md mb-6">
              <h3 className="font-semibold mb-4">Nouvelle soutenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Départements */}
                <div>
                  <label className="block text-sm font-medium mb-1">Département</label>
                  <select
                    className="w-full p-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200 ease-in-out max-h-40 overflow-y-auto" 
                    value={selectedDepartement}
                    onChange={handleDepartementChange}
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>{dep.intitule}</option>
                    ))}
                  </select>
                </div>

                {/* Filière */}
                <div>
                  <label className="block text-sm font-medium mb-1">Filière</label>
                  <select
                     className="w-full p-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-all duration-200 ease-in-out max-h-40 overflow-y-auto" 
                    value={selectedFiliere}
                    onChange={handlFiliereChange}

                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((filiere) => (
                      <option key={filiere.id} value={filiere.id}>{filiere.intitule}</option>
                    ))}
                  </select>
                </div>
                {/* groupes */}
                <div>
                  <label className="block text-sm font-medium mb-1">Groupe</label>
                  <select
                     className="w-full p-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     transition-all duration-200 ease-in-out max-h-40 overflow-y-auto" 
                    value={newSoutenance.Groupe}
                    onChange={(e) => setNewSoutenance({ ...newSoutenance, Groupe: e.target.value })}
                  >
                    <option value="">Sélectionner un groupe</option>
                    {groupes.map((grp) => (
                      <option key={grp.id} value={grp.id}>{grp.intitulé}</option>
                    ))}
                  </select>
                </div>
                
                {/* Projet */}
                <div>
                  <label className="block text-sm font-medium mb-1">Projet</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.projet}
                    onChange={(e) => setNewSoutenance({ ...newSoutenance, projet: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.date}
                    onChange={(e) => setNewSoutenance({...newSoutenance, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure</label>
                  <input 
                    type="time" 
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.heure}
                    onChange={(e) => setNewSoutenance({...newSoutenance, heure: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salle</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.salle}
                    onChange={(e) => setNewSoutenance({...newSoutenance, salle: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jury (séparés par des virgules)</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.jury.join(", ")}
                    onChange={(e) => setNewSoutenance({...newSoutenance, jury: e.target.value.split(", ")})}
                  />
                </div>

              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button onClick={handleAddSoutenance}>Enregistrer</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100 ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Groupe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Projet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Salle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Jury</th>
             



                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {soutenances.map((soutenance) => (
                  <tr key={soutenance.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.Groupe}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.projet}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.heure}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.salle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.jury.join(", ")}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteSoutenance(soutenance.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
          
        </CardContent>
      </Card>
    </Layout>
  );
};

export default PlanningSoutenances;

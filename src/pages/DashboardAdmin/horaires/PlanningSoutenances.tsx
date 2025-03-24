
import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
    const navigate = useNavigate();
  // Données simulées de soutenances
  const [soutenances, setSoutenances] = useState<Soutenance[]>([
    {
      id: "1",
      Groupe: "Mohammed Alami",
      projet: "Système de recommandation",
      date: "2023-06-15",
      heure: "10:00",
      salle: "A104",
      jury: ["Dr. Benani", "Dr. Tazi", "Dr. Chaoui"]
    },
    {
      id: "2",
      Groupe: "Fatima Zohra",
      projet: "Application mobile de gestion",
      date: "2023-06-16",
      heure: "14:30",
      salle: "B205",
      jury: ["Dr. Hakimi", "Dr. Rais", "Dr. Moussaoui"]
    }
  ]);

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
  const handleAddSoutenance = () => {
    const id = Math.random().toString(36).substr(2, 9);
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
  };

  // Fonction pour supprimer une soutenance
  const handleDeleteSoutenance = (id: string) => {
    setSoutenances(soutenances.filter(s => s.id !== id));
  };

  return (
    <Layout>
      
      
       <button onClick={() => navigate('/gestion-horaires')} className="mb-8 flex items-center p-2 rounded-md transition border bg-gray-200 hover:bg-blue-100">
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
            <div className="bg-indigo-50 p-4 rounded-md mb-6">
              <h3 className="font-semibold mb-4">Nouvelle soutenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Étudiant</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.Groupe}
                    onChange={(e) => setNewSoutenance({...newSoutenance, Groupe: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Projet</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.projet}
                    onChange={(e) => setNewSoutenance({...newSoutenance, projet: e.target.value})}
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
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Groupe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Projet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Salle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Jury</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Actions</th>
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Vue calendrier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Le calendrier interactif des soutenances sera affiché ici.</p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default PlanningSoutenances;

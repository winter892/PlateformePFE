import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus, Trash2, Edit } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

// Type pour les données de soutenance
interface Soutenance {
  id: string;
  etudiant: string;
  projet: string;
  date: string;
  heure: string;
  salle: string;
  jury: string[];
}

const PlanningSoutenances = () => {
  const [soutenances, setSoutenances] = useState<Soutenance[]>([
    {
      id: "1",
      etudiant: "Mohammed Alami",
      projet: "Système de recommandation",
      date: "2023-06-15",
      heure: "10:00",
      salle: "A104",
      jury: ["Dr. Benani", "Dr. Tazi", "Dr. Chaoui"]
    },
    {
      id: "2",
      etudiant: "Fatima Zohra",
      projet: "Application mobile de gestion",
      date: "2023-06-16",
      heure: "14:30",
      salle: "B205",
      jury: ["Dr. Hakimi", "Dr. Rais", "Dr. Moussaoui"]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newSoutenance, setNewSoutenance] = useState<Omit<Soutenance, "id">>({
    etudiant: "",
    projet: "",
    date: "",
    heure: "",
    salle: "",
    jury: []
  });

  const [editingSoutenance, setEditingSoutenance] = useState<Soutenance | null>(null);

  // Fonction pour ajouter ou modifier une soutenance
  const handleSaveSoutenance = () => {
    if (!newSoutenance.etudiant || !newSoutenance.projet || !newSoutenance.date || !newSoutenance.heure || !newSoutenance.salle || newSoutenance.jury.length === 0) {
      alert("Tous les champs doivent être remplis !");
      return;
    }

    if (editingSoutenance) {
      // Mise à jour de la soutenance existante
      setSoutenances(soutenances.map(soutenance =>
        soutenance.id === editingSoutenance.id ? { ...editingSoutenance, ...newSoutenance } : soutenance
      ));
      setEditingSoutenance(null);
    } else {
      // Ajout d'une nouvelle soutenance
      const id = Math.random().toString(36).substr(2, 9);
      setSoutenances([...soutenances, { id, ...newSoutenance }]);
    }

    setNewSoutenance({ etudiant: "", projet: "", date: "", heure: "", salle: "", jury: [] });
    setShowForm(false);
  };

  // Fonction pour supprimer une soutenance
  const handleDeleteSoutenance = (id: string) => {
    setSoutenances(soutenances.filter(s => s.id !== id));
  };

  // Fonction pour activer le mode édition
  const handleEditSoutenance = (soutenance: Soutenance) => {
    setEditingSoutenance(soutenance);
    setNewSoutenance({
      etudiant: soutenance.etudiant,
      projet: soutenance.projet,
      date: soutenance.date,
      heure: soutenance.heure,
      salle: soutenance.salle,
      jury: soutenance.jury
    });
    setShowForm(true);
  };

  return (
    <Layout>
      <Header title="Planning des soutenances" />
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendrier des soutenances</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {editingSoutenance ? "Modifier la soutenance" : "Ajouter une soutenance"}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="bg-indigo-50 p-4 rounded-md mb-6">
              <h3 className="font-semibold mb-4">{editingSoutenance ? "Modifier la soutenance" : "Nouvelle soutenance"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Étudiant</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.etudiant}
                    onChange={(e) => setNewSoutenance({ ...newSoutenance, etudiant: e.target.value })}
                  />
                </div>
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
                    onChange={(e) => setNewSoutenance({ ...newSoutenance, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.heure}
                    onChange={(e) => setNewSoutenance({ ...newSoutenance, heure: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salle</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.salle}
                    onChange={(e) => setNewSoutenance({ ...newSoutenance, salle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jury (séparés par des virgules)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newSoutenance.jury.join(", ")}
                    onChange={(e) => setNewSoutenance({ ...newSoutenance, jury: e.target.value.split(", ") })}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button onClick={handleSaveSoutenance}>Enregistrer</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Étudiant</th>
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
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.etudiant}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.projet}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.heure}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.salle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{soutenance.jury.join(", ")}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <Button onClick={() => handleEditSoutenance(soutenance)}><Edit className="h-4 w-4" /></Button>
                      <Button onClick={() => handleDeleteSoutenance(soutenance.id)}><Trash2 className="h-4 w-4" /></Button>
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

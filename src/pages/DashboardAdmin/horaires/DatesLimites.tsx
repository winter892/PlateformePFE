
import React, { useState } from "react";
import { Clock, Plus, Trash2, Edit } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

// Type pour les dates limites
interface DateLimite {
  id: string;
  filiere: string;
  description: string;
  date: string;
  notification: boolean;
}

const DatesLimites = () => {
  // Données simulées de dates limites
  const [datesLimites, setDatesLimites] = useState<DateLimite[]>([
    {
      id: "1",
      filiere: "Informatique",
      description: "Dépôt du rapport final",
      date: "2023-06-20",
      notification: true
    },
    {
      id: "2",
      filiere: "Génie Civil",
      description: "Remise des mémoires",
      date: "2023-06-25",
      notification: true
    }
  ]);

  // État pour le formulaire d'ajout
  const [showForm, setShowForm] = useState(false);
  const [newDateLimite, setNewDateLimite] = useState<Omit<DateLimite, 'id'>>({
    filiere: "",
    description: "",
    date: "",
    notification: true
  });

  // Fonction pour ajouter une nouvelle date limite
  const handleAddDateLimite = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setDatesLimites([...datesLimites, { id, ...newDateLimite }]);
    setNewDateLimite({
      filiere: "",
      description: "",
      date: "",
      notification: true
    });
    setShowForm(false);
  };

  // Fonction pour supprimer une date limite
  const handleDeleteDateLimite = (id: string) => {
    setDatesLimites(datesLimites.filter(d => d.id !== id));
  };

  return (
    <Layout>
      <Header title="Planning des dates limites de dépôt des rapports" />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dates limites</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une date limite
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="bg-indigo-50 p-4 rounded-md mb-6">
              <h3 className="font-semibold mb-4">Nouvelle date limite</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Filière</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.filiere}
                    onChange={(e) => setNewDateLimite({...newDateLimite, filiere: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.description}
                    onChange={(e) => setNewDateLimite({...newDateLimite, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date limite</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.date}
                    onChange={(e) => setNewDateLimite({...newDateLimite, date: e.target.value})}
                  />
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notification"
                    className="mr-2"
                    checked={newDateLimite.notification}
                    onChange={(e) => setNewDateLimite({...newDateLimite, notification: e.target.checked})}
                  />
                  <label htmlFor="notification" className="text-sm font-medium">Envoyer notification aux étudiants</label>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button onClick={handleAddDateLimite}>Enregistrer</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Filière</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Date limite</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Notification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datesLimites.map((dateLimite) => (
                  <tr key={dateLimite.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{dateLimite.filiere}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dateLimite.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dateLimite.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dateLimite.notification ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activée
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Désactivée
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteDateLimite(dateLimite.id)}>
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

export default DatesLimites;

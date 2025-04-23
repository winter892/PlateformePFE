import React, { useState, useEffect } from "react";
import { Clock, Plus, ArrowLeft, Trash2, Pencil } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

interface Filiere {
  id: number;
  intitule: string;
}

interface DateLimite {
  id: number;
  filiere: Filiere;
  description: string;
  date: string;
  notification: boolean;
}

const DatesLimites = () => {
  const navigate = useNavigate();
  const [datesLimites, setDatesLimites] = useState<DateLimite[]>([]);
  const [departements, setDepartements] = useState<{ id: number; intitule: string }[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [selectedDepartement, setSelectedDepartement] = useState<number | "">("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [newDateLimite, setNewDateLimite] = useState({
    filiereId: 0,
    description: "",
    date: "",
    notification: true,
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/departement`)
      .then((res) => res.json())
      .then(setDepartements)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedDepartement !== "") {
      fetch(`http://localhost:8080/api/filiere/${selectedDepartement}`)
        .then((res) => res.json())
        .then(setFilieres)
        .catch(console.error);
    } else {
      setFilieres([]);
    }
  }, [selectedDepartement]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/depot-rapport`)
      .then((res) => res.json())
      .then(setDatesLimites)
      .catch(console.error);
  }, []);

  const handleAddOrUpdate = () => {
    const payload = {
      filiere: { id: newDateLimite.filiereId },
      description: newDateLimite.description,
      date: newDateLimite.date,
      notification: newDateLimite.notification,
    };

    const url = isEditing
      ? `http://localhost:8080/api/depot-rapport/${editingId}`
      : "http://localhost:8080/api/depot-rapport";

    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isEditing) {
          setDatesLimites((prev) =>
            prev.map((item) => (item.id === editingId ? { ...item, ...data } : item))
          );
        } else {
          setDatesLimites((prev) => [...prev, data]);
        }
        resetForm();
      })
      .catch((error) => console.error("Erreur :", error));
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Supprimer cette date limite ?")) return;

    fetch(`http://localhost:8080/api/depot-rapport/${id}`, { method: "DELETE" })
      .then(() => setDatesLimites((prev) => prev.filter((d) => d.id !== id)))
      .catch(console.error);
  };

  const handleEdit = (dateLimite: DateLimite) => {
    setShowForm(true);
    setIsEditing(true);
    setEditingId(dateLimite.id);
    setNewDateLimite({
      filiereId: dateLimite.filiere.id,
      description: dateLimite.description,
      date: dateLimite.date,
      notification: dateLimite.notification,
    });
  };

  const resetForm = () => {
    setNewDateLimite({
      filiereId: 0,
      description: "",
      date: "",
      notification: true,
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <button
        onClick={() => navigate("/gestion-horaires")}
        className="mb-8 flex items-center p-2 rounded-md transition border bg-blue-100 hover:bg-blue-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Retour
      </button>

      <Header title="Planning des dates limites de dépôt des rapports" />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dates limites</CardTitle>
          <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une date
          </Button>
        </CardHeader>

        <CardContent>
          {showForm && (
            <div className="bg-blue-100 p-4 rounded-md mb-6">
              <h3 className="font-semibold mb-4">
                {isEditing ? "Modifier la date" : "Nouvelle date limite"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Département */}
                <div>
                  <label className="block text-sm font-medium mb-1">Département</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedDepartement}
                    onChange={(e) => setSelectedDepartement(Number(e.target.value) || "")}
                  >
                    <option value="">Sélectionner un département</option>
                    {departements.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.intitule}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filière */}
                <div>
                  <label className="block text-sm font-medium mb-1">Filière</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.filiereId}
                    onChange={(e) =>
                      setNewDateLimite({ ...newDateLimite, filiereId: Number(e.target.value) })
                    }
                    disabled={!selectedDepartement}
                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.intitule}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.description}
                    onChange={(e) =>
                      setNewDateLimite({ ...newDateLimite, description: e.target.value })
                    }
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">Date limite</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.date}
                    onChange={(e) => setNewDateLimite({ ...newDateLimite, date: e.target.value })}
                  />
                </div>

                {/* Notification */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notification"
                    className="mr-2"
                    checked={newDateLimite.notification}
                    onChange={(e) =>
                      setNewDateLimite({ ...newDateLimite, notification: e.target.checked })
                    }
                  />
                  <label htmlFor="notification" className="text-sm font-medium">
                    Envoyer une notification
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button onClick={handleAddOrUpdate} className="bg-blue-600 text-white hover:bg-blue-800">
                  {isEditing ? "Mettre à jour" : "Enregistrer"}
                </Button>
              </div>
            </div>
          )}

          {/* Tableau des dates */}
          <table className="w-full border-collapse border border-black-300 mt-4">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2">Filière</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Notification</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datesLimites.map((d) => (
                <tr key={d.id} className="text-center">
                  <td className="border p-2">{d.filiere?.intitule}</td>
                  <td className="border p-2">{d.description}</td>
                  <td className="border p-2">{d.date}</td>
                  <td className="border p-2">{d.notification ? "Oui" : "Non"}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <Button size="sm" onClick={() => handleEdit(d)} className=" bg-blue-600 text-white hover:bg-blue-400">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(d.id)} className=" bg-red-600 text-white hover:bg-red-400">
                      <Trash2 className="w-4 h-4 " />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DatesLimites;
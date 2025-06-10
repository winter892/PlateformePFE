import React, { useState, useEffect } from "react";
import { Clock, Plus, ArrowLeft, Trash2, Pencil } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { getEtudiants } from "../../../services/userService";

interface Filiere {
  id: number;
  intitule: string;
  departement: {
    id: number;
    intitule: string;
  };
}

interface DateLimite {
  id: number;
  filiere: Filiere;
  description: string;
  date: string;
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
  const [loading, setLoading] = useState({
    fetch: false,
    submit: false,
    delete: false,
    fetchPublic: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newDateLimite, setNewDateLimite] = useState({
    filiereId: 0,
    description: "",
    date: "",
  });

  const authFetch = React.useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    if (!token && url.startsWith('/api/')) {
      navigate('/login');
      throw new Error('Token non trouvé');
    }

    const headers = url.startsWith('/api/') 
      ? { ...options.headers, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { ...options.headers, 'Content-Type': 'application/json' };

    const response = await fetch(`http://localhost:8080${url}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      throw new Error('Session expirée');
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Réponse brute du backend :", errorData);
      throw new Error(errorData || 'Erreur de requête');
    }

    // Correction ici : si pas de contenu, ne pas parser en JSON
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  }, [navigate]);

  useEffect(() => {
    const fetchDepartements = async () => {
      setLoading(prev => ({ ...prev, fetchPublic: true }));
      try {
        const data = await fetch(`http://localhost:8080/api/departements`)
          .then(res => res.json());
        setDepartements(data);
      } catch (error) {
        console.error(error);
        setError("Erreur lors du chargement des départements");
      } finally {
        setLoading(prev => ({ ...prev, fetchPublic: false }));
      }
    };

    fetchDepartements();
  }, []);

  useEffect(() => {
    const fetchFilieres = async () => {
      if (selectedDepartement !== "") {
        setLoading(prev => ({ ...prev, fetchPublic: true }));
        try {
          const res = await fetch(`http://localhost:8080/api/filieres/${selectedDepartement}`);
          const text = await res.text();
          const data = text ? JSON.parse(text) : [];
          setFilieres(data);
        } catch (error) {
          console.error(error);
          setError("Erreur lors du chargement des filières");
        } finally {
          setLoading(prev => ({ ...prev, fetchPublic: false }));
        }
      } else {
        setFilieres([]);
      }
    };

    fetchFilieres();
  }, [selectedDepartement]);

  useEffect(() => {
    const fetchDatesLimites = async () => {
      setLoading(prev => ({ ...prev, fetch: true }));
      try {
        const data = await authFetch('/api/depot-rapport');
        setDatesLimites(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setError("Erreur lors du chargement des dates limites");
        setDatesLimites([]);
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };

    fetchDatesLimites();
  }, [authFetch]);

  const handleAddOrUpdate = async () => {
    if (!newDateLimite.filiereId || !newDateLimite.date) {
      setError("Veuillez sélectionner une filière et une date");
      return;
    }

    setLoading(prev => ({ ...prev, submit: true }));
    setError(null);
    setSuccess(null);

    const payload = {
      filiere: { id: newDateLimite.filiereId },
      description: newDateLimite.description,
      date: newDateLimite.date,
    };

    console.log("Payload envoyé :", payload);

    try {
      const url = isEditing 
        ? `/api/depot-rapport/${editingId}`
        : "/api/depot-rapport";
      
      const method = isEditing ? "PUT" : "POST";
      
      const data = await authFetch(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (isEditing) {
        setDatesLimites(prev => 
          prev.map(item => item.id === editingId ? { ...item, ...data } : item)
        );
        setSuccess("Date limite mise à jour avec succès");

        // --- AJOUT NOTIFICATIONS POUR TOUS LES ETUDIANTS DE LA FILIERE (MODIFICATION) ---
        try {
          const etudiants = await getEtudiants(newDateLimite.filiereId);
          for (const etudiant of etudiants) {
            await fetch("http://localhost:8080/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                textNotif: `Mise à jour : les dépôts de rapport pour ${data.filiere.intitule} doivent être le ${data.date} : ${data.description}`,
                userId: etudiant.id
              })
            });
          }
        } catch (notifError) {
          console.error("Erreur lors de l'envoi des notifications aux étudiants :", notifError);
        }
        // --- FIN AJOUT NOTIFICATIONS ---
      } else {
        setDatesLimites(prev => [...prev, data]);
        setSuccess("Date limite ajoutée avec succès");

        // --- AJOUT NOTIFICATIONS POUR TOUS LES ETUDIANTS DE LA FILIERE (CREATION) ---
        try {
          const etudiants = await getEtudiants(newDateLimite.filiereId);
          for (const etudiant of etudiants) {
            await fetch("http://localhost:8080/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                textNotif: `Les dépôts de rapport pour ${data.filiere.intitule} doivent être le ${data.date} : ${data.description}`,
                userId: etudiant.id
              })
            });
          }
        } catch (notifError) {
          console.error("Erreur lors de l'envoi des notifications aux étudiants :", notifError);
        }
        // --- FIN AJOUT NOTIFICATIONS ---
      }
      resetForm();
    } catch (error) {
      console.error("Erreur :", error);
      setError(error.message || "Erreur lors de l'opération");
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cette date limite ?")) return;

    setLoading(prev => ({ ...prev, delete: true }));
    setError(null);
    setSuccess(null);

    try {
      await authFetch(`/api/depot-rapport/${id}`, { method: "DELETE" });
      setDatesLimites(prev => prev.filter(d => d.id !== id));
      setSuccess("Date limite supprimée avec succès");
    } catch (error) {
      console.error(error);
      setError("Erreur lors de la suppression");
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleEdit = (dateLimite: DateLimite) => {
    setShowForm(true);
    setIsEditing(true);
    setEditingId(dateLimite.id);
    setSelectedDepartement(dateLimite.filiere.departement.id);
    setNewDateLimite({
      filiereId: dateLimite.filiere.id,
      description: dateLimite.description,
      date: dateLimite.date,
    });
  };

  const resetForm = () => {
    setNewDateLimite({
      filiereId: 0,
      description: "",
      date: "",
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
    setSelectedDepartement("");
    setError(null);
    setSuccess(null);
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
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-blue-600 text-white hover:bg-blue-800"
            disabled={loading.fetch}
          >
            {loading.fetch ? (
              <Clock className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Ajouter une date
          </Button>
        </CardHeader>

        <CardContent>
          {/* Messages d'erreur et de succès */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {loading.fetch && (
            <div className="flex justify-center py-4">
              <Clock className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          )}

          {showForm && (
            <div className="bg-blue-100 p-4 rounded-md mb-6">
              <h3 className="font-semibold mb-4">
                {isEditing ? "Modifier la date" : "Nouvelle date limite"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Département</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedDepartement}
                    onChange={(e) => setSelectedDepartement(Number(e.target.value) || "")}
                    disabled={loading.fetchPublic}
                  >
                    <option value="">Sélectionner un département</option>
                    {departements.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.intitule}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Filière</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.filiereId}
                    onChange={(e) =>
                      setNewDateLimite({ ...newDateLimite, filiereId: Number(e.target.value) })
                    }
                    disabled={!selectedDepartement || loading.fetchPublic}
                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.intitule}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.description}
                    onChange={(e) =>
                      setNewDateLimite({ ...newDateLimite, description: e.target.value })
                    }
                    disabled={loading.submit}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date limite</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={newDateLimite.date}
                    onChange={(e) => setNewDateLimite({ ...newDateLimite, date: e.target.value })}
                    disabled={loading.submit}
                  />
                </div>

                
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={loading.submit}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddOrUpdate} 
                  className="bg-blue-600 text-white hover:bg-blue-800"
                  disabled={loading.submit}
                >
                  {loading.submit ? (
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    "Mettre à jour"
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            </div>
          )}

          {!loading.fetch && (
            <table className="w-full border-collapse border border-black-300 mt-4">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border p-2">Filière</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {datesLimites.length > 0 ? (
                  datesLimites.map((d) => (
                    <tr key={d.id} className="text-center">
                      <td className="border p-2">{d.filiere?.intitule}</td>
                      <td className="border p-2">{d.description}</td>
                      <td className="border p-2">{d.date}</td>
                      <td className="border p-2 flex justify-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleEdit(d)} 
                          className="bg-blue-600 text-white hover:bg-blue-400"
                          disabled={loading.delete}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete(d.id)} 
                          className="bg-red-600 text-white hover:bg-red-400"
                          disabled={loading.delete}
                        >
                          {loading.delete ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="border p-4 text-center text-gray-500">
                      Aucune date limite trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DatesLimites;
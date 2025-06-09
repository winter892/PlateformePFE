import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Plus, Trash2, Edit, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  getDepartements,
  getFilieres,
  getGroupesByFiliere,
  getProjectName,
  getEncadrantName,
  getBlocs,
  getSallesByBloc,
  getJurys,
  getSoutenances,
  addSoutenance,
  deleteSoutenance,
} from '@/services/userService';
import Layout from '../../../components/dashboardAdmin/Layout';
import Header from '../../../components/dashboardAdmin/Header';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface Soutenance {
  id: number;
  groupe: {
    id: number;
    intitule: string;
    projet: string;
    encadrant: string;
    filiere: string;
  };
  date: string;
  heure: string;
  salle: {
    id: number;
    nom: string;
    bloc: string;
  };
  jurys: Array<{
    id: number;
    nom_complet: string;
    specialite: string;
  }>;
}

const PlanningSoutenances = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [groupes, setGroupes] = useState<any[]>([]);
  const [blocs, setBlocs] = useState<any[]>([]);
  const [salles, setSalles] = useState<any[]>([]);
  const [juryOptions, setJuryOptions] = useState<any[]>([]);
  const [soutenances, setSoutenances] = useState<Soutenance[]>([]);

  // États pour les sélections
  const [selectedDepartement, setSelectedDepartement] = useState<number | null>(null);
  const [selectedFiliere, setSelectedFiliere] = useState<number | null>(null);
  const [selectedGroupe, setSelectedGroupe] = useState<number | null>(null);
  const [selectedProjet, setSelectedProjet] = useState('');
  const [selectedEncadrant, setSelectedEncadrant] = useState('');
  const [selectedBloc, setSelectedBloc] = useState<number | null>(null);
  const [selectedSalle, setSelectedSalle] = useState<number | null>(null);
  const [selectedJurys, setSelectedJurys] = useState<number[]>([]);

  // État pour le formulaire
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    heure: '',
  });

  // Chargement initial des données
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [departementsData, blocsData, jurysData, soutenancesData] = await Promise.all([
          getDepartements(),
          getBlocs(),
          getJurys(),
          getSoutenances(),
        ]);

        setDepartments(departementsData);
        setBlocs(blocsData);
        setSoutenances(soutenancesData);

        const options = jurysData.map((jury: any) => ({
          value: jury.id,
          label: `${jury.nom_complet} (${jury.specialite})`,
        }));
        setJuryOptions(options);
      } catch (error) {
        console.error('Initial load error:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les données initiales',
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Gestion des changements de sélection
  const handleDepartementChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departementId = Number(e.target.value);
    setSelectedDepartement(departementId);
    setSelectedFiliere(null);
    setSelectedGroupe(null);
    setSelectedProjet('');
    setSelectedEncadrant('');

    if (departementId) {
      try {
        const filieresData = await getFilieres(departementId);
        setFilieres(filieresData);
      } catch (error) {
        console.error('Error fetching filieres:', error);
        setFilieres([]);
      }
    } else {
      setFilieres([]);
    }
  };

  const handleFiliereChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filiereId = Number(e.target.value);
    setSelectedFiliere(filiereId);
    setSelectedGroupe(null);
    setSelectedProjet('');
    setSelectedEncadrant('');

    if (filiereId) {
      try {
        const groupesData = await getGroupesByFiliere(filiereId);
        setGroupes(groupesData);
      } catch (error) {
        console.error('Error fetching groupes:', error);
        setGroupes([]);
      }
    } else {
      setGroupes([]);
    }
  };

  const handleGroupeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupeId = Number(e.target.value);
    setSelectedGroupe(groupeId);

    if (groupeId) {
      try {
        const [projet, encadrant] = await Promise.all([
          getProjectName(groupeId),
          getEncadrantName(groupeId),
        ]);
        setSelectedProjet(projet);
        setSelectedEncadrant(encadrant);
      } catch (error) {
        console.error('Error fetching group info:', error);
        setSelectedProjet('');
        setSelectedEncadrant('');
      }
    } else {
      setSelectedProjet('');
      setSelectedEncadrant('');
    }
  };

  const handleBlocChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const blocId = Number(e.target.value);
    setSelectedBloc(blocId);
    setSelectedSalle(null);

    if (blocId) {
      try {
        const sallesData = await getSallesByBloc(blocId);
        setSalles(sallesData);
      } catch (error) {
        console.error('Error fetching salles:', error);
        setSalles([]);
      }
    } else {
      setSalles([]);
    }
  };

  const handleSalleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const salleId = Number(e.target.value);
    setSelectedSalle(salleId);
  };

  const handleJuryChange = (selectedOptions: any) => {
    const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setSelectedJurys(values);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Ajout d'une nouvelle soutenance
  const handleAddSoutenance = async () => {
    if (!selectedGroupe || !formData.date || !formData.heure || !selectedSalle || selectedJurys.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
      });
      return;
    }

    try {
      const soutenanceData = {
        groupeId: selectedGroupe,
        date: formData.date,
        heure: formData.heure,
        salleId: selectedSalle,
        juryIds: selectedJurys,
      };

      const newSoutenance = await addSoutenance(soutenanceData);
      setSoutenances((prev) => [...prev, newSoutenance]);

      toast({
        title: 'Succès',
        description: 'La soutenance a été ajoutée avec succès',
      });

      // Réinitialiser le formulaire
      setShowForm(false);
      setSelectedGroupe(null);
      setSelectedProjet('');
      setSelectedEncadrant('');
      setSelectedBloc(null);
      setSelectedSalle(null);
      setSelectedJurys([]);
      setFormData({ date: '', heure: '' });
    } catch (error) {
      console.error('Error adding soutenance:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.response?.data?.message || 'Une erreur est survenue lors de l\'ajout',
      });
    }
  };

  // Suppression d'une soutenance
  const handleDeleteSoutenance = async (soutenanceId: number) => {
    try {
      await deleteSoutenance(soutenanceId);
      setSoutenances((prev) => prev.filter((s) => s.id !== soutenanceId));
      toast({
        title: 'Succès',
        description: 'La soutenance a été supprimée avec succès',
      });
    } catch (error) {
      console.error('Error deleting soutenance:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer la soutenance',
      });
    }
  };

  // Formatage de la date pour l'affichage
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Chargement en cours...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button
        onClick={() => navigate('/gestion-horaires')}
        className="mb-8 flex items-center p-2 rounded-md transition border bg-blue-100 hover:bg-blue-200"
      >
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
            <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200">
              <h3 className="font-semibold mb-4 text-lg text-blue-800">Nouvelle soutenance</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Département */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Département *</label>
                  <select
                    className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDepartement || ''}
                    onChange={handleDepartementChange}
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.intitule}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filière */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Filière *</label>
                  <select
                    className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedFiliere || ''}
                    onChange={handleFiliereChange}
                    disabled={!selectedDepartement}
                  >
                    <option value="">Sélectionner une filière</option>
                    {filieres.map((filiere) => (
                      <option key={filiere.id} value={filiere.id}>
                        {filiere.intitule}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Groupe */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Groupe *</label>
                  <select
                    className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedGroupe || ''}
                    onChange={handleGroupeChange}
                    disabled={!selectedFiliere}
                  >
                    <option value="">Sélectionner un groupe</option>
                    {groupes.map((groupe) => (
                      <option key={groupe.id} value={groupe.id}>
                        {groupe.intitule}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Projet */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Projet</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md bg-gray-50 cursor-not-allowed"
                    value={selectedProjet}
                    readOnly
                  />
                </div>

                {/* Encadrant */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Encadrant</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md bg-gray-50 cursor-not-allowed"
                    value={selectedEncadrant}
                    readOnly
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Date *</label>
                  <input
                    type="date"
                    name="date"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Heure */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Heure *</label>
                  <input
                    type="time"
                    name="heure"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.heure}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Bloc */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Bloc *</label>
                  <select
                    className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedBloc || ''}
                    onChange={handleBlocChange}
                  >
                    <option value="">Sélectionner un bloc</option>
                    {blocs.map((bloc) => (
                      <option key={bloc.id} value={bloc.id}>
                        {bloc.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salle */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Salle *</label>
                  <select
                    className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSalle || ''}
                    onChange={handleSalleChange}
                    disabled={!selectedBloc}
                  >
                    <option value="">Sélectionner une salle</option>
                    {salles.map((salle) => (
                      <option key={salle.id} value={salle.id}>
                        {salle.nom} (Capacité: {salle.capacite})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jury */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Jury *</label>
                  <Select
                    isMulti
                    options={juryOptions}
                    value={juryOptions.filter((option) => selectedJurys.includes(option.value))}
                    onChange={handleJuryChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Sélectionner les membres du jury..."
                    noOptionsMessage={() => 'Aucun jury disponible'}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddSoutenance}>Enregistrer</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Groupe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Filière
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Encadrant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Salle/Bloc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Jury
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {soutenances.length > 0 ? (
                  soutenances.map((soutenance) => (
                    <tr key={soutenance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{soutenance.groupe.intitule}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{soutenance.groupe.projet}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{soutenance.groupe.filiere}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{soutenance.groupe.encadrant}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(soutenance.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{soutenance.heure}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {soutenance.salle.nom} ({soutenance.salle.bloc})
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {soutenance.jurys.map((jury) => (
                            <span
                              key={jury.id}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {jury.nom_complet}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSoutenance(soutenance.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      Aucune soutenance programmée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default PlanningSoutenances;
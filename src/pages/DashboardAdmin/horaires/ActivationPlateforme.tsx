import React, { useState, useEffect } from "react";
import { Power, Bell, RefreshCw, ArrowLeft } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ActivationPlateforme = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // État initial
  const [platformStatus, setPlatformStatus] = useState({
    isActive: true,
    maintenanceMessage: "",
    reactivationDate: "",
    sendNotifications: true
  });
  const [loading, setLoading] = useState(true);
  
  // Récupérer le token du localStorage
  const token = localStorage.getItem("token");

  // Configurer axios pour inclure le token dans les requêtes
  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Charger l'état initial de la plateforme
  useEffect(() => {
    fetchPlatformStatus();
  }, []);

  const fetchPlatformStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get("/platform-status");
      setPlatformStatus({
        isActive: response.data.isActive,
        maintenanceMessage: response.data.maintenanceMessage || "",
        reactivationDate: response.data.reactivationDate 
          ? new Date(response.data.reactivationDate).toISOString().slice(0, 16)
          : "",
        sendNotifications: response.data.sendNotifications
      });
    } catch (error) {
      alert("Erreur lors du chargement du statut de la plateforme");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Basculer l'état actif/inactif
  const toggleActivation = async () => {
    try {
      const response = await api.post("/platform-status/toggle");
      setPlatformStatus(prev => ({
        ...prev,
        isActive: response.data.isActive
      }));
      alert(`Plateforme ${response.data.isActive ? 'activée' : 'désactivée'} avec succès`);
    } catch (error) {
      alert("Erreur lors du changement d'état de la plateforme");
      console.error(error);
    }
  };

  // Sauvegarder la configuration
  const saveConfiguration = async () => {
    try {
      const dataToSend = {
        ...platformStatus,
        reactivationDate: platformStatus.reactivationDate || null
      };
      
      const response = await api.put("/platform-status", dataToSend);
      setPlatformStatus({
        isActive: response.data.isActive,
        maintenanceMessage: response.data.maintenanceMessage,
        reactivationDate: response.data.reactivationDate 
          ? new Date(response.data.reactivationDate).toISOString().slice(0, 16)
          : "",
        sendNotifications: response.data.sendNotifications
      });
      alert("Configuration sauvegardée avec succès");
    } catch (error) {
      alert("Erreur lors de la sauvegarde de la configuration");
      console.error(error);
    }
  };

  // Réinitialiser les modifications locales
  const resetChanges = () => {
    fetchPlatformStatus();
  };

  // Gérer les changements dans les champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlatformStatus(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
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
      
      <Header title="Activation/Désactivation de la plateforme" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Power className="mr-2 h-5 w-5" />
              État de la plateforme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 p-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                platformStatus.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <Power className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold">
                {platformStatus.isActive ? 'Plateforme active' : 'Plateforme désactivée'}
              </h3>
              <p className="text-gray-500 text-center">
                {platformStatus.isActive 
                  ? 'La plateforme est actuellement accessible à tous les utilisateurs.' 
                  : 'La plateforme est actuellement inaccessible aux utilisateurs.'}
              </p>
              <Button 
                className={platformStatus.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} 
                size="lg"
                onClick={toggleActivation}
              >
                {platformStatus.isActive ? 'Désactiver la plateforme' : 'Activer la plateforme'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration de la désactivation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Message de maintenance</label>
                <textarea 
                  className="w-full p-2 border rounded-md h-24"
                  name="maintenanceMessage"
                  value={platformStatus.maintenanceMessage}
                  onChange={handleChange}
                  placeholder="Message à afficher aux utilisateurs pendant la maintenance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date de réactivation automatique (optionnel)</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2 border rounded-md"
                  name="reactivationDate"
                  value={platformStatus.reactivationDate}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-start mt-4">
                <input
                  id="notification"
                  name="sendNotifications"
                  type="checkbox"
                  className="mr-2 mt-1"
                  checked={platformStatus.sendNotifications}
                  onChange={handleChange}
                />
                <div>
                  <label htmlFor="notification" className="text-sm font-medium">
                    Envoyer une notification aux utilisateurs
                  </label>
                  <p className="text-xs text-gray-500">
                    Les utilisateurs seront informés de l'état de la plateforme par email
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={resetChanges}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button 
                  className="w-full"
                  onClick={saveConfiguration}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Enregistrer la configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ActivationPlateforme;
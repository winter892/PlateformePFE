
import React, { useState } from "react";
import { Power, Bell, RefreshCw, ArrowLeft } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const ActivationPlateforme = () => {
  const location = useLocation();
      const navigate = useNavigate();
  // État pour l'activation de la plateforme
  const [isActive, setIsActive] = useState(true);
  // État pour le message de maintenance
  const [maintenanceMessage, setMaintenanceMessage] = useState("La plateforme est temporairement désactivée pour maintenance.");
  // État pour la date de réactivation automatique
  const [reactivationDate, setReactivationDate] = useState("");
  // État pour l'option de notification
  const [sendNotification, setSendNotification] = useState(true);

  // Fonction pour activer/désactiver la plateforme
  const toggleActivation = () => {
    setIsActive(!isActive);
  };

  return (
    <Layout>
      
       <button onClick={() => navigate('/gestion-horaires')} className="mb-8 flex items-center p-2 rounded-md transition border bg-blue-100 hover:bg-blue-200">
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
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <Power className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold">
                {isActive ? 'Plateforme active' : 'Plateforme désactivée'}
              </h3>
              <p className="text-gray-500 text-center">
                {isActive 
                  ? 'La plateforme est actuellement accessible à tous les utilisateurs.' 
                  : 'La plateforme est actuellement inaccessible aux utilisateurs.'}
              </p>
              <Button 
                className={isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} 
                size="lg"
                onClick={toggleActivation}
              >
                {isActive ? 'Désactiver la plateforme' : 'Activer la plateforme'}
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
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="Message à afficher aux utilisateurs pendant la maintenance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date de réactivation automatique (optionnel)</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2 border rounded-md"
                  value={reactivationDate}
                  onChange={(e) => setReactivationDate(e.target.value)}
                />
              </div>

              <div className="flex items-start mt-4">
                <input
                  id="notification"
                  type="checkbox"
                  className="mr-2 mt-1"
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e.target.checked)}
                />
                <div>
                  <label htmlFor="notification" className="text-sm font-medium">Envoyer une notification aux utilisateurs</label>
                  <p className="text-xs text-gray-500">Les utilisateurs seront informés de l'état de la plateforme par email</p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button className="w-full">
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

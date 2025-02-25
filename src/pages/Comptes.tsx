
import React, { useState } from "react";
import Layout from "../components/dashboard/Layout";
import Header from "../components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User } from "lucide-react";

const Comptes = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <Layout>
      <Header title="Comptes" />
      <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
        {selectedRole ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {selectedRole === "encadrant" ? "Gestion des Encadrants" : "Gestion des Étudiants"}
              </h2>
              <Button variant="outline" onClick={() => setSelectedRole(null)}>
                Retour
              </Button>
            </div>
            <p className="text-gray-500">
              {selectedRole === "encadrant"
                ? "Gérez les comptes des encadrants et leurs permissions."
                : "Gérez les comptes des étudiants et leurs informations."}
            </p>
            {/* Contenu spécifique au rôle sélectionné - À compléter selon vos besoins */}
            <div className="mt-6 text-center text-gray-500">
              Interface de gestion des {selectedRole === "encadrant" ? "encadrants" : "étudiants"} à implémenter
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">Choisissez un type de compte à gérer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-blue-500"
                onClick={() => handleRoleSelect("encadrant")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Encadrants</CardTitle>
                  <Users className="h-6 w-6 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-500 mt-2">
                    Gérez les comptes des encadrants, leurs permissions et leurs responsabilités.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-blue-500"
                onClick={() => handleRoleSelect("etudiant")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Étudiants</CardTitle>
                  <User className="h-6 w-6 text-green-600" />
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-500 mt-2">
                    Gérez les comptes des étudiants, leurs informations et leur avancement.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Comptes;

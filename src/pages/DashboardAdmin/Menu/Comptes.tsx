
import React, { useState } from "react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, FileArchive, RefreshCcw, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Données fictives pour les départements
const departments = [
  { id: "info", name: "Informatique" },
  { id: "elec", name: "Électrique" },
  { id: "meca", name: "Mécanique" },
  { id: "civil", name: "Génie Civil" },
  { id: "indus", name: "Génie Industriel" }
];

// Données fictives pour les encadrants
const mockSupervisors = [
  { id: 1, nom: "Alaoui", prenom: "Mohammed", cin: "AB123456", departement: "info", codePFE: "" },
  { id: 2, nom: "Benani", prenom: "Sara", cin: "CD789012", departement: "info", codePFE: "" },
  { id: 3, nom: "Chraibi", prenom: "Karim", cin: "EF345678", departement: "elec", codePFE: "" },
  { id: 4, nom: "Daoudi", prenom: "Fatima", cin: "GH901234", departement: "elec", codePFE: "" },
  { id: 5, nom: "El Fassi", prenom: "Ahmed", cin: "IJ567890", departement: "meca", codePFE: "" },
];

// Données fictives pour les étudiants
const mockStudents = [
  { id: 1, nom: "Zidane", prenom: "Yasmine", codeApogee: "19000123", departement: "info", codePFE: "" },
  { id: 2, nom: "Yacoubi", prenom: "Mehdi", codeApogee: "19000456", departement: "info", codePFE: "" },
  { id: 3, nom: "Wahbi", prenom: "Leila", codeApogee: "19000789", departement: "elec", codePFE: "" },
  { id: 4, nom: "Toumi", prenom: "Hamza", codeApogee: "19000012", departement: "elec", codePFE: "" },
  { id: 5, nom: "Saadi", prenom: "Salma", codeApogee: "19000345", departement: "meca", codePFE: "" },
];

const Comptes = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [supervisors, setSupervisors] = useState(mockSupervisors);
  const [students, setStudents] = useState(mockStudents);
  const { toast } = useToast();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setSelectedDepartment(null);
  };

  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setSelectedDepartment(null);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
  };

  const generateCodes = () => {
    if (selectedRole === "encadrant") {
      const updatedSupervisors = supervisors.map(supervisor => {
        if (supervisor.departement === selectedDepartment && !supervisor.codePFE) {
          return {
            ...supervisor,
            codePFE: `PFE-${supervisor.departement.toUpperCase()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
          };
        }
        return supervisor;
      });
      setSupervisors(updatedSupervisors);
    } else {
      const updatedStudents = students.map(student => {
        if (student.departement === selectedDepartment && !student.codePFE) {
          return {
            ...student,
            codePFE: `PFE-${student.departement.toUpperCase()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
          };
        }
        return student;
      });
      setStudents(updatedStudents);
    }
    
    toast({
      title: "Codes générés",
      description: "Les codes PFE ont été générés avec succès",
      duration: 3000,
    });
  };

  const archiveList = () => {
    toast({
      title: "Liste archivée",
      description: "La liste a été archivée avec succès",
      duration: 3000,
    });
  };

  // Filtrer les personnes par département sélectionné
  const filteredSupervisors = supervisors.filter(
    (supervisor) => supervisor.departement === selectedDepartment
  );
  const filteredStudents = students.filter(
    (student) => student.departement === selectedDepartment
  );

  return (
    <Layout>
      <Header title="Comptes" />
      <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
        {/* Étape 1: Sélection du rôle */}
        {!selectedRole && (
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

        {/* Étape 2: Sélection du département */}
        {selectedRole && !selectedDepartment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Sélection du département - {selectedRole === "encadrant" ? "Encadrants" : "Étudiants"}
              </h2>
              <Button variant="outline" onClick={handleBackToRoles}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
              </Button>
            </div>
            <p className="text-gray-500 mb-6">
              Veuillez sélectionner un département pour afficher la liste des {selectedRole === "encadrant" ? "encadrants" : "étudiants"}.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <Card 
                  key={dept.id}
                  className="cursor-pointer transition-all hover:shadow-md border hover:border-blue-500"
                  onClick={() => handleDepartmentSelect(dept.id)}
                >
                  <CardHeader className="py-4">
                    <CardTitle className="text-base font-medium text-center">{dept.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Étape 3: Affichage de la liste */}
        {selectedRole && selectedDepartment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Liste des {selectedRole === "encadrant" ? "encadrants" : "étudiants"} - Département {departments.find(d => d.id === selectedDepartment)?.name}
              </h2>
              <Button variant="outline" onClick={handleBackToDepartments}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
              </Button>
            </div>
            
            <div className="flex gap-4 my-4">
              <Button onClick={generateCodes} className="bg-green-600 hover:bg-green-700">
                <RefreshCcw className="mr-2 h-4 w-4" /> Générer les codes
              </Button>
              <Button onClick={archiveList} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                <FileArchive className="mr-2 h-4 w-4" /> Archiver la liste
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>{selectedRole === "encadrant" ? "CIN" : "Code Apogée"}</TableHead>
                    <TableHead>Code PFE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRole === "encadrant" ? (
                    filteredSupervisors.length > 0 ? (
                      filteredSupervisors.map((supervisor) => (
                        <TableRow key={supervisor.id}>
                          <TableCell>{supervisor.nom}</TableCell>
                          <TableCell>{supervisor.prenom}</TableCell>
                          <TableCell>{supervisor.cin}</TableCell>
                          <TableCell>{supervisor.codePFE || "Non généré"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          Aucun encadrant trouvé dans ce département
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.nom}</TableCell>
                          <TableCell>{student.prenom}</TableCell>
                          <TableCell>{student.codeApogee}</TableCell>
                          <TableCell>{student.codePFE || "Non généré"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          Aucun étudiant trouvé dans ce département
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Comptes;

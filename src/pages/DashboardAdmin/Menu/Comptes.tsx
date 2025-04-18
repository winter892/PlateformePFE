import React, { useEffect, useState } from "react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  User,
  FileArchive,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  getDepartements,
  getFilieres,
  getEncadrants,
  getEtudiants,
} from "@/services/userService";

const Comptes = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedFiliere, setSelectedFiliere] = useState<string | null>(null);

  const [departments, setDepartments] = useState<any[]>([]);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepartements = async () => {
      const data = await getDepartements();
      setDepartments(data);
    };
    fetchDepartements();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchFilieres = async () => {
        const data = await getFilieres(selectedDepartment);
        setFilieres(data);
      };
      fetchFilieres();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchEncadrants = async () => {
        const data = await getEncadrants(selectedDepartment);
        setSupervisors(data);
      };
      fetchEncadrants();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedFiliere && selectedRole === "etudiant") {
      const fetchEtudiants = async () => {
        const data = await getEtudiants(selectedFiliere);
        setStudents(data);
      };
      fetchEtudiants();
    }
  }, [selectedFiliere, selectedRole]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setSelectedDepartment(null);
  };

  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId);
  };

  const handleFiliereSelect = (filiereId: string) => {
    setSelectedFiliere(filiereId);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setSelectedDepartment(null);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
  };

  const handleBackToFilieres = () => {
    setSelectedFiliere(null);
  };

  const generateCodes = () => {
    if (selectedRole === "encadrant") {
      const updatedSupervisors = supervisors.map((supervisor) => {
        if (!supervisor.codePFE) {
          return {
            ...supervisor,
            codePFE: `PFE-${supervisor.departement.toUpperCase()}-${Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}`,
          };
        }
        return supervisor;
      });
      setSupervisors(updatedSupervisors);
    } else {
      const updatedStudents = students.map((student) => {
        if (!student.codePFE) {
          return {
            ...student,
            codePFE: `PFE-${student.departement.toUpperCase()}-${Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}`,
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

  return (
    <Layout>
      <Header title="Comptes" />
      <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
        {!selectedRole && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">
              Choisissez un type de compte à gérer
            </h2>
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
              {selectedRole === "encadrant"
                ? "Veuillez sélectionner un département pour afficher la liste des encadrants"
                : "Veuillez sélectionner un département pour afficher la liste des filières"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <Card
                  key={dept.id}
                  className="cursor-pointer transition-all hover:shadow-md border hover:border-blue-500"
                  onClick={() => handleDepartmentSelect(dept.id)}
                >
                  <CardHeader className="py-4">
                    <CardTitle className="text-base font-medium text-center">
                      {dept.intitule}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedRole === "etudiant" && selectedDepartment && !selectedFiliere && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sélection du Filière des Étudiants</h2>
              <Button variant="outline" onClick={handleBackToDepartments}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
              </Button>
            </div>
            <p className="text-gray-500 mb-6">
              Veuillez sélectionner une filière pour afficher la liste des étudiants
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filieres.map((fil) => (
                <Card
                  key={fil.id}
                  className="cursor-pointer transition-all hover:shadow-md border hover:border-blue-500"
                  onClick={() => handleFiliereSelect(fil.id)}
                >
                  <CardHeader className="py-4">
                    <CardTitle className="text-base font-medium text-center">
                      {fil.intitule}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedRole && selectedDepartment && (selectedRole === "encadrant" || selectedFiliere) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Liste des{selectedRole === "encadrant" ? "encadrants" : "étudiants"}{" "}
                {selectedRole === "encadrant"
                  ?` - Département : ${departments.find((d) => d.id === selectedDepartment)?.intitule || ""}`
                  : -` Filière : ${filieres.find((f) => f.id === selectedFiliere)?.intitule || ""}`}
              </h2>
              <Button variant="outline" onClick={selectedRole === "encadrant" ? handleBackToDepartments : handleBackToFilieres}>
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
                    <TableHead>{selectedRole === "encadrant" ? "Email" : "Code Apogée"}</TableHead>
                    <TableHead>Code D'authentification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRole === "encadrant"
                    ? supervisors.length > 0
                      ? supervisors.map((supervisor) => (
                          <TableRow key={supervisor.id}>
                            <TableCell>{supervisor.nom}</TableCell>
                            <TableCell>{supervisor.prenom}</TableCell>
                            <TableCell>{supervisor.adresseEmail}</TableCell>
                            <TableCell>{supervisor.codePFE || "Non généré"}</TableCell>
                          </TableRow>
                        ))
                      : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            Aucun encadrant trouvé dans ce département
                          </TableCell>
                        </TableRow>
                      )
                    : students.length > 0
                      ? students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.nom}</TableCell>
                            <TableCell>{student.prenom}</TableCell>
                            <TableCell>{student.codeApogee}</TableCell>
                            <TableCell>{student.codePFE || "Non généré"}</TableCell>
                          </TableRow>
                        ))
                      : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            Aucun étudiant trouvé dans cette filière
                          </TableCell>
                        </TableRow>
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

export default Comptes;
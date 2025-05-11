
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff } from 'lucide-react';
import PasswordStrength from '../PasswordStrength';
import PasswordGenerator from '../PasswordGenerator';
import { departments } from '@/data/departmentData';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { getDepartements,getFilieres } from '@/services/userService';

const SupervisorForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    departmentId: '',
    FiliereId: '',
    specialty: '',
    password: ''
  });
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]); // Liste des départements récupérés
  const [selectedDepartement, setSelectedDepartement] = useState<string | number>(""); // ID du département sélectionné
  const [filieres, setFilieres] = useState<any[]>([]); // Liste des filières récupérées
  const navigate = useNavigate();
  
  

  // Récupérer les départements lors du chargement initiale
   useEffect(() => {
     const fetchDepartementsAndSoutenances = async () => {
       try {
         const departementsData = await getDepartements();
 
         console.log("Départements récupérés:", departementsData);
 
         setDepartments(departementsData);
       } catch (error) {
         console.error("Erreur lors de la récupération des données:", error);
       }
     };
 
     fetchDepartementsAndSoutenances();
   }, []);

  //lors du changement de département il fuat changer la liste des filieres
  
  const handleDepartementChange = async (e) => {
    const selectedDeptId = e.target.value;
    setFormData(prev => ({ ...prev, departmentId: selectedDeptId, FiliereId: '' }));
  
    if (selectedDeptId) {
      try {
        const filieresData = await getFilieres(selectedDeptId);
        if (filieresData.length === 0) {
          setFilieres([]);
          alert("Ce département n'a pas de filières disponibles.");
        } else {
          setFilieres(filieresData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des filières :", error);
        setFilieres([]);
      }
    } else {
      setFilieres([]);
    }
  };
  
    
 
  const handleInputChange= (event) =>{

    const {name, value} = event.target;
    setFormData({
      ...formData,
      [name]:value,
    })
  }


  const handlePasswordGenerate = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
  
    toast({
      title: "Mot de passe généré",
      description: "Pensez à copier ce mot de passe quelque part avant de valider.",
      duration: 5000,
      variant: "default", // ou "warning" si supporté
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.lastName || !formData.firstName || !formData.email || 
        !formData.departmentId || !formData.FiliereId || 
        !formData.specialty || !formData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.email.includes('@')) {
      toast({
        title: "Erreur",
        description: "L'adresse e-mail institutionnelle est invalide",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Compte créé avec succès",
        description: `Le compte encadrant pour ${formData.firstName} ${formData.lastName} a été créé.`,
      });
      
      // Reset form
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        departmentId: '',
        FiliereId: '',
        specialty: '',
        password: ''
      });
    }, 1500);
  };*/
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Valide les champs ici si nécessaire...
  
    // Préparation des données au bon format
    const mappedData = {
      nom: formData.lastName,
      prenom: formData.firstName,
      adresseEmail: formData.email,
      password: formData.password,
      specialite: formData.specialty,
      filiereId: parseInt(formData.FiliereId), // s'assurer que c'est un nombre
      role: "encadrant"
    };
    const handleSpaceClick = (userType: string) => {
      navigate('/login', { state: { userType } });
    };
  
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(mappedData)
      });
    
      const data = await response.json(); // Lire la réponse JSON
    
      // Vérifie le contenu de la réponse, pas juste le status HTTP
      if (data.statusCode === 500 && data.error?.includes("email")) {
        toast({
          title: "Email déjà utilisé",
          description: "Un compte avec cette adresse e-mail existe déjà.",
          variant: "destructive"
        });
        return;
      }
    
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
    
      toast({
        title: "Compte créé avec succès",
        description: `Le compte de ${formData.firstName} ${formData.lastName} a été enregistré avec succès.`,
        duration: 3000, // facultatif, contrôle le temps d'affichage
       
      });
      // Rediriger après 3 secondes
setTimeout(() => {
  handleSpaceClick('encadrant')}, 3000);
      
    
      // Réinitialiser le formulaire
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        departmentId: '',
        FiliereId: '',
        specialty: '',
        password: ''
      });
    
    } catch (error) {
      console.log("Erreur lors de la création :", error.message);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du compte.",
        variant: "destructive"
      });
    }
    
  };
  
  return (
    <div className="form-container animate-slide-in">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full supervisor-gradient text-white">
        <User size={32} />
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Créer un Compte Encadrant</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lastName" className="form-label">Nom</label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            className="form-input focus:ring-purple-500"
            placeholder="Martin"
            required
          />
        </div>
        
        <div>
          <label htmlFor="firstName" className="form-label">Prénom</label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            className="form-input focus:ring-purple-500"
            placeholder="Sophie"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Adresse e-mail institutionnelle</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input focus:ring-purple-500"
            placeholder="sophie.martin@univ.fr"
            required
          />
        </div>
        
        <div>
          <label htmlFor="departmentId" className="form-label">Département</label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleDepartementChange}
            className="form-select focus:ring-purple-500"
            required
          >
            <option value=""  className="text-gray-400 italic">Sélectionner un département</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.intitule}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="FiliereId" className="form-label">Filière</label>
          <select
            id="FiliereId"
            name="FiliereId"
            value={formData.FiliereId}
            onChange={handleInputChange}
            className="form-select focus:ring-purple-500"
            disabled={!formData.departmentId}
          
          >
             <option value="" className="text-gray-400 italic">Sélectionner une filiere</option>
            {filieres.map((filiere) => (
                          <option key={filiere.id} value={filiere.id}>
                            {filiere.intitule}
                           </option>
                        ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="specialty" className="form-label">Spécialité</label>
          <Input
            id="specialty"
            name="specialty"
            type="text"
            value={formData.specialty}
            onChange={handleInputChange}
            className="form-input focus:ring-purple-500"
            placeholder="Intelligence Artificielle, Big Data, Réseaux, etc."
            required
          />
        </div>
        
        <div>
          
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <div className="flex space-x-2">
                  <div className="relative flex-grow">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-input focus:ring-purple-500 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button 
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                  </div>
                  <PasswordGenerator 
                        onGenerate={handlePasswordGenerate}
                        buttonColor="bg-purple-500 hover:bg-purple-600" 
                  />
                  
            </div>
            <PasswordStrength password={formData.password} />
        </div>
        <div className="text-sm text-yellow-600 mt-1">
                      ⚠️ N'oubliez pas de copier votre mot de passe avant de soumettre le formulaire.
                    </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-md hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <span className="loader mr-2"></span>
              Création en cours...
            </>
          ) : (
            "Créer le compte"
          )}
        </button>
      </form>
    </div>
  );
};

export default SupervisorForm;

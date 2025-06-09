import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import PasswordStrength from '../PasswordStrength';
import PasswordGenerator from '../PasswordGenerator';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { getDepartements, getFilieres } from '@/services/userService';

const StudentForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    apogeCode: '',
    departmentId: '',
    filiereId: '',
    password: ''
  });
  const [departments, setDepartments] = useState<any[]>([]);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const departementsData = await getDepartements();
        setDepartments(departementsData);
      } catch (error) {
        console.error("Erreur de chargement des départements:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les départements",
          variant: "destructive"
        });
      }
    };
    fetchDepartements();
  }, []);

  useEffect(() => {
    const fetchFilieres = async () => {
      if (formData.departmentId) {
        try {
          const filieresData = await getFilieres(formData.departmentId);
          setFilieres(filieresData);
          setFormData(prev => ({ ...prev, filiereId: '' }));
        } catch (error) {
          console.error("Erreur de chargement des filières:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les filières",
            variant: "destructive"
          });
          setFilieres([]);
        }
      }
    };
    fetchFilieres();
  }, [formData.departmentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordGenerate = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    toast({
      title: "Mot de passe généré",
      description: "Copiez ce mot de passe avant soumission !",
      duration: 5000,
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateForm = () => {
    if (!/^\d+$/.test(formData.apogeCode)) {
      toast({
        title: "Code Apogée invalide",
        description: "Le code doit contenir uniquement des chiffres",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.toLowerCase().endsWith('@usms.ac.ma')) {
      toast({
        title: "Email invalide",
        description: "L'email doit être une adresse institutionnelle USMS (@usms.ac.ma)",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const studentData = {
      nom: formData.lastName,
      prenom: formData.firstName,
      adresseEmail: formData.email,
      password: formData.password,
      code_APOGEE: formData.apogeCode,
      filiereId: parseInt(formData.filiereId),
      role: "etudiant"
    };

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }
      // Vérifie le contenu de la réponse, pas juste le status HTTP
      if (data.statusCode === 500 && data.error?.includes("email")) {
        toast({
          title: "Email déjà utilisé",
          description: "Un compte avec cette adresse e-mail existe déjà.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Inscription réussie 🎓",
        description: `Bienvenue ${formData.firstName} ${formData.lastName} !`
      });

      // Récupérer l'ID utilisateur puis enregistrer la notification
      try {
        const userRes = await fetch(`http://localhost:8080/api/utilisateur/${encodeURIComponent(formData.email)}`);
        const userData = await userRes.json();
        if (userRes.ok && userData.id) {
          await fetch("http://localhost:8080/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              textNotif: `Bienvenue ${formData.firstName} ${formData.lastName}, votre compte a été créé avec succès.`,
              userId: userData.id
            })
          });
        }
      } catch (notifError) {
        console.error("Erreur lors de l'enregistrement de la notification:", notifError);
      }

      setTimeout(() => navigate('/login', { state: { userType: 'etudiant' } }), 2000);

      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        apogeCode: '',
        departmentId: '',
        filiereId: '',
        password: ''
      });

    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message.includes("existe déjà") 
          ? error.message 
          : "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white">
          <GraduationCap size={32} />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Inscription Étudiant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Naji"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ahmmed"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email universitaire</label>
            <Input
          type="email"
          name="email"
           value={formData.email}
           onChange={handleChange}
            placeholder="prenom.nom@usms.ac.ma"
          pattern="[a-zA-Z0-9._%+-]+@usms\.ac\.ma"
          title="Adresse email USMS valide requis (ex: prenom.nom@usms.ac.ma)"
          required
/>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Code Apogée</label>
            <Input
              name="apogeCode"
              value={formData.apogeCode}
              onChange={handleChange}
              placeholder="12345678"
              pattern="\d*"
              title="Uniquement des chiffres"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Département</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Sélectionnez un département</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.intitule}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Filière</label>
              <select
                name="filiereId"
                value={formData.filiereId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!formData.departmentId}
                required
              >
                <option value="">
                  {formData.departmentId 
                    ? "Sélectionnez une filière" 
                    : "Choisissez d'abord un département"}
                </option>
                {filieres.map((filiere) => (
                  <option key={filiere.id} value={filiere.id}>
                    {filiere.intitule}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <PasswordGenerator 
                onGenerate={handlePasswordGenerate}
                buttonColor="bg-green-500 hover:bg-green-600"
              />
            </div>
            <PasswordStrength password={formData.password} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <span className="loader mr-2"></span>
                Création en cours...
              </div>
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
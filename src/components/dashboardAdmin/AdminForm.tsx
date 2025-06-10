import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Eye, EyeOff } from 'lucide-react';
import PasswordStrength from '../PasswordStrength';
import PasswordGenerator from '../PasswordGenerator';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const AdminForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordGenerate = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    toast({
      title: "Mot de passe généré",
      description: "Copiez ce mot de passe avant de soumettre !",
      duration: 5000,
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateForm = () => {
    // Validation email USMS
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@usms\.ac\.ma$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email invalide",
        description: "Format requis : prenom.nom@usms.ac.ma",
        variant: "destructive"
      });
      return false;
    }

    // Validation nom/prénom
    const nameRegex = /^[a-zA-ZÀ-ÿ -]{2,}$/;
    if (!nameRegex.test(formData.lastName) || !nameRegex.test(formData.firstName)) {
      toast({
        title: "Nom invalide",
        description: "Doit contenir uniquement des lettres (min 2 caractères)",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const adminData = {
        nom: formData.lastName,
        prenom: formData.firstName,
        adresseEmail: formData.email,
        password: formData.password,
        role: "admin" // Rôle spécifique pour l'admin
      };

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      toast({
        title: "Administrateur créé 🎉",
        description: `${formData.firstName} ${formData.lastName} a été enregistré avec succès`,
      });

      // Enregistrer une notification pour l'admin créé
      try {
        // Attendre un peu pour que l'utilisateur soit bien créé côté backend
        await new Promise(r => setTimeout(r, 400));
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
        } else {
          console.error("Impossible de récupérer l'utilisateur pour la notification");
        }
      } catch (notifError) {
        console.error("Erreur lors de l'enregistrement de la notification:", notifError);
      }

      setTimeout(() => {
        handleSpaceClick('admin')}, 3000);
      const handleSpaceClick = (userType: string) => {
        navigate('/login', { state: { userType } });
      };

      // Réinitialisation du formulaire
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        password: ''
      });

    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur d'enregistrement",
        description: error.message.includes("existe déjà") 
          ? "Cet email est déjà utilisé" 
          : "Une erreur est survenue avec le serveur",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <ClipboardList size={32} />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Nouveau Administrateur
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Dupont"
                minLength={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Marie"
                minLength={2}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email institutionnel</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="prenom.nom@usms.ma"
              pattern="[a-zA-Z]+\.[a-zA-Z]+@usms\.ac\.ma"
              title="Format: prenom.nom@usms.ma"
              required
            />
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
                  minLength={8}
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
                buttonColor="bg-blue-500 hover:bg-blue-600 text-white"
              />
            </div>
            <PasswordStrength password={formData.password} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">🌀</span>
                Création...
              </span>
            ) : "Créer l'administrateur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
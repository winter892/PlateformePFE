
import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordGenerate = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.lastName || !formData.firstName || !formData.email || !formData.password) {
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
        description: "L'adresse e-mail est invalide",
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
        description: `Le compte administrateur pour ${formData.firstName} ${formData.lastName} a été créé.`,
      });
      
      // Reset form
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        password: ''
      });
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-gray-20 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl form-container animate-slide-in bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full admin-gradient text-white">
          <ClipboardList size={32} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Créer un Compte Administrateur</h2>
  
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lastName" className="form-label">Nom</label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input focus:ring-blue-500"
            placeholder="Votre Prenom"
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
            onChange={handleChange}
            className="form-input focus:ring-blue-500"
            placeholder="Votre Nom"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Adresse e-mail</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input focus:ring-blue-500"
            placeholder="Nom.Prenom@gmail.com"
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
                onChange={handleChange}
                className="form-input focus:ring-blue-500 pr-10 w-full"
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
              buttonColor="bg-blue-500 hover:bg-blue-600"
            />
          </div>
          <PasswordStrength password={formData.password} />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all disabled:opacity-70"
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
    </div>
  );
  

};

export default AdminForm;


import React, { useState, useEffect } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import PasswordStrength from '../PasswordStrength';
import PasswordGenerator from '../PasswordGenerator';
import { departments } from '@/data/departmentData';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const SupervisorForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    departmentId: '',
    programId: '',
    specialty: '',
    password: ''
  });
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (formData.departmentId) {
      const selectedDepartment = departments.find(d => d.id === formData.departmentId);
      setPrograms(selectedDepartment?.programs || []);
      setFormData(prev => ({ ...prev, programId: '' }));
    } else {
      setPrograms([]);
    }
  }, [formData.departmentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    if (!formData.lastName || !formData.firstName || !formData.email || 
        !formData.departmentId || !formData.programId || 
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
        programId: '',
        specialty: '',
        password: ''
      });
    }, 1500);
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="form-select focus:ring-purple-500"
            required
          >
            <option value="">Sélectionner un département</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="programId" className="form-label">Filière</label>
          <select
            id="programId"
            name="programId"
            value={formData.programId}
            onChange={handleChange}
            className="form-select focus:ring-purple-500"
            disabled={!formData.departmentId}
            required
          >
            <option value="">
              {formData.departmentId 
                ? "Sélectionner une filière" 
                : "Veuillez d'abord sélectionner un département"}
            </option>
            {programs.map(program => (
              <option key={program.id} value={program.id}>
                {program.name}
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
            onChange={handleChange}
            className="form-input focus:ring-purple-500"
            placeholder="Intelligence Artificielle, Big Data, Réseaux, etc."
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <PasswordGenerator 
              onGenerate={handlePasswordGenerate}
              buttonColor="bg-purple-500 hover:bg-purple-600" 
            />
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
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
          <PasswordStrength password={formData.password} />
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

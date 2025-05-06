
import React, { useState, useEffect } from 'react';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import PasswordStrength from '../PasswordStrength';
import PasswordGenerator from '../PasswordGenerator';
import { departments } from '@/data/departmentData';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const StudentForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    apogeCode: '',
    departmentId: '',
    programId: '',
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
        !formData.apogeCode || !formData.departmentId || !formData.programId || 
        !formData.password) {
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
        description: "L'adresse e-mail universitaire est invalide",
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
        description: `Le compte étudiant pour ${formData.firstName} ${formData.lastName} a été créé.`,
      });
      
      // Reset form
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        apogeCode: '',
        departmentId: '',
        programId: '',
        password: ''
      });
    }, 1500);
  };

  return (
    
      <div className="min-h-screen bg-gray-20 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl form-container animate-slide-in bg-white pl-8 pr-8 pb-8 rounded-lg shadow-md">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full student-gradient text-white">
        <GraduationCap size={32} />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Créer un Compte Étudiant</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lastName" className="form-label">Nom</label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input focus:ring-green-500"
            placeholder="Dupont"
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
            className="form-input focus:ring-green-500"
            placeholder="Marie"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Adresse e-mail universitaire</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input focus:ring-green-500"
            placeholder="marie.dupont@etudiant.univ.fr"
            required
          />
        </div>
        
        <div>
          <label htmlFor="apogeCode" className="form-label">Code Apogée</label>
          <Input
            id="apogeCode"
            name="apogeCode"
            type="text"
            value={formData.apogeCode}
            onChange={handleChange}
            className="form-input focus:ring-green-500"
            placeholder="21345678"
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
            className="form-select focus:ring-green-500"
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
            className="form-select focus:ring-green-500"
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
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <div className="flex space-x-2">
                    <div className="relative flex-grow">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input focus:ring-green-500 pr-10"
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
                        buttonColor="bg-green-500 hover:bg-green-600"
                      />
            </div>
            <PasswordStrength password={formData.password} />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-md hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all disabled:opacity-70"
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

export default StudentForm;


import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeViewerProps {
  component: string;
}

const getComponentCode = (component: string): string => {
  switch (component) {
    case 'admin':
      return `// AdminForm.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import PasswordGenerator from '@/components/PasswordGenerator';
import PasswordStrength from '@/components/PasswordStrength';

const AdminForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordGenerate = (generatedPassword: string) => {
    setFormData({ ...formData, password: generatedPassword });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Admin account created:', formData);
      setIsSubmitting(false);
      // Reset form or show success message
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form form-container">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastName" className="form-label">Nom</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="firstName" className="form-label">Prénom</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="form-label">Adresse e-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="form-input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <PasswordGenerator 
              onGenerate={handlePasswordGenerate} 
              buttonColor="bg-blue-500 hover:bg-blue-600" 
            />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="form-input"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordStrength password={formData.password} />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <span className="loader mr-2"></span>
              Création en cours...
            </>
          ) : (
            "Créer le compte"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AdminForm;`;
    case 'student':
      return `// StudentForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import PasswordGenerator from '@/components/PasswordGenerator';
import PasswordStrength from '@/components/PasswordStrength';
import { departments } from '@/data/departmentData';

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    code: "",
    department: "",
    program: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (formData.department) {
      const selectedDept = departments.find(d => d.id === formData.department);
      setAvailablePrograms(selectedDept?.programs || []);
      setFormData(prev => ({...prev, program: ""}));
    }
  }, [formData.department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordGenerate = (generatedPassword: string) => {
    setFormData({ ...formData, password: generatedPassword });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Student account created:', formData);
      setIsSubmitting(false);
      // Reset form or show success message
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="student-form form-container">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastName" className="form-label">Nom</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="firstName" className="form-label">Prénom</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="form-label">Adresse e-mail universitaire</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="form-input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="code" className="form-label">Code Apogée</label>
          <input
            id="code"
            name="code"
            type="text"
            required
            className="form-input"
            value={formData.code}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className="form-label">Département</label>
            <select
              id="department"
              name="department"
              required
              className="form-select"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Sélectionnez un département</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="program" className="form-label">Filière</label>
            <select
              id="program"
              name="program"
              required
              disabled={!formData.department}
              className="form-select"
              value={formData.program}
              onChange={handleChange}
            >
              <option value="">Sélectionnez une filière</option>
              {availablePrograms.map(program => (
                <option key={program.id} value={program.id}>{program.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <PasswordGenerator 
              onGenerate={handlePasswordGenerate} 
              buttonColor="bg-green-500 hover:bg-green-600" 
            />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="form-input"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordStrength password={formData.password} />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white"
        >
          {isSubmitting ? (
            <>
              <span className="loader mr-2"></span>
              Création en cours...
            </>
          ) : (
            "Créer le compte"
          )}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;`;
    case 'supervisor':
      return `// SupervisorForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import PasswordGenerator from '@/components/PasswordGenerator';
import PasswordStrength from '@/components/PasswordStrength';
import { departments } from '@/data/departmentData';

const SupervisorForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    program: "",
    specialty: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (formData.department) {
      const selectedDept = departments.find(d => d.id === formData.department);
      setAvailablePrograms(selectedDept?.programs || []);
      setFormData(prev => ({...prev, program: ""}));
    }
  }, [formData.department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordGenerate = (generatedPassword: string) => {
    setFormData({ ...formData, password: generatedPassword });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Supervisor account created:', formData);
      setIsSubmitting(false);
      // Reset form or show success message
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="supervisor-form form-container">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastName" className="form-label">Nom</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="firstName" className="form-label">Prénom</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="form-label">Adresse e-mail institutionnelle</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="form-input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className="form-label">Département</label>
            <select
              id="department"
              name="department"
              required
              className="form-select"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Sélectionnez un département</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="program" className="form-label">Filière</label>
            <select
              id="program"
              name="program"
              required
              disabled={!formData.department}
              className="form-select"
              value={formData.program}
              onChange={handleChange}
            >
              <option value="">Sélectionnez une filière</option>
              {availablePrograms.map(program => (
                <option key={program.id} value={program.id}>{program.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="specialty" className="form-label">Spécialité</label>
          <input
            id="specialty"
            name="specialty"
            type="text"
            required
            className="form-input"
            value={formData.specialty}
            onChange={handleChange}
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
          <input
            id="password"
            name="password"
            type="password"
            required
            className="form-input"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordStrength password={formData.password} />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white"
        >
          {isSubmitting ? (
            <>
              <span className="loader mr-2"></span>
              Création en cours...
            </>
          ) : (
            "Créer le compte"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SupervisorForm;`;
    default:
      return "// Sélectionnez un type de compte pour voir son code source";
  }
};

const CodeViewer: React.FC<CodeViewerProps> = ({ component }) => {
  return (
    <div className="code-viewer bg-gray-900 text-gray-100 rounded-lg p-4 mt-4 shadow-lg">
      <ScrollArea className="h-[500px]">
        <pre className="text-xs md:text-sm">
          <code>{getComponentCode(component)}</code>
        </pre>
      </ScrollArea>
    </div>
  );
};

export default CodeViewer;

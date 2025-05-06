// CreateAdminAccount.jsx
import React, { useState } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';

const CreateAdminAccount = () => {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'password') assessPassword(value);
  };

  const assessPassword = (pwd) => {
    let strength = 'Faible';
    if (pwd.length > 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^\w\s]/.test(pwd)) {
      strength = 'Fort';
    } else if (pwd.length >= 6) {
      strength = 'Moyen';
    }
    setPasswordStrength(strength);
  };

  const generatePassword = () => {
    const strongPwd = Math.random().toString(36).slice(-8) + '@1A';
    setForm({ ...form, password: strongPwd });
    assessPassword(strongPwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Compte administrateur créé.');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
          <ClipboardList className="text-white w-8 h-8" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Créer un compte Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" required className="w-full border p-3 rounded" />
        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" required className="w-full border p-3 rounded" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full border p-3 rounded" />
        <div className="relative">
          <input type="text" name="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" required className="w-full border p-3 rounded" />
          <button type="button" onClick={generatePassword} className="absolute right-2 top-2 text-sm text-blue-600">Générer</button>
        </div>
        <p className={`text-sm ${passwordStrength === 'Fort' ? 'text-green-600' : passwordStrength === 'Moyen' ? 'text-yellow-600' : 'text-red-600'}`}>Sécurité : {passwordStrength}</p>
        <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Créer le compte'}
        </button>
      </form>
    </div>
  );
};

export default CreateAdminAccount;

// Les composants pour Etudiant et Encadrant suivront le même modèle, avec les champs spécifiques à chaque rôle.

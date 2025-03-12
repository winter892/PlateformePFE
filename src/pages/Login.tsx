import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Loader2, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType || 'utilisateur';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    console.log('Login attempt:', { email, password, userType });
    
    // Redirection en fonction du type d'utilisateur
    switch (userType) {
      case 'admin':
        navigate('/IndexAdmin');
        break;
      case 'encadrant':
        navigate('/IndexEncadrant');
        break;
      case 'etudiant':
        navigate('/IndexEtudiant');
        break;
      default:
        navigate('/');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Si un compte existe avec cet email, vous recevrez les instructions de réinitialisation.');
    setShowForgotPassword(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center">
          <ArrowLeft className="w-5 h-5 mr-2" /> Retour
        </button>

        <div className="rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Connexion</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Adresse email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-xl"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-xl"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl bg-blue-600 text-white">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

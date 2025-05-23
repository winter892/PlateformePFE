import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, icons, Loader2, User, GraduationCap, ClipboardList, Mail } from 'lucide-react';
const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType || 'utilisateur';
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adresseEmail: identifier,
          password: password
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login réussi:', data);
  
        // Stockage du token
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('id', data.id);
  
        // Redirection selon le rôle
        let destination;
        switch (data.role) {
          case 'ENCADRANT':
            destination = '/IndexEncadrant';
            break;
          case 'ETUDIANT':
            destination = '/IndexEtudiant';
            break;
          case 'ADMIN':
            destination = '/IndexAdmin';
            break;
          default:
            alert( data.message ||'Échec de l\'authentification');
            destination = '/';
            break;
        }
  
        navigate(destination);
      } else {
        alert(data.message || 'Échec de l\'authentification');
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur de connexion au serveur.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Si un compte existe avec cet identifiant et cette adresse e-mail, vous recevrez les instructions de réinitialisation.');
    setShowForgotPassword(false);
    setResetIdentifier('');
    setResetEmail('');
  };

  const getUserDetails = () => {
    switch (userType) {
      case 'encadrant':
        return { icon: <User className="w-8 h-8 text-white" />, color: 'bg-gradient-to-r from-purple-500 to-purple-700' };
      case 'etudiant':
        return { icon: <GraduationCap className="w-8 h-8 text-white" />, color: 'bg-gradient-to-r from-green-400 to-green-600' }; // Dégradé vert clair à foncé
      case 'admin':
        return { icon: <ClipboardList className="w-8 h-8 text-white" />, color: 'bg-gradient-to-r from-blue-500 to-blue-700' };
      default:
        return { icon: <User className="w-8 h-8 text-white" />, color: 'bg-blue-500' };
    }
  };

  const { icon, color } = getUserDetails();

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full relative">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto mb-4 ${color} rounded-full flex items-center justify-center`}>
              {icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Connexion</h2>
            <p className="text-gray-600">Connectez-vous à votre compte</p>
          </div>

          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Email
                </label>
                <input
                  type='email'
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder= 'Prenom.nom@usms.ac.ma'
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 text-white rounded-lg hover:${color.replace('bg-', 'hover:bg-')}-700 disabled:opacity-50 ${color}`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Se connecter'}
              </button>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="mt-2 text-center">
                  <button
                    onClick={() => {
                      switch (userType) {
                        case 'etudiant':
                          navigate('/StudentForm');
                          break;
                        case 'encadrant':
                          navigate('/SupervisorForm');
                          break;
                        case 'admin':
                          navigate('/AdminForm');     
                          break;     
                        default:
                          navigate('/');
                          break;
                      }
                    }}
                    className="text-sm text-green-600 hover:text-green-800 transition-colors hover:underline"
                  >
                    Vous n'avez pas de compte ? Créez-en un
                  </button>
                </div>

            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="resetIdentifier" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Email
                </label>
                <input
                  type='email'
                  id="resetIdentifier"
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
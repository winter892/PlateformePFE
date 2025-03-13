import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Loader2, User, GraduationCap, ClipboardList, Mail } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType || 'utilisateur';
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetEmail, setResetEmail] = useState(''); // Ajout de l'état pour l'adresse e-mail

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log('Login attempt:', { identifier, password, userType });

    // Simulate authentication and navigation based on user type
    // In a real application, you would replace this with actual authentication logic
    let destination;
    switch (userType) {
      case 'encadrant':
        destination = '/IndexEncadrant'; // Replace with your actual route
        break;
      case 'etudiant':
        destination = '/IndexEtudiant'; // Replace with your actual route
        break;
      case 'admin':
        destination = '/IndexAdmin'; // Replace with your actual route
        break;
      default:
        destination = '/'; // Default navigation
        break;
    }
    // Perform authentication check here.
    // If authentication is successful:
    navigate(destination);
    // If authentication fails, you might want to show an error message.
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Si un compte existe avec cet identifiant et cette adresse e-mail, vous recevrez les instructions de réinitialisation.');
    setShowForgotPassword(false);
    setResetIdentifier('');
    setResetEmail(''); // Réinitialiser l'adresse e-mail après l'envoi
  };

  const getUserDetails = () => {
    switch (userType) {
      case 'encadrant':
        return { icon: <User className="w-8 h-8 text-white" />, color: 'bg-blue-500' };
      case 'etudiant':
        return { icon: <GraduationCap className="w-8 h-8 text-white" />, color: 'bg-green-500' };
      case 'admin':
        return { icon: <ClipboardList className="w-8 h-8 text-white" />, color: 'bg-purple-500' };
      default:
        return { icon: <User className="w-8 h-8 text-white" />, color: 'bg-blue-500' };
    }
  };

  const { icon, color } = getUserDetails();

  const getIdentifierLabel = () => {
    if (userType === 'etudiant') {
      return 'Code Apogée';
    } else {
      return 'Adresse Email';
    }
  };

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
            // Login Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                  {getIdentifierLabel()}
                </label>
                <input
                  type={userType === 'etudiant' ? 'text' : 'email'}
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={userType === 'etudiant' ? 'Entrez votre Code Apogée' : 'votre@email.com'}
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
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>
          ) : (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="resetIdentifier" className="block text-sm font-medium text-gray-700 mb-2">
                  {getIdentifierLabel()}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  <input
                    type={userType === 'etudiant' ? 'text' : 'email'}
                    id="resetIdentifier"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder={userType === 'etudiant' ? 'Entrez votre Code Apogée' : 'votre@email.com'}
                    required
                  />
                </div>
              </div>
              {userType === 'etudiant' && (
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors" />
                    <input
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Entrez votre Adresse Email"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 bg-gradient-to-r ${color} hover:shadow-lg`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Envoyer les instructions'
                )}
              </button>
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetIdentifier('');
                    setResetEmail('');
                    setIdentifier('');
                    setPassword('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
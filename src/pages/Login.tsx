import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
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

  const handleSubmit = async (e: React.FormEvent) => {
=======
import { ArrowLeft, Lock, icons , Loader2, User, GraduationCap, ClipboardList, Mail } from 'lucide-react';

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
>>>>>>> master
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
<<<<<<< HEAD
    console.log('Login attempt:', { email, password, userType });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Si un compte existe avec cet email, vous recevrez les instructions de réinitialisation.');
    setShowForgotPassword(false);
    setResetEmail('');
  };

  const getTitleByUserType = () => {
    switch (userType) {
      case 'encadrant':
        return 'Espace Encadrant';
      case 'etudiant':
        return 'Espace Étudiant';
      case 'admin':
        return 'Espace Administration';
      default:
        return 'Connexion';
    }
  };

  const getGradientByUserType = () => {
    switch (userType) {
      case 'encadrant':
        return 'from-blue-600 to-blue-400';
      case 'etudiant':
        return 'from-green-600 to-green-400';
      case 'admin':
        return 'from-purple-600 to-purple-400';
      default:
        return 'from-blue-600 to-blue-400';
=======
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
        return { icon: <User className="w-8 h-8 text-white" />, color: 'bg-purple-500' }; // Mauve pour encadrant
      case 'etudiant':
        return { icon: <GraduationCap className="w-8 h-8 text-white" />, color: 'bg-green-500' };
      case 'admin':
        return { icon: <ClipboardList className="w-8 h-8 text-white" />, color: 'bg-blue-500' }; // Bleu pour admin
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
>>>>>>> master
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative">
        <button 
        onClick={() => navigate('/')}
          
          className="mb-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors animate-slide-in"
=======
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full relative">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
>>>>>>> master
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>
<<<<<<< HEAD

        <div className="glass-effect rounded-2xl shadow-xl p-8 animate-fade-in-up">
          <div className="mb-8 text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${getGradientByUserType()} flex items-center justify-center`}>
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {getTitleByUserType()}
            </h2>
            <p className="text-gray-600">
              {showForgotPassword ? 'Réinitialiser votre mot de passe' : 'Connectez-vous à votre compte'}
            </p>
          </div>

          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
=======
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
>>>>>>> master
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors" />
                    <input
                      type="email"
<<<<<<< HEAD
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="votre@email.com"
=======
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Entrez votre Adresse Email"
>>>>>>> master
                      required
                    />
                  </div>
                </div>
<<<<<<< HEAD

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                onClick={() => navigate('/Index')}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 bg-gradient-to-r ${getGradientByUserType()} hover:shadow-lg`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
=======
              )}
>>>>>>> master

              <button
                type="submit"
                disabled={isLoading}
<<<<<<< HEAD
                onClick={() => navigate('/login')}
                className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 bg-gradient-to-r ${getGradientByUserType()} hover:shadow-lg`}
=======
                className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 bg-gradient-to-r ${color} hover:shadow-lg`}
>>>>>>> master
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Envoyer les instructions'
                )}
              </button>
<<<<<<< HEAD
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setShowForgotPassword(!showForgotPassword);
                setResetEmail('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg px-2 py-1"
            >
              {showForgotPassword ? 'Retour à la connexion' : 'Mot de passe oublié ?'}
            </button>
          </div>
=======
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetIdentifier('');
                    setResetEmail('');
                    setIsLoading(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          )}
>>>>>>> master
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> master

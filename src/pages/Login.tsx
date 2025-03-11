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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
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
    }
  };

  return (
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
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>

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
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

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

              <button
                type="submit"
                disabled={isLoading}
                onClick={() => navigate('/login')}
                className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 bg-gradient-to-r ${getGradientByUserType()} hover:shadow-lg`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Envoyer les instructions'
                )}
              </button>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
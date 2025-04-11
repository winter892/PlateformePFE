import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Building2 } from 'lucide-react';

const Homepage = () => {
  const navigate = useNavigate();

  const handleSpaceClick = (userType: string) => {
    navigate('/login', { state: { userType } });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 mb-4 animate-fade-in-up">
          Portail Universitaire
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
          Bienvenue sur votre espace numérique. Sélectionnez votre profil pour accéder à votre espace personnalisé.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Espace Encadrant */}
          <div 
            onClick={() => handleSpaceClick('encadrant')}
            className="group opacity-0 animate-fade-in-up glass-effect rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            <div className="p-8">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-slow">
                <Users className="w-10 h-10 text-purple-600 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Espace Encadrant</h2>
              <p className="text-gray-600 text-center">Accédez à vos outils d'encadrement et de suivi pédagogique</p>
            </div>
            <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>

          {/* Espace Étudiant */}
          <div 
            onClick={() => handleSpaceClick('etudiant')}
            className="group opacity-0 animate-fade-in-up animation-delay-200 glass-effect rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            <div className="p-8">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-slow">
                <GraduationCap className="w-10 h-10 text-green-600 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Espace Étudiant</h2>
              <p className="text-gray-600 text-center">Gérez votre parcours académique et accédez à vos ressources</p>
            </div>
            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>

          {/* Espace Administration */}
          <div 
            onClick={() => handleSpaceClick('admin')}
            className="group opacity-0 animate-fade-in-up animation-delay-400 glass-effect rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            <div className="p-8">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-slow">
                <Building2 className="w-10 h-10 text-blue-600 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Espace Administration</h2>
              <p className="text-gray-600 text-center">Pilotez et gérez les aspects administratifs de l'établissement</p>
            </div>
            <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mt-auto border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-4 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Mentions légales</a>
              <span className="hidden md:inline text-gray-300">|</span>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Support technique</a>
              <span className="hidden md:inline text-gray-300">|</span>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Contact</a>
            </div>
            <div className="text-sm text-gray-600 text-center md:text-right">
              © 2025 Plateforme de Suivi des Projets Académiques. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
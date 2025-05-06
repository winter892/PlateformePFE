
import React from 'react';

const LoadingStateEtudiant: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        <span className="ml-3 text-green-700">Chargement du livrable...</span>
      </div>
    </div>
  );
};

export default LoadingStateEtudiant;

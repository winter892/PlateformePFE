
import React from "react";

const RecentProjects = () => {
  // Ici, normalement on chargerait les projets récents depuis une API
  // Pour le moment, nous utilisons des données simulées
  const recentProjects = []; // Tableau vide pour correspondre à l'image qui ne montre pas de projets

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-8 animate-fade-in">
      <h2 className="text-xl font-semibold text-indigo-600 mb-4">Projets Récents</h2>
      
      {recentProjects.length > 0 ? (
        <div className="grid gap-4">
          {recentProjects.map((project, index) => (
            <div key={index} className="border rounded-md p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.date}</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucun projet récent à afficher
        </div>
      )}
    </div>
  );
};

export default RecentProjects;

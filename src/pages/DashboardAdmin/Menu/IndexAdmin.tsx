import React from "react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import StatCard from "../../../components/dashboardAdmin/StatCard";

const IndexAdmin = () => {
  return (
    <Layout>
      <Header title="Tableau de Bord" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Étudiants" 
          value={0} 
          type="students" 
        />
        <StatCard 
          title="Encadrants" 
          value={0} 
          type="supervisors" 
        />
        <StatCard 
          title="Projets en Cours" 
          value={0} 
          type="ongoing" 
        />
        <StatCard 
          title="Projets Terminés" 
          value={0} 
          type="completed" 
        />
      </div>
    </Layout>
  );
};

export default IndexAdmin;

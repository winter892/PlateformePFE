
import React from "react";
<<<<<<<< HEAD:src/pages/DashboardAdmin/Menu/IndexAdmin.tsx
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import StatCard from "../../../components/dashboardAdmin/StatCard";
========
import Layout from "../../../components/dashboard/Layout";
import Header from "../../../components/dashboard/Header";
import StatCard from "../../../components/dashboard/StatCard";
>>>>>>>> dd774f6ea53637030aae2045de0e7bf925aa787a:src/pages/DashboardAdmin/Menu/Index.tsx

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


import React from "react";
<<<<<<< HEAD
import Layout from "../../../components/dashboard/Layout";
import Header from "../../../components/dashboard/Header";
=======
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
>>>>>>> master

const Statistiques = () => {
  return (
    <Layout>
      <Header title="Statistiques" />
      <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
        <p className="text-center py-10 text-gray-500">
          Graphiques et statistiques des projets
        </p>
      </div>
    </Layout>
  );
};

export default Statistiques;

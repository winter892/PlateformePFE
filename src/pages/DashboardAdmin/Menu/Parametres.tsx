import React from "react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";

const Parametres = () => {
  return (
    <Layout>
      <Header title="Paramètres" />
      <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
        <p className="text-center py-10 text-gray-500">
          Paramètres de l'application
        </p>
      </div>
    </Layout>
  );
};

export default Parametres;

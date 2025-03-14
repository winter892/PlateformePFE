
import React from "react";
<<<<<<< HEAD
import Layout from "../../../components/dashboard/Layout";
import Header from "../../../components/dashboard/Header";
=======
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
>>>>>>> master

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

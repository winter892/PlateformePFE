
import React from "react";
import Layout from "../components/dashboard/Layout";
import Header from "../components/dashboard/Header";

const Comptes = () => {
  return (
    <Layout>
      <Header title="Comptes" />
      <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
        <p className="text-center py-10 text-gray-500">
          Gestion des comptes utilisateurs
        </p>
      </div>
    </Layout>
  );
};

export default Comptes;


import { ArrowRight, BarChart2, CheckCircle, Clock, AlertTriangle , BadgeCheck,
  Loader2,
  ListTodo,
  AlarmClock,} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import{getUserById}from '@/services/userService';
import {getProjetIdByUser,getTacheStats} from '@/services/EtudiantsService';

const IndexEtudiant = () => {
  // Animation variants
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const item = {
    hidden: {
      y: 20,
      opacity: 0
    },
    show: {
      y: 0,
      opacity: 1
    }
  };
  //recupere la statut et progression
const [stats, setStats] = useState([]);
const [progression, setProgression] = useState(0);
useEffect(() => {
  const fetchStats = async () => {
    try {
      const userId = localStorage.getItem("id");//récuperer id user connecter
      const projetId = await getProjetIdByUser(userId);//récuperer id du projet de ce user
      const data = await getTacheStats (projetId);
      console.log("Statistiques récupérées :", data);

      const newStats = [
        {
          label: "Tâches terminées",
          value: `${data.termine}/${data.total}`,
          bgColor: "bg-lime-100",
          textColor: "text-lime-800",
          iconColor: "text-lime-600",
          icon: BadgeCheck,
          description: `${Math.round(data.pourcentageTermine)}% complété`,
        },
        {
          label: "Tâches en cours",
          value: data.enCours.toString(),
          bgColor: "bg-cyan-100",
          textColor: "text-cyan-800",
          iconColor: "text-cyan-600",
          icon: Loader2,
          description: "Travail en cours",
        },
        {
          label: "Tâches à faire",
          value: data.aFaire.toString(),
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          iconColor: "text-amber-600",
          icon: ListTodo,
          description: "À planifier",
        },
        {
          label: "Tâches en retard",
          value: data.enRetard.toString(),
          bgColor: "bg-rose-100",
          textColor: "text-rose-800",
          iconColor: "text-rose-600",
          icon: AlarmClock,
          description: "Urgence requise",
        },
      ];
      
      setStats(newStats);
      setProgression(data.pourcentageTermine);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques", error);
    }
  };

  fetchStats();
}, []);
  //la partie de récupération des donne d'un user connecté
    const id = localStorage.getItem('id');
    const Token = localStorage.getItem('token');
    //la table ou nous avants stokes les donnes de l'utilisateur récupére
    const [utilisateur, setUtilisateur] = useState(null);

    useEffect(() => {
      const id = localStorage.getItem('id');
      if (id) {
        getUserById(id)
          .then((data) => {
            setUtilisateur(data);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
          });
      }
    }, []);
  
    console.log("ID utilisateur connecté :", id,"\n le Token \n",Token);

  return <div className="p-6 ml-64 animate-fadeIn">
      <div className="mb-8">
        <motion.h1 className="text-3xl font-bold mb-2 text-gray-800" initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.5
      }}>
          Tableau de bord
        </motion.h1>
        <motion.p className="text-gray-600 mb-8">
  {utilisateur ? (
    <>
  Bienvenue{" "}
  <span className="font-bold capitalize">
    {utilisateur.prenom} {utilisateur.nom}
  </span>
  , votre assistant de suivi de projets académiques.
</>
  ) : (
    <>Chargement des données...</>
  )}
</motion.p>

        
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={container} initial="hidden" animate="show">
                      {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl border-5 border-green-500 bg-white  shadow-lg hover:shadow-lg transition-all duration-300 overflow-hidden"
                  variants={item}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                      <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${stat.bgColor} ${stat.textColor}`}>
                        {stat.value}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{stat.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`h-1 w-full ${stat.iconColor}`}></div>
                </motion.div>
              ))}

        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.5
      }} className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
            <h3 className="text-lg font-medium mb-4">Progression du projet</h3>
            <div className="h-2.5 w-full bg-gray-200 rounded-full mb-6">
            <div
              className="h-2.5 rounded-full bg-green-500"
              style={{ width: `${progression}%` }}
            ></div>
          
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-gray-500">Date de début</p>
                <p className="font-medium">01 Février 2025</p>
              </div>
              <div>
                <p className="text-gray-500">Date de fin</p>
                <p className="font-medium">01 Avril 2025</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
};
export default IndexEtudiant;

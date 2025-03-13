
import { ArrowRight, BarChart2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
const IndexEtudiant = () => {
  const stats = [{
    label: "Tâches terminées",
    value: "1/4",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "25% complété"
  }, {
    label: "Tâches en cours",
    value: "1",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    description: "En progression"
  }, {
    label: "Tâches à faire",
    value: "1",
    color: "bg-yellow-100 text-yellow-800",
    icon: BarChart2,
    description: "À planifier"
  }, {
    label: "Tâches en retard",
    value: "1",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
    description: "Attention requise"
  }];

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
        <motion.p className="text-gray-600 mb-8" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }}>
          Bienvenue sur StudyTrack, votre assistant de suivi de projets académiques
        </motion.p>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={container} initial="hidden" animate="show">
          {stats.map((stat, index) => <motion.div key={index} className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden" variants={item}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <stat.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <span className={`text-sm font-medium rounded-full px-2.5 py-0.5 ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-800">{stat.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className="h-1 w-full bg-green-500"></div>
            </motion.div>)}
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
              <div className="h-2.5 rounded-full bg-green-500" style={{
              width: '25%'
            }}></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-gray-500">Date de début</p>
                <p className="font-medium">15 Oct 2023</p>
              </div>
              <div>
                <p className="text-gray-500">Date de fin</p>
                <p className="font-medium">30 Nov 2023</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
};
export default IndexEtudiant;

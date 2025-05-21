
import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Book, Calendar, Award, MapPin, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {getUserById} from '@/services/userService';
import { useEffect,useState } from 'react';

const Profile = () => {
  const studentInfoo = {
    name: "Ahmed Brinoui",
    email: "ahmed.Brinoui@usms.ac.ma",
    phone: "+212 612 345 678",
    studentId: "ET19540012",
    birthDate: "15/05/2004",
    address: "123 Avenue Mohammed V, Beni Mellal",
    department: "Informatique",
    level: "2 éme Année ",
    specialization: "Génie Informatique ",
    enrollmentDate: "Septembre 2025",
  };
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem('id');
      if (id) {
        try {
          const data = await getUserById(id);
          setStudentInfo(data);
        } catch (error) {
          console.error("Erreur lors du chargement du profil :", error);
        }
      }
    };

    fetchData();
  }, []);

  if (!studentInfo) {
    return <div className="ml-64 p-6">Chargement...</div>;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6 ml-64 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1 
          className="text-3xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Profil Étudiant
        </motion.h1>

        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="h-32 bg-gradient-to-r from-green-400 to-green-600"></div>
          
          <div className="p-6 relative">
            <div className="absolute -top-16 left-6 bg-white p-1 rounded-full border-4 border-white shadow-md">
              <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center">
                <User className="w-12 h-12 text-green-600" />
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={item} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Informations personnelles</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">{studentInfo.nom} {studentInfo.prenom}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{studentInfo.adresseEmail}</p>
                    </div>
                  </div>
                  </div>
                
              </motion.div>
              
              <motion.div variants={item} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Informations académiques</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Book className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Numéro d'étudiant</p>
                      <p className="font-medium">{studentInfo.code_APOGEE}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <School className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Département</p>
                      <p className="font-medium">{studentInfo.filiere.departement.intitule}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Niveau d'études</p>
                      <p className="font-medium">2 éme Année </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Book className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Spécialisation</p>
                      <p className="font-medium">{studentInfo.filiere.intitule}</p>
                    </div>
                  </div>
                  
                  
                </div>
              </motion.div>
            </div>
            
            
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;

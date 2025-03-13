
import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building,ArrowLeft, GraduationCap, Key, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherProfile = () => {
  const teacherInfo = {
    name: "Dr. Mohammed Ahmed",
    password: "••••••••",
    post: "Professeur",
    department: "Génie Informatique",
    email: "m.ahmed@faculty.edu",
    field: "Intelligence Artificielle"
  };

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
  const navigate = useNavigate();
  return (
    
    <div className="p-6">
      <button onClick={() => navigate('/IndexEncadrant')} className="mb-8 flex items-center p-2 rounded-md transition  hover:bg-violet-100">
          <ArrowLeft className="w-5 h-5 mr-2" /> Retour
        </button>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1 
          className="text-2xl font-semibold mb-6 text-violet-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Profil Encadrant
        </motion.h1>

        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-violet-100"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="h-32 bg-gradient-to-r from-violet-400 to-violet-600"></div>
          
          <div className="p-6 relative">
            <div className="absolute -top-16 left-6 bg-white p-1 rounded-full border-4 border-white shadow-md">
              <div className="bg-violet-100 rounded-full w-24 h-24 flex items-center justify-center">
                <User className="w-12 h-12 text-violet-600" />
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 gap-8">
              <motion.div variants={item} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-violet-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-violet-500">Nom complet</p>
                      <p className="font-medium text-violet-900">{teacherInfo.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Key className="w-5 h-5 text-violet-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-violet-500">Mot de passe</p>
                      <p className="font-medium text-violet-900">{teacherInfo.password}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <GraduationCap className="w-5 h-5 text-violet-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-violet-500">Poste</p>
                      <p className="font-medium text-violet-900">{teacherInfo.post}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Building className="w-5 h-5 text-violet-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-violet-500">Département</p>
                      <p className="font-medium text-violet-900">{teacherInfo.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <BookOpen className="w-5 h-5 text-violet-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-violet-500">Filière</p>
                      <p className="font-medium text-violet-900">{teacherInfo.field}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-violet-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-violet-500">Email</p>
                      <p className="font-medium text-violet-900">{teacherInfo.email}</p>
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

export default TeacherProfile;

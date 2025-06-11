import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ArrowLeft, Key, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '@/services/userService';
import { useEffect, useState } from 'react';

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem('id');
      if (id) {
        try {
          const data = await getUserById(id);
          setAdminInfo(data);
        } catch (error) {
          console.error("Erreur lors du chargement du profil :", error);
        }
      }
    };

    fetchData();
  }, []);

  const handlePasswordUpdate = async () => {
    try {
      // Ajouter ici l'appel API pour mettre à jour le mot de passe
      // await updatePassword(adminInfo.id, newPassword);
      setShowPasswordEdit(false);
      setNewPassword('');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
    }
  };

  if (!adminInfo) {
    return <div className="p-6">Chargement...</div>;
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
    <div className="p-6">
      <button 
        onClick={() => navigate('/IndexAdmin')} 
        className="mb-8 flex items-center p-2 rounded-md transition hover:bg-blue-100"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Retour
      </button>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1 
          className="text-2xl font-semibold mb-6 text-blue-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Profil Administrateur
        </motion.h1>

        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          
          <div className="p-6 relative">
            <div className="absolute -top-16 left-6 bg-white p-1 rounded-full border-4 border-white shadow-md">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 gap-8">
              <motion.div variants={item} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-blue-500">Nom complet</p>
                      <p className="font-medium text-blue-900">{adminInfo.nom} {adminInfo.prenom}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Key className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm text-blue-500">Mot de passe</p>
                        <p className="font-medium text-blue-900">••••••••</p>
                      </div>
                      <button 
                        onClick={() => setShowPasswordEdit(!showPasswordEdit)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {showPasswordEdit && (
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-blue-600">Nouveau mot de passe</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="p-2 border rounded-lg focus:outline-blue-600"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePasswordUpdate}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => setShowPasswordEdit(false)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-blue-500">Email</p>
                      <p className="font-medium text-blue-900">{adminInfo.adresseEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Key className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-blue-500">Rôle</p>
                      <p className="font-medium text-blue-900 capitalize">{adminInfo.role}</p>
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

export default AdminProfile;
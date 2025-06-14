import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getUserById } from '@/services/userService';

interface ChatHeaderProps {
  onToggleChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onToggleChat }) => {
  const iduser = localStorage.getItem('id');
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (iduser) {
        try {
          const data = await getUserById(iduser);
          setStudentInfo(data);
          console.log("Données d'encadrant :", data);
        } catch (error) {
          console.error("Erreur lors du chargement du profil :", error);
        }
      }
    };

    fetchData();
  }, [iduser]);

  return (
    <div className="px-4 py-3 border-b border-violet-100 flex items-center justify-between">
      <div>
        <h3 className="font-medium text-violet-900">Discussion en direct</h3>
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs text-violet-600">
            {studentInfo ? `${studentInfo.nom} ${studentInfo.prenom} ` : "Chargement..."}
          </span>
        </div>
      </div>
      <button onClick={onToggleChat} className="text-violet-500 hover:text-violet-700 transition-colors">
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;


import React from 'react';
import { ClipboardList, GraduationCap, User } from 'lucide-react';

export type AccountType = 'admin' | 'student' | 'supervisor';

interface AccountSelectorProps {
  activeType: AccountType;
  onSelect: (type: AccountType) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ activeType, onSelect }) => {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-3xl mx-auto mb-8">
      <button
        onClick={() => onSelect('admin')}
        className={`flex items-center justify-center gap-2 p-4 rounded-lg transition-all transform hover:scale-105 ${
          activeType === 'admin' 
            ? 'admin-gradient text-white shadow-lg scale-105' 
            : 'bg-white border border-gray-200 hover:border-blue-300 text-gray-700'
        }`}
      >
        <ClipboardList size={24} />
        <span className="font-medium">Administrateur</span>
      </button>

      <button
        onClick={() => onSelect('student')}
        className={`flex items-center justify-center gap-2 p-4 rounded-lg transition-all transform hover:scale-105 ${
          activeType === 'student' 
            ? 'student-gradient text-white shadow-lg scale-105' 
            : 'bg-white border border-gray-200 hover:border-green-300 text-gray-700'
        }`}
      >
        <GraduationCap size={24} />
        <span className="font-medium">Étudiant</span>
      </button>

      <button
        onClick={() => onSelect('supervisor')}
        className={`flex items-center justify-center gap-2 p-4 rounded-lg transition-all transform hover:scale-105 ${
          activeType === 'supervisor' 
            ? 'supervisor-gradient text-white shadow-lg scale-105' 
            : 'bg-white border border-gray-200 hover:border-purple-300 text-gray-700'
        }`}
      >
        <User size={24} />
        <span className="font-medium">Encadrant</span>
      </button>
    </div>
  );
};

export default AccountSelector;

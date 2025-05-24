import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ResizablePanelProps {
  children: React.ReactNode;
  chatExpanded: boolean;
  onToggle: () => void;
  layoutConfig: {
    chatWidth: string;
    viewerWidth: string;
  };
}

const ResizablePanelEtudiant: React.FC<ResizablePanelProps> = ({
  children,
  chatExpanded,
  onToggle,
  layoutConfig
}) => {
  return (
    <div className={`bg-white border-r border-green-100 transition-all duration-300 ${layoutConfig.chatWidth} relative`}>
      {chatExpanded ? (
        <>
          {children}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
            {/* Resize controls can be added here if needed */}
          </div>
        </>
      ) : (
        <div className="p-4">
          <button 
            onClick={onToggle} 
            className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResizablePanelEtudiant;

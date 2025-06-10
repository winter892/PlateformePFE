import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const MessageInputEtudiant: React.FC<MessageInputProps> = ({
  newMessage,
  onMessageChange,
  onSendMessage,
  handleKeyPress
}) => {
  return (
        <div className="p-4 border-t border-green-100">
        <div className="flex items-center space-x-2">
          {/* Textarea */}
          <textarea 
            value={newMessage} 
            onChange={e => onMessageChange(e.target.value)} 
            onKeyDown={handleKeyPress} 
            className="flex-1 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none resize-none"
            placeholder="Écrivez votre message..." 
            rows={2}
            aria-label="Écrire un message"
          ></textarea>

          {/* Bouton d'envoi */}
          <button 
            onClick={onSendMessage} 
            disabled={newMessage.trim() === ''} 
            className={`px-4 py-2 rounded-lg flex items-center ${
              newMessage.trim() === '' 
                ? 'bg-green-100 text-green-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            } transition-colors`}
            aria-label="Envoyer le message"
          >
            <Send size={16} className="mr-1" />
            Envoyer
          </button>
        </div>
      </div>
  );
};

export default MessageInputEtudiant;

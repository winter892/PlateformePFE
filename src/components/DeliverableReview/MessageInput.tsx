
import React from 'react';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  onMessageChange,
  onSendMessage,
  handleKeyPress
}) => {
  return (
    <div className="p-4 border-t border-violet-100">
      <textarea 
        value={newMessage} 
        onChange={e => onMessageChange(e.target.value)} 
        onKeyDown={handleKeyPress} 
        className="w-full p-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none resize-none" 
        placeholder="Écrivez votre message..." 
        rows={3}
      ></textarea>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex space-x-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors">
            <Paperclip size={16} />
          </button>
        </div>
        
        <button 
          onClick={onSendMessage} 
          disabled={newMessage.trim() === ''} 
          className={`px-4 py-2 rounded-lg flex items-center ${newMessage.trim() === '' ? 'bg-violet-100 text-violet-400 cursor-not-allowed' : 'bg-violet-600 text-white hover:bg-violet-700'} transition-colors`}
        >
          <Send size={16} className="mr-1" />
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

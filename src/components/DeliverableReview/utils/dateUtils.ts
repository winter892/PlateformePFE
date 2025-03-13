
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long'
      });
    }
  };
  
  export const groupMessagesByDate = (messages: any[]): { date: string; messages: any[] }[] => {
    const groupedMessages: {
      date: string;
      messages: any[];
    }[] = [];
    
    let currentDateStr = '';
    
    messages.forEach(message => {
      const messageDate = formatDate(message.timestamp);
      if (messageDate !== currentDateStr) {
        groupedMessages.push({
          date: messageDate,
          messages: [message]
        });
        currentDateStr = messageDate;
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(message);
      }
    });
    
    return groupedMessages;
  };
  
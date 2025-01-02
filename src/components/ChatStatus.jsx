import React from 'react';
import { Clock, WifiOff, Loader2 } from 'lucide-react';
import { isBusinessHours, getNextAvailableTime, formatBusinessHours } from '@/utils/businessHours';

const ChatStatus = ({ serverStatus, theme, displayMode = 'compact' }) => {
  // Only show status indicator in header, no text
  if (displayMode === 'compact') {
    if (serverStatus === 'checking') {
      return <Loader2 className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 animate-spin" />;
    }
    if (serverStatus === 'offline') {
      return <WifiOff className="h-4 w-4 md:h-5 md:w-5 text-red-500" />;
    }
    if (serverStatus === 'online' && !isBusinessHours()) {
      return <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />;
    }
    // When online during business hours, show AI assistant icon
    if (serverStatus === 'online' && isBusinessHours()) {
      return (
        <div className="relative w-4 h-4 md:w-5 md:h-5">
          <img 
            src={import.meta.env.PROD ? '/portfolio/ai-assistant-active.png' : '/ai-assistant-active.png'}
            alt="AI Assistant Online"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add(
                theme === 'dark' ? 'bg-green-500' : 'bg-green-400'
              );
            }}
          />
        </div>
      );
    }
    return null;
  }

  // Full display mode for message area
  if (serverStatus === 'checking') {
    return (
      <div className="text-center py-8 px-4">
        <Loader2 className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 animate-spin ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <p className="text-lg font-medium">Connecting to assistant...</p>
      </div>
    );
  }

  if (serverStatus === 'offline') {
    return (
      <div className="text-center py-8 px-4">
        <WifiOff className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <p className="text-lg font-medium mb-2">Assistant is currently offline</p>
        <p className="text-sm text-gray-500">Please try again in a few minutes</p>
      </div>
    );
  }

  if (serverStatus === 'online' && !isBusinessHours()) {
    return (
      <div className="text-center py-8 px-4">
        <Clock className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <p className="text-lg font-medium mb-2">
          Available {formatBusinessHours().start} - {formatBusinessHours().end}
        </p>
        <p className="text-sm text-gray-500">Monday through Friday</p>
        <p className="text-sm mt-4">
          Next available: {getNextAvailableTime()}
        </p>
      </div>
    );
  }

  // Online & during business hours
  return (
    <div className="text-center py-8 px-4">
      <div className="relative w-10 h-10 md:w-12 md:h-12 mx-auto mb-4">
          <img 
            src={import.meta.env.PROD ? '/portfolio/ai-assistant-active.png' : '/ai-assistant-active.png'}
            alt="AI Assistant Online"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '👋';
              e.target.parentElement.classList.add('text-2xl');
            }}
          />
      </div>
      <p className="text-lg">How can I help you today?</p>
    </div>
  );
};

export default ChatStatus;
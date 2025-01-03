import React from 'react';
import { Clock, WifiOff, Loader2 } from 'lucide-react';
import { isBusinessHours, getNextAvailableTime, formatBusinessHours } from '@/utils/businessHours';

const ChatStatus = ({ serverStatus, theme, displayMode = 'compact' }) => {
  // Only show status indicator in header, no text
  if (displayMode === 'compact') {
    if (serverStatus === 'checking') {
      return <Loader2 className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 animate-spin" />;
    }

    if (serverStatus === 'offline') {
      return (
        <div className="text-center py-8 px-4">
          <WifiOff className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <p className="text-lg font-medium mb-3">Assistant Currently Offline</p>
          <p className="text-sm text-gray-500 mb-3">
            I'm optimizing resources at the moment. Please explore my portfolio 
            or reach out via LinkedIn for immediate connection.
          </p>
          <p className="text-sm text-gray-500">
            Regular hours: {formatBusinessHours().start} - {formatBusinessHours().end}, Mon-Fri
          </p>
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
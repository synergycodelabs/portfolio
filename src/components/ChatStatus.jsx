import React from 'react';
import { Clock, WifiOff, Loader2 } from 'lucide-react';
import { isBusinessHours, getNextAvailableTime, formatBusinessHours } from '@/utils/businessHours';

const ChatStatus = ({ serverStatus, theme, displayMode = 'compact' }) => {
  // Only show status indicator in header, no text
  if (displayMode === 'compact') {
    if (serverStatus === 'checking') {
      return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
    if (serverStatus === 'offline') {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
    if (serverStatus === 'online' && !isBusinessHours()) {
      return <Clock className="h-4 w-4 text-orange-500" />;
    }
    return null;
  }

  // Full display mode for message area
  if (serverStatus === 'checking') {
    return (
      <div className="text-center py-8 px-4">
        <Loader2 className={`h-12 w-12 mx-auto mb-4 animate-spin ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <p className="text-lg font-medium">Connecting to assistant...</p>
      </div>
    );
  }

  if (serverStatus === 'offline') {
    return (
      <div className="text-center py-8 px-4">
        <WifiOff className={`h-12 w-12 mx-auto mb-4 ${
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
        <Clock className={`h-12 w-12 mx-auto mb-4 ${
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
      <p className="text-lg">ðŸ‘‹ How can I help you today?</p>
    </div>
  );
};

export default ChatStatus;
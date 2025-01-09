// src/components/FloatingChatBot/ChatHeader.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import ChatStatus from '../ChatStatus'; 
// Adjust this import if ChatStatus is located elsewhere
// e.g., you might do: import ChatStatus from '@/components/ChatStatus';

const ChatHeader = ({
  isExpanded,
  onExpandToggle,
  onClose,
  theme,
  serverStatus,
}) => {
  return (
    <div
      className={`p-4 flex justify-between items-center border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExpandToggle}
          className={`p-2 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <h3 className="font-semibold">Chat Assistant</h3>
        <ChatStatus
          serverStatus={serverStatus}
          theme={theme}
          displayMode="compact"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className={
          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        }
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
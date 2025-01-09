// src/components/FloatingChatBot/ChatMessages.jsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import formatResponse from '@/components/FloatingChatBot/formatResponse';
import SectionIndicator from '@/components/FloatingChatBot/SectionIndicator';

/**
 * Displays the scrollable list of messages (both user and assistant).
 * Also shows a "Thinking..." spinner if isLoading is true.
 */
const ChatMessages = ({ messages, theme, messagesEndRef, isLoading }) => {
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 ${
            msg.role === 'user' ? 'ml-auto text-right' : 'w-full'
          }`}
        >
          {msg.role === 'assistant' && msg.section && (
            <SectionIndicator section={msg.section} theme={theme} />
          )}
          <div
            className={`rounded-lg px-4 py-2 ${
              msg.role === 'user'
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {msg.role === 'assistant'
              ? formatResponse(msg.content)
              : msg.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start mb-4 w-full">
          <div
            className={`rounded-lg px-4 py-2 ${
              theme === 'dark'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export default ChatMessages;
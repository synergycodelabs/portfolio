// src/components/FloatingChatBot/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatFooter from './ChatFooter';
import { ConversationContext } from '@/utils/chatContext';
import { WELCOME_MESSAGE } from './constants';

/**
 * The "expanded" chat UI. Ties together ChatHeader, ChatMessages, and ChatFooter.
 */
const ChatWindow = ({ onClose, theme, serverStatus, isTransitioning }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext] = useState(() => new ConversationContext());
  const messagesEndRef = useRef(null);

  // Initialize welcome message once the server is online
  useEffect(() => {
    if (serverStatus === 'online' && messages.length === 0) {
      setMessages([WELCOME_MESSAGE]);
    }
  }, [serverStatus]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleExpandToggle = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={`rounded-lg shadow-xl flex flex-col ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      } transition-all duration-300 ease-in-out
      ${isExpanded ? 'fixed inset-0 md:relative md:w-[48rem] md:h-[36rem]' : 'w-80 md:w-96 h-[500px]'}
    `}
    >
      <ChatHeader
        isExpanded={isExpanded}
        onExpandToggle={handleExpandToggle}
        onClose={onClose}
        theme={theme}
        serverStatus={serverStatus}
      />
      <ChatMessages
        messages={messages}
        theme={theme}
        messagesEndRef={messagesEndRef}
        isLoading={isLoading}
      />
      <ChatFooter
        setMessages={setMessages}
        theme={theme}
        serverStatus={serverStatus}
        conversationContext={conversationContext}
      />
    </div>
  );
};

export default ChatWindow;
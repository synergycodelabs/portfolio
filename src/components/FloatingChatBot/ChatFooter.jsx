// src/components/FloatingChatBot/ChatFooter.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { sendChatMessage } from '@/utils/connectionHelper';
import { isBusinessHours } from '@/utils/businessHours';

/**
 * Bottom input field + send button.
 * Submits user messages to the backend and appends them to the conversation.
 */
const ChatFooter = ({ setMessages, theme, serverStatus, conversationContext }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !isBusinessHours() || serverStatus !== 'online') return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await sendChatMessage(input.trim(), conversationContext.getContext());
    if (result.success) {
      conversationContext.addMessage(input.trim(), result.response, result.section);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.response, section: result.section },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.error },
      ]);
    }
    setIsLoading(false);
  };

  // Optional: Send on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`p-4 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            serverStatus === 'offline'
              ? 'Chat is currently offline'
              : !isBusinessHours()
              ? 'Chat available during business hours'
              : 'Type a message...'
          }
          disabled={serverStatus !== 'online' || !isBusinessHours()}
          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}
        />
        <Button
          onClick={handleSend}
          disabled={
            isLoading ||
            !input.trim() ||
            serverStatus !== 'online' ||
            !isBusinessHours()
          }
          className={
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          }
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatFooter;
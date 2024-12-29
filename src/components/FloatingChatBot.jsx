import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApiUrl } from '@/config/api';

const FloatingChatBot = ({ theme = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const messagesEndRef = useRef(null);

  // Server status check
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(getApiUrl('status'));
        if (response.ok) {
          const data = await response.json();
          setServerStatus(data.status);
          
          // Log connection type in development
          if (!import.meta.env.PROD) {
            console.log('Connected via:', data.secure ? 'HTTPS' : 'HTTP');
          }
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        console.error('Server status check failed:', error);
        setServerStatus('offline');
      }
    };
  
    checkServerStatus();
    
    // Poll server status every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      const response = await fetch(getApiUrl('chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const assistantMessage = data.response || data.message || 'No response received';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantMessage
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.message.includes('Failed to fetch')
        ? 'Unable to connect to the server. Please check your internet connection and try again.'
        : 'Sorry, I encountered an error. Please try again later.';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`w-96 h-[500px] rounded-lg shadow-xl flex flex-col ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          {/* Header */}
          <div className={`p-4 flex justify-between items-center border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Chat Assistant</h3>
              {serverStatus === 'checking' && (
                <span className="text-yellow-500 text-sm">(Connecting...)</span>
              )}
              {serverStatus === 'offline' && (
                <span className="text-red-500 text-sm">(Offline)</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.role === 'user' ? 'ml-auto text-right' : 'mr-auto'
                }`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.role === 'user'
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className={`inline-block rounded-lg px-4 py-2 ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={serverStatus === 'offline' 
                  ? 'Chat is currently offline' 
                  : 'Type a message...'}
                disabled={serverStatus === 'offline'}
                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || serverStatus === 'offline'}
                className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatBot;
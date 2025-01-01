import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkServerConnection, sendChatMessage } from '@/utils/connectionHelper';
import { isBusinessHours } from '@/utils/businessHours';
import ChatStatus from './ChatStatus';
import ErrorBoundary from './common/ErrorBoundary';

const RETRY_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Hi! How can I help you today?'
};

const FloatingChatBotNew = ({ theme = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const messagesEndRef = useRef(null);
  const connectionCheckRef = useRef(null);

  // Check if we're near the resume section
  const [isNearResume, setIsNearResume] = useState(false);

  useEffect(() => {
    const checkResumeProximity = () => {
      const resumeSection = document.getElementById('resume-section');
      if (resumeSection) {
        const rect = resumeSection.getBoundingClientRect();
        const isNear = rect.top < window.innerHeight && rect.bottom > 0;
        setIsNearResume(isNear);
      }
    };

    window.addEventListener('scroll', checkResumeProximity);
    checkResumeProximity(); // Initial check

    return () => window.removeEventListener('scroll', checkResumeProximity);
  }, []);

  // Initialize welcome message when chat opens and server is online
  useEffect(() => {
    if (isOpen && serverStatus === 'online' && messages.length === 0) {
      setMessages([WELCOME_MESSAGE]);
    }
  }, [isOpen, serverStatus]);

  // Server status check with retry logic
  useEffect(() => {
    let isSubscribed = true;

    const checkStatus = async () => {
      if (retryCount >= MAX_RETRIES) {
        if (isSubscribed) {
          setServerStatus('offline');
          setRetryCount(0);
        }
        return;
      }

      const result = await checkServerConnection();

      if (!isSubscribed) return;

      if (result.status === 'online') {
        setServerStatus('online');
        setRetryCount(0);
      } else {
        setServerStatus('offline');
        setRetryCount(prev => prev + 1);
      }
    };

    checkStatus();

    // Set up polling interval
    connectionCheckRef.current = setInterval(checkStatus, RETRY_INTERVAL);

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
    };
  }, [retryCount]);

  // Scroll to bottom effect
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Slight delay to ensure content is rendered

    return () => clearTimeout(scrollTimer);
  }, [messages]);

  // Handle chat window transition
  useEffect(() => {
    if (isOpen) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !isBusinessHours() || serverStatus !== 'online') return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await sendChatMessage(input.trim());

    if (result.success) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.error
      }]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ErrorBoundary>
      <div className={`fixed ${isNearResume ? 'bottom-32' : 'bottom-20'} right-4 z-50 transition-all duration-300`}>
{/* Floating Button */}
{!isOpen && (
  <div className={`fixed bottom-20 transition-all duration-300 z-[9999]
    right-4 md:-right-5 md:hover:right-4`} // Different positioning for mobile vs desktop
  >
    {/* Ghost text message */}
    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
      opacity-0 group-hover:opacity-100 transition-all duration-300
      whitespace-nowrap pointer-events-none">
      <span className={`text-sm font-bold ${
        theme === 'dark' 
          ? 'text-transparent [-webkit-text-stroke:1px_white]'
          : 'text-transparent [-webkit-text-stroke:1px_black]'
      }`}>
        Let's chat!
      </span>
    </div>
    <Button
      onClick={() => setIsOpen(true)}
      className="shadow-lg hover:shadow-xl transition-all duration-300 
        flex items-center justify-center p-0
        hover:scale-105"
      variant="ghost"
    >
      <div className="w-9 h-9 md:w-10 md:h-10">
      <img 
  src={import.meta.env.PROD ? '/portfolio/ai-assistant-active.png' : '/ai-assistant-active.png'}
  alt="AI Assistant"
  className="w-full h-full rounded-full object-cover 
    hover:brightness-110 transition-all duration-300"
  onError={(e) => {
    // Fallback to the MessageCircle icon if image fails to load
    e.target.style.display = 'none';
    e.target.parentElement.innerHTML = '<MessageCircle className="h-6 w-6 text-white" />';
  }}
/>
      </div>
    </Button>
  </div>
)}
        {/* Chat Window */}
        {isOpen && (
          <div
            className={`w-80 md:w-96 h-[500px] rounded-lg shadow-xl flex flex-col ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            transition-all duration-300 ease-in-out`}
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
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
                onClick={() => setIsOpen(false)}
                className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <ChatStatus
                  serverStatus={serverStatus}
                  theme={theme}
                  displayMode="full"
                />
              ) : (
                messages.map((msg, index) => (
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
                ))
              )}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className={`inline-block rounded-lg px-4 py-2 ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
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
                  disabled={isLoading || !input.trim() || serverStatus !== 'online' || !isBusinessHours()}
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
    </ErrorBoundary>
  );
};

export default FloatingChatBotNew;
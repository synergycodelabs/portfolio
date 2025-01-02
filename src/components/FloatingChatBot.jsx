// src/components/FloatingChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkServerConnection, sendChatMessage } from '@/utils/connectionHelper';
import { isBusinessHours } from '@/utils/businessHours';
import { ConversationContext } from '@/utils/chatContext';
import ChatStatus from './ChatStatus';
import ErrorBoundary from './common/ErrorBoundary';

const RETRY_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm here to help you learn more about Angel's professional experience and skills. What would you like to know?"
};

const SectionIndicator = ({ section, theme }) => {
  if (!section) return null;
  
  return (
    <div className={`text-xs ${
      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    } mb-1 font-medium`}>
      <span className="inline-flex items-center gap-1">
        <span>📍</span>
        <span>{section}</span>
      </span>
    </div>
  );
};

const formatResponse = (content) => {
  // Clean up markdown formatting
  const cleanContent = content.replace(/\*\*/g, ''); // Remove all double asterisks

  if (cleanContent.includes('1.')) {
    const parts = cleanContent.split(/(?=\d+\.\s)/);
    const intro = parts[0].trim();
    const items = parts.slice(1);

    return (
      <div className="flex flex-col gap-3 w-full">
        {intro && (
          <div className="text-sm w-full text-left mb-2">
            {intro}
          </div>
        )}
        {items.length > 0 && (
          <div className="flex flex-col gap-3 w-full">
            {items.map((item, index) => {
              // Split the item into number and content more carefully
              const [number, ...contentParts] = item.trim().split(/\s(.+)/);
              const content = contentParts
                .join(' ')
                .replace(/\*\*/g, '') // Clean any remaining asterisks
                .trim();
              
              return (
                <div key={index} className="flex gap-2 text-sm w-full">
                  <span className="flex-shrink-0 min-w-[1.5rem] text-left">
                    {number}
                  </span>
                  <span className="flex-1 text-left">
                    {content}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  
  // For non-list responses, clean and return
  return (
    <div className="text-sm w-full text-left whitespace-pre-wrap">
      {cleanContent}
    </div>
  );
};

const FloatingChatBot = ({ theme = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const messagesEndRef = useRef(null);
  const connectionCheckRef = useRef(null);
  const [isNearResume, setIsNearResume] = useState(false);
  const [conversationContext] = useState(() => new ConversationContext());
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

    // Add tooltip animation effect
    useEffect(() => {
      if (hasInteracted) return;
  
      const initialTimer = setTimeout(() => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
        
        const intervalTimer = setInterval(() => {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
        }, 600000); // 10 minutes
  
        return () => clearInterval(intervalTimer);
      }, 5000); // Initial 5 second delay
  
      return () => clearTimeout(initialTimer);
    }, [hasInteracted]);

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

  // Initialize welcome message when chat opens
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
    connectionCheckRef.current = setInterval(checkStatus, RETRY_INTERVAL);

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
    }, 100);

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

    const result = await sendChatMessage(
      input.trim(), 
      conversationContext.getContext()
    );

    if (result.success) {
      // Store interaction in context
      conversationContext.addMessage(
        input.trim(),
        result.response,
        result.section
      );

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response,
        section: result.section
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.error
      }]);
    }

    setIsLoading(false);
  };

  // Clear context when chat is closed
  useEffect(() => {
    if (!isOpen) {
      conversationContext.clear();
    }
  }, [isOpen]);

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
        <div className="fixed bottom-28 group z-[9999]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`absolute right-[10px] 
            transition-opacity duration-300 bg-gray-800 text-white 
            px-3 py-1.5 rounded-l-md whitespace-nowrap
            ${showTooltip || isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-sm">Let's chat</span>
          </div>
            <div className="fixed right-[-30px]">
              <Button
                onClick={() => {
                  setIsOpen(true);
                  setHasInteracted(true);
                }}
                className="shadow-lg hover:shadow-xl transition-all duration-300 
                  flex items-center justify-center p-0"
                variant="ghost"
              >
                <div className="w-10 h-20 md:w-10 md:h-16">
                  <img 
                    src={import.meta.env.PROD ? '/portfolio/ai-assistant-active.png' : '/ai-assistant-active.png'}
                    alt="AI Assistant Online"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '👋';
                      e.target.parentElement.classList.add('text-2xl');
                    }}
                  />
                </div>
              </Button>
            </div>
          </div>
        )}
        {/* Chat Window */}
        {isOpen && (
          <div
            className={`${
              isExpanded 
                ? 'w-[32rem] md:w-[48rem] h-[36rem]' 
                : 'w-80 md:w-96 h-[500px]'
            } rounded-lg shadow-xl flex flex-col ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            transition-all duration-300 ease-in-out`}
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-2`}
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
                      msg.role === 'user' ? 'ml-auto text-right' : 'w-full'
                    }`}
                  >
                    {msg.role === 'assistant' && msg.section && (
                      <SectionIndicator section={msg.section} theme={theme} />
                    )}
                    <div
                      className={`${
                        msg.role === 'user'
                          ? 'inline-block ml-auto'
                          : 'w-full'
                      } rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.role === 'assistant' ? formatResponse(msg.content) : msg.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start mb-4 w-full">
                  <div className={`rounded-lg px-4 py-2 ${
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

export default FloatingChatBot;
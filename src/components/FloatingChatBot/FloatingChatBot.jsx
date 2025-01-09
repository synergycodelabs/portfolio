// src/components/FloatingChatBot/FloatingChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ChatWindow from './ChatWindow';
import { checkServerConnection } from '@/utils/connectionHelper';
import { RETRY_INTERVAL, MAX_RETRIES } from './constants';

/**
 * Main floating chatbot wrapper. Handles:
 * - Floating button with tooltip & fallback image
 * - Checking server connection with retry
 * - Resume proximity logic
 * - Transition states when opening/closing the chat window
 */
const FloatingChatBot = ({ theme = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);

  // Hover & tooltip logic
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Resume proximity logic
  const [isNearResume, setIsNearResume] = useState(false);

  // Transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  const connectionCheckRef = useRef(null);

  // --------------------------------------------------
  // 1) Check server status (with retries)
  // --------------------------------------------------
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
        setRetryCount((prev) => prev + 1);
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

  // --------------------------------------------------
  // 2) Tooltip & hover animations
  // --------------------------------------------------
  useEffect(() => {
    if (hasInteracted) return;
    // Show tooltip 5s after page load
    const initialTimer = setTimeout(() => {
      setShowTooltip(true);
      // Hide tooltip after 3s
      setTimeout(() => setShowTooltip(false), 3000);

      // Then show again every 10 minutes
      const intervalTimer = setInterval(() => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      }, 600000); // 10 minutes

      return () => clearInterval(intervalTimer);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, [hasInteracted]);

  // --------------------------------------------------
  // 3) Resume proximity detection
  // --------------------------------------------------
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

  // --------------------------------------------------
  // 4) Transition effect when opening chat
  // --------------------------------------------------
  useEffect(() => {
    if (isOpen) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --------------------------------------------------
  // 5) Open/Close logic
  // --------------------------------------------------
  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <ErrorBoundary>
      {/* 
        (A) Floating Button: Only show if chat is closed.
        Includes tooltip, hover, fallback image, etc.
      */}
      {!isOpen && (
        <div
          className="fixed bottom-28 right-[-30px] group z-[9999]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Tooltip */}
          <div
            className={`
              absolute left-[-210%] top-1/2 transform -translate-y-1/2
              transition-opacity duration-300 bg-gray-800 text-white
              px-3 py-1.5 rounded-md whitespace-nowrap
              ${showTooltip || isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <span className="text-sm">Let's chat</span>
          </div>

          {/* Icon/Button with fallback image */}
          <Button
            onClick={handleOpen}
            className="shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center p-0"
            variant="ghost"
          >
            <div className="w-10 h-20 md:w-10 md:h-16">
              <img
                src={
                  import.meta.env.PROD
                    ? '/portfolio/ai-assistant-active.png'
                    : '/ai-assistant-active.png'
                }
                alt="AI Assistant Online"
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (e.target && e.target.parentElement) {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '👋';
                    if (e.target.parentElement.classList) {
                      e.target.parentElement.classList.add('text-2xl');
                    }
                  }
                }}
              />
            </div>
          </Button>
        </div>
      )}

      {/* 
        (B) Chat Window: Only show if chat is open.
        Positioned in bottom corner, with dynamic offset if near the resume.
      */}
      {isOpen && (
        <div
          className={`fixed ${
            isNearResume ? 'bottom-32' : 'bottom-20'
          } right-4 z-50 transition-all duration-300`}
        >
          <ChatWindow
            onClose={handleClose}
            theme={theme}
            serverStatus={serverStatus}
            isTransitioning={isTransitioning}
          />
        </div>
      )}
    </ErrorBoundary>
  );
};

export default FloatingChatBot;
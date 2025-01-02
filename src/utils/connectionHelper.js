// src/utils/connectionHelper.js
import { getApiUrl } from '../config/api';
import { edgeHandler } from './browsers/edgeHandler';
import { defaultHandler } from './browsers/defaultHandler';

const isDevelopment = window.location.hostname === 'localhost';
const corsMode = isDevelopment ? 
    { mode: 'cors', credentials: 'include' } : 
    { mode: 'cors', credentials: 'omit' };

const getBrowserHandler = () => {
  if (/Edg/i.test(navigator.userAgent)) {
    console.log(`Using Edge handler in ${isDevelopment ? 'development' : 'production'}`);
    return { ...edgeHandler, corsMode };
  }
  console.log(`Using default handler in ${isDevelopment ? 'development' : 'production'}`);
  return { ...defaultHandler, corsMode };
};

export const checkServerConnection = async () => {
  const handler = getBrowserHandler();
  return handler.checkStatus();
};

export const sendChatMessage = async (message, context = []) => {
  const handler = getBrowserHandler();
  // Include context in the message payload
  return handler.sendMessage(message, { context: context.slice(-3) });
};
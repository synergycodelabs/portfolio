// src/utils/connectionHelper.js
import { getApiUrl } from '../config/api';
import { edgeHandler } from './browsers/edgeHandler';
import { defaultHandler } from './browsers/defaultHandler';

const getBrowserHandler = () => {
  if (/Edg/i.test(navigator.userAgent)) {
    console.log('Using Edge handler');
    return edgeHandler;
  }
  console.log('Using default handler');
  return defaultHandler;
};

export const checkServerConnection = async () => {
  const handler = getBrowserHandler();
  return handler.checkStatus();
};

export const sendChatMessage = async (message) => {
  const handler = getBrowserHandler();
  return handler.sendMessage(message);
};
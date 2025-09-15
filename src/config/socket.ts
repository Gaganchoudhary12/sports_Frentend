import { SocketConfig } from '../services/SocketEventStream';
import { getServerUrl } from '../utils/networkConfig';

export const SOCKET_CONFIG: SocketConfig = {
  url: getServerUrl(3001),
  
  options: {
    transports: ['polling', 'websocket'],
    timeout: 15000,
    forceNew: false,
  },
};

export const MATCH_CONFIG = {
  DEFAULT_MATCH_ID: 'match_123',
  
  SUPPORTED_EVENT_TYPES: [
    'BALL',
    'BOUNDARY', 
    'WICKET',
    'MATCH_STATUS',
    'TIMEOUT',
    'REVIEW',
    'OVER_COMPLETE',
    'INNINGS_BREAK',
  ],
  
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 2000,
};
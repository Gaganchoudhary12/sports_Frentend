import { useState, useEffect, useCallback } from 'react';
import { MatchEvent } from '../types/MatchEvent';
import { SocketEventStream } from '../services/SocketEventStream';
import { MATCH_CONFIG } from '../config/socket';

export interface SocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  events: MatchEvent[];
}

export const useSocketConnection = (matchId?: string) => {
  const simpleConfig = {
    url: "https://sports-z9px.onrender.com",
    options: {
      path: "/socket.io/",
      transports: ["websocket"],
      timeout: 10000,
      forceNew: true,
    },
  };

  const [socketStream] = useState(() => new SocketEventStream(simpleConfig));
  
  const [state, setState] = useState<SocketConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    events: [],
  });

  const currentMatchId = matchId || MATCH_CONFIG.DEFAULT_MATCH_ID;
console.log('====================================');
console.log(state,'statestatestatestatestate');
console.log('====================================');
  const connect = useCallback(() => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    socketStream.connect();
  }, [socketStream]);

  const disconnect = useCallback(() => {
    socketStream.disconnect();
    setState(prev => ({ 
      ...prev, 
      isConnected: false, 
      isConnecting: false 
    }));
  }, [socketStream]);

  const joinMatch = useCallback(() => {
    if (socketStream.connected) {
      socketStream.joinMatch(currentMatchId);
    }
  }, [socketStream, currentMatchId]);

  const leaveMatch = useCallback(() => {
    if (socketStream.connected) {
      socketStream.leaveMatch(currentMatchId);
    }
  }, [socketStream, currentMatchId]);

  const requestHistory = useCallback(() => {
    if (socketStream.connected) {
      socketStream.requestMatchHistory(currentMatchId);
    }
  }, [socketStream, currentMatchId]);

  const clearEvents = useCallback(() => {
    setState(prev => ({ ...prev, events: [] }));
  }, []);

  useEffect(() => {
    const unsubscribeEvents = socketStream.subscribe((event: MatchEvent) => {
      setState(prev => ({
        ...prev,
        events: [event, ...prev.events],
      }));
    });

    const unsubscribeConnection = socketStream.onConnectionChange((connected: boolean) => {
      setState(prev => ({
        ...prev,
        isConnected: connected,
        isConnecting: false,
        error: connected ? null : prev.error,
      }));

      if (connected) {
        setTimeout(() => {
          socketStream.joinMatch(currentMatchId);
        }, 500);
      }
    });

    const unsubscribeError = socketStream.onError((error: string) => {
      setState(prev => ({
        ...prev,
        error,
        isConnecting: false,
      }));
    });

    return () => {
      unsubscribeEvents();
      unsubscribeConnection();
      unsubscribeError();
    };
  }, [socketStream, currentMatchId]);

  useEffect(() => {
    return () => {
      socketStream.disconnect();
    };
  }, [socketStream]);

  return {
    ...state,
    
    connect,
    disconnect,
    joinMatch,
    leaveMatch,
    requestHistory,
    clearEvents,
    
    canConnect: !state.isConnected && !state.isConnecting,
    canDisconnect: state.isConnected,
  };
};
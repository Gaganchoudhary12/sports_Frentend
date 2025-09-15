import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { MatchEvent } from '../types/MatchEvent';
import { useSocketConnection } from '../hooks/useSocketConnection';
import { useMatchState } from '../hooks/useMatchState';
import { EventCard } from './EventCard';
import { ScoreBoard } from './ScoreBoard';

export const CricketCommentary: React.FC = () => {
  const [sessionEnded, setSessionEnded] = useState(false);
  
  const {
    events,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    canConnect,
    canDisconnect,
  } = useSocketConnection();

  const matchState = useMatchState(events);

  // Check for session end
  useEffect(() => {
    const sessionEndEvent = events.find(event => 
      event.payload?.status === 'Session Ended'
    );
    if (sessionEndEvent && !sessionEnded) {
      setSessionEnded(true);
      Alert.alert(
        'Match Complete! 🏏',
        'The 10-over simulation has finished. Final score: India 92/2. Thanks for watching!',
        [{ text: 'OK', onPress: () => {} }]
      );
    }
  }, [events, sessionEnded]);

  const handleConnect = () => {
    if (canConnect) {
      connect();
    } else if (canDisconnect) {
      disconnect();
    }
  };





  const renderEvent = ({ item }: { item: MatchEvent }) => (
    <EventCard event={item} />
  );

  const getConnectionStatus = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    if (error) return 'Error';
    return 'Disconnected';
  };



  return (
    <View style={styles.container}>
      <ScoreBoard matchState={matchState} />
      
      {/* Connection Status */}
      {/* <View style={styles.statusBar}>
        <View style={[
          styles.statusIndicator, 
          isConnected ? styles.connectedIndicator : styles.disconnectedIndicator
        ]} />
        <Text style={styles.statusText}>{getConnectionStatus()}</Text>
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
      </View> */}
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[
            styles.button, 
            sessionEnded ? styles.completedButton : 
            isConnected ? styles.exitButton : styles.startButton,
            (isConnecting || sessionEnded) && styles.disabledButton
          ]}
          onPress={handleConnect}
          disabled={isConnecting || sessionEnded}
        >
          <Text style={styles.buttonText}>
            {sessionEnded ? 'Match Complete' : 
             isConnected ? 'Exit Game' : 'Start Game'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id || Math.random().toString()}
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {isConnected 
                ? 'Game in progress! Waiting for match events...' 
                : 'Press "Start Game" to begin live cricket commentary'
              }
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  connectedIndicator: {
    backgroundColor: '#4CAF50',
  },
  disconnectedIndicator: {
    backgroundColor: '#f44336',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    marginLeft: 8,
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 150,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  exitButton: {
    backgroundColor: '#f44336',
  },
  completedButton: {
    backgroundColor: '#4caf50',
  },
  disabledButton: {
    backgroundColor: '#bdbdbd',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventsList: {
    flex: 1,
    paddingTop: 8,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 26,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9e9e9e',
    textAlign: 'center',
    fontStyle: 'italic',
  },

});
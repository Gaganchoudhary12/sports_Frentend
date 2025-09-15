import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MatchEvent } from '../types/MatchEvent';

interface EventCardProps {
  event: MatchEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getEventStyle = () => {
    switch (event.type) {
      case 'BOUNDARY':
        return styles.boundaryCard;
      case 'WICKET':
        return styles.wicketCard;
      case 'MATCH_STATUS':
        return styles.statusCard;
      default:
        return styles.defaultCard;
    }
  };

  const getEventIcon = () => {
    switch (event.type) {
      case 'BOUNDARY':
        return event.payload.runs === 6 ? '⚡' : '🏏';
      case 'WICKET':
        return '🎯';
      case 'MATCH_STATUS':
        return '📢';
      case 'BALL':
        return '🔵';
      default:
        return '❓';
    }
  };

  const renderEventContent = () => {
    switch (event.type) {
      case 'BALL':
      case 'BOUNDARY':
        return (
          <>
            <Text style={styles.runsText}>{event.payload.runs} run{event.payload.runs !== 1 ? 's' : ''}</Text>
            <Text style={styles.commentary}>{event.payload.commentary}</Text>
          </>
        );
      
      case 'WICKET':
        return (
          <>
            <Text style={styles.wicketText}>{event.payload.playerOut} - {event.payload.dismissal}</Text>
            <Text style={styles.commentary}>{event.payload.commentary}</Text>
          </>
        );
      
      case 'MATCH_STATUS':
        return (
          <>
            <Text style={styles.statusText}>{event.payload.status}</Text>
            <Text style={styles.commentary}>{event.payload.summary}</Text>
          </>
        );
      
      default:
        return (
          <>
            <Text style={styles.unknownType}>Unknown Event: {event.type}</Text>
            <Text style={styles.commentary}>
              {typeof event.payload === 'object' ? JSON.stringify(event.payload) : String(event.payload)}
            </Text>
          </>
        );
    }
  };

  return (
    <View style={[styles.card, getEventStyle()]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getEventIcon()}</Text>
        <Text style={styles.timestamp}>
          {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : ''}
        </Text>
      </View>
      {renderEventContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  defaultCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#e0e0e0',
  },
  boundaryCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
  },
  wicketCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#f44336',
    backgroundColor: '#ffebee',
    shadowColor: '#f44336',
    shadowOpacity: 0.2,
  },
  statusCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
    backgroundColor: '#e3f2fd',
    shadowColor: '#2196F3',
    shadowOpacity: 0.2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  runsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 6,
    textShadowColor: 'rgba(46, 125, 50, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  wicketText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c62828',
    marginBottom: 6,
    textShadowColor: 'rgba(198, 40, 40, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565c0',
    marginBottom: 6,
    textShadowColor: 'rgba(21, 101, 192, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  unknownType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef6c00',
    marginBottom: 6,
  },
  commentary: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
    fontWeight: '400',
  },
});
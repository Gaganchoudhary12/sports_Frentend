import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MatchState } from '../types/MatchEvent';

interface ScoreBoardProps {
  matchState: MatchState;
}

const { width } = Dimensions.get('window');

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ matchState }) => {

  const formatOvers = () => {
    const completedOvers = Math.floor(matchState.balls / 6);
    const remainingBalls = matchState.balls % 6;
    return remainingBalls > 0 ? `${completedOvers}.${remainingBalls}` : `${completedOvers}`;
  };

  const calculateRunRate = () => {
    const totalOvers = matchState.balls / 6;
    return totalOvers > 0 ? (matchState.totalRuns / totalOvers).toFixed(2) : '0.00';
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradientOverlay} />
      <View style={styles.mainScoreContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.teamName}>
            {matchState.matchStatus === 'Chase Begins' || 
             matchState.matchStatus === 'SA Powerplay End' ||
             matchState.matchStatus === 'Key Wicket' ||
             matchState.matchStatus === 'Equation' ||
             matchState.matchStatus === 'Crunch Time' ||
             matchState.matchStatus === 'Massive Wicket' ||
             matchState.matchStatus === 'Final Over' ? 
             '🇿🇦 SOUTH AFRICA' : '🇮🇳 INDIA'}
          </Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>{matchState.totalRuns}</Text>
            <Text style={styles.separator}>/</Text>
            <Text style={styles.wicketsText}>{matchState.wickets}</Text>
          </View>
          <Text style={styles.oversText}>({formatOvers()} overs)</Text>
          {matchState.currentBowler && (
            <Text style={styles.bowlerTextSmall}>
              {matchState.currentBowler === 'K. Rabada' ? 'K. Rabada' :
               matchState.currentBowler === 'A. Nortje' ? 'A. Nortje' :
               matchState.currentBowler === 'L. Ngidi' ? 'L. Ngidi' :
               matchState.currentBowler === 'M. Jansen' ? 'M. Jansen' :
               matchState.currentBowler === 'K. Maharaj' ? 'K. Maharaj' :
               matchState.currentBowler === 'T. Shamsi' ? 'T. Shamsi' :
               matchState.currentBowler}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{calculateRunRate()}</Text>
          <Text style={styles.statLabel}>Run Rate</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{matchState.balls}</Text>
          <Text style={styles.statLabel}>Balls Faced</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{10 - matchState.wickets}</Text>
          <Text style={styles.statLabel}>Wickets Left</Text>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{matchState.matchStatus}</Text>
        </View>
      </View>
      
      <View style={styles.batsmenContainer}>
        <Text style={styles.batsmenTitle}>Current Partnership</Text>
        <View style={styles.batsmenRow}>
          {matchState.currentBatsmen.map((batsman, index) => {
            const playerStats = matchState.getPlayerStats?.(batsman) || { runs: 0, balls: 0, isOut: false };
            const isNotOut = !playerStats.isOut && playerStats.balls > 0;
            
            return (
              <View key={index} style={styles.batsmanCard}>
                <Text style={styles.batsmanName}>
                  {batsman === 'V. Kohli' ? 'Virat Kohli' : 
                   batsman === 'R. Jadeja' ? 'Ravindra Jadeja' :
                   batsman === 'R. Sharma' ? 'Rohit Sharma' :
                   batsman === 'R. Pant' ? 'Rishabh Pant' :
                   batsman === 'S. Yadav' ? 'Suryakumar Yadav' :
                   batsman === 'H. Pandya' ? 'Hardik Pandya' :
                   batsman === 'Q. de Kock' ? 'Quinton de Kock' :
                   batsman === 'R. Hendricks' ? 'Reeza Hendricks' :
                   batsman === 'A. Markram' ? 'Aiden Markram' :
                   batsman === 'H. Klaasen' ? 'Heinrich Klaasen' :
                   batsman === 'D. Miller' ? 'David Miller' :
                   batsman === 'M. Jansen' ? 'Marco Jansen' :
                   batsman === 'K. Maharaj' ? 'Keshav Maharaj' :
                   batsman === 'T. Shamsi' ? 'Tabraiz Shamsi' :
                   batsman}
                </Text>
                <Text style={styles.batsmanStats}>
                  {playerStats.balls > 0 
                    ? `${playerStats.runs}${isNotOut ? '*' : ''} (${playerStats.balls})`
                    : '0* (0)'
                  }
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d47a1',
    paddingTop: 50,
    paddingBottom: 20,
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(13, 71, 161, 0.95)',
  },
  mainScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    minWidth: width * 0.7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  teamName: {
    fontSize: 16,
    color: '#e3f2fd',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  separator: {
    fontSize: 32,
    color: '#90caf9',
    marginHorizontal: 8,
    fontWeight: '300',
  },
  wicketsText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffab91',
  },
  oversText: {
    fontSize: 16,
    color: '#bbdefb',
    fontWeight: '500',
  },
  bowlerTextSmall: {
    fontSize: 12,
    color: '#90caf9',
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 15,
    paddingVertical: 16,
    zIndex: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#b3e5fc',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  statusBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  batsmenContainer: {
    marginHorizontal: 20,
    zIndex: 1,
  },
  batsmenTitle: {
    fontSize: 14,
    color: '#e1f5fe',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  batsmenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  batsmanCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  batsmanName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  batsmanStats: {
    fontSize: 12,
    color: '#81d4fa',
    fontWeight: '500',
  },
});
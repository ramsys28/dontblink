import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameStatsProps {
  currentTime: number;
  bestTime: number;
  gamesPlayed: number;
  averageTime: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  currentTime,
  bestTime,
  gamesPlayed,
  averageTime,
}) => {
  const formatTime = (time: number): string => {
    return time.toFixed(1);
  };

  const getPerformanceRating = (time: number): string => {
    if (time < 2) return '👶 Newbie';
    if (time < 5) return '🔥 Getting Hot';
    if (time < 10) return '⚡ Lightning Fast';
    if (time < 20) return '🏆 Champion';
    if (time < 30) return '🚀 Superhuman';
    return '🧘 Zen Master';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Game Statistics</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(currentTime)}s</Text>
          <Text style={styles.statLabel}>Current Time</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(bestTime)}s</Text>
          <Text style={styles.statLabel}>Best Time</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{gamesPlayed}</Text>
          <Text style={styles.statLabel}>Games Played</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(averageTime)}s</Text>
          <Text style={styles.statLabel}>Average Time</Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>
          {getPerformanceRating(bestTime)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 20,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ecdc4',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffeb3b',
  },
});

export default GameStats;
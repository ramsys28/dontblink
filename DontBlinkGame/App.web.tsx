import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface GameState {
  isPlaying: boolean;
  currentTime: number;
  bestTime: number;
  roundStarted: boolean;
  gamesPlayed: number;
  totalTime: number;
}

const DontBlinkWebGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentTime: 0,
    bestTime: 0,
    roundStarted: false,
    gamesPlayed: 0,
    totalTime: 0,
  });

  const [showWelcome, setShowWelcome] = useState(true);
  const [distractionText, setDistractionText] = useState('');
  const [showDistraction, setShowDistraction] = useState(false);

  // Animation refs
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Game refs
  const gameTimer = useRef<NodeJS.Timeout | null>(null);
  const distractionTimer = useRef<NodeJS.Timeout | null>(null);
  const gameEndTimer = useRef<NodeJS.Timeout | null>(null);

  const distractions = [
    '🐧 Dancing Penguin!',
    '🎉 SURPRISE!',
    '✨ Sparkles!',
    '👻 Peek-a-boo!',
    '💥 BOOM!',
    '🎪 Circus Time!',
    '🦄 Unicorn Alert!',
    '🌈 Rainbow Power!',
    '🚀 Rocket Launch!',
    '🎭 Drama Time!',
  ];

  const getPerformanceRating = (time: number): string => {
    if (time < 2) return '👶 Newbie';
    if (time < 5) return '🔥 Getting Hot';
    if (time < 10) return '⚡ Lightning Fast';
    if (time < 20) return '🏆 Champion';
    if (time < 30) return '🚀 Superhuman';
    return '🧘 Zen Master';
  };

  const startGame = useCallback(() => {
    setShowWelcome(false);
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      currentTime: 0,
      roundStarted: false,
    }));

    // 3-second countdown
    setTimeout(() => {
      setGameState(prev => ({ ...prev, roundStarted: true }));
      startTimer();
      startDistractionSchedule();
      scheduleRandomGameEnd();
    }, 3000);
  }, []);

  const startTimer = useCallback(() => {
    gameTimer.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        currentTime: prev.currentTime + 0.1,
      }));
    }, 100);
  }, []);

  const scheduleRandomGameEnd = useCallback(() => {
    // Random end time between 3-20 seconds for demo
    const endTime = Math.random() * 17000 + 3000;
    gameEndTimer.current = setTimeout(() => {
      endGame();
    }, endTime);
  }, []);

  const endGame = useCallback(() => {
    // Clear all timers
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
      gameTimer.current = null;
    }
    if (distractionTimer.current) {
      clearTimeout(distractionTimer.current);
      distractionTimer.current = null;
    }
    if (gameEndTimer.current) {
      clearTimeout(gameEndTimer.current);
      gameEndTimer.current = null;
    }

    const newBestTime = Math.max(gameState.bestTime, gameState.currentTime);
    const isNewRecord = gameState.currentTime > gameState.bestTime;

    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      roundStarted: false,
      bestTime: newBestTime,
      gamesPlayed: prev.gamesPlayed + 1,
      totalTime: prev.totalTime + prev.currentTime,
    }));

    setShowDistraction(false);
    stopAllAnimations();

    // Show result with delay
    setTimeout(() => {
      const message = isNewRecord && gameState.bestTime > 0 
        ? `🎉 NEW RECORD! 🎉\n\nYou lasted ${gameState.currentTime.toFixed(1)} seconds!\n\n${getPerformanceRating(gameState.currentTime)}`
        : `Game Over! 👁️\n\nYou lasted ${gameState.currentTime.toFixed(1)} seconds!\n\n${getPerformanceRating(gameState.currentTime)}`;
      
             Alert.alert('Game Over', message);
    }, 500);
  }, [gameState.currentTime, gameState.bestTime]);

  const startDistractionSchedule = useCallback(() => {
    const scheduleNext = () => {
      const delay = Math.random() * 3000 + 1500; // 1.5-4.5 seconds
      distractionTimer.current = setTimeout(() => {
        triggerDistraction();
        scheduleNext();
      }, delay);
    };
    scheduleNext();
  }, []);

  const triggerDistraction = useCallback(() => {
    const randomDistraction = distractions[Math.floor(Math.random() * distractions.length)];
    setDistractionText(randomDistraction);
    setShowDistraction(true);

    // Background color animation
    Animated.sequence([
      Animated.timing(backgroundColorAnim, {
        toValue: Math.random(),
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();

    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // Hide distraction
    setTimeout(() => {
      setShowDistraction(false);
    }, 1500);
  }, [backgroundColorAnim, shakeAnim, scaleAnim]);

  const stopAllAnimations = useCallback(() => {
    Animated.timing(backgroundColorAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(shakeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [backgroundColorAnim, shakeAnim, scaleAnim]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimer.current) clearInterval(gameTimer.current);
      if (distractionTimer.current) clearTimeout(distractionTimer.current);
      if (gameEndTimer.current) clearTimeout(gameEndTimer.current);
    };
  }, []);

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(0, 0, 0)', 'rgb(255, 107, 107)'],
  });

  const averageTime = gameState.gamesPlayed > 0 ? gameState.totalTime / gameState.gamesPlayed : 0;

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={[
        styles.gameContainer,
        {
          transform: [
            { translateX: shakeAnim },
            { scale: scaleAnim },
          ],
        },
      ]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👁️ Don't Blink!</Text>
          <Text style={styles.subtitle}>Web Demo</Text>
        </View>

        {/* Welcome Message */}
        {showWelcome && (
          <View style={styles.welcomeContainer}>
            <View style={styles.messageBox}>
              <Text style={styles.welcomeTitle}>🚀 Welcome to Don't Blink!</Text>
              <Text style={styles.welcomeText}>
                This is a web demo of the mobile eye-tracking game.
              </Text>
              <Text style={styles.welcomeSubtext}>
                The full experience with real blink detection is available on mobile devices.
              </Text>
              <Text style={styles.demoNote}>
                📱 This demo simulates the gameplay experience.
              </Text>
            </View>
          </View>
        )}

        {/* Game Status */}
        <View style={styles.statusContainer}>
          {!gameState.isPlaying ? (
            <View style={styles.menuContainer}>
              <Text style={styles.instructionText}>
                Test your willpower and focus!
              </Text>
              <Text style={styles.rulesText}>
                Keep your eyes open while distractions try to make you blink.
              </Text>
              
              {/* Statistics */}
              {gameState.gamesPlayed > 0 && (
                <View style={styles.statsContainer}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Best Time:</Text>
                    <Text style={styles.statValue}>{gameState.bestTime.toFixed(1)}s</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Games Played:</Text>
                    <Text style={styles.statValue}>{gameState.gamesPlayed}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Average:</Text>
                    <Text style={styles.statValue}>{averageTime.toFixed(1)}s</Text>
                  </View>
                  <Text style={styles.ratingText}>
                    {getPerformanceRating(gameState.bestTime)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.gameInfo}>
              {!gameState.roundStarted ? (
                <Text style={styles.countdownText}>Get Ready... 👀</Text>
              ) : (
                <>
                  <Text style={styles.timerText}>
                    {gameState.currentTime.toFixed(1)}s
                  </Text>
                  <Text style={styles.statusText}>
                    Don't blink! Focus and resist the distractions!
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Distraction Display */}
        {showDistraction && gameState.roundStarted && (
          <View style={styles.distractionContainer}>
            <Text style={styles.distractionText}>{distractionText}</Text>
          </View>
        )}

        {/* Start Button */}
        {!gameState.isPlaying && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>
                {gameState.gamesPlayed === 0 ? 'START DEMO' : 'PLAY AGAIN'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Get the full mobile experience with real blink detection!
          </Text>
        </View>

      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: Math.min(width * 0.08, 36),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#4ecdc4',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '600',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 25,
    borderRadius: 20,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  welcomeTitle: {
    fontSize: 20,
    color: '#4ecdc4',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  demoNote: {
    fontSize: 14,
    color: '#ffeb3b',
    textAlign: 'center',
    fontWeight: '600',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    alignItems: 'center',
    maxWidth: 400,
  },
  instructionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  rulesText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    minWidth: 250,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  statValue: {
    fontSize: 16,
    color: '#4ecdc4',
    fontWeight: 'bold',
  },
  ratingText: {
    fontSize: 18,
    color: '#ffeb3b',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  gameInfo: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 28,
    color: '#ffeb3b',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerText: {
    fontSize: Math.min(width * 0.12, 60),
    color: '#4ecdc4',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  distractionContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  distractionText: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ff6b6b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DontBlinkWebGame;
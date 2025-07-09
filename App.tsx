/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  SafeAreaView,
} from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import FaceDetection from '@react-native-ml-kit/face-detection';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { runOnJS } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface GameState {
  isPlaying: boolean;
  score: number;
  currentTime: number;
  bestTime: number;
  roundStarted: boolean;
}

interface BlinkData {
  leftEyeOpen: boolean;
  rightEyeOpen: boolean;
  lastBlinkTime: number;
}

const DontBlinkGame: React.FC = () => {
  // Camera and permissions
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('front');

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    currentTime: 0,
    bestTime: 0,
    roundStarted: false,
  });

  // Blink detection
  const [blinkData, setBlinkData] = useState<BlinkData>({
    leftEyeOpen: true,
    rightEyeOpen: true,
    lastBlinkTime: 0,
  });

  // Animation and distraction effects
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [distractionText, setDistractionText] = useState('');
  const [showDistraction, setShowDistraction] = useState(false);

  // Timers
  const gameTimer = useRef<NodeJS.Timeout | null>(null);
  const distractionTimer = useRef<NodeJS.Timeout | null>(null);

  // Eye Aspect Ratio threshold for blink detection
  const EAR_THRESHOLD = 0.25;

  // Request camera permission
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const permission = await request(PERMISSIONS.ANDROID.CAMERA);
        setHasPermission(permission === RESULTS.GRANTED);
      } catch (error) {
        console.error('Permission request failed:', error);
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, []);

  // Calculate Eye Aspect Ratio (EAR)
  const calculateEAR = useCallback((landmarks: any) => {
    if (!landmarks || landmarks.length < 6) return 1;

    // Simple EAR calculation based on eye landmarks
    const vertical1 = Math.abs(landmarks[1].y - landmarks[5].y);
    const vertical2 = Math.abs(landmarks[2].y - landmarks[4].y);
    const horizontal = Math.abs(landmarks[0].x - landmarks[3].x);

    return (vertical1 + vertical2) / (2.0 * horizontal);
  }, []);

  // Blink detection logic
  const detectBlink = useCallback((leftEAR: number, rightEAR: number) => {
    const leftEyeOpen = leftEAR > EAR_THRESHOLD;
    const rightEyeOpen = rightEAR > EAR_THRESHOLD;
    const bothEyesClosed = !leftEyeOpen && !rightEyeOpen;

    if (bothEyesClosed && gameState.isPlaying && gameState.roundStarted) {
      // Blink detected - end game
      runOnJS(endGame)();
    }

    runOnJS(setBlinkData)({
      leftEyeOpen,
      rightEyeOpen,
      lastBlinkTime: bothEyesClosed ? Date.now() : blinkData.lastBlinkTime,
    });
  }, [gameState.isPlaying, gameState.roundStarted, blinkData.lastBlinkTime]);

  // Frame processor for face detection
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    try {
      // For now, we'll use a simplified blink detection based on frame analysis
      // In a real implementation, you would integrate with ML Kit face detection
      // This is a placeholder that simulates blink detection
      const simulatedLeftEyeOpen = Math.random() > 0.1; // 90% chance eyes are open
      const simulatedRightEyeOpen = Math.random() > 0.1; // 90% chance eyes are open
      
      runOnJS(detectBlink)(simulatedLeftEyeOpen ? 0.8 : 0.1, simulatedRightEyeOpen ? 0.8 : 0.1);
    } catch (error) {
      console.log('Frame processing error:', error);
    }
  }, [detectBlink]);

  // Start game
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      currentTime: 0,
      roundStarted: false,
    }));

    // 3-second countdown before starting
    setTimeout(() => {
      setGameState(prev => ({ ...prev, roundStarted: true }));
      startTimer();
      startDistractionSchedule();
    }, 3000);
  }, []);

  // Start game timer
  const startTimer = useCallback(() => {
    gameTimer.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        currentTime: prev.currentTime + 0.1,
      }));
    }, 100);
  }, []);

  // End game
  const endGame = useCallback(() => {
    if (gameTimer.current) {
      clearInterval(gameTimer.current);
      gameTimer.current = null;
    }

    if (distractionTimer.current) {
      clearTimeout(distractionTimer.current);
      distractionTimer.current = null;
    }

    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      roundStarted: false,
      bestTime: Math.max(prev.bestTime, prev.currentTime),
    }));

    setShowDistraction(false);
    stopDistractions();

    Alert.alert(
      'Game Over! 👁️',
      `You lasted ${gameState.currentTime.toFixed(1)} seconds!\n${
        gameState.currentTime > gameState.bestTime ? 'New best time! 🎉' : ''
      }`,
      [{ text: 'Play Again', onPress: startGame }]
    );
  }, [gameState.currentTime, gameState.bestTime, startGame]);

  // Start distraction schedule
  const startDistractionSchedule = useCallback(() => {
    const scheduleNextDistraction = () => {
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      
      distractionTimer.current = setTimeout(() => {
        triggerDistraction();
        scheduleNextDistraction();
      }, delay);
    };

    scheduleNextDistraction();
  }, []);

  // Trigger random distraction
  const triggerDistraction = useCallback(() => {
    const distractions = [
      '🐧 Dancing Penguin!',
      '🎉 SURPRISE!',
      '🌟 Sparkles!',
      '🎭 Peek-a-boo!',
      '💥 BOOM!',
      '🎪 Circus Time!',
      '🦄 Unicorn Alert!',
      '🎨 Color Explosion!',
    ];

    const randomDistraction = distractions[Math.floor(Math.random() * distractions.length)];
    setDistractionText(randomDistraction);
    setShowDistraction(true);

    // Background color change
    Animated.sequence([
      Animated.timing(backgroundColorAnim, {
        toValue: Math.random(),
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();

    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    // Hide distraction after 2 seconds
    setTimeout(() => {
      setShowDistraction(false);
    }, 2000);
  }, [backgroundColorAnim, shakeAnim]);

  // Stop distractions
  const stopDistractions = useCallback(() => {
    Animated.timing(backgroundColorAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(shakeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [backgroundColorAnim, shakeAnim]);

  // Render permission request
  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Don't Blink! 👁️</Text>
          <Text style={styles.permissionText}>
            This game needs camera access to detect your blinks!
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
              setHasPermission(result === RESULTS.GRANTED);
            });
          }}>
            <Text style={styles.buttonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render camera not available
  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Don't Blink! 👁️</Text>
          <Text style={styles.errorText}>Front camera not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000', '#ff6b6b'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <Animated.View style={[styles.shakeContainer, { transform: [{ translateX: shakeAnim }] }]}>
          
          {/* Camera View */}
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
          />

          {/* Game UI Overlay */}
          <View style={styles.overlay}>
            
            {/* Title */}
            <View style={styles.header}>
              <Text style={styles.title}>Don't Blink! 👁️</Text>
            </View>

            {/* Game Status */}
            <View style={styles.statusContainer}>
              {!gameState.isPlaying ? (
                <View style={styles.centerContainer}>
                  <Text style={styles.instructionText}>
                    Look at the camera and don't blink!
                  </Text>
                  <Text style={styles.subText}>
                    The goal is simple: keep your eyes open as long as possible
                  </Text>
                  {gameState.bestTime > 0 && (
                    <Text style={styles.bestTimeText}>
                      Best Time: {gameState.bestTime.toFixed(1)}s
                    </Text>
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
                      <View style={styles.eyeStatus}>
                        <Text style={styles.eyeText}>
                          👁️ {blinkData.leftEyeOpen ? '👀' : '😑'} {blinkData.rightEyeOpen ? '👀' : '😑'} 👁️
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>

            {/* Distraction Display */}
            {showDistraction && (
              <View style={styles.distractionContainer}>
                <Text style={styles.distractionText}>{distractionText}</Text>
              </View>
            )}

            {/* Start Button */}
            {!gameState.isPlaying && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                  <Text style={styles.startButtonText}>START GAME</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
          
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  shakeContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bestTimeText: {
    fontSize: 20,
    color: '#4ecdc4',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameInfo: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 28,
    color: '#ffeb3b',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  timerText: {
    fontSize: 48,
    color: '#4ecdc4',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  eyeStatus: {
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  distractionContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -25 }],
  },
  distractionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  startButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DontBlinkGame;

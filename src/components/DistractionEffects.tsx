import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface DistractionEffectsProps {
  visible: boolean;
  type: string;
  onComplete?: () => void;
}

const DistractionEffects: React.FC<DistractionEffectsProps> = ({
  visible,
  type,
  onComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Start animation sequence
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          { iterations: 2 }
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 8 }
        ),
      ]).start(() => {
        onComplete?.();
      });
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      bounceAnim.setValue(0);
    }
  }, [visible, fadeAnim, scaleAnim, rotateAnim, bounceAnim, onComplete]);

  const getDistractionContent = () => {
    switch (type) {
      case 'penguin':
        return { emoji: '🐧', text: 'Dancing Penguin!' };
      case 'surprise':
        return { emoji: '🎉', text: 'SURPRISE!' };
      case 'sparkles':
        return { emoji: '✨', text: 'Sparkles!' };
      case 'peekaboo':
        return { emoji: '👻', text: 'Peek-a-boo!' };
      case 'boom':
        return { emoji: '💥', text: 'BOOM!' };
      case 'circus':
        return { emoji: '🎪', text: 'Circus Time!' };
      case 'unicorn':
        return { emoji: '🦄', text: 'Unicorn Alert!' };
      case 'rainbow':
        return { emoji: '🌈', text: 'Rainbow!' };
      default:
        return { emoji: '🎭', text: 'Surprise!' };
    }
  };

  const content = getDistractionContent();

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.distractionContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate },
              { translateY: bounce },
            ],
          },
        ]}
      >
        <Text style={styles.emoji}>{content.emoji}</Text>
        <Text style={styles.text}>{content.text}</Text>
      </Animated.View>

      {/* Particle effects */}
      <Animated.View
        style={[
          styles.particleContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {[...Array(5)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                transform: [
                  { scale: scaleAnim },
                  { rotate },
                ],
              },
            ]}
          >
            <Text style={styles.particleEmoji}>⭐</Text>
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  distractionContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ff6b6b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
  },
  particleEmoji: {
    fontSize: 20,
  },
});

export default DistractionEffects;
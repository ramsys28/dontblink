# 👁️ Don't Blink! - Mobile Eye Tracking Game

A React Native mobile game that uses real-time facial tracking and blink detection to create an engaging, competitive experience. Challenge yourself to keep your eyes open as long as possible while the game tries to distract you!

## 🎮 Game Features

- **Real-time Blink Detection**: Uses the device's front camera with advanced computer vision
- **Progressive Distractions**: Randomized visual and audio distractions that increase in intensity
- **Performance Analytics**: Track your best times, averages, and achievements
- **Beautiful Animations**: Smooth UI transitions and entertaining distraction effects
- **Privacy-First**: All facial data is processed locally - nothing is stored or transmitted
- **Cross-Platform**: Runs on both iOS and Android

## 🚀 Quick Start

### Prerequisites

- Node.js (≥18.0.0)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- A physical device with a front-facing camera (recommended for best experience)

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd DontBlinkGame
   npm install
   ```

2. **For Android:**
   ```bash
   # Start Metro bundler
   npm start
   
   # In another terminal, run on Android
   npx react-native run-android
   ```

3. **For iOS:**
   ```bash
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

### Required Permissions

The app requires the following permissions:
- **Camera**: For facial tracking and blink detection
- **Microphone**: For enhanced audio feedback (optional)

## 🎯 How to Play

1. **Grant Permissions**: Allow camera access when prompted
2. **Position Yourself**: Hold the device 12-18 inches from your face
3. **Start Game**: Tap "START GAME" and wait for the 3-second countdown
4. **Don't Blink**: Keep your eyes open as long as possible!
5. **Survive Distractions**: The game will try to make you blink with:
   - Sudden color changes
   - Dancing animations
   - Surprise pop-ups
   - Screen shaking effects
6. **Challenge Yourself**: Beat your best time and climb the performance rankings!

## 🏆 Performance Rankings

- 👶 **Newbie**: < 2 seconds
- 🔥 **Getting Hot**: 2-5 seconds  
- ⚡ **Lightning Fast**: 5-10 seconds
- 🏆 **Champion**: 10-20 seconds
- 🚀 **Superhuman**: 20-30 seconds
- 🧘 **Zen Master**: 30+ seconds

## 🛠️ Technical Implementation

### Core Technologies

- **React Native 0.80.1**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **react-native-vision-camera**: High-performance camera integration
- **@react-native-ml-kit/face-detection**: Google ML Kit for facial recognition
- **react-native-reanimated**: Smooth 60fps animations
- **react-native-permissions**: Runtime permission handling

### Blink Detection Algorithm

The game uses a sophisticated multi-method approach for blink detection:

1. **Eye Aspect Ratio (EAR) Calculation**:
   ```typescript
   EAR = (|p2 - p6| + |p3 - p5|) / (2 * |p1 - p4|)
   ```
   - Where p1-p6 are eye landmark coordinates
   - Threshold: EAR < 0.25 indicates closed eye

2. **ML Kit Integration**: Uses Google's face detection API for robust eye state probability

3. **Temporal Filtering**: Requires consecutive frames of closed eyes to confirm blink

4. **Calibration System**: Adapts to individual users for improved accuracy

### Architecture Overview

```
src/
├── components/
│   ├── GameStats.tsx          # Statistics and performance display
│   ├── DistractionEffects.tsx # Animated distraction components
│   └── ...
├── utils/
│   ├── BlinkDetection.ts      # Advanced blink detection engine
│   ├── SoundManager.ts        # Audio feedback system
│   └── ...
└── assets/                    # Game assets and resources
```

### Key Components

#### BlinkDetectionEngine
Handles sophisticated blink detection with multiple fallback methods:
- Primary: ML Kit face detection probabilities
- Secondary: EAR calculation from landmarks
- Fallback: Simulated detection for development

#### SoundManager
Manages audio feedback and haptic responses:
- Game start/end sounds
- Distraction audio cues
- Achievement notifications
- Volume and preference controls

#### DistractionEffects
Creates engaging visual distractions:
- Particle systems
- Color animations
- Rotation and scaling effects
- Randomized timing and intensity

## 🔧 Configuration & Customization

### Blink Detection Settings

```typescript
// Adjust sensitivity in src/utils/BlinkDetection.ts
const EAR_THRESHOLD = 0.25;      // Eye closure threshold
const CONSECUTIVE_FRAMES = 2;     // Required consecutive closed frames
const CONFIDENCE_THRESHOLD = 0.7; // Minimum detection confidence
```

### Distraction Timing

```typescript
// Modify in App.tsx
const delay = Math.random() * 3000 + 2000; // 2-5 seconds between distractions
```

### Performance Thresholds

Update performance rankings in `src/components/GameStats.tsx`:

```typescript
const getPerformanceRating = (time: number): string => {
  if (time < 2) return '👶 Newbie';
  if (time < 5) return '🔥 Getting Hot';
  // ... customize thresholds
};
```

## 📱 Platform-Specific Notes

### Android
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 33
- Required permissions configured in `android/app/src/main/AndroidManifest.xml`
- Uses Camera2 API for optimal performance

### iOS
- Minimum iOS: 11.0
- Camera usage description required in `Info.plist`
- Metal framework for GPU-accelerated processing
- AVFoundation for camera access

## 🐛 Troubleshooting

### Common Issues

1. **Camera Permission Denied**
   - Check device settings and manually enable camera permission
   - Restart the app after granting permissions

2. **Face Detection Not Working**
   - Ensure adequate lighting
   - Position face 12-18 inches from camera
   - Clean the front camera lens

3. **Performance Issues**
   - Close other apps to free memory
   - Lower frame rate in development builds
   - Use release build for optimal performance

4. **Build Errors**
   ```bash
   # Clear caches and rebuild
   npx react-native start --reset-cache
   cd android && ./gradlew clean && cd ..
   npm run android
   ```

### Debug Mode

Enable additional logging by modifying the frame processor:

```typescript
const frameProcessor = useFrameProcessor((frame) => {
  'worklet';
  console.log('Frame processed:', frame.timestamp);
  // ... detection logic
}, []);
```

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on device/emulator
npm run android  # or npm run ios
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google ML Kit team for facial detection APIs
- React Native Vision Camera community
- Reanimated team for smooth animations
- Beta testers and contributors

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting guide

---

**Ready to test your willpower? Don't blink and start playing! 👁️**

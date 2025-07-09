# 🌐 Web Deployment Guide - Don't Blink! for Render

## Overview
This guide shows how to create a web version of the Don't Blink! game that can be deployed on Render using React Native Web.

## 🚀 Quick Setup for Web Deployment

### Step 1: Install React Native Web Dependencies

```bash
cd DontBlinkGame
npm install react-native-web react-dom
npm install -D @babel/preset-react webpack webpack-cli webpack-dev-server html-webpack-plugin babel-loader
```

### Step 2: Create Web-Specific Configuration

Create `webpack.config.js`:
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.web.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
  },
};
```

### Step 3: Create Web Entry Point

Create `index.web.js`:
```javascript
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('DontBlinkGame', () => App);
AppRegistry.runApplication('DontBlinkGame', {
  rootTag: document.getElementById('root'),
});
```

### Step 4: Create HTML Template

Create `public/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Don't Blink! - Eye Tracking Game</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #000;
        }
        #root {
            height: 100vh;
            width: 100vw;
        }
    </style>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

### Step 5: Update Package.json Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "web": "webpack serve --mode development",
    "build:web": "webpack --mode production",
    "start:web": "webpack serve"
  }
}
```

## 🔧 Render Deployment Setup

### 1. Create Render-Specific Files

Create `render.yaml`:
```yaml
services:
  - type: web
    name: dont-blink-game
    env: static
    buildCommand: npm install && npm run build:web
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

Create `package.json` build script for Render:
```json
{
  "scripts": {
    "build": "npm run build:web"
  }
}
```

### 2. Web-Specific App Modifications

Create `App.web.tsx` (web-optimized version):
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const DontBlinkWebGame: React.FC = () => {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    currentTime: 0,
    bestTime: 0,
    roundStarted: false,
  });

  const [showMessage, setShowMessage] = useState(true);

  const startGame = () => {
    setShowMessage(false);
    setGameState(prev => ({ ...prev, isPlaying: true, currentTime: 0 }));
    
    setTimeout(() => {
      setGameState(prev => ({ ...prev, roundStarted: true }));
      startTimer();
    }, 3000);
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        currentTime: prev.currentTime + 0.1,
      }));
    }, 100);

    // Simulate random game end (since we can't detect blinks in web)
    const randomEndTime = Math.random() * 10000 + 5000; // 5-15 seconds
    setTimeout(() => {
      clearInterval(timer);
      endGame();
    }, randomEndTime);
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      roundStarted: false,
      bestTime: Math.max(prev.bestTime, prev.currentTime),
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👁️ Don't Blink! (Web Demo)</Text>
      
      {showMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            🚀 This is a web demo of the mobile game!
          </Text>
          <Text style={styles.subText}>
            The full experience with real blink detection is available on mobile devices.
          </Text>
          <Text style={styles.subText}>
            This demo will automatically end after a random time to simulate gameplay.
          </Text>
        </View>
      )}

      {!gameState.isPlaying ? (
        <View style={styles.centerContainer}>
          <Text style={styles.instructionText}>
            Ready to test your willpower?
          </Text>
          {gameState.bestTime > 0 && (
            <Text style={styles.bestTimeText}>
              Best Time: {gameState.bestTime.toFixed(1)}s
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>START DEMO</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          {!gameState.roundStarted ? (
            <Text style={styles.countdownText}>Get Ready... 👀</Text>
          ) : (
            <View style={styles.gameInfo}>
              <Text style={styles.timerText}>
                {gameState.currentTime.toFixed(1)}s
              </Text>
              <Text style={styles.statusText}>
                Don't blink! (Demo mode - will end automatically)
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    maxWidth: 400,
  },
  messageText: {
    fontSize: 18,
    color: '#4ecdc4',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 8,
  },
  centerContainer: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  bestTimeText: {
    fontSize: 20,
    color: '#4ecdc4',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 28,
    color: '#ffeb3b',
    fontWeight: 'bold',
  },
  gameInfo: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    color: '#4ecdc4',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default DontBlinkWebGame;
```

## 🚀 Deploy to Render

### Method 1: Connect GitHub Repository

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Static Site"
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install && npm run build:web`
   - **Publish Directory**: `dist`
6. Deploy!

### Method 2: Manual Deploy

1. Build locally:
   ```bash
   npm run build:web
   ```
2. Upload the `dist` folder to Render
3. Configure as static site

## 🌐 Environment Variables (if needed)

```bash
# Add to Render environment
NODE_ENV=production
PUBLIC_URL=https://your-app.render.com
```

## 📝 Important Notes

### Limitations of Web Version:
- **No Real Camera Access**: Web cameras have different APIs
- **No Blink Detection**: Would need different computer vision libraries
- **Performance**: May be slower than native mobile app
- **User Experience**: Touch interactions differ from mobile

### Recommended Approach:
1. **Use web version as a demo/marketing page**
2. **Direct users to download the actual mobile app**
3. **Show screenshots and videos of mobile functionality**

## 🎯 Next Steps

1. **Set up the web version** using the guide above
2. **Deploy to Render** as a demo/landing page
3. **Focus on mobile app distribution** for the full experience
4. **Use the web version** to showcase your mobile app capabilities

Would you like me to help you set up any of these deployment options?
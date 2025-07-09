// import Sound from 'react-native-sound';

// For now, we'll use a simplified sound manager without actual audio files
// In a production app, you would uncomment the Sound import and implement actual audio

export interface SoundEffect {
  name: string;
  file: string;
  volume?: number;
}

class SoundManager {
  private sounds: Map<string, any> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Sound.setCategory('Playback');
    this.initializeSounds();
  }

  private initializeSounds() {
    const soundEffects: SoundEffect[] = [
      { name: 'gameStart', file: 'game_start.mp3', volume: 0.7 },
      { name: 'gameEnd', file: 'game_end.mp3', volume: 0.8 },
      { name: 'distraction', file: 'distraction.mp3', volume: 0.6 },
      { name: 'newRecord', file: 'new_record.mp3', volume: 0.9 },
      { name: 'countdown', file: 'countdown.mp3', volume: 0.5 },
    ];

    soundEffects.forEach(effect => {
      // In a real implementation, you would load the actual sound files:
      /*
      const sound = new Sound(effect.file, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load sound', effect.name, error);
          return;
        }
        sound.setVolume(effect.volume || 0.5);
        this.sounds.set(effect.name, sound);
      });
      */
      
      // For now, we'll just store a placeholder
      this.sounds.set(effect.name, { 
        play: () => console.log(`Playing sound: ${effect.name}`),
        setVolume: (volume: number) => console.log(`Setting volume for ${effect.name}: ${volume}`)
      });
    });
  }

  playSound(name: string, volume?: number): void {
    if (!this.enabled) return;

    const sound = this.sounds.get(name);
    if (sound) {
      if (volume !== undefined) {
        sound.setVolume(volume);
      }
      sound.play();
    } else {
      console.warn(`Sound ${name} not found`);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(soundName: string, volume: number): void {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.setVolume(Math.max(0, Math.min(1, volume)));
    }
  }

  stopAll(): void {
    this.sounds.forEach(sound => {
      if (sound.stop) {
        sound.stop();
      }
    });
  }

  // Game-specific sound methods
  playGameStart(): void {
    this.playSound('gameStart');
  }

  playGameEnd(isNewRecord: boolean = false): void {
    if (isNewRecord) {
      this.playSound('newRecord');
    } else {
      this.playSound('gameEnd');
    }
  }

  playDistraction(): void {
    this.playSound('distraction', 0.4); // Quieter for distractions
  }

  playCountdown(): void {
    this.playSound('countdown');
  }

  // Haptic feedback simulation (would use react-native-haptic-feedback in production)
  vibrate(type: 'light' | 'medium' | 'heavy' = 'medium'): void {
    console.log(`Vibrating with ${type} intensity`);
    // In production: HapticFeedback.trigger(type);
  }
}

// Singleton instance
export const soundManager = new SoundManager();

export default SoundManager;
import { AppRegistry } from 'react-native';
import App from './App.web';

// Register the main component
AppRegistry.registerComponent('DontBlinkGame', () => App);

// Run the application
AppRegistry.runApplication('DontBlinkGame', {
  rootTag: document.getElementById('root'),
});
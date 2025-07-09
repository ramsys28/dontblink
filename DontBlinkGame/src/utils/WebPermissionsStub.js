// Stub for react-native-permissions in web environment

export const request = () => Promise.resolve('granted');

export const PERMISSIONS = {
  ANDROID: {
    CAMERA: 'android.permission.CAMERA',
  },
  IOS: {
    CAMERA: 'ios.permission.CAMERA',
  },
};

export const RESULTS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  BLOCKED: 'blocked',
  UNAVAILABLE: 'unavailable',
};

export default {
  request,
  PERMISSIONS,
  RESULTS,
};
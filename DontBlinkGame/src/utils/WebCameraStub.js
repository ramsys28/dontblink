// Stub for react-native-vision-camera in web environment

export const Camera = () => null;

export const useCameraDevice = () => null;

export const useFrameProcessor = () => null;

export const useCameraPermission = () => ({
  hasPermission: false,
  requestPermission: () => Promise.resolve('denied'),
});

export default {
  Camera,
  useCameraDevice,
  useFrameProcessor,
  useCameraPermission,
};
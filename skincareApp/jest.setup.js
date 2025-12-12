// ensure the NativeModules mock is loaded
require('./jest-mocks/NativeModules.js');

// silence native animated warnings
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default = Reanimated;
  Reanimated.__reanimatedWorkletInit = () => {};
  return Reanimated;
});

// mock gesture handler minimal exports
jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {},
    Directions: {},
  };
});

// mock expo-router hooks used in tests
// Create a shared store the test can override
let mockParams = {};

jest.mock('expo-router', () => ({
  Link: ({ children }) => children,
  Stack: {
    Screen: ({ children }) => children,
  },

  useLocalSearchParams: () => mockParams,
  useSearchParams: () => mockParams,

  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),

  useSegments: () => [],
}));

// Utility for tests to set params
export const setMockRouterParams = (params) => {
  mockParams = params;
};

// jest.mock('expo-router', () => ({
//   Link: ({ children }) => children,
//   useLocalSearchParams: () => ({}),
//   useSearchParams: () => ({}),
//   useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
// }));
// jest.mock('expo-router', () => ({
//   Link: ({ children }) => children,
//   useRouter: () => ({ push: jest.fn() }),
//   useSegments: () => [],
// }));
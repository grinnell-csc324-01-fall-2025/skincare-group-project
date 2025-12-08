// Minimal mock for react-native/Libraries/BatchedBridge/NativeModules
module.exports = {
  __esModule: true,
  default: {
    ImageLoader: {},
    ImageViewManager: {},
    Linking: {},
    LinkingManager: {},
    NativeUnimoduleProxy: {
      modulesConstants: {
        mockDefinition: {
          ExponentConstants: {
            experienceUrl: { mock: 'exp://127.0.0.1:19000' },
          },
        },
      },
      viewManagersMetadata: {},
    },
    UIManager: {},
  },
};
// __tests__/ImageScreen.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import ImageScreen from '@/app/image';
import { useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

// -------------------- Mock dependencies --------------------
jest.mock('expo-camera', () => {
  const CameraMock = jest.fn();
  CameraMock.requestCameraPermissionsAsync = jest.fn(() =>
    Promise.resolve({ granted: true })
  );

  return {
    Camera: CameraMock,
    CameraView: jest.fn(() => null),
    useCameraPermissions: jest.fn(() => [{ status: 'granted' }, jest.fn()]),
  };
});

jest.mock('expo-image-picker', () => ({
  useCameraPermissions: jest.fn(() => [{ status: 'granted' }, jest.fn()]),
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ granted: true })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({ canceled: false, assets: [{ uri: 'mock-image-uri' }] })
  ),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: jest.fn(),
  Link: ({ children }) => children, // render children directly
}));

// -------------------- Tests --------------------
describe('<ImageScreen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  // -------------------- Camera preview branch --------------------
  test('renders camera preview when ready=1 and no image', () => {
    useLocalSearchParams.mockReturnValue({ ready: 1 });

    render(<ImageScreen />);

    expect(screen.getByText(/Take Pic/i)).toBeTruthy();
  });

  // -------------------- Captured image branch --------------------
  test('renders captured image and buttons when ready=1 and image exists', () => {
    useLocalSearchParams.mockReturnValue({ ready: 1 });

    // Mock useState to simulate image already exists
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ['mock-image-uri', jest.fn()]) // image
      .mockImplementationOnce(() => [null, jest.fn()]); // cameraRef

    render(<ImageScreen />);

    expect(screen.getByText(/restart/i)).toBeTruthy();
    expect(screen.getByText(/Next/i)).toBeTruthy();
  });

  // -------------------- Library image branch --------------------
  test('renders library image when ready=2', async () => {
    useLocalSearchParams.mockReturnValue({ ready: 2 });

    render(<ImageScreen />);

    expect(await screen.findByText(/restart/i)).toBeTruthy();
    expect(await screen.findByText(/Next/i)).toBeTruthy();
  });

  // -------------------- Camera permission denied --------------------
  test('shows alert if camera permission is denied', async () => {
    useLocalSearchParams.mockReturnValue({ ready: 1 });

    const { Camera, useCameraPermissions } = require('expo-camera');
    useCameraPermissions.mockReturnValue([{ status: 'denied' }, jest.fn()]);
    Camera.requestCameraPermissionsAsync.mockResolvedValue({ granted: false });

    render(<ImageScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permission required',
        'Permission to access camera is required!'
      );
    });
  });

  // -------------------- Library permission denied --------------------
  test('shows alert if library permission is denied', async () => {
    useLocalSearchParams.mockReturnValue({ ready: 2 });

    const ImagePicker = require('expo-image-picker');
    ImagePicker.useCameraPermissions.mockReturnValue([{ status: 'denied' }, jest.fn()]);
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: false });

    render(<ImageScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permission required',
        'Permission to access media library is required!'
      );
    });
  });
});

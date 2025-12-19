import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ConcernsScreen from '@/app/concerns';
import { Link, useLocalSearchParams } from 'expo-router';

// Mock Expo Router
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: jest.fn(),
  Link: ({ children }) => children, // render the child directly for testing
}));

describe('<ConcernsScreen />', () => {
  beforeEach(() => {
    // Provide a mock imageUri
    useLocalSearchParams.mockReturnValue({ imageUri: 'mock-image-uri' });
  });

  test('Text renders correctly on ConcernsScreen', () => {
    render(<ConcernsScreen />);
    expect(screen.getByText(/Before we start, what concerns do you have\?/i)).toBeTruthy();
  });

  test('all option buttons render correctly on ConcernsScreen', () => {
    render(<ConcernsScreen />);

    const cancerousButton = screen.getByText('Cancerous Moles');
    const skinTypeButton = screen.getByText('Skin Type');
    const acneButton = screen.getByText('Acne Type');

    expect(cancerousButton).toBeTruthy();
    expect(skinTypeButton).toBeTruthy();
    expect(acneButton).toBeTruthy();

    fireEvent.press(cancerousButton);
    fireEvent.press(skinTypeButton);
    fireEvent.press(acneButton);

  });

  test('Buttons render correctly on HomeScreen', () => {
      render(<ConcernsScreen />);
      expect(screen.getByText('Next')).toBeTruthy();
    });

});
















// describe('<ConcernsScreen />', () => {
//     test('Text renders correctly on HomeScreen', () => {
//         render(<ConcernsScreen />);
//         expect(screen.getByText(/Before we start, what concerns do you have?/i)).toBeTruthy();
//     })

//     test('Buttons render correctly on HomeScreen', () => {
//         render(<ConcernsScreen />);
//         expect(screen.getByText(/Cancerous Moles/i)).toBeTruthy();
//         expect(screen.getByText(/Skin Type/i)).toBeTruthy();
//         expect(screen.getByText(/Acne Type/i)).toBeTruthy();
//         expect(screen.getByTestId('MyButton')).toBeTruthy();
//     })

// })

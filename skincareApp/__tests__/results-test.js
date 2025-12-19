import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ResultsScreen from '@/app/results';
import { Link, useLocalSearchParams } from 'expo-router';

// Mock Expo Router
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: jest.fn(),
  Link: ({ children }) => children,
}));

describe('<ResultsScreen />', () => {
  beforeEach(() => {
    useLocalSearchParams.mockReturnValue({ imageUri: 'mock-image-uri', tests: '1,2' });
  });

  test('shows loading indicator initially', () => {
    // Mock fetch that never resolves so loading stays true
    global.fetch = jest.fn(() => new Promise(() => {}));

    render(<ResultsScreen />);
    
    const loader = screen.getByTestId('loading-indicator');
    expect(loader).toBeTruthy();
  });

  test('renders results after fetch', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cancerResult: 0, skinAnalysis: 0.7 }),
      })
    );

    render(<ResultsScreen />);

    // Wait for results text after loading
    expect(await screen.findByText(/your results/i)).toBeTruthy();
    expect(screen.getByText(/Recommendations/i)).toBeTruthy();
  });

  test('shows restart button', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cancerResult: 0, skinAnalysis: 0.7 }),
      })
    );

    render(<ResultsScreen />);
    
    const restartButton = await screen.findByText(/restart/i);
    expect(restartButton).toBeTruthy();
  });
});











// // Mock Expo Router
// jest.mock('expo-router', () => ({
//   ...jest.requireActual('expo-router'),
//   useLocalSearchParams: jest.fn(),
//   Link: ({ children }) => children,
// }));

// describe('<ResultsScreen />', () => {
//     beforeEach(() => {
//         // Mock route params
//         useLocalSearchParams.mockReturnValue({ imageUri: 'mock-image-uri', tests: '1,2' });

//         // Mock fetch globally for all tests in this file
//         global.fetch = jest.fn(() =>
//         Promise.resolve({
//             ok: true,
//             json: () => Promise.resolve({ cancerResult: 0, skinAnalysis: 0.7 }),
//         })
//         );
//     });


//     test('Text renders correctly on ResultsScreen', () => {
//         render(<ResultsScreen />);
//         const resultText = screen.findByText(/your results/i);
//         expect(resultText).toBeTruthy();
//     });
// });
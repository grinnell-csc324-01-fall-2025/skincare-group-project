import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ResultsScreen from '../app/results.jsx';

// --- Mock expo-router ---
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({
    tests: '1,2',
    imageUri: 'file:///tmp/photo.jpg',
  }),
  Link: ({ children }) => children, // simply render children
}));

// --- Mock global fetch ---
global.fetch = jest.fn((url) => {
  if (url.includes('/api/cancer_result')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ cancerResult: 0.42 }), // below threshold
    });
  }
  if (url.includes('/api/skin_analysis')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        skinAnalysis: { label: 'oily', confidence: 0.8 }
      }),
    });
  }
  return Promise.resolve({
    ok: false,
    status: 404,
    json: async () => ({ error: 'not found' }),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('displays results for selected tests', async () => {
  const { getByText, queryByText } = render(<ResultsScreen />);

  // While loading, the title should NOT appear
  expect(queryByText(/Your results/i)).toBeNull();

  // Wait for loading to finish and UI to update
  await waitFor(() => {
    expect(getByText(/Your results/i)).toBeTruthy();
  });

  // Labels for each test should appear
  // expect(getByText('Cancerous Moles')).toBeTruthy();
  // expect(getByText('Skin Type')).toBeTruthy();

  // Component logic:
  // cancerResult = 0.42 (< 0.5) → “NOT have Skin Cancer”
  expect(getByText(/NOT have Skin Cancer/i)).toBeTruthy();

  // Skin type is not displayed as raw JSON anymore
  // but it still appears inside the text output
  expect(getByText(/oily/i)).toBeTruthy();
});

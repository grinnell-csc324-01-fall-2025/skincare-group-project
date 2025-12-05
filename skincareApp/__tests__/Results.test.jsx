import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ResultsScreen from '../app/results.jsx';

// mock expo-router hook used by ResultsScreen
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ tests: '1,2', imageUri: 'file:///tmp/photo.jpg' }),
}));

// mock global fetch to return responses for each endpoint the component calls
global.fetch = jest.fn((url) => {
  if (url.includes('/api/cancer_result')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ cancerResult: 0.42 }),
    });
  }
  if (url.includes('/api/skin_analysis')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ skinAnalysis: { label: 'oily', confidence: 0.8 } }),
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
  const { getByText } = render(<ResultsScreen />);

  // title should render immediately
  expect(getByText(/Your results/i)).toBeTruthy();

  // wait for asynchronous fetches to finish and UI to update
  await waitFor(() => {
    // check that each test label appears
    expect(getByText('Cancerous Moles')).toBeTruthy();
    expect(getByText('Skin Type')).toBeTruthy();

    // check that returned values are rendered
    expect(getByText('0.42')).toBeTruthy();           // cancerResult float string
    expect(getByText(/oily/i)).toBeTruthy();          // skinAnalysis label appears in JSON output
  });
});
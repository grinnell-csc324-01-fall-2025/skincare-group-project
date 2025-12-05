import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Mock expo-router Link/params so components render in test environment
jest.mock('expo-router', () => ({
  Link: ({ children }) => children,
  useLocalSearchParams: () => ({}),
  useRouter: () => ({ push: jest.fn() }),
}));

import ConcernsScreen from '../app/concerns.jsx';

test('Concerns screen renders options and buttons are pressable', async () => {
  const { getByText } = render(<ConcernsScreen />);

  // options expected from concerns.jsx
  expect(getByText('Cancerous Moles')).toBeTruthy();
  expect(getByText('Skin Type')).toBeTruthy();

  // pressing options should not throw
  fireEvent.press(getByText('Cancerous Moles'));
  fireEvent.press(getByText('Skin Type'));

  // Next button should render (it may be a Button or TouchableOpacity wrapped by Link)
  // We look for "Next" text which previous versions used
  const next = getByText(/next/i);
  expect(next).toBeTruthy();

  // pressing Next should not throw (navigation is mocked)
  fireEvent.press(next);
});
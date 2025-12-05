import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  Link: ({ children }) => children,
  useLocalSearchParams: () => ({}),
  useRouter: () => ({ push: jest.fn() }),
}));

import SessionsScreen from '../app/sessions.jsx';

test('Sessions screen renders without crashing', () => {
  const tree = render(<SessionsScreen />).toJSON();
  expect(tree).toBeTruthy();
});
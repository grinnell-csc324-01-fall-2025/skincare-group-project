import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  Link: ({ children }) => children,
  useLocalSearchParams: () => ({}),
  useRouter: () => ({ push: jest.fn() }),
}));

import IndexScreen from '../app/index.jsx';

test('Index screen renders without crashing', () => {
  const tree = render(<IndexScreen />).toJSON();
  expect(tree).toBeTruthy();
});
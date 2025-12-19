import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '@/app/index';

describe('<HomeScreen />', () => {
  test('Text renders correctly on HomeScreen', () => {
    render(<HomeScreen />);
    expect(screen.getByText(/Welcome!/i)).toBeTruthy();
    expect(screen.getByText(/In this app you will be able to scan or upload pictures of your skin to receive personalized skincare recomendations depending on you skin and acne type. You also have the option to check whether a mole is cancerous./i)).toBeTruthy();
    expect(screen.getByText(/To start please choose one of the options below:/i)).toBeTruthy();
  })

  test('Buttons render correctly on HomeScreen', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Take a picture')).toBeTruthy();
    expect(screen.getByText('Select a picture')).toBeTruthy();
  });

})
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

// Defining different screens/sections

// Starting screen
const StartingScreen = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column'
    },
    text: {
      fontSize: 50,
      color: '#9dc1fa',
      fontWeight: 'bold',
      textAlign: 'center'
    }
  })
  return (
    <View style = {styles.container}>
      <Text style = {styles.text}>Skincare Project</Text>
    </View>
  )
};

// Main concerns screen
const MainConcernsScreen = () => {
};

// Choosing related sessions screen
const RelatedSessionsScreen = () => {
};

// Image upload screen
const ImageUploadScreen = () => {
};

// Live scan screen
const LiveScanScreen = () => {
};

// Results screen
const ResultsScreen = () => {
};

// Create a Stack Navigator
const Stack = createStackNavigator();

const app = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartingScreen">
        <Stack.Screen name="StartingScreen" component={StartingScreen} />
        <Stack.Screen name="MainConcernsScreen" component={MainConcernsScreen} />
        <Stack.Screen name="RelatedSessionsScreen" component={RelatedSessionsScreen} />
        <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} />
        <Stack.Screen name="LiveScanScreen" component={LiveScanScreen} />
        <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default app;

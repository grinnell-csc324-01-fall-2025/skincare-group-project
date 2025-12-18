import { View, Text, StyleSheet} from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import MyButton from '../components/MyButton';


const homeScreen = () => {

  return (
    <View style = {styles.container}>
        <Text style = {styles.header}>Welcome!</Text>
        <Text style = {styles.text}>
          In this app you will be able to scan or upload pictures of your skin to receive personalized skincare
          recomendations depending on you skin and acne type. You also have the option to check whether a mole is cancerous.
        </Text>
        <Text style = {styles.text}>
          To start please choose one of the options below:
        </Text>

        <Link 
          href={{
            pathname: "/image",
            params: {ready: 1} // 1 - photo taken
          }}
          push
          asChild>
            <MyButton text= "Take a picture"/>
        </Link>
        <Link 
          href={{
            pathname: "/image",
            params: {ready: 2} // 2 - image picked
          }}
          push
          asChild>
            <MyButton text= "Select a picture"/>
        </Link>
      </View>
  )
}

export default homeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"

  },

  header: {
    color: "#023047ff",
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },

  text: {
    color: "#023047ff",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  }
})
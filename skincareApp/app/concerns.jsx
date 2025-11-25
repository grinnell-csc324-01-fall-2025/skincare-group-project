import { View, Text, Button, Alert, StyleSheet} from 'react-native'
import { Link } from 'expo-router';
import React, {useState} from 'react'

const concernsScreen = () => {

  return (
    <View style = {styles.container}>
      <h1 style = {styles.text}>Before we start, what concerns do you have?</h1>

      <View style={styles.buttons}>
        <Link href="/index" pop>
          <Button 
            title="Cancerous Moles">
          </Button>
        </Link>

        <Button 
          title="Skin Type">
        </Button>
        <Button 
          title="Acne Type">
        </Button>
      </View>
    </View>
  )
}

export default concernsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 80,
    marginHorizontal: 30

  },
  text: {
    color: '#9dc1fa',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttons: {
    marginTop: 30,
    gap:50
  }
})
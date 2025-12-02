import { View, Text, Button, Alert, StyleSheet} from 'react-native'
import { Link } from 'expo-router';
import React, {useState} from 'react'

const concernsScreen = () => {

  return (
    <View style = {styles.container}>
      <Text style = {styles.text}>Before we start, what concerns do you have?</Text>

      <View style={styles.buttons}>
        <Link href="/results" push asChild>
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
    color: "#023047",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  buttons: {
    marginTop: 30,
    gap:50
  }
})
import { View, Text, Button, Alert, StyleSheet} from 'react-native'
import { Link } from 'expo-router';
import React, {useState} from 'react'

const resultsScreen = () => {
    return (
        <View style = {styles.container}>
          <Text style={styles.text}>results page</Text>
    
          <View style={styles.buttons}>
            <Link href="/" dismissTo asChild>
              <Button 
                title="return home">
              </Button>
            </Link>
          </View>
        </View>
      )
}

export default resultsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    color: "#023047",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  }
})
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const App = () => {
const [isLoading, setIsLoading] = useState(false)
const handleApiCall = async () => {
  setIsLoading(true)
  try {
    const response = await fetch('http://localhost:5000/api_call/', {  // Fixed URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request: "oil level",
        request: "cancer status"
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    Alert.alert('API Call Success', `Message: ${data.message}`)
  } catch (error) {
    Alert.alert('API Call Failed', error.message)
  } finally {
    setIsLoading(false)
  }
}

  return (
    <View style = {styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleApiCall}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Make API Call'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  text: {
    fontSize: 50,
    color: '#9dc1fa',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40
  },
  button: {
    backgroundColor: '#9dc1fa',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
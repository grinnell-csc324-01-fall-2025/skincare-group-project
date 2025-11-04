import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const app = () => {
  return (
    <View style = {styles.container}>
      <Text style = {styles.text}>Skincare Project</Text>
    </View>
  )
}

export default app

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
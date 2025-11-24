import { View, Text, Button, Alert, StyleSheet} from 'react-native'
import React, {useState} from 'react'

const app = () => {
  const [image, setImage] = useState(null);

  function getImage(event) {
    //get image from input
  }

  return (
    <View style = {styles.container}>
      <h1 style = {styles.text}>Welcome!</h1>
      <h2 style = {styles.text}>
        In this app you will be able to scan or upload pictures of your skin to receive personalized skincare
        recomendations depending on you skin and acne type. You also have the option to check whether a mole is cancerous.
      </h2>
      <h2 style = {styles.text}>
        To start please choose one of the options below:
      </h2>

      <input type='file' id='image-input' onChange={getImage} ></input>

      <View style={styles.buttons}>
        <Button 
          title="scan">

        </Button>
        <Button 
          title="upload">
          onPress={() => document.getElementById('image-input').click()}
        </Button>
      </View>

    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',

  },
  text: {
    color: '#9dc1fa',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttons: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',

    gap:80
  }
})
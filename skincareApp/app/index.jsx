import { View, Text, Button, Image, TouchableOpacity, Alert, StyleSheet} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, {useState} from 'react'
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const homeScreen = () => {
  const [image, setImage] = useState(null);
  const [imageChosen, setImageChosen] = useState(false);

  const choseImage = () => {
    setImageChosen(true);
  }

  const pickImage = async () => {
    //no permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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

      <TouchableOpacity style={styles.imagePicker} onPress={() => {}}>
        <View style={styles.placeholderContainer}>
          <Ionicons name="camera-outline" size={40} color="#023047" />
          <Text style={styles.placeholderText}>Take a picture</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image? (
          <Image source={{uri: image}} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={40} color="#023047" />
            <Text style={styles.placeholderText}>Select an image</Text>
          </View>
        )}
      </TouchableOpacity>

      <Link href="/concerns" push asChild>
        <Button style={styles.button} 
          title="continue">
        </Button>
      </Link>

    </View>
  )
}

export default homeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  text: {
    color: "#023047",
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 90,
  },
  imagePicker: {
    marginTop: 30,
    width: "100%",
    height: 100,
    backgroundColor: "#8ecae6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#219ebc",
    overflow: "hidden"
  },
  previewImage: {
    width: "100%",
    height: "100%"
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  placeholderText: {
    color: "#023047",
    margin: 8
  }
})
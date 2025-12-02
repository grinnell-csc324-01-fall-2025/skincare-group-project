import { View, Text, Button, Image, TouchableOpacity, Alert, StyleSheet, SafeAreaViewBase} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, {useState, useRef, useEffect, use} from 'react'
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import MyButton from '../components/MyButton';


const homeScreen = () => {
  let cameraRef = useRef();

  const [ready, setReady] = useState(0); // 0 - not ready, 1 - photo taken, 2 - image picked

  const [image, setImage] = useState(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] = ImagePicker.useCameraPermissions();

  const getPermissions = async () => {
    try {
      //Check for permissions for the camera
      if(cameraPermission.status !== 'granted') {
        const permissionResponse = await Camera.requestCameraPermissionsAsync();
        if (!permissionResponse.granted) {
          Alert.alert('Permission required', 'Permission to access camera is required!');
          return;
        } 
      }

      setReady(1);


    } catch (error) {
      console.log(error);
    }

  }

  const takePhoto = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setImage(newPhoto.uri);
  }

  // Picking an image from the device's library
  const pickImage = async () => {
    try {
      //check for permission
      if (libraryPermission.status !== 'granted') {
        const permissionResponse = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResponse.granted) {
          Alert.alert('Permission required', 'Permission to access media library is required!');
          return;
        }
      }

      // Let user pick an image
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setReady(2);
      }

    } catch (error) {
      console.log(error);
    }
  }

  if (ready == 0) {
    //no picture has been taken or selected
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

        <MyButton text= "Take a picture" onPress={getPermissions}/>
        <MyButton text= "Select a picture" onPress={pickImage}/>
      </View>
    )
    
  } else if (ready == 1) {
    //In the process of taking a photo
    if (image == null) {
      return (
        <View style={styles.container}>
            <CameraView style={styles.previewImage} ref={cameraRef}/>
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <Text style={styles.text}>Take Pic</Text>
            </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
            <Image source={{uri: image}} style={styles.previewImage} />
            <MyButton text="restart" onPress={() => {setReady(0); setImage(null);}} backgroundColor='#e76f51ff'/>
            <Link href="/concerns" push asChild>
              <MyButton text="Next"/>
            </Link>
        </View>
      )
    }


  } else {
    //selected image from library
    return (
      <View style={styles.container}>
        <View style={styles.imagePicker}> 
          <Image source={{uri: image}} style={styles.previewImage} />
          <MyButton text="restart" onPress={() => {setReady(0); setImage(null);}} backgroundColor='#e76f51ff'/>
          <Link href="/concerns" push asChild>
            <MyButton text="Next"/>
          </Link>
        </View>
      </View>
    )
  }
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
  },

  captureButton: {
    width: 200,
    height: 50,
    borderRadius: 20,
    marginVertical: 10,
    backgroundColor: "#219ebcff",
  },

  imagePicker: {
    width: "100%",
    height: "50%",
  },

  previewImage: {
    width: "100%",
    height: "70%",
    overflow: 'hidden',
    borderRadius: 20,
  },
  placeholderContainer: {
    width: "100%",
  },
})
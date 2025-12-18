import { View, Text, Image, TouchableOpacity, Alert, StyleSheet} from 'react-native'
import {useState, useRef} from 'react'
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import MyButton from '../components/MyButton';

import { useLocalSearchParams } from 'expo-router';


const ImageSCreen = () => {
    const {ready} = useLocalSearchParams();

    let cameraRef = useRef();
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }

        } catch (error) {
        console.log(error);
        }
    }


    if (ready == 1) {
        //In the process of taking a photo
        getPermissions();
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
                    <Link href="/" push asChild>
                        <MyButton text="restart" backgroundColor='#e76f51ff'/>
                    </Link>
                    <Link 
                    href={{
                        pathname: "/concerns", 
                        params: {imageUri : image}
                    }} 
                    push 
                    asChild>
                    <MyButton text="Next"/>
                    </Link>
                </View>
            )
        }
 
    } else if (ready == 2) {
        //selected image from library
        pickImage();
        return (
        <View style={styles.container}>
            <View style={styles.imagePicker}> 
            <Image source={{uri: image}} style={styles.previewImage} />
            <Link href="/" push asChild>
                <MyButton text="restart" backgroundColor='#e76f51ff'/>
            </Link>
            <Link 
                href={{
                pathname: "/concerns", 
                params: {imageUri : image}
                }} 
                push 
                asChild>
                <MyButton text="Next"/>
            </Link>
            </View>
        </View>
        )
        
    } 
}

export default ImageSCreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"

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

  text: {
    color: "#023047ff",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  }
})
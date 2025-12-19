import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import MyButton from '../components/MyButton';
import { useLocalSearchParams } from 'expo-router';

const options = [
  {id: '1', label: 'Cancerous Moles'},
  {id: '2', label: 'Skin Type'},
  {id: '3', label: 'Acne Type'},
];

const ConcernsScreen = () => {
  //pass the image from the previous screen index
  const {imageUri} = useLocalSearchParams();

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleOption = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <View style = {styles.container}>
      <Text style = {styles.title}>Before we start, what concerns do you have?</Text>
      
      <View style = {styles.optionsContainer}>
        {options.map(option => {
          const selected = selectedIds.includes(option.id);
          return (
            <TouchableOpacity
              key = {option.id}
              style = {[
                styles.button,
                selected ? styles.selectedButton : styles.unselectedButton,
              ]}
              onPress = {() => toggleOption(option.id)}
            >
              <Text
                style = {[
                  styles.buttonText,
                  selected ? styles.selectedButtonText : styles.unselectedButtonText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}

    </View>

      <Link
        href={{
          pathname: "/results", 
          params: {tests: selectedIds.join(','), imageUri: imageUri}
        }} 
        push 
        asChild>
        <MyButton text="Next" testID="Next-Button"/>
      </Link>
    </View>
  );
};

export default ConcernsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',

  },
  title: {
    color: "#023047ff",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 10,
  },
  optionsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  selectedButton: {
    backgroundColor: '#8ecae6ff',
    borderColor: '#8ecae6ff',
  },
  unselectedButton: {
    backgroundColor: '#fff',
    borderColor: '#8ecae6ff',
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  unselectedButtonText: {
    color: '#8ecae6ff',
  },
  next: {
    marginTop: 24,
    width: '50%',
  },
})
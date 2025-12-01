import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

const options = [
  {id: '1', label: 'Cancerous Moles'},
  {id: '2', label: 'Skin Type'},
  {id: '3', label: 'Acne Type'},
];

const concernsScreen = () => {
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
              key={option.id}
              style={[
                styles.button,
                selected ? styles.selectedButton : styles.unselectedButton,
              ]}
              onPress={() => toggleOption(option.id)}
            >
              <Text
                style={[
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

    <View style = {styles.next}>
      <Link href = "/index" asChild>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </Link>
      </View>
    </View>
  );
};

export default concernsScreen

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#053a8fff',
    fontWeight: 'bold',
    fontSize: 35,
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    backgroundColor: '#9dc1fa',
    borderColor: '#9dc1fa',
  },
  unselectedButton: {
    backgroundColor: '#fff',
    borderColor: '#9dc1fa',
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
    color: '#9dc1fa',
  },
  next: {
    marginTop: 24,
    width: '50%',
  },
  nextButton: {
    backgroundColor: '#5288e0ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
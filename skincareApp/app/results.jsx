import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import MyButton from '../components/MyButton';

const idToTest = {
  '1': { label: 'Cancerous Moles', endpoint: '/api/cancer_result', field: 'cancerResult' },
  '2': { label: 'Skin Type', endpoint: '/api/skin_analysis', field: 'skinAnalysis' },
  '3': { label: 'Acne Type', endpoint: '/api/acne_analysis', field: 'acneAnalysis' },
  // add more mappings as needed
  // make sure backend endpoints correspond with these endpoints and that they return
  // JSON with the expected fields
};

const ResultsScreen = () => {
  // expects query params: ?tests=1,2 and optionally &imageUri=<local-file-uri>
  const { tests, imageUri } = useLocalSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBaseUrl = () => {
    const LAN_IP = "192.168.1.203"; // replace with your computer's IP
    return Platform.select({
      android: "http://10.0.2.2:5000", // Android emulator
      ios: "http://localhost:5000",    // iOS simulator
      web: `http://${LAN_IP}:5000`,    // Expo web
      default: `http://${LAN_IP}:5000`,
    });
  };

  useEffect(() => {
    const testsParam = typeof tests === 'string' && tests.length ? tests : '';
    const ids = testsParam ? testsParam.split(',') : [];

    const toFetch = ids.map(id => idToTest[id]).filter(Boolean);

    if (toFetch.length === 0) {
      setResults([{ label: 'No tests selected', value: null }]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const baseUrl = getBaseUrl();

    Promise.all(
      toFetch.map(async test => {
        const url = `${baseUrl}${test.endpoint}`;

        try {
          const form = new FormData();
          // include a test identifier if your backend needs it
          form.append('test', test.label);

          // append image if provided (imageUri should be a local file URI, e.g. from ImagePicker)
          if (imageUri) {
            const uri = imageUri; // expo-image-picker returns local uri like file:///...
            // derive filename and type
            const uriParts = uri.split('/');
            const name = uriParts[uriParts.length - 1] || 'photo.jpg';
            const ext = name.split('.').pop().toLowerCase();
            const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

            // React Native expects { uri, name, type } for file fields
            form.append('image', {
              uri,
              name,
              type: mime,
            });
          }

          // Do not set Content-Type header here — let fetch/React Native set the correct boundary.
          const res = await fetch(url, {
            method: 'POST',
            body: form,
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
          const value = test.field && json[test.field] !== undefined ? json[test.field] : json;
          return { 
            label: test.label, ok: true, value };
        } catch (err) {
          return { 
            label: test.label, ok: false, error: err.message };
        }
      })
    )
      .then(setResults)
      .finally(() => setLoading(false));
  }, [tests, imageUri]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" testID="loading-indicator"/>
      </View>
    );
  }

  let index = 0;
  const ids = tests.split(',');

  const findResult = (value) => {
    let result = "";

    if (value >= 0.5) {
      if (ids[index] == '1') {
        result = " have Skin Cancer ";
      } else if (ids[index] == '2') {
        result = " have Oily Skin \nYou may want to condsider using the following products: \n- La Roche-Posay Effaclar Purifying Foaming Gel \n- Avène’s Cleanance Cleansing Gel ";
      }
    } else {
      if (ids[index] == '1') {
        result = " NOT have Skin Cancer ";
      } else if (ids[index] == '2') {
        result = " have Dry Skin \nYou mak want to consider using the following products: \n- Cetaphil Daily Hydrating Lotion \n- CeraVe Moisturizing Cream ";
      }
    }

    index += 1;
    return result;
  }

  return (
    <ScrollView contentContainerStyle = {styles.container}>
      <Text style = {styles.title}>Your results:</Text>

      {results.map((r, idx) => (
        <View key = {idx} style = {styles.resultCard}>
          <Text style = {styles.otherTest}>We've determined you may  
            {r.ok ? (
              <Text style = {styles.resultText}>
                {findResult(r.value)}

                {/* {typeof r.value === 'object' ? JSON.stringify(r.value, null, 2) : String(r.value)} */}
              </Text>
            ) : (
              <Text style = {styles.errorText}> Error: {r.error} </Text>
            )}
          </Text>
        </View>
      ))}

      <View style = {styles.infoBox}>
        <Text style = {styles.infoTitle}>Recommendations</Text>
        <Text style = {styles.infoText}>
          Please note that these results are not a diagnosis. You may want to consult
          a dermatologist to get a professional opinion on these results and
          personalized advice.
        </Text>
      </View>

      <Link href='/' push asChild>
        <MyButton text="restart" backgroundColor='#e76f51ff'/>
      </Link>
    </ScrollView>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoBox: {
    backgroundColor: '#c5d3f5ff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 60,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1975ffff',
    textDecorationLine: 'underline',
  },
  infoText: {
    fontSize: 16,
    color: '#023047',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#219ebc',
  },
  resultCard: {
    backgroundColor: '#e0fbfc',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  resultLabel: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 6,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#023047',
  },
  errorText: {
    fontSize: 24,
    color: '#d00000',
  },
  otherTest: {
    fontSize: 24,
    color: '#023047'
  }
});
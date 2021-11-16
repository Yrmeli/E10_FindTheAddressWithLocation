
// Import
import React, { useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput, FlatList} from 'react-native';
import MapView, { Marker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

const [osoite, setOsoite] = useState('');
const [region, setRegion] = useState(null);

const getRegion= () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=%204G05Ni1C3G5EqHrP0vGOYvVQR5baT6K7&location=${osoite}`)
    .then(response => response.json())
    .then(responseJson => setRegion( {
      ...region,
      latitude: responseJson.results[0].locations[0].displayLatLng.lat,
      longitude: responseJson.results[0].locations[0].displayLatLng.lng,
    }))
    .catch(error => { 
      Alert.alert('Error', error); 
    });    
}

/* 
  Käynnistettäessä tarkistaa, onko paikannukseen lupa
  getCurrentPositionAsync() - palauttaa coords-objektin {latitude, longitude, altitude, speed etc.}
*/
useEffect(() => {
  (async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      Alert.alert('No permission to get location')
      return;
    }
    const location = await Location.getCurrentPositionAsync({});

    setRegion({
      latitude:location.coords.latitude,
      longitude:location.coords.longitude,
      latitudeDelta:0.03,
      longitudeDelta:0.03,
    });

  })();
},[]);

return (
    <View style={styles.container}>

        <MapView
        style = {{flex:8, width:'100%'}}
        region = {region}>
          {
            region &&
            <Marker
            coordinate = {{
            latitude:region.latitude,
            longitude:region.longitude}}
            />
          }
              
        </MapView>

        <TextInput 
        style = {styles.input}
        onChangeText = {osoite => setOsoite(osoite)} 
        value = {osoite}
        />
        <Button title = "Show" onPress = { getRegion }/>		
        <StatusBar hidden = {true} />
      </View>
      
);
}

// Tyyli
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
  width:'100%',
  padding:5,
  margin:5,
  borderColor:'gray', 
  borderWidth:1
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import MapView, {Marker, Callout} from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { block } from 'react-native-reanimated';


function HomeScreen( { navigation } ) {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>

      <View style={{ justifyContent: "space-around", flexDirection: "row" }}>

          <Button
            title="Search the Map"
            onPress={() => navigation.navigate('Map')}
          />

          <Button
            title="Favourite locations"
            onPress={() => navigation.navigate('Favourites')}
          />

      </View>

    </View>
  );
}

function MapScreen() {
  const [stations, setStations] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const {latitude, longitude} = coords;

        setCurrentRegion({
          latitude, 
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        })

      }
    }
    loadInitialPosition();
  }, []);

  if(!currentRegion) {
    return null;
  }

  async function loadStations() {
    const key = 'c92e49d079d28d3bd2a21a4c4e243897624ec143';
    const contract = 'dublin';
    const response = await axios.get(`https://api.jcdecaux.com/vls/v1/stations?contract=${contract}&apiKey=${key}`, {

    })
    // console.log(response.data);
    setStations(response.data);
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  loadStations()
  

/* { this.state.mapList.map(marker => ( */

  return (
    <View on style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MapView 
        style={styles.map} 
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChanged}
      >
        { stations.map(station => (
          <Marker
            key={station.number}
            coordinate={{ latitude: station.position.lat, longitude: station.position.lng }}
          >
            <Callout>
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationAvailableBikes}>{station.available_bike_stands} available bikes</Text>
              <Text style={styles.stationStatus}>{station.status}</Text>
            </Callout>
          </Marker>
        ))}
          

      </MapView>
    </View>
  );
}

function FavouritesScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>favourites Screen</Text>
    </View>
  );
}

function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dublin Bicycle'}} />
          <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Search for bicycles' }} />
          <Stack.Screen name="Favourites" component={FavouritesScreen} options={{ title: 'Favourite locations' }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

const Stack = createStackNavigator(); 

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  stationName: {
    fontWeight: 'bold',
    fontSize: 18
  },
  stationAvailableBikes: {
    fontSize: 12
  },
  stationStatus: {
    color: "#999",
    fontWeight: 'bold'
  },
})

export default App;
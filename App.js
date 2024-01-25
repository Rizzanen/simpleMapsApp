import { useState, useEffect } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission to get location");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleInputChange = (text) => {
    setAddress(text);
  };

  const search = () => {
    fetch(
      `https://geocode.maps.co/search?q=${address}&api_key=65b297a62aa8d697670042rwmc299a3`
    )
      .then((response) => response.json())
      .then((data) => {
        setCoordinates({
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        });
      })
      .catch((error) => Alert.alert("Error" + error));
    setAddress("");
    Keyboard.dismiss();
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <MapView
        style={{ flex: 1, height: "80%", width: "100%" }}
        region={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: coordinates.latitudeDelta,
          longitudeDelta: coordinates.longitudeDelta,
        }}
      >
        <Marker
          coordinate={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }}
          title={address}
        />
      </MapView>
      <View
        style={{
          position: "absolute",
          top: 50,
          left: "8%",
          width: "100%",
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{
            width: "65%",
            height: 40,
            borderWidth: 2,
            borderColor: "black",
            backgroundColor: "white",
            opacity: 0.8,
            fontSize: 18,
          }}
          value={address}
          onChangeText={(text) => handleInputChange(text)}
        />
        <Pressable
          style={{
            backgroundColor: "grey",
            width: "18%",
            marginLeft: 2,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "black",
            padding: 5,
            opacity: 0.9,
          }}
          onPress={search}
        >
          <Text style={{ color: "white", fontSize: 15, fontWeight: 600 }}>
            Search
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

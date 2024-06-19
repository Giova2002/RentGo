import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "../header/Header";
import { UserContext } from '../context/UserContext';
import { firebase } from "../firebase/firebaseConfig";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Likes() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      console.log('useeer',user)
      const userDoc = await firebase.firestore().collection("usuario").doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const favoriteCarRefs = userData.favoritos || [];
        const favoriteCars = [];

        await Promise.all(favoriteCarRefs.map(async (carRef) => {
          const carDoc = await carRef.get();
          if (carDoc.exists) {
            favoriteCars.push({
              key: carDoc.id,
              ...carDoc.data(),
            });
          }
        }));

        setFavorites(favoriteCars);
      } else {
        console.error("User document not found!");
      }
    } catch (error) {
      console.error("Error fetching favorite cars:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
   

    fetchFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Función que se ejecuta cuando la pantalla está enfocada
  
        fetchFavorites();

  
      return () => {
        // Función que se ejecuta cuando la pantalla pierde el foco
     // Limpia el temporizador cuando la pantalla pierde el foco
      };
    }, [user]) // La dependencia de la función es un arreglo vacío, lo que significa que se ejecutará solo una vez (cuando se monta el componente)
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EBAD36" />
        <Text style={styles.cargando}>Cargando</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Header />
      <Text style={styles.tittle}>Mis Favoritos</Text>

      <View style={styles.listSeccion}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#EBAD36" />
            <Text style={styles.cargando}>Cargando</Text>
          </View>
        ) : favorites.length === 0 ? (
          <Text style={styles.noReservations}>No hay ningún carro en favoritos</Text>
        ) : (


        <FlatList 
          data={favorites.filter(item => item.disponible)}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.element}
              onPress={() => navigation.navigate('Info', { carId: item.key } ) }>
              <View style={styles.infoArea}>
                <Text style={styles.infoTittle}>{item.modelo}</Text>
                <Text style={styles.infoSub}>{item.tipo}</Text>
                <Text style={styles.infoPrice}>
                  <Text style={styles.listAmount}>{item.precio}$/día</Text>
                </Text>
              </View>
              <View style={styles.imageArea}>
                <Image source={{uri: item.imagenURL[0]}} resizeMode='fill' style={styles.vehicleImage}/>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.key}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  listSeccion: {
    flexDirection: "column",
    alignItems: "center",
    height: windowHeight * 0.8,
    paddingBottom:90,
    
   
  },
  element: {
    height: windowHeight * 0.14,
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#1C252E",
    flexDirection: "row",
    marginTop: 30,
   
    width:windowWidth*0.85
    
  },
  infoArea: {
    flexDirection: "column",
    flex: 1,
  },
  infoTittle: {
    color: "#FDFDFD",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Raleway_400Regular",
    numberOfLines: 1,
    width: windowWidth * 0.85,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  infoSub: {
    color: "#77828B",
    fontSize: 9,
    fontFamily: "Raleway_400Regular",
    fontWeight: "bold",
  },
  infoPrice: {
    flex: 1,
    color: "#EBAD36",
    fontSize: 14,
    fontFamily: "Raleway_700Bold",
    position: "absolute",
    bottom: 0,
  },
  listAmount: {
    fontFamily: "Raleway_400Regular",
  },
  imageArea: {
    left: 15,
  },
  vehicleImage: {
    width: windowWidth * 0.45,
    height: windowHeight * 0.12,
  },
  tittle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000000",
    paddingLeft: 28,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cargando: {
    alignSelf: "center",
    color: 'black',
    fontSize: 15,
  },
  noReservations: {
    color: 'black',
    fontSize: 20,
    paddingTop: windowHeight * 0.30,
    width: windowWidth * 0.80,
    fontWeight: "bold",
    fontFamily: "Raleway_400Regular",
    textAlign: 'center', 
    alignSelf: 'center', 
  },
  
});

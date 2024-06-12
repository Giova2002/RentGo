import React, { useEffect, useState, useContext, Pressable,  } from 'react';
import { Linking } from 'react-native';
import { firebase } from "../firebase/firebaseConfig";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserContext } from '../context/UserContext';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';

const back = require("../assets/Img/arrow.png");
const wa= require("../assets/Img/whatsapp.png");
const corazongris = require("../assets/corazongris.png");
const corazonrojo = require("../assets/corazonrojo.png");

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function InfoScreen({ route, navigation }) {
  const { user } = useContext(UserContext);
  const { carId } = route.params;
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriting, setFavoriting] = useState(false); 
  const autoRef = firebase.firestore().collection('auto');
  const userRef = firebase.firestore().collection('usuario');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carDoc = await autoRef.doc(carId).get();
        
        if (carDoc.exists) {
          setCar(carDoc.data());
        } else {
          console.error("Car not found!");
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const userDoc = await userRef.doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData.favoritos && userData.favoritos.some(fav => fav.id === carId)) {
            setIsFavorite(true);
          }
        } else {
          console.error("User not found!");
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    fetchCar();
    checkFavoriteStatus();
  }, [carId]);

  const toggleFavorite = async () => {
    setFavoriting(true); // Activar el indicador de carga
    try {
      const userDoc = await userRef.doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        let newFavorites = [];
        const carRef = autoRef.doc(carId);

        if (userData.favoritos && userData.favoritos.some(fav => fav.id === carId)) {
          newFavorites = userData.favoritos.filter(fav => fav.id !== carId);
        } else {
          newFavorites = userData.favoritos ? [...userData.favoritos, carRef] : [carRef];
        }

        await userRef.doc(user.uid).update({ favoritos: newFavorites });
        setIsFavorite(!isFavorite);
      } else {
        console.error("User not found!");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setFavoriting(false); // Desactivar el indicador de carga
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EBAD36" />
        <Text style={styles.cargando}>Cargando</Text>
      </View>
    );
  }

  const openWhatsApp = (phoneNumber) => {
    // Verificar la longitud correcta del número de teléfono
    if (phoneNumber.length !== 10) {
      alert('Por favor, inserte un número de WhatsApp correcto');
      return;
    }
  
    // Usando el código de país para Venezuela
    let url = 'whatsapp://send?phone=58' + phoneNumber;
  
    Linking.openURL(url)
      .then(() => {
        console.log('WhatsApp abierto');
      })
      .catch(() => {
        alert('Asegúrese de que WhatsApp esté instalado en su dispositivo');
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.HeaderText}>Detalles</Text>
              <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
                <Image source={back} resizeMode="contain" style={styles.arrow} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.imageSection}>
            <View style={{ width: 350, height: 210 }}>
              <Image source={{ uri: car.imagenURL }} style={styles.image} />
            </View>
          </View>
          <View style={styles.headSection}>
            <View style={styles.topTextArea}>
              <View>
                <Text style={styles.makemodelText}>{car.modelo}</Text>
              </View>
              <View style={styles.priceFavoriteContainer}>
                <Text style={styles.price}>
                  <Text style={styles.amount}>{car.precio}$/día</Text>
                </Text>
                <TouchableOpacity onPress={toggleFavorite} activeOpacity={0.9} disabled={favoriting}>
                  {favoriting ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Image source={isFavorite ? corazonrojo : corazongris} style={styles.favoriteIcon} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.typetranText}>{car.tipo}</Text>
          </View>
          <View>
            <Text style={styles.descriptionText}>{car.descripcion}</Text>
            <View style={styles.propertiesArea}>
              <View style={styles.level}>
                <Text style={styles.propertyText}>
                  Marca: {car.marca}{'\n'}
                  Litros Gasolina: {car.litros_gas} Litros{'\n'}
                  Nro. Asientos: {car.cant_asientos} {'\n'}
                  Nro. Puertas: {car.nro_puertas} {'\n'}
                  Bluetooth: {car.bluetooth} {'\n'}
                  Maleta: {car.maleta} {'\n'}
                  Ubicación: {car.ubicacion} {'\n'}
                  Detalles: {car.detalles}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.contetReserva} >
          <TouchableOpacity onPress={() => openWhatsApp(car.phoneNumber)} activeOpacity={0.9}>
            <Image source={wa} resizeMode="contain" style={styles.what}  />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rentButton} onPress={() => navigation.navigate('Reserva', { carId })}>
            <Text style={styles.rentButtonText}>Reservar</Text>
          </TouchableOpacity>

          </View>
          {/* <TouchableOpacity>
          <Image source={wa} resizeMode="contain" style={styles.what} />

          </TouchableOpacity>
          <TouchableOpacity style={styles.rentButton} onPress={() => navigation.navigate('Reserva', { carId })}>
            <Text style={styles.rentButtonText}>Reservar</Text>
          </TouchableOpacity> */}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    paddingRight: 35,
    paddingLeft: 35,
    marginTop: -15,
  },
  headerSection: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  HeaderText: {
    fontSize: 20,
    marginLeft: 130,
    top: 21,
    fontWeight: "500",
    fontFamily: 'Raleway_700Bold',
  },
  imageSection: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  headSection: {},
  topTextArea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  makemodelText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: 'Raleway_700Bold',
  },
  priceFavoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontWeight: "400",
    fontFamily: 'Raleway_700Bold',
  },
  amount: {
    fontWeight: "bold",
    color: "#EBAD36",
    fontFamily: 'Raleway_700Bold',
  },
  favoriteIcon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  typetranText: {
    marginTop: 1,
    color: "#696969",
    fontWeight: "600",
    fontSize: 12,
  },
  descriptionText: {
    marginTop: 30,
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 18,
    color: "#696969",
    fontWeight: "500",
    fontFamily: 'Raleway_400Regular',
  },
  propertiesArea: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  level: {
    marginRight: 30,
  },
  propertyText: {
    fontSize: 12,
    color: "#696969",
    fontFamily: 'Raleway_400Regular',
  },
  rentButton: {
    marginTop: 5,
    height: 40,
    alignSelf: "flex-end",
    width: 150,
    backgroundColor: "#EBAD36",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rentButtonText: {
    color: "black",
    fontWeight: "500",
    fontFamily: 'Raleway_700Bold',
  },
  image: {
    width: 300,
    height: 150,
    alignSelf: "center",
    marginTop: 15,
  },
  arrow: {},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cargando: {
    alignSelf: "center",
    color: 'black',
    fontSize: '15',
    fontFamily: 'Raleway_700Bold',
  },
  what: {
    width: "25%",
    height: 40,
    width: 80,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    

  },
  contetReserva: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingVertical: 60,
  },
});







// import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
// import React ,{useEffect, useState } from 'react'
// import { firebase } from "../firebase/firebaseConfig"
// import { FlatList } from 'react-native-gesture-handler';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // import img1 from '../assets/Img/arrow.png'


// const back = require("../assets/Img/arrow.png");


// export default function InfoScreen({route, navigation}) {

// const [loading, setLoading] = useState(true); // Set loading to true on component mount
// const [auto, setAuto] = useState([]); // Initial empty array of users
// const autoRef = firebase.firestore().collection('auto')

// useEffect( () => {
// // const subscriber = firestore()
// autoRef
// .onSnapshot(querySnapshot => {
// const auto = [];
// querySnapshot.forEach((documentSnapshot) => {
// auto.push({
// ...documentSnapshot.data(),
// key: documentSnapshot.id

// });
// });
// setAuto(auto);
// // setLoading(false);
// });
// // Unsubscribe from events when no longer in use
// // return () => subscriber();
// }, []);

// // if (loading) {
// // return <ActivityIndicator />;
// // }
// return (

// <SafeAreaView style={styles.safeArea}>
// <GestureHandlerRootView style={{ flex: 1 }}>
// <View style={styles.container}>
// <View style={styles.headerSection}>
// <View>
// <Text style={styles.HeaderText}>Detalles</Text>
// <TouchableOpacity
// onPress={() => navigation.goBack()}
// activeOpacity={0.9}>
// <Image source={back} resizeMode="contain" style={styles.arrow} />
// </TouchableOpacity>
// </View>

// </View>
// <FlatList
// data={auto}
// renderItem={({ item }) => (
// <View>
// <View style={styles.imageSection}>
// <View style={{ width: 350, height: 200 }}>
// <Image
// source={require('../assets/Img/carro1.png')} //falta cambiar
// style={styles.image}
// />
// </View>
// </View>
// <View style={styles.headSection}>
// <View style={styles.topTextArea}>
// <View>
// <Text style={styles.makemodelText}>{item.modelo}</Text>
// </View>
// <View>
// <Text style={styles.price}>
// <Text style={styles.amount}>{item.precio}</Text>
// </Text>
// </View>
// </View>
// <Text style={styles.typetranText}>
// {item.tipo}
// </Text>
// </View>
// <View>
// <Text style={styles.descriptionText}>
// {item.descripcion}
// </Text>
// <View style={styles.propertiesArea}>
// <View style={styles.level}>
// <Text style={styles.propertyText}>
// Marca: {item.marca}{'\n'}
// Litros Gasolina: {item.litros_gas} Litros{'\n'}
// Nro. Asientos: {item.cant_asientos} {'\n'}
// Nro. Puertas: {item.nro_puertas} {'\n'}
// Bluetooth: {item.bluetooth} {'\n'}
// Maleta: {item.maleta} {'\n'}
// Ubicación: {item.ubicacion} {'\n'}
// Detalles: {item.detalles}
// </Text>
// </View>
// </View>
// </View>
// <TouchableOpacity style={styles.rentButton} onPress={() => navigation.navigate('Reserva')}>
// <Text style={styles.rentButtonText}>Reservar</Text>
// </TouchableOpacity>
// </View>
// )}
// />



// </View>
// </GestureHandlerRootView>
// </SafeAreaView> 
// )
// }

// const styles = StyleSheet.create({
// safeArea: {
// flex: 1,
// backgroundColor: "white",
// },
// container: {
// flex: 1,
// paddingRight: 35,
// paddingLeft: 35,
// marginTop:-15,
// },
// headerSection: {
// height: 70,
// flexDirection: "row",
// justifyContent: "space-between",
// alignItems: "center",
// },
// menuIconStyle: {
// width: 25,
// },
// HeaderText: {
// fontSize: 20,
// marginLeft: 130,
// top: 21,
// // marginTop: 4,
// fontWeight: "500",
// },
// faceIconStyle: {
// width: 30,
// },

// imageSection: {
// width: "100%",
// height: 250,
// justifyContent: "center",
// alignItems: "center",
// },
// vehicleImage: {
// width: 300,
// height: 300,
// },

// headSection: {},
// topTextArea: {
// flexDirection: "row",
// justifyContent: "space-between",
// },
// makemodelText: {
// fontSize: 20,
// fontWeight: "500",
// },
// price: {
// fontWeight: "400",
// },
// amount: {
// fontWeight: "bold",
// color: "#EBAD36",
// },
// typetranText: {
// marginTop: 1,
// color: "#696969",
// fontWeight: "600",
// fontSize: 12,
// },
// descriptionText: {
// marginTop: 30,
// fontSize: 14,
// letterSpacing: 0.1,
// lineHeight: 18,
// color: "#696969",
// fontWeight: "500",
// },
// propertiesText: {
// marginTop: 20,
// fontSize: 19,
// fontWeight: "500",
// },
// propertiesArea: {
// marginTop: 20,
// flexDirection: "row",
// justifyContent: "flex-start",
// },
// level: {
// marginRight: 30,
// },
// propertyText: {
// fontSize: 12,
// color: "#696969",
// },
// valueText: {
// fontSize: 12,
// color: "black",
// },
// rentButton: {
// marginTop: 5,
// height: 40,
// // padding: 10,
// alignSelf: "flex-end",
// width: 150,
// backgroundColor: "#EBAD36",
// borderRadius: 8,
// justifyContent: "center",
// alignItems: "center",
// },
// rentButtonText: {
// color: "black",
// fontWeight: "500",
// },
// image: {
// width: 300,
// height: 150,
// alignSelf: "center",
// marginTop:15,
// },

// arrow:{

// }
// });

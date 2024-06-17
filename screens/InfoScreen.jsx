
import { Linking } from 'react-native';
import React, { useEffect, useState, useContext,useCallback, useRef } from 'react';
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { firebase } from "../firebase/firebaseConfig";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserContext } from '../context/UserContext';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { useCarFiltersContext } from '../context/CarFiltersContext';
import { AntDesign } from '@expo/vector-icons';


const back = require("../assets/Img/arrow.png");
const wa= require("../assets/Img/whatsapp.png");
const corazongris = require("../assets/corazongris.png");
const corazonrojo = require("../assets/corazonrojo.png");

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const { width: screenWidth } = Dimensions.get('window');

export default function InfoScreen({ route, navigation }) {
  const {data,setData}=useCarFiltersContext()
  const { user } = useContext(UserContext);
  const { carId } = route.params;
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriting, setFavoriting] = useState(false); 
  const autoRef = firebase.firestore().collection('auto');
  const userRef = firebase.firestore().collection('usuario');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const carouselRef = useRef(null);


  const handleImageChange = (index) => {
    setCurrentIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentIndex((currentIndex - 1 + car.imagenURL.length) % car.imagenURL.length);
  };

  const handleNextImage = () => {
    setCurrentIndex((currentIndex + 1) % car.imagenURL.length);
  };

  useFocusEffect(
    useCallback(() => {
      // Función que se ejecuta cuando la pantalla está enfocada
      const timeout = setTimeout(() => {
        // Establece los datos después de 2 segundos
        setData({
          seatCount: 2,
          priceRange: [10, 500],
          automaticSelected: false,
          manualSelected: false,
          selectedBrands: [],
          selectedLocations: [],
          search: "",
          filter: false,
          filterByBrand: false
        });
      }, 50);
  
      return () => {
        // Función que se ejecuta cuando la pantalla pierde el foco
        console.log('ROUTEEE', route); // Imprime información sobre la ruta (podría ser útil para depuración)
        clearTimeout(timeout); // Limpia el temporizador cuando la pantalla pierde el foco
      };
    }, []) // La dependencia de la función es un arreglo vacío, lo que significa que se ejecutará solo una vez (cuando se monta el componente)
  );
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
          {/* <View style={styles.imageSection}>
            <View style={{ width: 350, height: 210 }}>
              <Image source={{ uri: car.imagenURL }} style={styles.image} />
            </View>
          </View> */}
        <FlatList
          data={car.imagenURL}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        
          onScroll={(event) => {
            const { contentOffset, layoutMeasurement } = event.nativeEvent;
            const currentIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
            handleImageChange(currentIndex);
          }}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <View style={[styles.imageContainer, { width: screenWidth }]}>
              <Image source={{ uri: item }} style={[styles.image, { width: "100%", height:"100%",}]} />
            </View>
          )}
        />
        <View style={styles.dotsContainer}>
          {car.imagenURL.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : null,
              ]}
            />
          ))}
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
            </View >
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
      
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingRight: 35,
    paddingLeft: 35,
    marginTop: -15,
    flexDirection: "colum",
   
  },
  headerSection: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuIconStyle: {
    width: 25,
  },

  HeaderText: {
    fontSize: 20,
    marginLeft: 130,
    top: 21,
    fontWeight: "500",
    fontFamily: 'Raleway_700Bold'
  },
  faceIconStyle: {
    width: 30,
  },
  imageSection: {
    width: "100%",
    objectFit: 10,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    
  },

  vehicleImage: {
    width: 300,
    height: 300,
  },

  headSection: {},
  topTextArea: {
    marginTop: 30,
    marginHorizontal: 35,
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
    left: 35,

  },
  descriptionText: {
    marginTop: 30,
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 18,
    color: "#696969",
    fontWeight: "500",
    fontFamily: 'Raleway_400Regular',
    marginLeft: 40,
    marginRight: 33,
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
    marginLeft: 40,
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
    
    alignSelf: 'center',
    marginTop: 15,
    marginHorizontal: 'auto',
    left:-34,
    flex: 1,  
    resizeMode: 'cover',
    
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
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  
    arrowContainer: {
      position: 'absolute',
      top: '50%',
      transform: [{ translateY: -24 }],
      padding: 3,
      backgroundColor: 'white',
      borderRadius: 999,
   
  
    },
    arrowLeft: {
       marginTop:75,
      left:0,
    
    },
    arrowRight: {
      marginTop:75,
      right: 0,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: 'black',
    },
    imageContainer:{
      
      justifyContent: 'center',
      alignItems: 'center',
      width: screenWidth, 
      flex: 1,
      width: windowWidth * 0.30,
      height: windowHeight * 0.25,
      objectFit: '100%'
    },



  });




import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ActivityIndicator,Dimensions, FlatList } from 'react-native'
import React ,{useEffect, useState, useRef } from 'react'
import { firebase } from "../firebase/firebaseConfig"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';


const back = require("../assets/Img/arrow.png");
const fortuner = require("../assets/fortuner.png");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const { width: screenWidth } = Dimensions.get('window');

export default function InfoScreen({ route, navigation }) {
  const { carId } = route.params;
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const autoRef = firebase.firestore().collection('auto');
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

    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EBAD36" />
        <Text style={styles.cargando}>Cargando</Text>
      </View>
    );
  }

  

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
        <Image source={{ uri: item }} style={[styles.image, { width: "90%", height:"100%" }]} />
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
              <View>
                <Text style={styles.price}>
                  <Text style={styles.amount}>{car.precio}$/día</Text>
                </Text>
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
          <TouchableOpacity style={styles.rentButton} onPress={() => navigation.navigate('Reserva', { carId })}>
            <Text style={styles.rentButtonText}>Reservar</Text>
          </TouchableOpacity>
        </View>
        
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

  // vehicleImage: {
  //   width: 300,
  //   height: 300,
  // },
  headSection: {},
  topTextArea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  makemodelText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: 'Raleway_700Bold',
    top: 20,
    
  },
  price: {
    fontWeight: "400",
    fontFamily: 'Raleway_700Bold',
    top: 20,
  },
  amount: {
    fontWeight: "bold",
    color: "#EBAD36",
    fontFamily: 'Raleway_700Bold'
  },
  typetranText: {
    marginTop: 30,
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
    fontFamily: 'Raleway_400Regular'
  },
  propertiesText: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "500",
    fontFamily: 'Raleway_400Regular'
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
    fontFamily: 'Raleway_400Regular'
  },
  valueText: {
    fontSize: 12,
    color: "black",
    fontFamily: 'Raleway_400Regular'
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
    fontFamily: 'Raleway_700Bold'
  },
  image: {
    width: 300,
    height: 150,
    alignSelf: 'center',
    marginTop: 15,
    marginHorizontal: 'auto',
    left:-34,
    
  },
  arrow: {},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center'},

    cargando:{
        alignSelf: "center",
        color: 'black',
        fontSize: '15',
        fontFamily: 'Raleway_700Bold'

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

    },
    imageSection: {
   
      height: 250,
      justifyContent: "center",
      alignItems: "center",

    },
});




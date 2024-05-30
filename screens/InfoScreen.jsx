import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React ,{useEffect, useState } from 'react'
import { firebase } from "../firebase/firebaseConfig"
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const back = require("../assets/Img/arrow.png");
const fortuner = require("../assets/fortuner.png");

export default function InfoScreen({ route, navigation }) {
  const { carId } = route.params;
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const autoRef = firebase.firestore().collection('auto');

  useEffect(() => {
    const fetchCar = async () => {
      const carDoc = await autoRef.doc(carId).get();
      if (carDoc.exists) {
        setCar(carDoc.data());
        setLoading(false);
      } else {
        console.error("Car not found!");
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return <ActivityIndicator />;
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
            <View style={{ width: 350, height: 200 }}>
              <Image source={{uri: car.imagenURL}} style={styles.image} />
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
          <TouchableOpacity style={styles.rentButton} onPress={() => navigation.navigate('Reserva')}>
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
  },
  faceIconStyle: {
    width: 30,
  },
  imageSection: {
    width: "100%",
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  makemodelText: {
    fontSize: 20,
    fontWeight: "500",
  },
  price: {
    fontWeight: "400",
  },
  amount: {
    fontWeight: "bold",
    color: "#EBAD36",
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
  },
  propertiesText: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "500",
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
  },
  valueText: {
    fontSize: 12,
    color: "black",
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
  },
  image: {
    width: 300,
    height: 150,
    alignSelf: "center",
    marginTop: 15,
  },
  arrow: {},
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


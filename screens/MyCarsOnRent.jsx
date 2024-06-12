import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator, ScrollView, Linking
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "../header/Header";
import { UserContext } from '../context/UserContext';
import { firebase } from "../firebase/firebaseConfig";
const wa= require("../assets/Img/whatsapp.png");

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function MyCarsOnRent() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    try {
      console.log('useeer', user);
      const rentalsSnapshot = await firebase.firestore().collection("reserva")
        .where("id_usuario_queAlquila", "==", user.uid)
        .get();
      
      const rentalsData = [];

      await Promise.all(rentalsSnapshot.docs.map(async doc => {
        const rental = doc.data();
        const carId = rental.id_auto;

        // Obtener información del auto usando id_auto
        const carDoc = await firebase.firestore().collection("auto").doc(carId).get();
        const carData = carDoc.exists ? carDoc.data() : {};
        console.log('Car data:', carData);

        // Convertir el objeto Timestamp a una fecha legible
        const fechaInicio = rental.fecha_inicio.toDate().toLocaleDateString();
        const fechaFin = rental.fecha_fin.toDate().toLocaleDateString();

        rentalsData.push({
          key: doc.id,
          ...rental,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          ...carData, // Combinar datos del auto
        });
      }));

      setRentals(rentalsData);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRentals();
      return () => {
        // Función que se ejecuta cuando la pantalla pierde el foco
      };
    }, [user])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EBAD36" />
        <Text style={styles.cargando}>Cargando</Text>
      </View>
    );
  };

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
    <GestureHandlerRootView>
      <Header />
      <Text style={styles.tittle}>Mis Reservas</Text>

      <ScrollView
          contentContainerStyle={styles.elementPallet}
          showsVerticalScrollIndicator={false}
        >

      <View style={styles.listSeccion}>
        <FlatList 
          data={rentals}
          renderItem={({ item }) => (
            <View 
              style={styles.element}
              // onPress={() => navigation.navigate('Info', { carData: item.id_auto } ) }
              >
              <View style={styles.infoArea}>
                <Text style={styles.infoTittle}>{item.modelo}</Text>
                <Text style={styles.infoSub}>{item.tipo}</Text>
                <View style={styles.containerPrice}>
                <Text style={styles.price}>Precio total: {item.precio_total}$</Text>
                <Text style={styles.price}>Precio por día: {item.precio_por_dia}$</Text>
                </View>
                
                <Text style={styles.infoPrice}>
                  <Text style={styles.listAmount}>Fecha Inicio: {item.fecha_inicio}{'\n'}</Text>
                  <Text style={styles.listAmount}>Fecha Fin: {item.fecha_fin}</Text>
                </Text>
                

            
                
              </View>
              <View style={styles.imageArea}>
                <Image source={{uri: item.imagenURL}} resizeMode='fill' style={styles.vehicleImage}/>
                
                <View style={styles.contacto}>
                <View>
                <Text style={styles.contactoC}>Contacto:</Text>
                <Text style={styles.contactoNumber}>0{item.phoneNumber}</Text>
                </View>
                <TouchableOpacity onPress={() => openWhatsApp(item.phoneNumber)} activeOpacity={0.9}>
                <Image source={wa} resizeMode="contain" style={styles.what}  />
                </TouchableOpacity>
                
                  
                </View>


              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.key}
        />
      </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  listSeccion: {
    flexDirection: "column",
    alignItems: "center",
    height: windowHeight * 0.8,
    paddingBottom: 90,
  },
  element: {
    height: windowHeight * 0.22,
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#1C252E",
    flexDirection: "row",
    marginTop: 30,
    width: windowWidth * 0.85,
  },
  infoArea: {
    flexDirection: "column",
    flex: 1,
  },
  infoTittle: {
    top: 10,
    color: "#FDFDFD",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Raleway_700Bold",
    numberOfLines: 1,
    // width: 150, // Ajusta el width según lo que necesites
    width: windowWidth * 0.85,
    overflow: "hidden", // Esto evitará que el texto se desborde
    whiteSpace: "nowrap", // Esto evitará que el texto se divida en varias líneas
    textOverflow: "ellipsis", // Esto mostrará puntos suspensivos (...) si el texto se recorta
  },
  infoSub: {
    top: 14,
    color: "#77828B",
    fontSize: 9,
    fontFamily: "Raleway_700Bold",
    fontWeight: "bold",
  },
  infoPrice: {
    flex: 1,
    color: "#EBAD36",
    fontSize: 10,
    fontFamily: "Raleway_700Bold",
    position: "absolute",
    bottom: 0,
    numberOfLines: 1,
    overflow: "hidden", // Esto evitará que el texto se desborde
    whiteSpace: "nowrap", // Esto evitará que el texto se divida en varias líneas
    textOverflow: "ellipsis"
  },
  listAmount: {
    fontFamily: "Raleway_400Regular",
    numberOfLines: 1,
    overflow: "hidden", // Esto evitará que el texto se desborde
    whiteSpace: "nowrap", // Esto evitará que el texto se divida en varias líneas
    textOverflow: "ellipsis"
  },
  phone:{
    color: "#FDFDFD",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
    numberOfLines: 1,
    marginTop: 20,
    width: windowWidth * 0.85,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",

  },
  imageArea: {
    left: 15,
    flexDirection: "column",
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
  containerPrice:{

    flexDirection: "column",
    flex: 1,
    marginTop: windowHeight * 0.09


  },
  price:{
    color: "#FDFDFD",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
    // left:2,
  },
  what: {
    width: "10%",
    height: 50,
    width: 80,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    

  },
  contacto:{
    flexDirection: "row",
    marginTop: 7,
    marginLeft: 28,
  },
  contactoNumber:{
    
    color: "#FDFDFD",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",

  },
  contactoC:{
    marginTop:14,
    color: "#FDFDFD",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Raleway_700Bold",

  }
  
});



// import React, { useEffect, useState, useContext, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { FlatList } from "react-native-gesture-handler";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Header from "../header/Header";
// import { UserContext } from '../context/UserContext';
// import { firebase } from "../firebase/firebaseConfig";

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

// export default function MyCarsOnRent() {
//   const navigation = useNavigation();
//   const { user } = useContext(UserContext);
//   const [loading, setLoading] = useState(true);
//   const [rentals, setRentals] = useState([]);

//   const fetchRentals = async () => {
//     try {
//       console.log('useeer', user);
//       const rentalsSnapshot = await firebase.firestore().collection("reserva")
//         .where("id_usuario_queAlquila", "==", user.uid)
//         .get();
      
//       const rentalsData = [];
      

//       rentalsSnapshot.forEach(doc => {
//         const rental = doc.data();
//         // Convertir el objeto Timestamp a una fecha legible
//         const fechaInicio = rental.fecha_inicio.toDate().toLocaleDateString();
//         const fechaFin = rental.fecha_fin.toDate().toLocaleDateString();
//         rentalsData.push({
//           key: doc.id,
//           ...rental,
//           fecha_inicio: fechaInicio,
//           fecha_fin: fechaFin, 
//         });
//       });

//       setRentals(rentalsData);
//     } catch (error) {
//       console.error("Error fetching rentals:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRentals();
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchRentals();
//       return () => {
//         // Función que se ejecuta cuando la pantalla pierde el foco
//       };
//     }, [user])
//   );

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#EBAD36" />
//         <Text style={styles.cargando}>Cargando</Text>
//       </View>
//     );
//   }

//   return (
//     <GestureHandlerRootView>
//       <Header />
//       <Text style={styles.tittle}>Mis Reservas</Text>

//       <View style={styles.listSeccion}>
//         <FlatList 
//           data={rentals}
//           renderItem={({ item }) => (
//             <TouchableOpacity 
//               style={styles.element}
//               onPress={() => navigation.navigate('Info', { carId: item.key } ) }>
//               <View style={styles.infoArea}>
//                 <Text style={styles.infoTittle}>{item.modelo}</Text>
//                 <Text style={styles.infoSub}>{item.tipo}</Text>
//                 <Text style={styles.infoPrice}>
//                   <Text style={styles.listAmount}> Fecha Inicio: {item.fecha_inicio} {'\n'} Fecha Fin: {item.fecha_fin}  </Text>
//                 </Text>
//               </View>
//               <View style={styles.imageArea}>
//                 <Image source={{uri: item.imagenURL}} resizeMode='fill' style={styles.vehicleImage}/>
//               </View>
//             </TouchableOpacity>
//           )}
//           showsVerticalScrollIndicator={false}
//           keyExtractor={item => item.key}
//         />
//       </View>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   listSeccion: {
//     flexDirection: "column",
//     alignItems: "center",
//     height: windowHeight * 0.8,
//     paddingBottom: 90,
//   },
//   element: {
//     height: windowHeight * 0.14,
//     padding: 13,
//     borderRadius: 10,
//     backgroundColor: "#1C252E",
//     flexDirection: "row",
//     marginTop: 30,
//     width: windowWidth * 0.85,
//   },
//   infoArea: {
//     flexDirection: "column",
//     flex: 1,
//   },
//   infoTittle: {
//     color: "#FDFDFD",
//     fontSize: 14,
//     fontWeight: "bold",
//     fontFamily: "Raleway_400Regular",
//     numberOfLines: 1,
//     width: windowWidth * 0.85,
//     overflow: "hidden",
//     whiteSpace: "nowrap",
//     textOverflow: "ellipsis",
//   },
//   infoSub: {
//     color: "#77828B",
//     fontSize: 9,
//     fontFamily: "Raleway_400Regular",
//     fontWeight: "bold",
//   },
//   infoPrice: {
//     flex: 1,
//     color: "#EBAD36",
//     fontSize: 14,
//     fontFamily: "Raleway_700Bold",
//     position: "absolute",
//     bottom: 0,
//   },
//   listAmount: {
//     fontFamily: "Raleway_400Regular",
//   },
//   imageArea: {
//     left: 15,
//   },
//   vehicleImage: {
//     width: windowWidth * 0.45,
//     height: windowHeight * 0.12,
//   },
//   tittle: {
//     fontSize: 25,
//     fontWeight: "bold",
//     color: "#000000",
//     paddingLeft: 28,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   cargando: {
//     alignSelf: "center",
//     color: 'black',
//     fontSize: 15,
//   },
// });


// import React, { useEffect, useState, useContext, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { FlatList } from "react-native-gesture-handler";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Header from "../header/Header";
// import { UserContext } from '../context/UserContext';
// import { firebase } from "../firebase/firebaseConfig";



// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

// export default function MyCarsOnRent() {
//   const navigation = useNavigation();
//   const { user } = useContext(UserContext);
//   const [loading, setLoading] = useState(true);
//   const [rentals, setRentals] = useState([]);

//   const fetchRentals = async () => {
//     try {
//       console.log('useeer', user)
//       const rentalsSnapshot = await firebase.firestore().collection("reserva")
//         .where("id_usuario_queAlquila", "==", user.uid)
//         .get();
      
//       const rentalsData = [];

//       rentalsSnapshot.forEach(doc => {
//         rentalsData.push({
//           key: doc.id,
//           ...doc.data(),
//         });
//       });

//       setRentals(rentalsData);
//     } catch (error) {
//       console.error("Error fetching rentals:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRentals();
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchRentals();
//       return () => {
//         // Función que se ejecuta cuando la pantalla pierde el foco
//       };
//     }, [user])
//   );

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#EBAD36" />
//         <Text style={styles.cargando}>Cargando</Text>
//       </View>
//     );
//   }

//   return (
//     <GestureHandlerRootView>
//       <Header />
//       <Text style={styles.tittle}>Mis Reservas</Text>

//       <View style={styles.listSeccion}>
//         <FlatList 
//           data={rentals}
//           renderItem={({ item }) => (
//             <TouchableOpacity 
//               style={styles.element}
//               onPress={() => navigation.navigate('Info', { carId: item.key } ) }>
//                 {/* onPress={() => navigation.navigate('RentalInfo', { rentalId: item.key } ) } */}
//               <View style={styles.infoArea}>
//                 <Text style={styles.infoTittle}>{item.modelo}</Text>
//                 <Text style={styles.infoSub}>{item.tipo}</Text>
//                 <Text style={styles.infoPrice}>
//                   <Text style={styles.listAmount}> Fecha Inicio: {item.fecha_inicio}$/día</Text>
//                 </Text>
//               </View>
//               <View style={styles.imageArea}>
//                 <Image source={{uri: item.imagenURL}} resizeMode='fill' style={styles.vehicleImage}/>
//               </View>
//             </TouchableOpacity>
//           )}
//           showsVerticalScrollIndicator={false}
//           keyExtractor={item => item.key}
//         />
//       </View>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   listSeccion: {
//     flexDirection: "column",
//     alignItems: "center",
//     height: windowHeight * 0.8,
//     paddingBottom: 90,
//   },
//   element: {
//     height: windowHeight * 0.14,
//     padding: 13,
//     borderRadius: 10,
//     backgroundColor: "#1C252E",
//     flexDirection: "row",
//     marginTop: 30,
//     width: windowWidth * 0.85,
//   },
//   infoArea: {
//     flexDirection: "column",
//     flex: 1,
//   },
//   infoTittle: {
//     color: "#FDFDFD",
//     fontSize: 14,
//     fontWeight: "bold",
//     fontFamily: "Raleway_400Regular",
//     numberOfLines: 1,
//     width: windowWidth * 0.85,
//     overflow: "hidden",
//     whiteSpace: "nowrap",
//     textOverflow: "ellipsis",
//   },
//   infoSub: {
//     color: "#77828B",
//     fontSize: 9,
//     fontFamily: "Raleway_400Regular",
//     fontWeight: "bold",
//   },
//   infoPrice: {
//     flex: 1,
//     color: "#EBAD36",
//     fontSize: 14,
//     fontFamily: "Raleway_700Bold",
//     position: "absolute",
//     bottom: 0,
//   },
//   listAmount: {
//     fontFamily: "Raleway_400Regular",
//   },
//   imageArea: {
//     left: 15,
//   },
//   vehicleImage: {
//     width: windowWidth * 0.45,
//     height: windowHeight * 0.12,
//   },
//   tittle: {
//     fontSize: 25,
//     fontWeight: "bold",
//     color: "#000000",
//     paddingLeft: 28,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   cargando: {
//     alignSelf: "center",
//     color: 'black',
//     fontSize: 15,
//   },
// });





// import React, { useEffect, useState, useContext, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { FlatList } from "react-native-gesture-handler";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Header from "../header/Header";
// import { UserContext } from '../context/UserContext';
// import { firebase } from "../firebase/firebaseConfig";

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

// export default function MyCarsOnRent() {
//   const navigation = useNavigation();
//   const { user } = useContext(UserContext);
//   const [loading, setLoading] = useState(true);
//   const [reservas, setReservas] = useState([]);

//   const fetchReservas = async () => {
//     try {
//       const snapshot = await firebase
//         .firestore()
//         .collection("reserva")
//         .where("id_usuario_queAlquila", "==", user.uid)
//         .get();
  
//       const reservas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setReservas(reservas);
//     } catch (error) {
//       console.error("Error fetching reservas:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchReservas();
//   }, []);
  
//   useFocusEffect(
//     useCallback(() => {
//       fetchReservas();
//       return () => {};
//     }, [])
//   );

  
  

//   // const fetchReservas = async () => {
//   //   try {
//   //     console.log("Usuario presente:", user.uid);
//   //     const snapshot = await firebase.firestore().collection("reserva").where('id_usuario_queAlquila', '==', user.uid).get();
//   //     const reservasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//   //     setReservas(reservasData);
//   //   } catch (error) {
//   //     console.error("Error fetching reservas:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
  
//   // useEffect(() => {
//   //   fetchReservas();
//   // }, []);
  
//   // useFocusEffect(
//   //   useCallback(() => {
//   //     fetchReservas();
//   //     return () => {};
//   //   }, []) 
//   // );
  

//   // const fetchReservas = async () => {
//   //   try {
//   //     console.log("Usuario presente:" ,user.uid)
      
//   //     const snapshot = await firebase.firestore().collection("reserva").where('id_usuario_queAlquila', '==', user.uid).get();
//   //     const reservasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//   //     setReservas(reservasData);
//   //   } catch (error) {
//   //     console.error("Error fetching reservas:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchReservas();
//   // }, []);

//   // useFocusEffect(
//   //   useCallback(() => {
//   //     fetchReservas();
//   //     return () => {};
//   //   }, []) 
//   // );

  
//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#EBAD36" />
//         <Text style={styles.cargando}>Cargando</Text>
//       </View>
//     );
//   }

//   return (
//     <GestureHandlerRootView>
//       <Header />
//       <Text style={styles.tittle}>Mis Reservas</Text>

//       <View style={styles.listSeccion}>
//         <FlatList 
//           data={reservas}
//           renderItem={({ item }) => (
//             <TouchableOpacity 
//               style={styles.element}
//               onPress={() => navigation.navigate('Info', { carId: item.autoId } ) }>
//               <View style={styles.infoArea}>
//                 <Text style={styles.infoTittle}>{item.modelo}</Text>
//                 <Text style={styles.infoSub}>{item.tipo}</Text>
//                 <Text style={styles.infoPrice}>
//                   <Text style={styles.listAmount}>Fecha inicio: {item.fecha_inicio} {'\n'} Fecha inicio: {item.fecha_fin}</Text>
//                 </Text>
//               </View>
//               <View style={styles.imageArea}>
//                 <Image source={{uri: item.imagenURL}} resizeMode='fill' style={styles.vehicleImage}/>
//               </View>
//             </TouchableOpacity>
//           )}
//           showsVerticalScrollIndicator={false}
//           keyExtractor={item => item.id}
//         />
//       </View>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   listSeccion: {
//     flexDirection: "column",
//     alignItems: "center",
//     height: windowHeight * 0.8,
//     paddingBottom:90,
//   },
//   element: {
//     height: windowHeight * 0.14,
//     padding: 13,
//     borderRadius: 10,
//     backgroundColor: "#1C252E",
//     flexDirection: "row",
//     marginTop: 30,
//     width:windowWidth*0.85
//   },
//   infoArea: {
//     flexDirection: "column",
//     flex: 1,
//   },
//   infoTittle: {
//     color: "#FDFDFD",
//     fontSize: 14,
//     fontWeight: "bold",
//     fontFamily: "Raleway_400Regular",
//     numberOfLines: 1,
//     width: windowWidth * 0.85,
//     overflow: "hidden",
//     whiteSpace: "nowrap",
//     textOverflow: "ellipsis",
//   },
//   infoSub: {
//     color: "#77828B",
//     fontSize: 9,
//     fontFamily: "Raleway_400Regular",
//     fontWeight: "bold",
//   },
//   infoPrice: {
//     flex: 1,
//     color: "#EBAD36",
//     fontSize: 14,
//     fontFamily: "Raleway_700Bold",
//     position: "absolute",
//     bottom: 0,
//   },
//   listAmount: {
//     fontFamily: "Raleway_400Regular",
//   },
//   imageArea: {
//     left: 15,
//   },
//   vehicleImage: {
//     width: windowWidth * 0.45,
//     height: windowHeight * 0.12,
//   },
//   tittle: {
//     fontSize: 25,
//     fontWeight: "bold",
//     color: "#000000",
//     paddingLeft: 28,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   cargando: {
//     alignSelf: "center",
//     color: 'black',
//     fontSize: 15,
//   },
// });




// import { View, Text ,  StyleSheet,Image,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,Button } from 'react-native'
// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;
// import React, { useState, useEffect } from 'react';

// import Header from '../header/Header'
// import Profile from '../header/Profile'
// import { firebase } from "../firebase/firebaseConfig";
// import { FlatList } from "react-native-gesture-handler";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import img from "../assets/Img/carro1.png";


// export default function MyCarsOnRent() {
//   const [loading, setLoading] = useState(true); // Set loading to true on component mount
//   const [auto, setAuto] = useState([]); // Initial empty array of users
//   const autoRef = firebase.firestore().collection('auto')

// useEffect( () => {

//   autoRef
//   .onSnapshot(querySnapshot => {
//   const auto = [];
  
//   querySnapshot.forEach((documentSnapshot) => {
//   auto.push({
//   ...documentSnapshot.data(),
//   key: documentSnapshot.id
  

//   });
// });

//   setAuto(auto);

// });

// }, []);
//   return (

//     <GestureHandlerRootView>
//       <Header />
//       <View style={styles.filterContainer}>
//         <Button
//           title="Mis Carros Reservados"
//           onPress={() => setFilter('reservados')}
//           // color={filter === 'reservados' ? "#1C252E" : "#77828B"}
//         />
//         <Button
//           title="Mis Carros en Alquiler"
//           onPress={() => setFilter('alquiler')}
//           // color={filter === 'alquiler' ? "#1C252E" : "#77828B"}
//         />
//       </View>
      
//       <View style={styles.listSeccion}>
//       <Text style={styles.tittle}>Mis Carros en Alquiler</Text>

//         <ScrollView
//           contentContainerStyle={styles.elementPallet}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* <Card/> */}

//           <FlatList 
//          data={auto}
//          renderItem={({ item }) => (

//           <TouchableOpacity 
//           style={styles.element}
//           onPress={() => navigation.navigate('Info', {carId: item.key } ) }>
//                     <View style={styles.infoArea}>
//                       <Text style={styles.infoTittle}>{item.modelo}</Text>
//                       <Text style={styles.infoSub}>{item.tipo}</Text>
//                       <Text style={styles.infoPrice}>
//                         <Text style={styles.listAmount}>{item.precio}$/dia</Text>
//                       </Text>
                      
//                     </View>
//                     <View style={styles.imageArea}>
                      
//                       <Image source={{uri: item.imagenURL}} resizeMode='fill' style={styles.vehicleImage}/>
//                     </View>
//             </TouchableOpacity>
//          )}/>
          
//         </ScrollView>
//       </View>
     

//     </GestureHandlerRootView>
    
      
//   )
// };

// const styles = StyleSheet.create({
//   textall: {
//     flex: 1,
//     position: "absolute",
//     left: 17,
//     // right: 60,
//     top: 110,
//     bottom: 0,
//     fontSize: 25,
//     fontFamily: "SF",
//     fontWeight: "bold",
//     color: "#000000",
//     textShadowColor: "rgba(0, 0, 0, 0.5)",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },
//   listSeccion: {
//     flexDirection: "column",
//     // justifyContent: 'center',
//     // position: 'absolute',
//     // marginTop: 10,
//     alignItems: "center",
//     // flexGrow: 1,
//     height: windowHeight * 0.57, // cambio el largo de toda la seccion
//   },
//   headText: {
//     // position: 'absolute',
//     fontFamily: "Raleway_700Bold",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 10,
//     padding: 10,
//     right: 100,
//     fontWeight: "bold",
//     color: "#000000",
//     // textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     // textShadowOffset: { width: 1, height: 1 },
//     // textShadowRadius: 0.5,
//   },

//   elementPallet: {
//     // position: 'center',
//     // justifyContent: 'center',
//     // top: 4,
//     // letf: 400,
//     fontFamily: "Raleway_400Regular",
//     // width: 340,
//     width: windowWidth * 0.85,
//     // height: 2000,
//     flexDirection: "column",
//     flexGrow: 1,
//     // alignItems: 'center',
//     // paddingTop: 30, // Ajusta el espaciado superior si es necesario
//     // paddingBottom: 30,
//     paddingBottom: 40,
//   },

//   element: {
//     // height: 120,
//     height: windowHeight * 0.14,
//     padding: 13,
//     borderRadius: 10,
//     backgroundColor: "#1C252E",
//     flexDirection: "row",
//     marginTop: 30,
//   },
//   infoArea: {
//     fontFamily: "SF",
//     flexDirection: "column",
//     flex: 1,
//   },

//   infoTittle: {
//     top: 10,
//     color: "#FDFDFD",
//     fontSize: 14,
//     fontWeight: "bold",
//     fontFamily: "Raleway_400Regular",
//     numberOfLines: 1,
//     // width: 150, // Ajusta el width según lo que necesites
//     width: windowWidth * 0.85,
//     overflow: "hidden", // Esto evitará que el texto se desborde
//     whiteSpace: "nowrap", // Esto evitará que el texto se divida en varias líneas
//     textOverflow: "ellipsis", // Esto mostrará puntos suspensivos (...) si el texto se recorta
//   },

//   infoSub: {
//     top: 14,
//     color: "#77828B",
//     fontSize: 9,
//     fontFamily: "Raleway_400Regular",
//     fontWeight: "bold",
//   },

//   infoPrice: {
//     flex: 1,
//     color: "#EBAD36",
//     fontSize: 14,
//     fontFamily: "Raleway_700Bold",
//     position: "absolute",
//     bottom: 0,
//   },

//   listAmount: {
//     fontFamily: "Raleway_400Regular",
//   },

//   imageArea: {
//     left: 15,
//     fontFamily: "Raleway_700Bold",
//   },

//   vehicleImage: {
//     objectFit: 20,
//     width: windowWidth * 0.45,
//     height: windowHeight * 0.12,
//     // width: 180,
//     //height: 120,
//   },

//   tittle: {
//     fontFamily: "Raleway_700Bold",
//     fontSize: 25,
//     fontWeight: "bold",
//     color: "#000000",
//     // textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     // textShadowOffset: { width: 1, height: 1 },
//     // textShadowRadius: 0.11,
//     paddingLeft: 28,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 10,
//   },
// });
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

      const currentDate = new Date(); // Fecha actual

      await Promise.all(rentalsSnapshot.docs.map(async doc => {
        const rental = doc.data();
        const carId = rental.id_auto;

        // Obtener información del auto usando id_auto
        const carDoc = await firebase.firestore().collection("auto").doc(carId).get();
        const carData = carDoc.exists ? carDoc.data() : {};
        console.log('Car data:', carData);

        // Convertir el objeto Timestamp a una fecha legible
        const fechaInicio = rental.fecha_inicio.toDate();
        const fechaFin = rental.fecha_fin.toDate();

        // Verificar si la reserva aún está vigente
        if (fechaFin >= currentDate) {
          rentalsData.push({
            key: doc.id,
            ...rental,
            fecha_inicio: fechaInicio.toLocaleDateString(),
            fecha_fin: fechaFin.toLocaleDateString(),
            ...carData, // Combinar datos del auto
          });
        }
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

  // const fetchRentals = async () => {
  //   try {
  //     console.log('useeer', user);
  //     const rentalsSnapshot = await firebase.firestore().collection("reserva")
  //       .where("id_usuario_queAlquila", "==", user.uid)
  //       .get();
      
  //     const rentalsData = [];

  //     await Promise.all(rentalsSnapshot.docs.map(async doc => {
  //       const rental = doc.data();
  //       const carId = rental.id_auto;

  //       // Obtener información del auto usando id_auto
  //       const carDoc = await firebase.firestore().collection("auto").doc(carId).get();
  //       const carData = carDoc.exists ? carDoc.data() : {};
  //       console.log('Car data:', carData);

  //       // Convertir el objeto Timestamp a una fecha legible
  //       const fechaInicio = rental.fecha_inicio.toDate().toLocaleDateString();
  //       const fechaFin = rental.fecha_fin.toDate().toLocaleDateString();

  //       rentalsData.push({
  //         key: doc.id,
  //         ...rental,
  //         fecha_inicio: fechaInicio,
  //         fecha_fin: fechaFin,
  //         ...carData, // Combinar datos del auto
  //       });
  //     }));

  //     setRentals(rentalsData);
  //   } catch (error) {
  //     console.error("Error fetching rentals:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchRentals();
  // }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchRentals();
  //     return () => {
  //       // Función que se ejecuta cuando la pantalla pierde el foco
  //     };
  //   }, [user])
  // );

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
              {item?.imagenURL?.[0] && (
  <Image 
    source={{ uri: item.imagenURL[0] }} 
    resizeMode='fill' 
    style={styles.vehicleImage} 
  />
)}
                
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
    // height: windowHeight * 0.90,
    paddingBottom: 90,
    // flexGrow: 1,
    
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

  },
  elementPallet: {
  
    fontFamily: "Raleway_400Regular",
    flexDirection: "column",
    flexGrow: 1,
    paddingBottom: 30,
  },
  
  
});


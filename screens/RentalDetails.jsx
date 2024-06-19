import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLC-pS5Vo8WDeWHnJXnrIe4608MrVyak4",
  authDomain: "rentgo-c7fab.firebaseapp.com",
  projectId: "rentgo-c7fab",
  storageBucket: "rentgo-c7fab.appspot.com",
  messagingSenderId: "625456398357",
  appId: "1:625456398357:web:10302507e32033badcce1c",
  measurementId: "G-ML4RSSK39M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const back = require("../assets/Img/arrow.png");

export default function RentalDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { rentalId } = route.params; // Obtener el ID de la reserva desde las params

  const [loading, setLoading] = useState(true);
  const [rentalData, setRentalData] = useState(null);

//   useEffect(() => {
//     const fetchRentalData = async () => {
//       try {
//         const rentalDoc = await getDoc(doc(db, "reserva", rentalId));
//         if (rentalDoc.exists()) {
//           setRentalData(rentalDoc.data());
//         } else {
//           Alert.alert("Error", "No se encontró la reserva");
//         }
//       } catch (error) {
//         Alert.alert("Error", "Hubo un problema al cargar los datos de la reserva");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRentalData();
//   }, [rentalId]);

useEffect(() => {
    const fetchRentalData = async () => {
      try {
        const rentalDoc = await getDoc(doc(db, "reserva", rentalId));
        if (rentalDoc.exists()) {
          const rentalData = rentalDoc.data();
          const carId = rentalData.id_auto; // Obtener el ID del auto desde la reserva
  
          // Obtener información del auto usando carId
          const carDoc = await getDoc(doc(db, "auto", carId));
          if (carDoc.exists()) {
            const carData = carDoc.data();
            setRentalData({
              ...rentalData,
              cedula: carData.cedula,
              carnet: carData.carnet,
              // Agrega otros campos del auto que necesites mostrar en RentalDetail
            });
          } else {
            Alert.alert("Error", "No se encontraron los datos del auto");
          }
        } else {
          Alert.alert("Error", "No se encontró la reserva");
        }
      } catch (error) {
        Alert.alert("Error", "Hubo un problema al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRentalData();
  }, [rentalId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EBAD36" />
      </View>
    );
  }

  if (!rentalData) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron datos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
                <Image source={back} resizeMode="contain" style={styles.arrow} />
              </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>Documentos del Carro</Text>
        <Text style={styles.subtitle}>Cédula</Text>
        <Image source={{ uri: rentalData.cedula }} style={styles.idPhoto} />
        
        <Text style={styles.subtitle}>Certificado de Circulación</Text>
        <Image source={{ uri: rentalData.carnet}} style={styles.idPhoto} />
        <View style={styles.detailContainer}>
            
          {/* <Text style={styles.detailText}><Text style={styles.detailLabel}>Nombre:</Text> {rentalData.nombre}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Apellido:</Text> {rentalData.apellido}</Text> */}
          <Text style={styles.title}>Información</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Teléfono: </Text> {rentalData.numero_contacto}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Auto:</Text> {rentalData.nombre_auto}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Precio Total:</Text> {rentalData.precio_total} $</Text>
        </View>
      </View>
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#F5F5F5" ,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Raleway_700Bold",
    
  },
  idPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailContainer: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Raleway_400Regular",
  },
  detailLabel: {
    fontWeight: "bold",
    fontFamily: "Raleway_700Bold",
  },
  arrow: {

    right: 160, 
    marginBottom: 20, 
    
  },

  subtitle:{
    fontSize: 15,
    fontWeight: "bold",
    textAlign: 'left',
    marginBottom: 20,
    fontFamily: "Raleway_400Regular",
    

  },
});
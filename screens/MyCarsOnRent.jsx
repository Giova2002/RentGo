import { View, Text ,  StyleSheet,Image,
  ScrollView,
  TouchableOpacity,
  Dimensions, } from 'react-native'
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import React from 'react'
import Header from '../header/Header'
import Profile from '../header/Profile'
import { firebase } from "../firebase/firebaseConfig";
import { FlatList } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import img from "../assets/Img/carro1.png";


export default function MyCarsOnRent() {
  return (

    <GestureHandlerRootView>
      <Header />
      <Text style={styles.tittle}>Mis Carros en Alquiler</Text>
     

    </GestureHandlerRootView>
    
      
  )
};

const styles = StyleSheet.create({
  textall: {
    flex: 1,
    position: "absolute",
    left: 17,
    // right: 60,
    top: 110,
    bottom: 0,
    fontSize: 25,
    fontFamily: "SF",
    fontWeight: "bold",
    color: "#000000",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  listSeccion: {
    flexDirection: "column",
    // justifyContent: 'center',
    // position: 'absolute',
    // marginTop: 10,
    alignItems: "center",
    // flexGrow: 1,
    height: windowHeight * 0.57, // cambio el largo de toda la seccion
  },
  headText: {
    // position: 'absolute',
    fontFamily: "Raleway_700Bold",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    padding: 10,
    right: 100,
    fontWeight: "bold",
    color: "#000000",
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 0.5,
  },

  elementPallet: {
    // position: 'center',
    // justifyContent: 'center',
    // top: 4,
    // letf: 400,
    fontFamily: "Raleway_400Regular",
    // width: 340,
    width: windowWidth * 0.85,
    // height: 2000,
    flexDirection: "column",
    flexGrow: 1,
    // alignItems: 'center',
    // paddingTop: 30, // Ajusta el espaciado superior si es necesario
    // paddingBottom: 30,
    paddingBottom: 40,
  },

  element: {
    // height: 120,
    height: windowHeight * 0.14,
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#1C252E",
    flexDirection: "row",
    marginTop: 30,
  },
  infoArea: {
    fontFamily: "SF",
    flexDirection: "column",
    flex: 1,
  },

  infoTittle: {
    top: 10,
    color: "#FDFDFD",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Raleway_400Regular",
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
    fontFamily: "Raleway_700Bold",
  },

  vehicleImage: {
    objectFit: 20,
    width: windowWidth * 0.45,
    height: windowHeight * 0.12,
    // width: 180,
    //height: 120,
  },

  tittle: {
    fontFamily: "Raleway_700Bold",
    fontSize: 25,
    fontWeight: "bold",
    color: "#000000",
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 0.11,
    paddingLeft: 28,
  },
});
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { useEffect, useState, useCallback } from "react";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { firebase } from "../firebase/firebaseConfig";
import { FlatList } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import img from "../assets/Img/carro1.png";
import Header from "../header/Header";
import React from "react";
import img1 from "../assets/Img/carro2.png"; //https://i.pinimg.com/originals/45/68/7a/45687a213158cccef7ecdc75005cfdd6.png //'../assets/Img/carro2.png'
import img2 from "../assets/Img/carro3.png";
import img3 from "../assets/Img/hyundai-santa-fe.png";
import SearchBar from "../search/SearchBar.jsx";
import info from "../screens/InfoScreen.jsx";
import Card from "../components/Card.jsx";
import { useCarFiltersContext } from '../context/CarFiltersContext';

const img4 =
  "https://i.pinimg.com/originals/45/68/7a/45687a213158cccef7ecdc75005cfdd6.png ";
// import navegation from '../screens/InfoScreen.jsx';

import Cards from "../components/Card.jsx";

export default function Cars({ }) {
  const {data,setData}=useCarFiltersContext()
  const route = useRoute();

  const navigation = useNavigation()
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [auto, setAuto] = useState([]); // Initial empty array of users
  const autoRef = firebase.firestore().collection("auto");

  useFocusEffect(
   useCallback(() => {
      // Do something when the screen is focused

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setData({seatCount: 2,priceRange:[10, 500],automaticSelected:false, manualSelected:false, selectedBrands:[],selectedLocations:[], search:data.search,filter:false,filterByBrand:false})
   
      };
    }, [])
  );




  useEffect(() => {
    autoRef.onSnapshot((querySnapshot) => {
      const auto = [];

      querySnapshot.forEach((documentSnapshot) => {
        auto.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setAuto(auto);
    });
  }, []);




  useEffect(() => {
    console.log(data)
    if (
      data?.seatCount &&
      data?.priceRange &&
      data?.automaticSelected != null &&
      data?.manualSelected !=null &&
      data?.selectedBrands &&
      data?.selectedLocations
    ) {
filter()
    }
  }, [data]);

  const filter = async () => {
    console.log('FILTRARRR')
    if (
      data?.seatCount &&
      data?.priceRange &&
      data?.automaticSelected != null &&
      data?.manualSelected !=null &&
      data?.selectedBrands &&
      data?.selectedLocations
    ) {
      let price=data.priceRange[1] == 500 ? [data.priceRange[0],100000000000000] : data.priceRange
      console.log('Location',data.selectedLocations,data.selectedBrands)

      autoRef.get().then((querySnapshot) => {
        let auto = [];
        querySnapshot.forEach((documentSnapshot) => {
          auto.push({
            key: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        if(data.filter){
      
        auto=auto.filter((element)=> {return element.cant_asientos==data.seatCount && element.precio >=price[0] && element.precio<=price[1]})
        if(data.selectedBrands.length>0){
          auto=auto.filter((element)=> {return data.selectedBrands.includes(element.marca) })
        }
        if(data.selectedLocations.length>0){
          auto=auto.filter((element)=> {return data.selectedLocations.includes(element.ubicacion) })
        }
        if(data.automaticSelected && data.manualSelected ){

        }else if(data.automaticSelected && !data.manualSelected){
          auto=auto.filter((element)=> {return element.tipo=="Automático" })
        }else if(!data.automaticSelected && data.manualSelected){
          auto=auto.filter((element)=> {return element.tipo=="Sincrónico" })
        }

      }

      if(data.selectedBrands.length>0 && data.filterByBrand){
        auto=auto.filter((element)=> {return data.selectedBrands.includes(element.marca) })
      }

        if(data.search.trim != ""){
          auto=auto.filter((element)=> {return element.modelo.toLowerCase().includes(data.search.toLowerCase()) || element.marca.toLowerCase().includes(data.search.toLowerCase()) })
        }
        setAuto(auto)
        
      });
    }
  };


  return (
    <GestureHandlerRootView>
      <Header />
      <Text style={styles.tittle}>Renta Un Carro</Text>

      <SearchBar />

      <View style={styles.listSeccion}>
        <Text style={styles.headText}> Todos los Carros</Text>

        <ScrollView
          contentContainerStyle={styles.elementPallet}
          showsVerticalScrollIndicator={false}
        >
          {/* <Card/> */}

          <FlatList
            data={auto}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.element}
                onPress={() => navigation.navigate("Info", { carId: item.key })}
              >
                <View style={styles.infoArea}>
                  <Text style={styles.infoTittle}>{item.modelo}</Text>
                  <Text style={styles.infoSub}>{item.tipo}</Text>
                  <Text style={styles.infoSub}>{item.cant_asientos}</Text>
                  <Text style={styles.infoPrice}>
                    <Text style={styles.listAmount}>{item.precio}$/dia</Text>
                  </Text>
                </View>
                <View style={styles.imageArea}>
                  <Image
                    source={{ uri: item.imagenURL }}
                    resizeMode="fill"
                    style={styles.vehicleImage}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

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

// import { View, Text, SafeAreaView , StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions} from 'react-native'
// // import { useNavigation } from '@react-navigation/native';
// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;
// import img from '../assets/Img/carro1.png'
// import Header from '../header/Header'
// import React from 'react'
// import img1 from '../assets/Img/carro2.png'
// import img2 from '../assets/Img/carro3.png'
// import img3 from '../assets/Img/hyundai-santa-fe.png'
// import SearchBar from '../search/SearchBar.jsx'

// export default function Cars() {

//   return (

// // style={{flex: 1, alignItems: "center", justifyContent: "center"}}
//     <View>

//         <Header/>
//         <Text style={styles.tittle} >Renta Un Carro</Text>
//         <SearchBar/>

//         <View style={styles.listSeccion}>
//           <Text style={styles.headText}> Todos los Carros</Text>

//           <ScrollView contentContainerStyle={styles.elementPallet}>
//           <TouchableOpacity
//           View style={styles.element}
//           activeOpacity={0.8}>
//             onPress={() => navigation.navigate('InfoScreen')}
//           {/* colocar una funcion que agarre el ID de los carros para que los muestre */}
//               {/* <View style={styles.element}> */}
//                 {/* onPress={() => navigation.navigate('Info', { id: vehicle.id }) } */}
//                     <View style={styles.infoArea}>
//                       <Text style={styles.infoTittle}>Toyota Corolla 2006</Text>
//                       <Text style={styles.infoSub}>Carro Automático</Text>
//                       <Text style={styles.infoPrice}>
//                         <Text style={styles.listAmount}>50$/day</Text>
//                       </Text>

//                     </View>
//                     <View style={styles.imageArea}>
//                       <Image source={img} resizeMode='fill' style={styles.vehicleImage}/>
//                     </View>

//               {/* </View> */}
//             </TouchableOpacity>
//             <View style={styles.element}>
//                 <View style={styles.infoArea}>
//                   <Text style={styles.infoTittle}>Mitsubishi Lancer 2006</Text>
//                   <Text style={styles.infoSub}>Carro Sincrónico</Text>
//                   <Text style={styles.infoPrice}>
//                     <Text style={styles.listAmount}>30$/day</Text>
//                   </Text>

//                 </View>
//                 <View style={styles.imageArea}>
//                   <Image source={img1} resizeMode='fill' style={styles.vehicleImage}/>
//                 </View>
//             </View>
//             <View style={styles.element}>
//                 <View style={styles.infoArea}>
//                   <Text style={styles.infoTittle}>Toyota Fortuner 2008</Text>
//                   <Text style={styles.infoSub}>Carro Sincrónico</Text>
//                   <Text style={styles.infoPrice}>
//                     <Text style={styles.listAmount}>70$/day</Text>
//                   </Text>

//                 </View>
//                 <View style={styles.imageArea}>
//                   <Image source={img2} resizeMode='fill' style={styles.vehicleImage}/>
//                 </View>
//             </View>
//             <View style={styles.element}>
//                 <View style={styles.infoArea}>
//                   <Text style={styles.infoTittle}>Hyndai 2006</Text>
//                   <Text style={styles.infoSub}>Carro Automático</Text>
//                   <Text style={styles.infoPrice}>
//                     <Text style={styles.listAmount}>60$/day</Text>
//                   </Text>

//                 </View>
//                 <View style={styles.imageArea}>
//                   <Image source={img3} resizeMode='fill' style={styles.vehicleImage}/>
//                 </View>
//             </View>
//             <View style={styles.element}>
//                 <View style={styles.infoArea}>
//                   <Text style={styles.infoTittle}>Hyndai 2006</Text>
//                   <Text style={styles.infoSub}>Carro Automático</Text>
//                   <Text style={styles.infoPrice}>
//                     <Text style={styles.listAmount}>60$/day</Text>
//                   </Text>

//                 </View>
//                 <View style={styles.imageArea}>
//                   <Image source={img3} resizeMode='fill' style={styles.vehicleImage}/>
//                 </View>
//             </View>

//           </ScrollView>
//         </View>
//     </View>

//   )
// }

// const styles = StyleSheet.create({
//   // container: {
//   //   flex: 1,
//   //   backgroundColor: 'pink',
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   // },
//   textall:{
//     flex:1,
//     position: 'absolute',
//     left: 17,
//     // right: 60,
//     top: 110,
//     bottom: 0,
//     fontSize: 25,
//     fontFamily:"SF",
//     fontWeight: "bold",
//     color: '#000000',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },
//   listSeccion:{
//     flexDirection: 'column',
//     // justifyContent: 'center',
//     // position: 'absolute',
//     // marginTop: 10,
//     alignItems: 'center',
//     // flexGrow: 1,
//     height: windowHeight * 0.53, // cambio el largo de toda la seccion

//   },
//   headText:{
//     // position: 'absolute',
//     fontFamily:"SF",
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 10,
//     padding:10,
//     right: 100,
//     fontWeight: "bold",
//     color: '#000000',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 0.5,
//   },

//   elementPallet:{
//     // position: 'center',
//     // justifyContent: 'center',
//     // top: 4,
//     // letf: 400,
//     fontFamily:"SF",
//     // width: 340,
//     width: windowWidth * 0.85,
//     // height: 2000,
//     flexDirection: 'column',
//     flexGrow: 1,
//     // alignItems: 'center',
//     // paddingTop: 30, // Ajusta el espaciado superior si es necesario
//     // paddingBottom: 30,

//   },

//   element:{
//     // height: 120,
//     height: windowHeight * 0.14,
//     padding:13,
//     borderRadius:10,
//     backgroundColor: '#1C252E',
//     flexDirection: 'row',
//     marginTop: 30,
//   },
//   infoArea:{

//     fontFamily:"SF",
//     flexDirection: 'column',
//     flex: 1,
//   },

//   infoTittle:{
//     top: 10,
//     color: '#FDFDFD',
//     fontSize: 14,
//     fontWeight: 'bold',
//     fontFamily:"SF",
//     numberOfLines: 1,
//     // width: 150, // Ajusta el width según lo que necesites
//     width: windowWidth * 0.85,
//     overflow: 'hidden', // Esto evitará que el texto se desborde
//     whiteSpace: 'nowrap', // Esto evitará que el texto se divida en varias líneas
//     textOverflow: 'ellipsis', // Esto mostrará puntos suspensivos (...) si el texto se recorta

//   },

//   infoSub:{
//     top: 14,
//     color: '#77828B',
//     fontSize: 9,
//     fontFamily:"SF",
//     fontWeight: 'bold',
//   },

//   infoPrice:{
//     flex: 1,
//     color: '#EBAD36',
//     fontSize: 14,
//     fontFamily:"SF",
//     fontWeight: 'bold',
//     position: "absolute",
//     bottom: 0,

//   },

//   listAmount:{
//     fontFamily:"SF",
//   },

//   imageArea:{
//     left:15,
//     fontFamily:"SF",
//   },

//   vehicleImage:{
//     objectFit:20,
//     width: windowWidth * 0.45,
//     height: windowHeight * 0.12,
//     // width: 180,
//     //height: 120,
//   },

//   tittle:{
//     fontFamily:"SF",
//     fontSize: 25,
//     fontWeight: 'bold',
//     color: '#000000',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 0.11,
//     paddingLeft: 28,

//   }

// })

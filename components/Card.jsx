// import { View, Text, SafeAreaView , StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions} from 'react-native'
// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

import { View, Text, SafeAreaView , StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions} from 'react-native'
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import {useEffect, useState } from 'react'
import { firebase } from "../firebase/firebaseConfig"
import { FlatList } from 'react-native-gesture-handler';
import img from '../assets/Img/carro1.png'
import React from 'react'

export default Card = ({ navigation, image, title, price, infoSub }) => {

    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [auto, setAuto] = useState([]); // Initial empty array of users
    const autoRef = firebase.firestore().collection('auto')

  useEffect( () => {

    autoRef
    .onSnapshot(querySnapshot => {
    const auto = [];
    
    querySnapshot.forEach((documentSnapshot) => {
    auto.push({
    ...documentSnapshot.data(),
    key: documentSnapshot.id
    

    });
  });
  
    setAuto(auto);

  });

  }, []);
    
    // const data = {
    //     image: image,
    //     title: title,
    //     price: price,
    //     infoSub: infoSub,
    // }

    // console.log(image)

    return(

        <FlatList 
         data={auto}
         renderItem={({ item }) => (

          <TouchableOpacity 
          style={styles.element}
          onPress={() => navigation.navigate('Info', {carId: item.key} ) }>
                    <View style={styles.infoArea}>
                      <Text style={styles.infoTittle}>{item.modelo}</Text>
                      <Text style={styles.infoSub}>{item.tipo}</Text>
                      <Text style={styles.infoPrice}>
                        <Text style={styles.listAmount}>{item.precio}$/dia</Text>
                      </Text>
                      
                    </View>
                    <View style={styles.imageArea}>
                      <Image source={img} resizeMode='fill' style={styles.vehicleImage}/>
                    </View>
            </TouchableOpacity>
         )}/>
        
        // <TouchableOpacity style={styles.element} onPress={() => navigation.navigate('Info', { image })}>
        //   {/* colocar una funcion que agarre el ID de los carros para que los muestre */}
        //       {/* <View style={styles.element}> */}
        //         {/* onPress={() => navigation.navigate('Info', { id: vehicle.id }) } */}

        //     <View style={styles.infoArea}>
        //         <Text style={styles.infoTittle}>{title}</Text>
        //         <Text style={styles.infoSub}>{infoSub}</Text>
        //         <Text style={styles.infoPrice}>
        //             <Text style={styles.listAmount}>{price}</Text>
        //         </Text>                
        //     </View>

        //     <View style={styles.imageArea}>
        //         <Image source={image} resizeMode='fill' style={styles.vehicleImage}/>
        //     </View>
                                
        // </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    element:{
        // height: 120,
        height: windowHeight * 0.14,
        padding:13,
        borderRadius:10,
        backgroundColor: '#1C252E',
        flexDirection: 'row',
        marginTop: 30,
    },
    infoArea:{    
        fontFamily:"SF",
        flexDirection: 'column',
        flex: 1,
    },    
      infoTittle:{
        top: 10,
        color: '#FDFDFD',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily:"SF",
        numberOfLines: 1,
        // width: 150, // Ajusta el width según lo que necesites
        width: windowWidth * 0.85,
        overflow: 'hidden', // Esto evitará que el texto se desborde
        whiteSpace: 'nowrap', // Esto evitará que el texto se divida en varias líneas
        textOverflow: 'ellipsis', // Esto mostrará puntos suspensivos (...) si el texto se recorta            
    },      
      infoSub:{
        top: 14,
        color: '#77828B',
        fontSize: 9,
        fontFamily:"SF",
        fontWeight: 'bold',
    },    
      infoPrice:{
        flex: 1,
        color: '#EBAD36',
        fontSize: 14,
        fontFamily:"SF",
        fontWeight: 'bold',
        position: "absolute",
        bottom: 0,        
    },
    listAmount:{
        fontFamily:"SF",
    },
    imageArea:{
        left:15,
        fontFamily:"SF",
    },    
    vehicleImage:{
        objectFit:20,
        width: windowWidth * 0.45,
        height: windowHeight * 0.12,
        // width: 180,
        //height: 120,
    },
})
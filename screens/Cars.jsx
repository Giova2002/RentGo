import { View, Text, SafeAreaView , StyleSheet, Image, ScrollView} from 'react-native'
import img from '../assets/Img/carro1.png'
import React from 'react'
import img1 from '../assets/Img/carro2.png'
import img2 from '../assets/Img/carro3.png'
import img3 from '../assets/Img/hyundai-santa-fe.png'





export default function Cars() {
  return (
    <SafeAreaView style={{flex: 1, alignItems: "center", justifyContent: "center"}}>

        <View style={styles.textall}>
        <Text style={styles.textall}>All Cars</Text>
        </View>

        <View style={styles.listSeccion}>
          {/* <Text style={styles.headText}> Most Wanted</Text> */}
          <ScrollView style={styles.elementPallet}> 
          {/* colocar una funcion que agarre el ID de los carros para que los muestre */}
            <View style={styles.element}>
              {/* onPress={() => navigation.navigate('Info', { id: vehicle.id }) } */}
                <View style={styles.infoArea}>
                  <Text style={styles.infoTittle}>Toyota Corolla 2006</Text>
                  <Text style={styles.infoSub}>Carro Automático</Text>
                  <Text style={styles.infoPrice}>
                    <Text style={styles.listAmount}>50$/day</Text>
                  </Text>
                  
                </View>
                <View style={styles.imageArea}>
                  <Image source={img} resizeMode='fill' style={styles.vehicleImage}/>
                </View>
            </View>
            <View style={styles.element}>
                <View style={styles.infoArea}>
                  <Text style={styles.infoTittle}>Mitsubishi Lancer 2006</Text>
                  <Text style={styles.infoSub}>Carro Sincrónico</Text>
                  <Text style={styles.infoPrice}>
                    <Text style={styles.listAmount}>30$/day</Text>
                  </Text>
                  
                </View>
                <View style={styles.imageArea}>
                  <Image source={img1} resizeMode='fill' style={styles.vehicleImage}/>
                </View>
            </View>
            <View style={styles.element}>
                <View style={styles.infoArea}>
                  <Text style={styles.infoTittle}>Toyota Fortuner 2008</Text>
                  <Text style={styles.infoSub}>Carro Sincrónico</Text>
                  <Text style={styles.infoPrice}>
                    <Text style={styles.listAmount}>70$/day</Text>
                  </Text>
                  
                </View>
                <View style={styles.imageArea}>
                  <Image source={img2} resizeMode='fill' style={styles.vehicleImage}/>
                </View>
            </View>
            <View style={styles.element}>
                <View style={styles.infoArea}>
                  <Text style={styles.infoTittle}>Hyndai 2006</Text>
                  <Text style={styles.infoSub}>Carro Automático</Text>
                  <Text style={styles.infoPrice}>
                    <Text style={styles.listAmount}>60$/day</Text>
                  </Text>
                  
                </View>
                <View style={styles.imageArea}>
                  <Image source={img3} resizeMode='fill' style={styles.vehicleImage}/>
                </View>
            </View>
            <View style={styles.element}>
                <View style={styles.infoArea}>
                  <Text style={styles.infoTittle}>Hyndai 2006</Text>
                  <Text style={styles.infoSub}>Carro Automático</Text>
                  <Text style={styles.infoPrice}>
                    <Text style={styles.listAmount}>60$/day</Text>
                  </Text>
                  
                </View>
                <View style={styles.imageArea}>
                  <Image source={img3} resizeMode='fill' style={styles.vehicleImage}/>
                </View>
            </View>
          </ScrollView>
        </View>
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: 'pink',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  textall:{
    flex:1,
    position: 'absolute',
    left: 17,
    // right: 60,
    top: 110,
    bottom: 0,
    fontSize: 25,
    fontFamily:"SF",
    fontWeight: "bold",
    color: '#000000',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  listSeccion:{
    position: 'absolute',
    marginTop: 15,
  },
  headText:{
    position: 'absolute',
    fontFamily:"SF",
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },

  elementPallet:{
    position: 'center',
    top: 70,
    // letf: 400,
    fontFamily:"SF",
    width: 340,
    height: 500,
  },

  element:{
    height: 120,
    padding:13,
    borderRadius:10,
    backgroundColor: '#1C252E',
    flexDirection: 'row',
    marginTop: 30,
  },
  infoArea:{
  
    fontFamily:"SF",
    flex: 1,
  },

  infoTittle:{
    top: 10,
    color: '#FDFDFD',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily:"SF",
    numberOfLines: 1,
    width: 150, // Ajusta el width según lo que necesites
    overflow: 'hidden', // Esto evitará que el texto se desborde
    whiteSpace: 'nowrap', // Esto evitará que el texto se divida en varias líneas
    textOverflow: 'ellipsis', // Esto mostrará puntos suspensivos (...) si el texto se recorta
    
    
  },
  
  infoSub:{
    top: 12,
    color: '#77828B',
    fontSize: 9,
    fontFamily:"SF",
    fontWeight: 'bold',
  },

  infoPrice:{
    top: 45,
    color: '#EBAD36',
    fontSize: 14,
    fontFamily:"SF",
    fontWeight: 'bold',
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
  
    width: 180,
    height: 100,
  },

  
})
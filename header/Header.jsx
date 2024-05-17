import { View, Text, StyleSheet,Image } from 'react-native'
import React from 'react'


const Header = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Location</Text>
        <Text style={styles.location}>Caracas, Venezuela</Text>
        {/* tiene que cambiar a la ubicacion personal del usuario */}
        <Image style={styles.imageContainer}
        source={require('../assets/gps.png')} 
      />
         
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 40,
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
      
    },
    title: {
      color: '#000000',
      fontSize: 14,
      fontFamily:"SF",
      top: -370,
      left: 100,
      color:"#748289"
      
    },
    location: {
        color: '#748289',
        fontSize: 19,
        fontFamily:"SF",
        top: -365,
        left: 100,
        color:"#000000"
      },
  imageContainer: {
    width: 28,
    height: 29,
    position: 'absolute', 
    top: -370, 
    left: 30,
  },
      
    
  });
  
  export default Header;
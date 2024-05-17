import { View, Text, StyleSheet } from 'react-native'
import React from 'react'


const Header = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Location</Text>
        <Text style={styles.location}>Caracas, Venezuela</Text>
         {/* tiene que cambiar a la ubicacion personal del usuario */}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 20,
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
      
    },
    title: {
      color: '#000000',
      fontSize: 20,
      fontFamily:"SF"
      
    },
    location: {
        color: '#748289',
        fontSize: 20,
        fontFamily:"SF"
      }
      
    
  });
  
  export default Header;
import { View, Text, StyleSheet, Image} from 'react-native'
import React from 'react'
import Profile from './Profile'; //header/Profile.jsx


const Header = () => {
return (
<View style={styles.container}>
<View style={styles.locationContainer}>
<Image style={styles.imageContainer}
source={require('../assets/gps.png')} 
/>
<View style={styles.locationDetails}>
<Text style={styles.title}>Your Location</Text>
<Text style={styles.location}>Caracas, Venezuela</Text>
</View>
</View>
{/* tiene que cambiar a la ubicacion personal del usuario */}
<Profile/>
</View>
);
}
const styles = StyleSheet.create({
container: {
width: '100%',
height: 110,
flexDirection:"row",
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal:20,
marginTop:25,


},
locationContainer:{
flexDirection:"row",
alignItems:"center",


},
title: {
color: '#000000',
fontSize: 14,
color:"#748289",
fontFamily:"Raleway_700Bold"
},
location: {
color: '#748289',
fontSize: 19,
color:"#000000",
fontFamily:"Raleway_700Bold"
},
imageContainer: {
width: 28,
height: 29,
marginRight:30,


},

});
export default Header;

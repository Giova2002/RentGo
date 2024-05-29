import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
// import img1 from '../assets/Img/arrow.png'

const back = require("../assets/Img/arrow.png");


export default function InfoScreen({navigation}) {
return (
<SafeAreaView style={styles.safeArea}>
<View style={styles.container}>
<View style={styles.headerSection}>
    <View>
    <Text style={styles.HeaderText}>Detalles</Text>
    <TouchableOpacity
    onPress={() => navigation.goBack()}
    activeOpacity={0.9}>
    <Image  source={back} resizeMode="contain" style={styles.arrow} />
    </TouchableOpacity>
    
    
    </View>

</View>
<View style={styles.imageSection}>
<View style={{ width: 350, height: 200}}>
<Image
source={require('../assets/Img/carro1.png')}
style={styles.image}
/>
</View>
</View>
<View style={styles.headSection}>
<View style={styles.topTextArea}>
<Text style={styles.makemodelText}>
BMW X4 2024
</Text>
<Text style={styles.price}>
<Text style={styles.amount}>$150/día</Text>
</Text>
</View>
<Text style={styles.typetranText}>
SUV Automático
</Text>
</View>
<Text style={styles.descriptionText}>El BMW X4 es un SUV, del segmento C, fabricado por BMW desde 2014. El BMW X4 se caracteriza por ser un modelo que comparte plataforma, habitáculo, tecnología y motorizaciones con el BMW X3, pero que ofrece una visión más deportiva y dinámica. </Text>
<View style={styles.propertiesArea}>
<View style={styles.level}>
<Text style={styles.propertyText}>
Marca: BMW{'\n'}
Litros Gasolina: 40 litros{'\n'}
Nro. Asientos: 5 {'\n'}
Nro. Puertas: 4 {'\n'}
Bluetooth: Sí {'\n'}
Maleta: Sí {'\n'}
Ubicación: Caracas {'\n'}
Detalles: Ninguno

</Text>
</View>
</View>
<TouchableOpacity style={styles.rentButton} onPress={() => navigation.navigate('Reserva')}>
<Text style={styles.rentButtonText}>Reservar</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
)
}

const styles = StyleSheet.create({
safeArea: {
flex: 1,
backgroundColor: "white",
},
container: {
flex: 1,
paddingRight: 35,
paddingLeft: 35,
marginTop:-15,
},
headerSection: {
height: 70,
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
},
menuIconStyle: {
width: 25,
},
HeaderText: {
fontSize: 20,
marginLeft: 130,
top: 21,
// marginTop: 4,
fontWeight: "500",
},
faceIconStyle: {
width: 30,
},

imageSection: {
width: "100%",
height: 250,
justifyContent: "center",
alignItems: "center",
},
vehicleImage: {
width: 300,
height: 300,
},

headSection: {},
topTextArea: {
flexDirection: "row",
justifyContent: "space-between",
},
makemodelText: {
fontSize: 20,
fontWeight: "500",
},
price: {
fontWeight: "400",
},
amount: {
fontWeight: "bold",
color: "#EBAD36",
},
typetranText: {
marginTop: 1,
color: "#696969",
fontWeight: "600",
fontSize: 12,
},
descriptionText: {
marginTop: 30,
fontSize: 14,
letterSpacing: 0.1,
lineHeight: 18,
color: "#696969",
fontWeight: "500",
},
propertiesText: {
marginTop: 20,
fontSize: 19,
fontWeight: "500",
},
propertiesArea: {
marginTop: 20,
flexDirection: "row",
justifyContent: "flex-start",
},
level: {
marginRight: 30,
},
propertyText: {
fontSize: 12,
color: "#696969",
},
valueText: {
fontSize: 12,
color: "black",
},
rentButton: {
marginTop: 5,
height: 40,
// padding: 10,
alignSelf: "flex-end",
width: 150,
backgroundColor: "#EBAD36",
borderRadius: 8,
justifyContent: "center",
alignItems: "center",
},
rentButtonText: {
color: "black",
fontWeight: "500",
},
image: {
width: 300,
height: 150,
alignSelf: "center",
marginTop:15,
},

arrow:{

}
});


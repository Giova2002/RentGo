import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'

export default function Profile() {
return (
<View style={styles.container}>
<View style={styles.imageContainer}>
<Image source={require('../assets/profile.jpg')} style={styles.image} />
</View>
</View>
);
}
const styles = StyleSheet.create({
container: {
width: 60,
height: 60,
borderRadius: 30,
overflow: 'hidden',
backgroundColor: '#8D999E',
borderWidth: 2,
borderColor: '#8D999E',
elevation: 3,
},
imageContainer: {
width: '100%',
height: '100%',
borderRadius: 28,
overflow: 'hidden',
borderWidth: 2,
borderColor: '#FFFFFF',
},
image: {
width: '100%',
height: '100%',
resizeMode: 'cover',
},
});

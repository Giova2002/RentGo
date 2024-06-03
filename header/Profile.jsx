import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import ProfileScreen from '../screens/ProfileScreen';

export default function Profile() {
    const { user } = useContext(UserContext);
    const navigation=useNavigation()
    console.log(user)
return (
<View style={styles.container}>
    <TouchableOpacity onPress={()=>{navigation.navigate("Profile")}}>
<View style={styles.imageContainer}>
    {user?.img ?
<Image source={{uri:user.img}} style={styles.image} />:
<Image source={require('../assets/profile.jpg')} style={styles.image} />
}
</View>
</TouchableOpacity>
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

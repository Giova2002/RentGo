import React, { useState } from 'react';
import { View, TextInput, StyleSheet,Image,Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const SearchBar = ({ onSubmit }) => {
const [term, setTerm] = useState('');

const handleSubmit = () => {
if (term.trim() !== '') {
onSubmit(term);
}
};

return (
<View style={styles.container}>
<View style={styles.search}>
<Image source={require('../assets/search.png')} style={styles.image} />
<TextInput
style={styles.input}
placeholder="Busca Tu Carro"
value={term}
onChangeText={setTerm}
onSubmitEditing={handleSubmit}
/>
</View>
<View style={styles.filters}>
<Image source={require('../assets/filter.png')} style={styles.imageFilter} />
</View>
</View>
);
};

const styles = StyleSheet.create({
container:{
flexDirection:"row",
padding:20,
alignItems:"center",




},
search: {
flexDirection: 'row',
alignItems: 'center',
borderWidth: 1,
borderColor: '#000000',
borderRadius: 5,
paddingHorizontal: 10,
margin: 10,
width:windowWidth*0.68,
height:windowHeight*0.07,

},
input: {
flex: 1,
marginLeft: 10,
fontSize: 18,
},
image:{
width:windowWidth*0.068,
height:windowHeight*0.028,

},
filters:{
width:windowWidth*0.17,
height:windowHeight*0.07,
backgroundColor:"#EBAD36",
borderRadius:9,
alignItems:"center",
justifyContent:"center",


},
imageFilter:{
width:windowWidth*0.08,
height:windowHeight*0.04,
}

});

export default SearchBar;
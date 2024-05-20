import React, { useState } from 'react';
import { View, TextInput, StyleSheet,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

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
        alignItems:"center"

    },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    width:292,
    height:64
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  image:{
    width:26,
    height:26,

  },
  filters:{
    width:65,
    height:64,
    backgroundColor:"#EBAD36",
    borderRadius:9,
    alignItems:"center",
    justifyContent:"center"

  },
  imageFilter:{
    width:30,
    height:30,
  }

});

export default SearchBar;
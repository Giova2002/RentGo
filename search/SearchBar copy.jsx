import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Dimensions, TouchableOpacity, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SearchBar = ({ onSubmit }) => {
  const [term, setTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
      <TouchableOpacity style={styles.filters} onPress={() => setModalVisible(true)}>
        <Image source={require('../assets/filter.png')} style={styles.imageFilter} />
      </TouchableOpacity>
      <Modal
        
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Opciones de Filtro</Text>
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity onPress={() => console.log("Cantidad de asientos")} style={styles.option}>
                <Text>Cantidad de Asientos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Precio")} style={styles.option}>
                <Text>Precio</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Marca")} style={styles.option}>
                <Text>Marca</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Tipo")} style={styles.option}>
                <Text>Tipo</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    width: windowWidth * 0.68,
    height: windowHeight * 0.07,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  image: {
    width: windowWidth * 0.068,
    height: windowHeight * 0.028,
  },
  filters: {
    width: windowWidth * 0.17,
    height: windowHeight * 0.07,
    backgroundColor: "#EBAD36",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  imageFilter: {
    width: windowWidth * 0.08,
    height: windowHeight * 0.04,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: windowWidth * 0.8,
    backgroundColor: "#EBAD36"
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  closeButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default SearchBar;


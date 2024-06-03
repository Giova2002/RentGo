import { View, Text, StyleSheet, Image, TextInput, Alert, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState,useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ProfileScreen = () => {
  
  const initialUser = {
    id:"iUPxvupTSPDK4czA7dmQ"
  };

  const [user, setUser] = useState(null);


  const handleSave = async () => {
    try {
      await db.collection('usuarios').doc(user.correo).update({
        nombre: name
      });
      Alert.alert('Éxito', 'Su perfil se ha actualizado exitosamente');
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Hubo un problema al actualizar su perfil');
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setUser({ ...user, img: { uri: selectedImage } });
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.yellowContainer}>
        <Text style={styles.header}>Editar Perfil</Text>
        <View style={styles.profileImageContainer}>
          <Image source={user.img} style={styles.profileImage} />
        </View>
        <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
          <Text style={styles.editImageText}>Editar Imagen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={text => setName(text)}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={user.correo}
          editable={false}
        />
      </View>
      <View style={styles.botonContainer}>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  yellowContainer: {
    width: windowWidth,
    backgroundColor: "#EBAD36",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 30,
  },
  header: {
    fontSize: 22,
    fontFamily: "Raleway_700Bold",
    paddingBottom: windowHeight * 0.04,
    color: "#F5F5F5"
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  editImageText: {
    color: '#EBAD36',
    fontFamily: "Raleway_700Bold",
    fontSize: 14,
  },
  inputContainer: {
    width: windowWidth,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom:25

  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Raleway_700Bold",
  },
  input: {
    width: windowWidth*0.9,
    height:windowHeight*0.04,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    fontFamily: "Raleway_400Regular",
    
    
  },
  botonContainer:{
    
    justifyContent:'center',
    display:"flex",
    alignItems:"center"



  },
  saveButton: {
    backgroundColor: '#EBAD36',
   height:windowHeight*0.04,
    
    borderRadius: 5,
    alignItems: 'center',
    width:windowWidth*0.4,
    justifyContent:'center',
    
    
    
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
});

export default ProfileScreen;
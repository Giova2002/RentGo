import React, { useState, useEffect,useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../firebase/firebaseConfig';
import { UserContext } from '../context/UserContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { width } from '@fortawesome/free-brands-svg-icons/fa42Group';


const back = require("../assets/Img/arrow.png");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const storage = firebase.storage();

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const userId = "iUPxvupTSPDK4czA7dmQ";
  const { user,setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserById = async (userId) => {
      try {
        const doc = await firebase.firestore().collection('usuario').doc(user.id).get();
        if (doc.exists) {
          setUser({ id: doc.id, ...doc.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserById(userId);
  }, []);

  const uploadImage = async (uri) => {
    console.log('URI:', uri);
    console.log("stoooore",storage)
    try {
      const response = await fetch(uri);
      console.log('Response:', response);
      const blob = await response.blob();
      console.log('Blob:', blob);
      const ref = storage.ref().child(`images/${userId}/${Date.now()}`);
      console.log('Storage Ref:', ref);
      const snapshot = await ref.put(blob);
      console.log('Snapshot:', snapshot);
      const imageUrl = await snapshot.ref.getDownloadURL();
      console.log('Image URL:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la biblioteca de medios.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result)

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      console.log('Selected Image URI: ', selectedImage);
      if (!selectedImage) {
        console.error('Invalid image URI');
        return;
      }
      setLoading(true);
      try {
        const imageUrl = await uploadImage(selectedImage);
        console.log('Image URL: ', imageUrl);
        setUser(prevData => ({
          ...prevData,
          img: imageUrl
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        setLoading(false);
        Alert.alert('Error', 'Hubo un problema al subir la imagen. Por favor, inténtelo de nuevo.');
      }
    }
  };

  const handleSave = async () => {
    try {
      await firebase.firestore().collection('usuario').doc(userId).update(user);
      Alert.alert('Éxito', 'Su perfil se ha actualizado exitosamente');
      setTimeout(() => {
        navigation.goBack(); // Navegar de regreso a la pantalla anterior
      }, 1000);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Hubo un problema al actualizar su perfil');
    }
  };
  


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EBAD36" />
        <Text style={styles.cargando}>Cargando</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.yellowContainer}>
        <View style ={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9} style={styles.arrow}>
                <Image source={back} resizeMode="contain"  />
              </TouchableOpacity>
      
        <Text style={styles.header}>Editar Perfil</Text>
        
              </View>
        
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: user.img }} style={styles.profileImage} resizeMethod='cover' />
        </View>
        <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
          <Text style={styles.editImageText}>Editar Imagen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={user.nombre}
          onChangeText={text => setUser(prevData => ({
            ...prevData,
            nombre: text
          }))}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido:</Text>
        <TextInput
          style={styles.input}
          value={user.apellido}
          onChangeText={text => setUser(prevData => ({
            ...prevData,
            apellido: text
          }))}
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
};

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
    paddingBottom:5,


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
    marginTop:25
    
    
    
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center'},

    cargando:{
        alignSelf: "center",
        color: 'black',
        fontSize: 15,
        fontFamily: 'Raleway_700Bold'

    },
    arrow:{
      position:"absolute",
      top:0,
      left:15
      

      
      
    },
    headerContainer:{
      flexDirection:"row",
      justifyContent:"center",
      position:"relative",
      width:"100%",
   

    
    }
});

export default ProfileScreen;
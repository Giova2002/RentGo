import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../firebase';
import { UserContext } from '../context/UserContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { width } from '@fortawesome/free-brands-svg-icons/fa42Group';

const back = require("../assets/Img/arrow.png");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const storage = firebase.storage();
const auth = getAuth();

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const doc = await firebase.firestore().collection('usuario').doc(currentUser.uid).get();
          if (doc.exists) {
            setUser({ id: doc.id, ...doc.data() });
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = storage.ref().child(`images/${user.id}/${Date.now()}`);
      const snapshot = await ref.put(blob);
      const imageUrl = await snapshot.ref.getDownloadURL();
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

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      if (!selectedImage) {
        console.error('Invalid image URI');
        return;
      }
      setLoading(true);
      try {
        const imageUrl = await uploadImage(selectedImage);
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
      await firebase.firestore().collection('usuario').doc(user.id).update(user);
      Alert.alert('Éxito', 'Su perfil se ha actualizado exitosamente');
      setTimeout(() => {
        navigation.goBack(); // Navegar de regreso a la pantalla anterior
      }, 2000);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Hubo un problema al actualizar su perfil');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Navegar a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Hubo un problema al cerrar sesión. Por favor, inténtelo de nuevo.');
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
    // <View style={styles.container}>
    //   <View style={styles.yellowContainer}>
    //     <View style ={styles.headerContainer}>
    //     <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9} style={styles.arrow}>
    //             <Image source={back} resizeMode="contain"  />
    //           </TouchableOpacity>
      
    //     <Text style={styles.header}>Editar Perfil</Text>
        
    //           </View>
        
    //     <View style={styles.profileImageContainer}>
    //       <Image source={{ uri: user.img }} style={styles.profileImage} resizeMethod='cover' />
    //     </View>
    //     <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
    //       <Text style={styles.editImageText}>Editar Imagen</Text>
    //     </TouchableOpacity>
    //   </View>

    //   <View style={styles.inputContainer}>
    //     <Text style={styles.label}>Nombre:</Text>
    //     <TextInput
    //       style={styles.input}
    //       value={user.nombre}
    //       onChangeText={text => setUser(prevData => ({
    //         ...prevData,
    //         nombre: text
    //       }))}
    //     />
    //   </View>

    //   <View style={styles.inputContainer}>
    //     <Text style={styles.label}>Apellido:</Text>
    //     <TextInput
    //       style={styles.input}
    //       value={user.apellido}
    //       onChangeText={text => setUser(prevData => ({
    //         ...prevData,
    //         apellido: text
    //       }))}
    //     />
    //   </View>

    //   <View style={styles.inputContainer}>
    //     <Text style={styles.label}>Email:</Text>
    //     <TextInput
    //       style={styles.input}
    //       value={user.correo}
    //       editable={false}
    //     />
    //   </View>
    //   <View style={styles.botonContainer}>
    //     <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
    //       <Text style={styles.saveButtonText}>Guardar Cambios</Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>
    
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.yellowContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9} style={styles.arrow}>
              <Image source={back} resizeMode="contain" style={styles.arrowImage} />
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
        <View style={styles.formContainer}>
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
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
  },
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  arrow: {

    position: "absolute",
    top: 0,
    left: 15,
    zIndex:1,
  },
  arrowImage: {
    width: 24,
    height: 24,
  },
  header: {
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
    color: "#F5F5F5",
    textAlign: 'center',
    flex: 1,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  editImageButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  editImageText: {
    color: '#EBAD36',
    fontFamily: "Raleway_700Bold",
    fontSize: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: "Raleway_400Regular",
    backgroundColor: '#FFFFFF',
  },
  botonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#EBAD36',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
  },
  logoutButton: {
    backgroundColor: '#2F3942',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cargando: {
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
    color: "#EBAD36",
    marginTop: 10,
  },
});

export default ProfileScreen;

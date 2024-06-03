import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';

const firebaseConfig = {
  apiKey: "AIzaSyDLC-pS5Vo8WDeWHnJXnrIe4608MrVyak4",
  authDomain: "rentgo-c7fab.firebaseapp.com",
  projectId: "rentgo-c7fab",
  storageBucket: "rentgo-c7fab.appspot.com",
  messagingSenderId: "625456398357",
  appId: "1:625456398357:web:10302507e32033badcce1c",
  measurementId: "G-ML4RSSK39M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function SignIn() {
  const navigation = useNavigation();

  const [values, setValues] = useState({ name: "", email: "", pass: "", apellido: "", img: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleAuthProvider);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async () => {
    if (!values.name || !values.email || !values.pass || !values.apellido || !values.img) {
      setErrorMsg("Llene todos los campos");
      Alert.alert("Error", "Llene todos los campos");
      return;
    }
    if (values.pass.length < 8) {
      setErrorMsg("La contraseña debe tener al menos 8 caracteres");
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, values.email, values.pass);
      const user = res.user;

      await updateProfile(user, { displayName: values.name });

      const userRef = doc(collection(db, "usuario"), user.uid);
      await setDoc(userRef, {
        apellido: values.apellido,
        correo: values.email,
        id_arrendador: "",
        id_arrendatario: "",
        img: values.img,
        nombre: values.name,
        password: values.pass,
        uid: user.uid,
      });

      Alert.alert("Registro exitoso", "Usuario registrado correctamente");
      navigation.navigate("Login");
    } catch (err) {
      setSubmitButtonDisabled(false);
      setErrorMsg(err.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setValues({ ...values, img: result.assets[0].uri });
    }
  };

  useEffect(() => {
    const saveProfile = async (user) => {
      try {
        const userProfile = { displayName: values.name };
        await updateProfile(user, userProfile);
        Alert.alert("Creando usuario", "Accediendo");
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Coloque datos correctos");
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Login");
        saveProfile(user);
      }
    });
    return unsubscribe;
  }, [navigation, values.name]);

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={pickImage}>
          <Image source={values.img ? { uri: values.img } : require('../assets/profile1.png')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={values.name}
            onChangeText={(text) => setValues({ ...values, name: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Apellido"
            style={styles.input}
            value={values.apellido}
            onChangeText={(text) => setValues({ ...values, apellido: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={values.email}
            onChangeText={(text) => setValues({ ...values, email: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry={true}
            value={values.pass}
            onChangeText={(text) => setValues({ ...values, pass: text })}
          />
        </View>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={register} disabled={submitButtonDisabled}>
            <Text style={styles.buttonText}>Registrate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
            <Text style={styles.buttonText}>Regístrate con Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Si ya tienes una cuenta, inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#EBAD36',
    borderWidth: 2,
    marginBottom: 20,
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: "Raleway_400Regular",
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#EBAD36',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 10,
  },
  googleButton: {
    backgroundColor: '#2F3942',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: "Raleway_700Bold",
  },
  loginText: {
    color: '#EBAD36',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: "Raleway_700Bold",
  },
});


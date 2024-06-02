import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { googleProvider } from "../firebase";

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

export default function Signin() {
  const navigation = useNavigation();
  const [values, setValues] = useState({ name: "", email: "", pass: "", apellido: "", img: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });
    return unsubscribe;
  }, [navigation]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
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

      await addDoc(collection(db, "usuarios"), {
        apellido: values.apellido,
        correo: values.email,
        id_arrendador: "",
        id_arrendatario: "",
        img: values.img,
        nombre: values.name,
        password: values.pass,
      });

      navigation.navigate("Home");
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
      setValues({ ...values, img: result.uri });
    }
  };

  return (
    <View style={styles.padre}>
      <View>
        <TouchableOpacity onPress={pickImage}>
          <Image source={values.img ? { uri: values.img } : require('../assets/profile1.png')} style={styles.profile} />
        </TouchableOpacity>
      </View>
      <View style={styles.tarjeta}>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Nombre"
            style={{ paddingHorizontal: 15 }}
            value={values.name}
            onChangeText={(text) => setValues({ ...values, name: text })}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Apellido"
            style={{ paddingHorizontal: 15 }}
            value={values.apellido}
            onChangeText={(text) => setValues({ ...values, apellido: text })}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Correo electrónico"
            style={{ paddingHorizontal: 15 }}
            value={values.email}
            onChangeText={(text) => setValues({ ...values, email: text })}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Contraseña"
            style={{ paddingHorizontal: 15 }}
            secureTextEntry={true}
            value={values.pass}
            onChangeText={(text) => setValues({ ...values, pass: text })}
          />
        </View>
        <Text style={styles.error}>{errorMsg}</Text>
        <View style={styles.padreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={register} disabled={submitButtonDisabled}>
            <Text style={styles.textoBoton}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cajaBoton} onPress={signInWithGoogle}>
            <Text style={styles.textoBoton}>Regístrate con Google</Text>
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
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
  },
  tarjeta: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    paddingVertical: 20,
    backgroundColor: "#cccccc40",
    borderRadius: 30,
    marginVertical: 10,
  },
  padreBoton: {
    alignItems: "center",
  },
  cajaBoton: {
    backgroundColor: "orange",
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  loginText: {
    textAlign: "center",
    color: "orange",
    marginTop: 16,
  },
});

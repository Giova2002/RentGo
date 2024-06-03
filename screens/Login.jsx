// Login.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'; // Importa auth desde firebase.js

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Home'); // Redirigir a Home si ya está autenticado
      }
    });

    return unsubscribe;
  }, [navigation]);

  const logueo = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert(`Iniciando sesión`, `Accediendo`);
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      Alert.alert(`Error`, `El usuario o la contraseña son incorrectos`);
    }
  };

  return (
    <View style={styles.padre}>
      <View style={styles.tarjeta}>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Correo electrónico"
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Contraseña"
            style={{ paddingHorizontal: 15 }}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.padreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={logueo}>
            <Text style={styles.textoBoton}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Text style={styles.loginText}>Si no tienes una cuenta, regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tarjeta: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
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
  cajaTexto: {
    paddingVertical: 20,
    backgroundColor: '#cccccc40',
    borderRadius: 30,
    marginVertical: 10,
  },
  padreBoton: {
    alignItems: 'center',
  },
  cajaBoton: {
    backgroundColor: 'orange',
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
  },
  textoBoton: {
    textAlign: 'center',
    color: 'white',
  },
  loginText: {
    textAlign: "center",
    color: "orange",
    marginTop: 16,
  },
});

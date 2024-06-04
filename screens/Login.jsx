import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
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
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={logueo}>
            <Text style={styles.buttonText}>Iniciar sesion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Text style={styles.signupText}>Si no tienes una cuenta, regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 20,
    backgroundColor: '#FFFFFF',
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
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  signupText: {
    color: '#2F3942',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: "Raleway_700Bold",
  },
});


import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase"; 
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";

export default function Likes() {
  const navigation = useNavigation();
  const [values, setValues] = useState({ name: "", email: "", pass: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const register = () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Llene todos los campos");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        await updateProfile(user, { displayName: values.name });
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };
  useEffect(() => {
    const saveProfile = async (user) => {
      try {
        const userProfile = {
          displayName: values.name,
        };
        await updateProfile(user, userProfile);
      } catch (error) {
        console.log(error);
      }
    };
  }, [navigation, values.name]);

  return (
    <View style={styles.container}>
      <View style={styles.innerBox}>
        <Text style={styles.heading}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese un nombre"
          value={values.name}
          onChangeText={(text) => setValues({ ...values, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingrese un correo"
          value={values.email}
          onChangeText={(text) => setValues({ ...values, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingrese una contraseña"
          secureTextEntry
          value={values.pass}
          onChangeText={(text) => setValues({ ...values, pass: text })}
        />
        <Text style={styles.error}>{errorMsg}</Text>
        <Button title="Guardar" onPress={register} disabled={submitButtonDisabled} />
        <Button title="Regístrate con Google" onPress={signInWithGoogle} />
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text>Si ya tienes una cuenta, inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  innerBox: {
    width: "100%",
    maxWidth: 400,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
  },
  error: {
    color: "red",
    marginBottom: 16,
  },
});

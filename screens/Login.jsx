import { View, Text,Image,StyleSheet,TextInput,TouchableOpacity,Alert } from 'react-native'
import React,{useState} from 'react';
import appFirebase from '../firebase';
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth(appFirebase)

export default function Login() {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const logueo = async()=>{
    try{
      await signInWithEmailAndPassword(auth,email,password)
      Alert.alert(`iniciando sesion`,`Accediendo`)
    }catch(error){
      console.log(error);
      Alert.alert(`Error`,`El usuario o la contraseña son incorrectos`)
    }
  }
  return (
    <View style={styles.padre}>
       <View>
        <View>
            <Image source={require('../assets/profile1.png')} style={styles.profile}/>
        </View>
      </View>
      <View style={styles.tarjeta}>
      <View style={styles.cajaTexto}>
        <TextInput placeholder='correo electronico' style={{paddingHorizontal:15}}
        onChangeText={(text)=>setEmail(text)} 
        /> 
       </View>
        <View style={styles.cajaTexto}>
        <TextInput placeholder='contraseña' style={{paddingHorizontal:15}} secureTextEntry={true}
        onChangeText={(text)=>setPassword(text)}
        />
        </View>
        <View style={styles.padreBoton}>
            <TouchableOpacity style={styles.cajaBoton}onPress={logueo}>
                <Text style={styles.textoBoton}>Sign in</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  padre:{
    flex:1,
    justifyContent:`center`,
    alignItems:`center`,
    backgroundColor:`white`
  },
  profile:{
    width:100,
    height:100,
    borderRadius:50,
    bordercolor:`white`,
  },
  tarjeta:{
    margin:20,
    backgroundColor:`white`,
    borderRadius:20,
    width:`90%`,
    padding:20,
    shadowColor:`#000`,
    shadowOffset:{
      width:0,
      height:2,
    },
    shadowOpacity:0.25,
    shadowRadius:4,
    elevation:5,
  },
  cajaTexto:{
    paddingVertical:20,
    backgroundColor:`#cccccc40`,
    borderRadius:30,
    marginVertical:10,
  },
  padreBoton:{
    alignItems:`center`,
  },
  cajaBoton:{
    backgroundColor:`orange`,
    borderRadius:30,
    paddingVertical:20,
    width:150,
    marginTop:20,
  },
  textoBoton:{
    textAlign:`center`,
    color:`white`,
  },
});

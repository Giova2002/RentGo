import { View, Text, StyleSheet, Picker, TextInput, Toucha, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from "../firebase/firebaseConfig"
import Header from '../header/Header'
import Profile from '../header/Profile'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';
import { faMoneyBill, faMoneyBillTransfer, faPeopleArrows, faCamera, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import 'firebase/compat/storage'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import DropDownPicker from 'react-native-dropdown-picker';


import 'firebase/storage';


export default function AddCar() {

  const todoRef = firebase.firestore().collection("auto")
  const [ modelo, setModelo ] = useState('');
  const [ marca, setMarca ] = useState('');
  const [ ubicacion, setUbicacion ] = useState('');
  const [ precio, setPrecio ] = useState('');
  const [ tipo, setTipo ] = useState('');
  const [ descripcion, setDescripcion ] = useState('');
  const [ maleta, setMaleta ] = useState('');
  const [ addData, setAddData ] = useState('');
  const [ puertas, setPuertas ] = useState('');
  const [ detalles, setDetalles ] = useState('');
  const [ gasolina, setGasolina ] = useState('');
  const [ bluetooth, setBluetooth ] = useState('');
  const [ asientos, setAsientos ] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Toyota', value: 'Toyota' },
    { label: 'Kia', value: 'Kia' },
    { label: 'Ford', value: 'Ford' },
    { label: 'Chevrolet', value: 'Chevrolet' },
    { label: 'Hyundai', value: 'Hyundai' },
    { label: 'Mitsubishi', value: 'Mitsubishi' },
  ]);

  const [openC, setOpenC] = useState(false);
  const [ciudades, setCiudades] = useState([
    { label: 'Caracas', value: 'Caracas' },
    { label: 'Barquisimeto', value: 'Barquisimeto' },
    { label: 'Porlamar', value: 'Porlamar' },
    { label: 'Maracay', value: 'Maracay' },
    { label: 'Guarenas', value: 'Guarenas' },
   
  ]);

  const [openT, setOpenT] = useState(false);
  const [tipos, setTipos] = useState([
    { label: 'Automático', value: 'Automático' },
    { label: 'Sincrónico', value: 'Sincrónico' },

   
  ]);
  const handleImageUpload = async (imageUri) => {
    try {
      const snapshot = await todoRef.get();
      let maxId = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.id_auto && typeof data.id_auto === 'number' && data.id_auto > maxId) {
          maxId = data.id_auto;
        }
      });
      const newFieldId = maxId + 1;


      const response = await fetch(imageUri);
      const blob = await response.blob();
      const ref = firebase.storage().ref().child(`fotosCarros/car_id_${newFieldId}.jpg`);
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

   

    const addField = async (e) => {
      setLoading(true);
   

      const imageUrl = image ? await handleImageUpload(image) : null;
      

  try {

    
    const snapshot = await todoRef.get();
    let maxId = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.id_auto && typeof data.id_auto === 'number' && data.id_auto > maxId) {
        maxId = data.id_auto;
      }
    });
    const newFieldId = maxId + 1;

    await firebase.firestore().collection('auto').add({
    id_auto: newFieldId,
    marca: marca,
    modelo: modelo,
    ubicacion: ubicacion,
    precio: precio,
    tipo: tipo,
    descripcion: descripcion,
    maleta: maleta,
    nro_puertas: puertas,
    detalles: detalles,
    litros_gas: gasolina,
    bluetooth: bluetooth,
    cant_asientos: asientos,
    disponible: true,
    recomendado: false,
    imagenURL: imageUrl,
    
        });

       

        setMarca('');
        setModelo('');
        setUbicacion('');
        setPrecio('');
        setTipo('');
        setDescripcion('');
        setMaleta('');
        setPuertas('');
        setDetalles('');
        setGasolina('');
        setBluetooth('');
        setAsientos('');
        setImage('');

      
        alert("Su nuevo auto se ha agregado con éxito!");
    //navigation.navigate('Cars');
    // navigation.goBack();
  } catch (error) {
    console.error("Error al añadir el auto: ", error);
    alert("Error al añadir el auto");
  } finally {
    setLoading(false); // Set loading to false after the Firestore operation is complete
  }
};

 if (loading) {
      return (
        <View style={style.loaderContainer}>
          <ActivityIndicator size="large" color="#EBAD36" />
          <Text style={style.cargando}>Cargando</Text>
        </View>
      );
    }

const handleImagePicker = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
  });

  if (!result.canceled) {
    const image = result.assets[0].uri;
    return image;
  }
};

const handlePicker = async () => {
  let result = await handleImagePicker();
  setImage(result);
};


  return (
<SafeAreaView style={style.container}>

      
       <Header />
       <ScrollView >
       <Text style={style.HeaderText}>Agregar Auto</Text>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <View>
    <View style={{ marginRight: 20, marginLeft:20 , zIndex:999, }} >
    <DropDownPicker
        open={open}
        value={marca}
        items={items}
        setOpen={setOpen}
        setValue={setMarca}
        setItems={setItems}
        placeholder="Marca"
        style={style.picker}
        textStyle={[style.pickerText, marca && style.selectedPickerText]} // Apply different style for the selected option
        dropdownStyle={style.dropdownStyle}
        dropdownTextStyle={style.dropdownTextStyle}
      />

      
      </View>
      {/* <TextInput
       style={style.input}
      placeholder="Marca"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(marca) => setMarca(marca)}
      value={marca}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      /> */}
            <TextInput
        style={style.input}
      placeholder="Modelo"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(modelo) => setModelo(modelo)}
      value={modelo}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />

<View style={{ marginRight: 20, marginLeft:20 , zIndex:99, }} >
    <DropDownPicker
        open={openC}
        value={ubicacion}
        items={ciudades}
        setOpen={setOpenC}
        setValue={setUbicacion}
        setItems={setCiudades}
        placeholder="Ubicación"
        style={style.picker}
        textStyle={[style.pickerText, ubicacion && style.selectedPickerText]} // Apply different style for the selected option
        dropdownStyle={style.dropdownStyle}
        dropdownTextStyle={style.dropdownTextStyle}
        
      />
      </View>
    
            <TextInput
        style={style.input}
      placeholder="Precio (por día)"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(precio) => setPrecio(precio)}
      value={precio}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />
<View style={{ marginRight: 20, marginLeft:20 , zIndex:9, }} >
<DropDownPicker
        open={openT}
        value={tipo}
        items={tipos}
        setOpen={setOpenT}
        setValue={setTipo}
        setItems={setTipos}
        placeholder="Tipo de Carro"
        style={style.picker}
        textStyle={[style.pickerText, tipo && style.selectedPickerText]} // Apply different style for the selected option
        dropdownStyle={style.dropdownStyle}
        dropdownTextStyle={style.dropdownTextStyle}
        
      />
      </View>
            <TextInput
        style={style.input}
      placeholder="Descripción"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(descripcion) => setDescripcion(descripcion)}
      value={descripcion}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />
            <TextInput
       style={style.input}
      placeholder="Maleta (Sí/No)"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(maleta) => setMaleta(maleta)}
      value={maleta}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />
                 <TextInput
        style={style.input}
      placeholder="Número de Puertas"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(puertas) => setPuertas(puertas)}
      value={puertas}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />
                 <TextInput
       style={style.input}
      placeholder="Detalles"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(detalles) => setDetalles(detalles)}
      value={detalles}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />
                 <TextInput
        style={style.input}
      placeholder="Litros de Gasolina"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(gasolina) => setGasolina(gasolina)}
      value={gasolina}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />
                    <TextInput
       style={style.input}
      placeholder="Bluetooth (Sí/No)"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(bluetooth) => setBluetooth(bluetooth)}
      value={bluetooth}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />

<TextInput
      style={style.input}
      placeholder="Cantidad de Asientos"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(asientos) => setAsientos(asientos)}
      value={asientos}
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      

    
      />
     <View style={{borderWidth: 1, borderRadius: 10,    marginLeft:20, marginRight:20,}}>
        <View style={style.anexarCont}>
          <Text style={{  fontFamily: 'Raleway_700Bold',  fontSize: 15}}>Anexar Foto: </Text>
  
             {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 50 }} />}
               <TouchableOpacity onPress={handlePicker}>
                 <FontAwesomeIcon icon={faUpload} size={25} />
               </TouchableOpacity>

        </View>
    </View>
<View style={style.buttoncointainer}>
  
    <TouchableOpacity style={style.rentButton} onPress={addField}>
      <Text style={style.rentButtonText}>Agregar</Text>
    </TouchableOpacity>
    </View>
    </View>
    
    </GestureHandlerRootView>
    
    </ScrollView>
  </SafeAreaView>
 
  )
}

const style= StyleSheet.create({

  container: {
 
  
    flex: 1,
   marginTop: -40,
   
 

  },
  formContainer:{

    height:50,
    marginLeft:20,
    marginRight:20,
    marginTop:30,
 
  },
 
  

  rentButton: {
    marginTop: 30,
    height: 40,
    alignSelf: "center",
    width: 150,
    backgroundColor: "#EBAD36",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",

  },
  rentButtonText: {
    color: "black",
    fontWeight: "500",
    fontFamily: 'Raleway_700Bold'
  },

  HeaderText: {
    fontSize: 15,
    
   alignSelf: "center",
    top: 0,
    marginBottom:30,
    fontWeight: "500",
    fontFamily: 'Raleway_700Bold'
  },

  buttoncointainer:{
    paddingBottom: 120,
    
  },

  anexarCont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',  
    fontWeight: "500",
    fontFamily: 'Raleway_700Bold',
    height: 50,
    textAlignVertical:"center",
   
    
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center'},
    

    cargando:{
        alignSelf: "center",
        color: 'black',
        fontSize: '15',
        fontFamily: 'Raleway_700Bold'

    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
     
      borderRadius: 10,
      borderColor: '#000000',
     
      marginLeft:20,
      marginRight:20,
      fontFamily: 'Raleway_700Bold',
      zIndex: 0,
      fontSize:15,
      height:48,
    
    },
 
picker: {
 
    marginBottom: 10,

backgroundColor: "#F5F5F5",
    fontFamily: 'Raleway_700Bold',
  },

  pickerText: {
    fontSize:15,
    fontFamily: 'Raleway_700Bold',
    color: '#aaaaaa',
  
},
dropdownStyle: {
  
  zIndex: 9999, // Set the zIndex to a high value
  backgroundColor: "#F5F5F5",
},


selectedPickerText: {
  color: 'black', // Set the color for the selected option to black
},


})
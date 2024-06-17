import { View, Text, StyleSheet, Picker, TextInput, Toucha, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
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
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../context/UserContext';

import 'firebase/storage';


export default function AddCar() {

  const { user } = useContext(UserContext);

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
  const [carImages, setCarImages] = useState([]);
  const [cedula, setCedula] = useState('');
  const [carnet, setCarnet] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

 
const [images, setImages] = useState([]);
const [coverImage, setCoverImage] = useState(null);

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

  const [openM, setOpenM] = useState(false);
  const [maletas, setMaletas] = useState([
    { label: 'Si', value: 'Si' },
    { label: 'No', value: 'No' },

   
  ]);

  const [openB, setOpenB] = useState(false);
  const [bluetooths, setBluetooths] = useState([
    { label: 'Si', value: 'Si' },
    { label: 'No', value: 'No' },

   
  ]);
  const handleImageUpload = async (imageUris) => {
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

      const downloadUrls = await Promise.all(
        imageUris.map(async (imageUri) => {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const ref = firebase.storage().ref().child(`fotosCarros/car_id_${newFieldId}_${Date.now()}.jpg`);
          await ref.put(blob);
          return await ref.getDownloadURL();
        })
      );
      return downloadUrls;
    } catch (error) {
      console.error("Error uploading images: ", error);
      return [];
    }
  };

  const handleCedulaUpload = async (imageUri) => {
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
      const ref = firebase.storage().ref().child(`fotosCedulasPropietarios/Cedula_Arrendador_car_id_${newFieldId}.jpg`);
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

  const handleCarnetUpload = async (imageUri) => {
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
      const ref = firebase.storage().ref().child(`fotosCarnetsCirculacion/Carnet_Circulacion_car_id_${newFieldId}.jpg`);
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };
   

  const addField = async () => {
    setLoading(true);
  
    if (
      marca.trim() === '' ||
      modelo.trim() === '' ||
      ubicacion.trim() === '' ||
      precio.trim() === '' ||
      tipo.trim() === '' ||
      descripcion.trim() === '' ||
      maleta.trim() === '' ||
      puertas.trim() === '' ||
      detalles.trim() === '' ||
      gasolina.trim() === '' ||
      asientos.trim() === '' ||
      images.length === 0 ||
      cedula.trim() === '' ||
      carnet.trim() === '' ||
      phoneNumber.trim() === '' ||
      !/^\d+$/.test(phoneNumber) 

    ) {
      alert('Por favor rellenar todos los campos');
      setLoading(false);
      return;
    }
  
    const imageUrls = await handleImageUpload(images);
    const coverImageUrl = coverImage ? imageUrls[0] : null;
    const cedulaUrl = cedula ? await handleCedulaUpload(cedula) : null;
    const carnetUrl = carnet ? await handleCarnetUpload(carnet) : null;

   
  
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
  
      // const userRef = firebase.firestore().collection('usuario').doc(user.id);
      await todoRef.add({
        id_auto: newFieldId,
        marca: marca,
        modelo: modelo,
        ubicacion: ubicacion,
        precio: parseFloat(precio),
        tipo: tipo,
        descripcion: descripcion,
        maleta: maleta,
        nro_puertas: parseFloat(puertas),
        detalles: detalles,
        litros_gas: parseFloat(gasolina),
        bluetooth: bluetooth,
        cant_asientos: parseFloat(asientos),
        disponible: true,
        recomendado: false,
        imagenURL: [coverImageUrl, ...imageUrls.slice(1)],
        coverImageUrl: coverImageUrl,
        cedula: cedulaUrl,
        carnet: carnetUrl,
        // arrendatarioRef: userRef,
        phoneNumber: phoneNumber,
            
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
      setImages([]);
      setCoverImage(null);
      setCedula('');
      setCarnet('');
      setPhoneNumber('');
  
      alert("Su nuevo auto se ha agregado con éxito!");
    } catch (error) {
      console.error("Error al añadir el auto: ", error);
      alert("Error al añadir el auto");
    } finally {
      setLoading(false);
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
        allowsMultipleSelection: true,
        selectionLimit: 0, // Set to 0 to allow unlimited selection
      });
    
      if (!result.canceled) {
        return result.assets.map((asset) => asset.uri);
      }
      return [];
    };

    const handlePicker = async () => {
      let result = await handleImagePicker();
      setImages(result);
      setCoverImage(result.length > 0 ? result[0] : null);
    };

    const handleCedulaPicker = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
    
      if (!result.canceled) {
        const cedula = result.assets[0].uri;
        return cedula;
      }
    };
    
    const handlePickerCedula = async () => {
      let result = await handleCedulaPicker();
      setCedula(result);
    };

    const handleCarnetPicker = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
    
      if (!result.canceled) {
        const carnet = result.assets[0].uri;
        return carnet;
      }
    };
    
    const handlePickerCarnet = async () => {
      let result = await handleCarnetPicker();
      setCarnet(result);
    };

    const handlePhoneNumberChange = (text) => {
  
      if (text.startsWith('0')) {
          text = text.substring(1);
      }
      setPhoneNumber(text);
    };
    // const handlePicker = async (type) => {
    //   let result;
    //   if (type === 'cover') {
    //     result = await handleImagePicker();
    //     if (result.length > 0) {
    //       setCoverImage(result[0]);
    //     } else {
    //       setCoverImage(null);
    //     }
    //   } else {
    //     result = await handleImagePicker();
    //     setImages(result);
    //   }
    // };

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
      <TextInput
  style={style.input}
  placeholder="Modelo"
  placeholderTextColor="#aaaaaa"
  onChangeText={(modelo) => setModelo(modelo)}
  value={modelo}
  multiline={true}
  underlineColorAndroid="transparent"
  autocapitalize="none"
  onSubmitEditing={() => Keyboard.dismiss()}
  blurOnSubmit={false}
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
      keyboardType="numeric"
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      onSubmitEditing={() => {
        if (precio.trim() === '') {
          Alert.alert('Error', 'Please fill in the Cantidad de Asientos field.');
        } else {
          // Proceed with form submission or other actions
          console.log('Form submitted successfully.');
        }
      }}
      />

<TextInput
    style={style.input}
    placeholder="Número de Teléfono (+58)"
    placeholderTextColor="#aaaaaa"
    onChangeText={handlePhoneNumberChange}
    value={phoneNumber}
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
   
      <View style={{ marginRight: 20, marginLeft:20 , zIndex:8, }} >
<DropDownPicker
        open={openM}
        value={maleta}
        items={maletas}
        setOpen={setOpenM}
        setValue={setMaleta}
        setItems={setMaletas}
        placeholder="Maleta (Sí/No)"
        style={style.picker}
        textStyle={[style.pickerText, maleta && style.selectedPickerText]} // Apply different style for the selected option
        dropdownStyle={style.dropdownStyle}
        dropdownTextStyle={style.dropdownTextStyle}
        
      />
      </View>
      <TextInput
  style={style.input}
  placeholder="Número de Puertas"
  placeholderTextColor="#aaaaaa"
  onChangeText={(puertas) => setPuertas(puertas)}
  value={puertas}
  keyboardType="numeric"
  multiline={true}
  underlineColorAndroid="transparent"
  autocapitalize="none"
/>
                 <TextInput
       style={style.input}
      placeholder="Detalles del Auto (Ej.: Condición)"
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
      keyboardType="numeric"
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      />
  

<View style={{ marginRight: 20, marginLeft:20 , zIndex:8, }} >
<DropDownPicker
        open={openB}
        value={bluetooth}
        items={bluetooths}
        setOpen={setOpenB}
        setValue={setBluetooth}
        setItems={setBluetooths}
        placeholder="Bluetooth (Sí/No)"
        style={style.picker}
        textStyle={[style.pickerText, bluetooth && style.selectedPickerText]} // Apply different style for the selected option
        dropdownStyle={style.dropdownStyle}
        dropdownTextStyle={style.dropdownTextStyle}
        
      />
      </View>
<TextInput
      style={style.input}
      placeholder="Cantidad de Asientos"
      placeholderTextColor= "#aaaaaa"
      onChangeText={(asientos) => setAsientos(asientos)}
      value={asientos}
      keyboardType="numeric"
      multiline={true}
      underlineColorAndroid="transparent"
      autocapitalize="none"
      

    
      />
<View style={{ borderWidth: 1, borderRadius: 10, marginLeft: 20, marginRight: 20, height: 390 }}>
  <View style={[style.anexarCont]}>
    <Text style={{ fontFamily: 'Raleway_700Bold', fontSize: 15, top: 10, right:10, left: 10, color: '#aaaaaa'}}>Anexar Fotos del Vehículo: {'\n'}(en el orden que desee que aparezcan)</Text>
    <TouchableOpacity onPress={handlePicker}>
      <FontAwesomeIcon icon={faUpload} size={25} />
    </TouchableOpacity>
  </View>
  {images.length > 0 && (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((imageUri, index) => (
          <View key={index} style={{ marginRight: 10, marginLeft:10, position: 'relative' }}>
            <Image source={{ uri: imageUri }} style={{ width: 300, height: 280, top: 10 }} />
            {index === coverImage && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(0, 128, 0, 0.7)', // Slightly transparent green
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 12 }}>Cover Image</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => setCoverImage(index)}
              style={{ position: 'absolute', bottom: 0, right: 0 }}
            >
              <FontAwesomeIcon
                icon={faStar}
                size={20}
                color={index === coverImage ? 'gold' : 'gray'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  )}
</View>

<View style={{ borderWidth: 1, borderRadius: 10, marginLeft: 20, marginRight: 20, marginTop: 10, height: 390 }}>
  <View style={[style.anexarCont]}>
    <Text style={{ fontFamily: 'Raleway_700Bold', fontSize: 15, color: '#aaaaaa' }}>Anexar Cédula del Propietario:</Text>
    <TouchableOpacity onPress={handlePickerCedula}>
      <FontAwesomeIcon icon={faUpload} size={25} />
    </TouchableOpacity>
  </View>
  {cedula && (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <Image source={{ uri: cedula }} style={{ width: 300, height: 280 }} />
    </View>
  )}
</View>

<View style={{ borderWidth: 1, borderRadius: 10, marginLeft: 20, marginRight: 20, height: 390, marginTop: 10, }}>
  <View style={[style.anexarCont]}>
    <Text style={{ fontFamily: 'Raleway_700Bold', fontSize: 15, color: '#aaaaaa' }}>Anexar Carnet de Circulación:</Text>
    <TouchableOpacity onPress={handlePickerCarnet}>
      <FontAwesomeIcon icon={faUpload} size={25} />
    </TouchableOpacity>
  </View>
  {carnet && (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <Image source={{ uri: carnet }} style={{ width: 300, height: 280 }} />
    </View>
  )}
</View> 

{/* <View style={{ borderWidth: 1, borderRadius: 10, marginLeft: 20, marginRight: 20, height: 270, marginBottom:10, }}>
  <View style={[style.anexarCont]}>
    <Text style={{ fontFamily: 'Raleway_700Bold', fontSize: 16 }}>Anexar Portada:</Text>
    <TouchableOpacity onPress={() => handlePicker('cover')}>
      <FontAwesomeIcon icon={faUpload} size={25} />
    </TouchableOpacity>
  </View>
  {coverImage && (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <Image source={{ uri: coverImage }} style={{ width: 200, height: 150 }} />
    </View>
  )}
</View>

<View style={{ borderWidth: 1, borderRadius: 10, marginLeft: 20, marginRight: 20, height: 270 }}>
  <View style={[style.anexarCont]}>
    <Text style={{ fontFamily: 'Raleway_700Bold', fontSize: 16 }}>Anexar otras fotos:</Text>
    <TouchableOpacity onPress={() => handlePicker('additional')}>
      <FontAwesomeIcon icon={faUpload} size={25} />
    </TouchableOpacity>
  </View>
  {images.map((image, index) => (
    <View key={index} style={{ alignItems: 'center', marginTop: 10 }}>
      <Image source={{ uri: image }} style={{ width: 200, height: 150 }} />
    </View>
  ))}
</View> */}

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
fontSize: 18,
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
borderColor:"#748289",
marginLeft:20,
marginRight:20,
fontFamily: 'Raleway_700Bold',
zIndex: 0,
fontSize:15,
height:48,
},
picker: {
marginBottom: 10,
borderColor:"#748289",

backgroundColor: "#F5F5F5",
fontFamily: 'Raleway_700Bold',
},

pickerText: {
fontSize:15,
fontFamily: 'Raleway_700Bold',
color: '#aaaaaa',
},
dropdownStyle: {
zIndex: 9999,
backgroundColor: "#F5F5F5",
},


selectedPickerText: {
  color: 'black',
},


})

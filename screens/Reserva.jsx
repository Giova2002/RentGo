import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, Button, Pressable, TouchableOpacity, ActivityIndicator, Dimensions, Linking} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CalendarComponent from '../components/CalendarComponent';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMoneyBill, faMoneyBillTransfer, faPeopleArrows, faCamera, faUpload } from '@fortawesome/free-solid-svg-icons'
import { firebase } from "../firebase/firebaseConfig";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../context/UserContext';

import disableDates from '../components/CalendarComponent';
const back = require("../assets/Img/arrow.png");
const storage = firebase.storage();
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


export default Reserva = ({route, navigation}) => {


  const { user } = useContext(UserContext);
  const [IdImg, setIdImg] = useState(null);
  const [LicenseImg, setLicenseImg] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedRange, setSelectedRange] = useState({ startDate: '', endDate: '' });
  const [totalAmount, setTotalAmount] = useState(0);
  // const [isLoading, setIsLoading] = useState(true);

const [openC, setOpenC] = useState(false);
const [bancos, setBancos] = useState('');
const [banco, setBanco] = useState([
  { label: 'Banco de Venezuela', value: 'Banco de Venezuela' },
  { label: 'Banco Provincial', value: 'Banco Provincial' },
  { label: 'Banesco', value: 'Banesco' },
  { label: 'Banco del Tesoro', value: 'Banco del Tesoro' },
  { label: 'Banco Bicentenario', value: 'Banco Bicentenario' },
  { label: 'Mercantil', value: 'Mercantil' },
  { label: 'BOD', value: 'BOD' },
  { label: 'BNC', value: 'BNC' },
  { label: 'Banca Amiga', value: 'Banca Amiga' }
]);

const [paymentInfo, setPaymentInfo] = useState({
  bankName: '',
  ci_pago_movil: '',
  phoneNumber_pago_movil: '',
  cashAmount: '',
  contactNumber: ''

});

const [userInfo, setUserInfo] = useState(null);

const [formInfo, setFormInfo] = useState({
  nombre_completo: '',
  ci_foto: '',
  ci:'',
  licencia: ''
});

  const { carId } = route.params;
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const autoRef = firebase.firestore().collection('auto');

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };


  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carDoc = await autoRef.doc(carId).get();
        if (carDoc.exists) {
          setCar(carDoc.data());
        } else {
          console.error("Car not found!");
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      } finally {
        setLoading(false);
      }
    };

    
    const fetchUserInfo = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const userDoc = await firebase.firestore().collection('usuario').doc(user.uid).get();
          if (userDoc.exists) {
            setUserInfo(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    

    // hacer fetch de las reservas asociadas al CarID y extraer las fechas (fecha inicio y fecha final) para deshabilitarlas en el calendario
    const fetchReservas = async () => {
      try {
        const reservaRef = firebase.firestore().collection('reserva');
        const reservas = await reservaRef.where('id_auto', '==', carId).get();

        if (!reservas.empty){
          const dates = [];
          reservas.forEach((reserva) => {
            const data = reserva.data();
            const startDate = data.fecha_inicio.toDate().toISOString().split('T')[0];
            const endDate = data.fecha_fin.toDate().toISOString().split('T')[0];
            dates.push({ startDate, endDate });
          });
          setReservedDates(dates);
        }
      }
      catch (error) {
        console.error("Error fetching reservas data:", error);
      }            
    }

    fetchCar();
    fetchUserInfo();
    fetchReservas();
  }, [carId, user]);

  useEffect(() => {
    if (selectedRange.startDate && selectedRange.endDate && car) {
      const startDate = new Date(selectedRange.startDate);
      const endDate = new Date(selectedRange.endDate);
      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Including the end date
      const total = diffDays * car.precio;
      setTotalAmount(total);
    }
  }, [selectedRange, car]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EBAD36" />
        <Text style={styles.cargando}>Cargando</Text>
      </View>
    );
  }



  

  // console.log("carId:", carId); 
  // console.log("Usuario:", user.uid); 
  
  const handleImageUpload = async (imageUri, folder) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const ref = storage.ref().child(`${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

    const handleReserve = async () => {

      if (!formInfo.nombre_completo || !formInfo.ci || !IdImg || !LicenseImg) {
        alert("Por favor, complete todos los campos requeridos");
        return;
      }
      const numericRegex = /^\d+$/;
      if (!numericRegex.test(formInfo.ci)) {
        alert("La cédula solo debe contener caracteres numéricos");
        return;
      }

      if(!selectedRange.startDate || !selectedRange.endDate){
        alert("Por favor, seleccione la fecha de inicio o de fin de su reserva");
        return;

      }
      if (!paymentMethod) {
        alert("Por favor, seleccione un método de pago");
        return;
      }
      if (paymentMethod === 'cash') {
        const cashAmount = parseFloat(paymentInfo.cashAmount);
        if (isNaN(cashAmount) || cashAmount <= 0) {
          alert("Por favor, ingrese una cantidad válida de efectivo");
          return;
        }
        if (cashAmount < totalAmount) {
          alert(`Por favor, ingrese un monto mayor o igual al monto total de $${totalAmount}`);
          return;
        }
      }

      if (paymentMethod === 'cash' && !paymentInfo.cashAmount) {
        alert("Por favor, ingrese la cantidad de efectivo");
        return;
      }
  
      if (paymentMethod === 'mobile' && (!bancos|| !paymentInfo.ci_pago_movil || !paymentInfo.phoneNumber_pago_movil)) {
        alert("Todos los campos de Pago Móvil son obligatorios");
        return;
      }
  
      if (paymentMethod === 'acordar' && !paymentInfo.contactNumber) {
        alert("Por favor, ingrese un número de contacto");
        return;
      }
      setLoading(true);
      
      const idImageUrl = IdImg ? await handleImageUpload(IdImg, 'cedulas') : null;
      const licenseImageUrl = LicenseImg ? await handleImageUpload(LicenseImg, 'licencias') : null;
      // setIsLoading(true);
      
  
      try {
        await firebase.firestore().collection('reserva').add({
          id_auto: carId,
          nombre_auto: car.modelo,
          metodo_pago: paymentMethod,
          cantidad_efectivo: paymentInfo.cashAmount,
          id_usuario_queAlquila: user.uid,
          id_firebase: userInfo,
          id_propietario: car.arrendatarioRef,
          banco: bancos,
          ci_pago_movil: paymentInfo.ci_pago_movil,
          phoneNumber_pago_movil: paymentInfo.phoneNumber_pago_movil,
          numero_contacto: car.phoneNumber,
          precio_total: totalAmount,
          precio_por_dia: car.precio,
          nombre_completo: formInfo.nombre_completo,
          ci: formInfo.ci,
          url_cedula: idImageUrl,
          url_licencia: licenseImageUrl,
          fecha_inicio: new Date(selectedRange.startDate),
          fecha_fin: new Date(selectedRange.endDate),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          
          
        });

        alert("Reserva realizada con éxito");
        navigation.navigate('Home');
        console.log("ID FOTO:",car.imagenURL[0]);
        // navigation.goBack();
      } catch (error) {
        console.error("Error al realizar la reserva: ", error);
        console.log("ID FOTO:",car.imagenURL[0]);
        alert("Error al realizar la reserva");
      } 
      finally {
        // Ocultar el spinner de carga
        setLoading(false);
      
      }
    };

    // console.log("Id Usuario:", user);
    // console.log("Id Usuario:", user.id);
    console.log("Id USER INFO Usuario:", userInfo);
    console.log("ID FOTO:",car.imagenURL[0]);

    const handleImagePick = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
  
      if (!result.canceled) {
        const image = result.assets[0].uri;
        return image;
      }
    };
  
    const handleTakeIdPhoto = async () => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
  
      if (!result.canceled) {
        const image = result.assets[0].uri;
        setIdImg(image);
      }
    };
  
    const handleTakeLicenseImg = async () => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
  
      if (!result.canceled) {
        const image = result.assets[0].uri;
        setLicenseImg(image);
      }
    };
  
    const handlePickIdImg = async () => {
      let result = await handleImagePick();
      setIdImg(result);
    };
  
    const handlePickLicenseImg = async () => {
      let result = await handleImagePick();
      setLicenseImg(result);
    };
    const openWhatsApp = (phoneNumber) => {
      // Verificar la longitud correcta del número de teléfono
      if (phoneNumber.length !== 10) {
        alert('Por favor, inserte un número de WhatsApp correcto');
        return;
      }
    
      // Usando el código de país para Venezuela
      let url =
        'whatsapp://send?phone=58' + phoneNumber;
    
      Linking.openURL(url)
        .then(() => {
          console.log('WhatsApp abierto');
        })
        .catch(() => {
          alert('Asegúrese de que WhatsApp esté instalado en su dispositivo');
        });
    };
    


 
  return (

    
    
    <ScrollView style={styles.container}>
      <GestureHandlerRootView>
        
      <View style={styles.arrow}>
        <TouchableOpacity          
          onPress={() => navigation.goBack()}
          activeOpacity={0.9}>
          <Image  source={back} resizeMode="contain" style={{height:30}}/>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>        
        <Image source={{uri: car.imagenURL[0]}} style={styles.image} />
        {/* {uri: car.imagenURL} */}
      </View>
      
      <View style={styles.details}>        
        <Text style={styles.label}>Reservar</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Nombre Completo"  
          value={formInfo.nombre_completo}
          onChangeText={(text) => setFormInfo({ ...formInfo, nombre_completo: text })}

          />

          <TextInput 
            style={styles.input} 
            placeholder="Cédula Identidad" 
            value={formInfo.ci} 
            onChangeText={(text) => setFormInfo({ ...formInfo, ci: text })}
          />

        <View style={{borderWidth: 1, borderRadius: 10, padding: 10, marginVertical:10,borderColor:"#748289"}}>
          <View style={styles.anexarCont}>
            
            <Text style={{fontSize:16,fontFamily: 'Raleway_700Bold',color:'#748289'}}>Anexar Cédula</Text>        

            <View style={{flexDirection:'row'}}>
              {/* <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={handleTakeIdPhoto}>
                <FontAwesomeIcon icon={faCamera} size={20} />
              </Pressable> */}

              <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={handlePickIdImg}>
                <FontAwesomeIcon icon={faUpload} size={20} />
              </Pressable>          
            </View>          

          </View>       

          {IdImg && <View style={styles.idContainer}><Image source={{ uri: IdImg }} style={styles.IdImage} /></View>} 

        </View>               
        
        <View style={{borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10,borderColor:"#748289"}}>
          <View style={styles.anexarCont}>
            
            <Text style={{fontSize:16,fontFamily: 'Raleway_700Bold',color:"#748289"}}>Anexar Licencia</Text>        

            <View style={{flexDirection:'row'}}>
              {/* <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={handleTakeLicenseImg}>
                <FontAwesomeIcon icon={faCamera} size={20} />
              </Pressable> */}

              <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={handlePickLicenseImg}>
                <FontAwesomeIcon icon={faUpload} size={20} />
              </Pressable>          
            </View>          

          </View>         
          
          {LicenseImg && <View style={styles.idContainer}><Image source={{ uri: LicenseImg }} style={styles.IdImage} /></View>}

        </View>              
        
        <Text style={[{marginTop: 10}, styles.label]}>Fecha de reserva</Text>

        <CalendarComponent reservas={reservedDates} onRangeSelected={setSelectedRange}/>

        <Text style={[{marginTop: 10}, styles.label]}>Método de Pago</Text> 

        <View style={styles.containerPago}>

        <Pressable
              style={({ pressed }) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36' }, styles.pagosButton]}
              onPress={() => setPaymentMethod('cash')}
            >
              <FontAwesomeIcon icon={faMoneyBill} size={38} />
              <Text style={{ color: '#000000', fontSize: 13,fontFamily: 'Raleway_400Regular' }}>Efectivo</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36' }, styles.pagosButton]}
              onPress={() => setPaymentMethod('mobile')}
            >
              <FontAwesomeIcon icon={faMoneyBillTransfer} size={38} />
              <Text style={{ color: '#000000', fontSize: 13,fontFamily: 'Raleway_400Regular' }}>Pago Móvil</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36' }, styles.pagosButton]}
              onPress={() => setPaymentMethod('agree')}
            >
              <FontAwesomeIcon icon={faPeopleArrows} size={39} />
              <Text style={{ color: '#000000', fontSize: 13,fontFamily: 'Raleway_400Regular'}}>Acuerdo</Text>
            </Pressable>
          </View>

          {paymentMethod === 'cash' && (
            <View>
              <Text style={styles.titleForms}>
                Ingrese el monto en efectivo a cancelar
              </Text>
              <TextInput
              style={styles.input}
              placeholder="Cantidad en efectivo"
              value={paymentInfo.cashAmount}
              onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cashAmount: text })}
              keyboardType="numeric"
            />

            </View>
            
          )}

          {paymentMethod === 'mobile' && (
          <View>
            <Text style={styles.titleForms}>
                Ingrese los datos de la cuenta con la que realizará el pago 
              </Text>
              <View style={{ marginBottom: openC ? 200 : 10 }}>
              <DropDownPicker
              open={openC}
              value={bancos}
              items={banco}
              setOpen={setOpenC}
              setItems={setBanco}
              setValue={setBancos}
              placeholder="Seleccione el Banco"
              style={styles.picker}
              textStyle={[styles.pickerText, banco && styles.selectedPickerText]} // Apply different style for the selected option
              dropdownStyle={[styles.dropdownStyle, { backgroundColor: '#F5F5F5' }]}
              
            />
            
            </View>
            
            <TextInput
                style={styles.input}
                placeholder="Número de Cédula"
                value={paymentInfo.ci_pago_movil}
                onChangeText={(text) => setPaymentInfo({ ...paymentInfo, ci_pago_movil: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Número de Teléfono"
                value={paymentInfo.phoneNumber_pago_movil}
                onChangeText={(text) => setPaymentInfo({ ...paymentInfo, phoneNumber_pago_movil: text })}
                keyboardType="phone-pad"
              />
          </View>
        )}

          {paymentMethod === 'agree' && (
            <View>  
              <Text style={styles.titleForms}>
                Presione el link para comunicarse directamnete con el propietario del auto. {'\n'} {'\n'}
                IMPORTANTE: para culminar la reserva debera regresar a la App nuevamente y completar el proceso.
              </Text>
              <Pressable onPress={() => openWhatsApp(car.phoneNumber)} >
                <Text style={styles.whatsappLink}>{  'w.app/atencionAlCliente/+58' + car.phoneNumber}</Text>
              </Pressable>
            </View>
          )}

            {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#EBAD36" />
              <Text style={styles.cargando}>Su reserva está siendo procesada</Text>
            </View>
          )}

          <Text style={styles.totalAmountText}>Monto Total: ${totalAmount}</Text>
          <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#354655' : '#1C252E',}, styles.submitButton,]} onPress={handleReserve}>
            <Text style={{ color: '#EBAD36', fontSize: 18,fontFamily: 'Raleway_700Bold'}}>Reservar</Text>
           
        </Pressable>
      
      </View>
      
      </GestureHandlerRootView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    alignItems: 'center', 
    marginTop: 10,
  },
  image: {
    marginTop: 70,
    marginBottom: 30,
    objectFit: 30,
    width: windowWidth * 0.90,
    height: windowHeight * 0.20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Raleway_700Bold',
  },
  details: {
    padding: 20,
    backgroundColor: '#E6E6E6',
    borderRadius: 25,
    fontFamily: 'Raleway_700Bold',
    paddingBottom:50
   
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Raleway_700Bold',
    paddingBottom:10,
    paddingTop:10
  },
  input: {
    borderWidth: 1,
    
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderColor:"#748289",
    fontFamily: 'Raleway_700Bold',
    color:"#748289"
    
  },
  anexar: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 50,
    height:50,
    marginHorizontal: 5,
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 100,
    
  },
  containerPago: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom:25
  },
  pagosButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
    height: 85,
    alignSelf: 'center',
  },
  arrow: {
    top: 50,
    left: 20,
    position: 'fixed',  
    zIndex:1
  },
  IdImage: {
    width: 300,
    height: 200,
    alignSelf: 'center',    
    objectFit: 'contain',
  },
  idContainer: {
    borderRadius: 10,
    backgroundColor: '#D7D6D6',   
    marginTop: 20,     
    marginBottom: 10,
   
  },
  anexarCont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',  
          
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

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 5,
      backgroundColor: '#EBAD36',
      borderRadius: 15,
    },
    closeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      fontFamily: 'Raleway_400Regular',
    },
    modalInput: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      marginBottom: 10,
    },
    sendButton: {
      padding: 10,
      backgroundColor: '#EBAD36',
      borderRadius: 10,
      marginTop: 20,
    },
    sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontFamily: 'Raleway_400Regular',
    },

    titleForms: {
      fontSize: 13,
      padding: 16,
      fontFamily: ' Raleway_700Bold',
    },
    totalAmountText: {
      fontSize: 20,
      fontFamily: 'Raleway_700Bold',
      textAlign: 'center',
      marginVertical: 20,
    },
    picker: {
      marginBottom: 4,
      backgroundColor: "#F5F5F5",
      
      // backgroundColor: "#F5F5F5",
      fontFamily: 'Raleway_700Bold',
      },
      
      pickerText: {
      fontSize:15,
      fontFamily: 'Raleway_700Bold',
      color: '#pink',
      },
      dropdownStyle: {
      zIndex: 9999,
      backgroundColor: "#F5F5F5",
      },
      
      
      selectedPickerText: {
        color: '#aaa',
      },
      whatsappLink: {
        color: 'blue', 
        textDecorationLine: 'underline', 
        textDecorationColor: 'blue',
        marginLeft: 10,
        fontFamily: 'Raleway_400Regular',
      },
    
});

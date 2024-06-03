import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, Button, Pressable, TouchableOpacity, ActivityIndicator, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMoneyBill, faMoneyBillTransfer, faPeopleArrows, faCamera, faUpload } from '@fortawesome/free-solid-svg-icons'
import { firebase } from "../firebase/firebaseConfig";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const back = require("../assets/Img/arrow.png");
const storage = firebase.storage();
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


export default Reserva = ({route, navigation}) => {


  
  const [IdImg, setIdImg] = useState(null);
  const [LicenseImg, setLicenseImg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  // const [isLoading, setIsLoading] = useState(true);

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

    fetchCar();
    fetchUserInfo();
  }, [carId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#EBAD36" />
        <Text style={styles.cargando}>Cargando</Text>
      </View>
    );
  }

  

  console.log("carId:", carId); 


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
      if (!paymentMethod) {
        alert("Por favor, seleccione un método de pago");
        return;
      }

      if (paymentMethod === 'cash' && !paymentInfo.cashAmount) {
        alert("Por favor, ingrese la cantidad de efectivo");
        return;
      }
  
      if (paymentMethod === 'mobile' && (!paymentInfo.bankName || !paymentInfo.ci_pago_movil || !paymentInfo.phoneNumber_pago_movil)) {
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
          metodo_pago: paymentMethod,
          cantidad_efectivo: paymentInfo.cashAmount,
          banco: paymentInfo.bankName,
          ci_pago_movil: paymentInfo.ci_pago_movil,
          phoneNumber_pago_movil: paymentInfo.phoneNumber_pago_movil,
          // numero_contacto: car.phoneNumber, //{/* {car.id_usuario.phoneNumber} */}
          //  paymentInfo.contactNumber,
          // ID_user: userInfo,
          precio: car.precio,
          // ID_propietario: car.id_usuario,
          nombre_completo: formInfo.nombre_completo,
          ci: formInfo.ci,
          url_cedula: idImageUrl,
          url_licencia: licenseImageUrl,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
          
        });
        alert("Reserva realizada con éxito");
        navigation.navigate('Cars');
        // navigation.goBack();
      } catch (error) {
        console.error("Error al realizar la reserva: ", error);
        alert("Error al realizar la reserva");
      } 
      finally {
        // Ocultar el spinner de carga
        setLoading(false);
      
      }
    };

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
        <Image source={{uri: car.imagenURL}} style={styles.image} />
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

        <View style={{borderWidth: 1, borderRadius: 10, padding: 10, marginVertical:10}}>
          <View style={styles.anexarCont}>
            
            <Text style={{fontSize:16}}>Anexar Cédula</Text>        

            <View style={{flexDirection:'row'}}>
              <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={handleTakeIdPhoto}>
                <FontAwesomeIcon icon={faCamera} size={25} />
              </Pressable>

              <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={handlePickIdImg}>
                <FontAwesomeIcon icon={faUpload} size={25} />
              </Pressable>          
            </View>          

          </View>       

          {IdImg && <View style={styles.idContainer}><Image source={{ uri: IdImg }} style={styles.IdImage} /></View>} 

        </View>               
        
        <View style={{borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10}}>
          <View style={styles.anexarCont}>
            
            <Text style={{fontSize:16}}>Anexar Licencia</Text>        

            <View style={{flexDirection:'row'}}>
              <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={handleTakeLicenseImg}>
                <FontAwesomeIcon icon={faCamera} size={25} />
              </Pressable>

              <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={handlePickLicenseImg}>
                <FontAwesomeIcon icon={faUpload} size={25} />
              </Pressable>          
            </View>          

          </View>         
          
          {LicenseImg && <View style={styles.idContainer}><Image source={{ uri: LicenseImg }} style={styles.IdImage} /></View>}

        </View>              
        
        <Text style={[{marginTop: 10}, styles.label]}>Método de Pago</Text> 

        <View style={styles.containerPago}>

        <Pressable
              style={({ pressed }) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36' }, styles.pagosButton]}
              onPress={() => setPaymentMethod('cash')}
            >
              <FontAwesomeIcon icon={faMoneyBill} size={43} />
              <Text style={{ color: '#000000', fontSize: 13 }}>Efectivo</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36' }, styles.pagosButton]}
              onPress={() => setPaymentMethod('mobile')}
            >
              <FontAwesomeIcon icon={faMoneyBillTransfer} size={43} />
              <Text style={{ color: '#000000', fontSize: 13 }}>Pago Móvil</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36' }, styles.pagosButton]}
              onPress={() => setPaymentMethod('agree')}
            >
              <FontAwesomeIcon icon={faPeopleArrows} size={43} />
              <Text style={{ color: '#000000', fontSize: 13 }}>Acuerdo</Text>
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
              <TextInput
                style={styles.input}
                placeholder="Banco"
                value={paymentInfo.bankName}
                onChangeText={(text) => setPaymentInfo({ ...paymentInfo, bankName: text })}
              />
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
              Este es el número de contacto del dueño del carro. Anote su número para cuadrar la metodología de pago directamente.
            </Text>
            <View style={styles.input}>
              <Text>{car.phoneNumber}</Text>
              
              {/* {car.id_usuario.phoneNumber} */}
            </View>
            </View>
            
          )}
           {/* {isLoading && (
        <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
   */}
            {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#EBAD36" />
              <Text style={styles.cargando}>Su reserva está siendo procesada</Text>
            </View>
          )}


          <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#354655' : '#1C252E',}, styles.submitButton,]} onPress={handleReserve}>
            <Text style={{ color: '#EBAD36', fontSize: 18, fontWeight: 'bold'}}>Reservar</Text>
           
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
    // width: '65%',
    // height: 200,
    marginTop: 70,
    marginBottom: 30,
    objectFit: 60,
    width: windowWidth * 0.60,
    height: windowHeight * 0.15,
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
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Raleway_700Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#000000',
  },
  anexar: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 60,
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
      fontSize: 12,
      padding: 16,
      fontWeight: 'bold',
      fontFamily: 'Raleway_400Regular',
    },
});


 
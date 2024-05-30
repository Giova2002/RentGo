import React, { useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, Button, Pressable, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMoneyBill, faMoneyBillTransfer, faPeopleArrows, faCamera, faUpload } from '@fortawesome/free-solid-svg-icons'


export default Reserva = ({navigation}) => {

  const [IdImg, setIdImg] = useState(null);
  const [LicenseImg, setLicenseImg] = useState(null);


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
      }
    );
  
    if (!result.canceled) {
      const image = result.assets[0].uri;
      setIdImg(image);
    }
  };
  const handleTakeLicenseImg = async () => {
    let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      }
    );
  
    if (!result.canceled) {
      const image = result.assets[0].uri;
      setLicenseImg(image);
    }
  };

  const handlePickIdImg = async () => {
    let result = await handleImagePick();    
    setIdImg(result);
  }  
  const handlePickLicenseImg = async () => {
    let result = await handleImagePick();
    setLicenseImg(result);
  }  
 
  return (

    
    <ScrollView style={styles.container}>

      <View style={styles.arrow}>
        <TouchableOpacity          
          onPress={() => navigation.goBack()}
          activeOpacity={0.9}>
          <Image  source={require("../assets/Img/arrow.png")} resizeMode="contain" style={{height:30}}/>
        </TouchableOpacity>
      </View>



      <View style={styles.header}>        
        <Image source={require('../assets/fortuner.png')} style={styles.image} />
      </View>
      
      <View style={styles.details}>        
        <Text style={styles.label}>Reservar</Text>

        <TextInput style={styles.input} placeholder="Nombre Completo" />
        <TextInput style={styles.input} placeholder="Cédula Identidad" />

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
            <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.pagosButton,]}>
                <FontAwesomeIcon icon={faMoneyBill} size={43}/>
                <Text style={{ color: '#000000', fontSize: 13}}>Efectivo</Text>
            </Pressable>
    
            <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.pagosButton,]}>
                <FontAwesomeIcon icon={faMoneyBillTransfer} size={45}/>
                <Text style={{ color: '#000000', fontSize: 13}}>Pago Móvil</Text>
            </Pressable>

            <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.pagosButton,]}>
                <FontAwesomeIcon icon={faPeopleArrows} size={45}/>
                <Text style={{ color: '#000000', fontSize: 13}}>Acordar</Text>
            </Pressable>
        </View>

        <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#354655' : '#1C252E',}, styles.submitButton,]}>
            <Text style={{ color: '#EBAD36', fontSize: 18, fontWeight: 'bold'}}>Reservar</Text>
        </Pressable>

      </View>
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
    width: '65%',
    height: 200,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  details: {
    padding: 20,
    backgroundColor: '#E6E6E6',
    borderRadius: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  }
});

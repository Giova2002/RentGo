import React from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, Button, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMoneyBill, faMoneyBillTransfer, faPeopleArrows } from '@fortawesome/free-solid-svg-icons'

export default Reserva = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/fortuner.png')} style={styles.image} />
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Reservar</Text>

        <TextInput style={styles.input} placeholder="Nombre Completo" />
        <TextInput style={styles.input} placeholder="Cédula Identidad" />

        <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={() => handleAttachId()}>
            <Text style={{ color: '#000000', fontSize: 16}}>Anexar Cédula</Text>
        </Pressable>

        <Pressable style={({pressed}) => [{ backgroundColor: pressed ? '#D09932' : '#EBAD36',}, styles.anexar,]} onPress={() => handleAttachLicense()}>
            <Text style={{ color: '#000000', fontSize: 16}}>Anexar Licencia</Text>
        </Pressable>
        
        <Text style={[{marginTop: 20}, styles.label]}>Método de Pago</Text>

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
    marginTop: 40,
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
    marginVertical: 10,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
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
});

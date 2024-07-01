import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { firebase } from '../firebase/firebaseConfig';

export default function Ratings({ route, navigation }) {
  const { carId } = route.params;
  const [rating, setRating] = useState(0); // Puntuación inicial, puedes ajustar según necesites
  const [hasReserved, setHasReserved] = useState(false); // Estado para verificar si ha reservado el auto
  const back = require("../assets/Img/arrow.png");


  useEffect(() => {
    const checkReservation = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          console.warn('Usuario no autenticado');
          return;
        }

        const reservationsRef = firebase.firestore().collection('reserva')
          .where('id_auto', '==', carId)
          .where('id_usuario_queAlquila', '==', user.uid)
          .get();

        if (reservationsRef.empty) {
          setHasReserved(false);
        } else {
          setHasReserved(true);
        }
      } catch (error) {
        console.error('Error checking reservation:', error);
      }
    };

    checkReservation();
  }, [carId]); // Ejecutar la verificación cada vez que cambie carId


  const saveRating = async () => {
    try {
      if (!hasReserved) {
        Alert.alert('No se puede calificar', 'Debes haber reservado este auto anteriormente.');
        return;
      }

      const carRef = firebase.firestore().collection('auto').doc(carId);

      // Obtener el documento actual del auto
      const doc = await carRef.get();
      if (doc.exists) {
        const currentData = doc.data();
        let { totalRatings, averageRating } = currentData;

        // Si es la primera calificación, inicializa los valores
        if (!totalRatings) {
          totalRatings = 0;
          averageRating = 0;
        }

        // Convertir la calificación de estrellas a una escala del 1 al 10
        const ratingInScale = calculateNumericRating(rating);

        // Calcular nuevo promedio y actualizar total de calificaciones
        totalRatings += 1;
        averageRating = ((averageRating * (totalRatings - 1)) + ratingInScale) / totalRatings;

        // Guardar en Firebase Firestore
        await carRef.set({
          totalRatings,
          averageRating,
        }, { merge: true });

        Alert.alert('Calificación exitosa', 'El auto ha sido calificado con éxito.');
        // Navegar de vuelta a la pantalla anterior
        navigation.goBack();
        // navigation.navigate('Home');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  // Función para convertir la calificación de estrellas a escala del 1 al 10
  const calculateNumericRating = (rating) => {
    switch (rating) {
      case 1: return 1;   // Terrible
      case 2: return 2;   // Very Bad
      case 3: return 3;   // Bad
      case 4: return 4;   // Normal
      case 5: return 5;   // Good
      case 6: return 6;   // Very Good
      case 7: return 7;  // Excellent
      default: return 0;  // Valor por defecto
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.9}>
            <Image source={back} resizeMode="contain" style={styles.arrow} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Rating</Text>
        </View>

        <View style={styles.ratingContainer}>
          <AirbnbRating
            reviews={['Terrible', 'Very Bad', 'Bad', 'Normal', 'Good', 'Very Good', 'Excellent']}
            count={7}
            defaultRating={rating}
            onFinishRating={setRating}
            selectedColor='#EBAD36'
            unSelectedColor='lightgray'
            reviewColor='black'
            size={30}
            reviewSize={24}
            isDisabled={!hasReserved} // Deshabilitar el rating si no ha reservado el auto
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveRating}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Alinea los elementos en la parte superior
    alignItems: 'center',
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 70,
    paddingTop: 40,
    width: '100%', // Ancho completo para ocupar toda la pantalla
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Raleway_700Bold',
    marginRight: 100,
  },
//   arrow: {
//     width: 25,
//     height: 25,
//   },
  ratingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 40,
    marginBottom:95,
  },
  saveButton: {
    backgroundColor: '#EBAD36',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


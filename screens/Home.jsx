import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { firebase } from '../firebase/firebaseConfig'; 
import Header from '../header/Header';
import SearchBar from '../search/SearchBar';
import { useNavigation, useRoute } from '@react-navigation/native';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Home() {
  const navigation = useNavigation()
  const route = useRoute()
  const marcas = Array.from({ length: 3 });
  const [recommendedCars, setRecommendedCars] = useState([]);


  useEffect(() => {
    const fetchRecommendedCars = async () => {
      try {
        const snapshot = await firebase.firestore().collection('auto').where('recomendado', '==', true).get();
        const recommendedCarsData = snapshot.docs.map(doc => doc.data());
        setRecommendedCars(recommendedCarsData);
      } catch (error) {
        console.error('Error fetching recommended cars:', error);
      }
    };

    fetchRecommendedCars();
  }, []);



  return (
    <View style={styles.home}>
      <Header />
      <Text style={styles.title}>Busca Tu Coche de Ensueño Para Conducir</Text>
      <SearchBar  />
      <View style={styles.blueContainer}>
      <ScrollView showsVerticalScrollIndicator={false} >
        <View style={styles.yellowRectangleContainer}>
          <View style={styles.yellowRectangle}></View>
        </View>

        <View style={styles.topBrandsContainer}>
          <Text style={styles.subtitle}>Marcas Líderes</Text>
          <View style={styles.brandsCollection}>
            {marcas.map((_, index) => (
              <View key={index} style={styles.brandsContainer}></View>
            ))}
          </View>
        </View>
        <View style={styles.recommendationsContainer}>
          <Text style={styles.subtitle}>Recomendaciones</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {recommendedCars.map((car, index) => (
              <View key={index} style={styles.carInfo}>
                <View style={styles.carRecommendationContainer}>
                  <Image
                    style={styles.imageContainer}
                    source={{uri: car.imagenURL}}
                  />
                  <Text style={styles.carName}>{car.modelo}</Text>
                  <Text style={styles.price}>{car.precio}$/día</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  title: {
    fontSize: 25,
    width: "70%",
    paddingLeft: 20,
    fontFamily: "Raleway_700Bold"
  },
  topBrandsContainer: {
    flexDirection: "column",
    marginTop: 50,
  },
  yellowRectangleContainer: {
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  yellowRectangle: {
    width: 65,
    height: 10,
    backgroundColor: "#EBAD36",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
  },
  blueContainer: {
    backgroundColor: "#1C252E",
    height: windowHeight * 0.6,
    borderRadius: 35,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 10,
    flexDirection: "column",
    padding: 15,
  },
  brandsCollection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  scrollContainer: {
    paddingHorizontal: 10, 
  },
  brandsContainer: {
    width: 115,
    height: 107,
    backgroundColor: "#2F3942",
    borderRadius: 10,
  },
  subtitle: {
    fontFamily: "Raleway_700Bold",
    color: "#FDFDFD",
    fontSize: 25,
  },
  recommendationsContainer: {
    marginTop: 30,
  },
  carRecommendationContainer: {
    backgroundColor: "#2F3942",
    borderRadius: 10,
    width: 182,
    height: 126,
    paddingHorizontal: 10,
    marginRight: 10, 
    
  },
  carInfo: {
    display: 'flex',
    height: 'auto',
    overflow: 'hidden',
    paddingTop: 50,
  },
  imageContainer: {
    height: 100,
    width: 'auto',
    objectFit: "contain",
    marginTop: -50,
  },
  carName: {
    fontSize: 16,
    color: "#FDFDFD",
    marginBottom: 6,
    marginTop: 10,
    fontFamily: "Raleway_700Bold"
  },
  price: {
    color: "#EBAD36",
    fontSize: 14,
    fontFamily: "Raleway_700Bold"
  }
});

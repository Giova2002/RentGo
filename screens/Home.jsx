import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image ,TouchableOpacity} from 'react-native';
import { firebase } from '../firebase/firebaseConfig'; 
import Header from '../header/Header';
import SearchBar from '../search/SearchBar';
import { useNavigation, useRoute,useFocusEffect } from '@react-navigation/native';
import { useCarFiltersContext } from '../context/CarFiltersContext';




const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Home() {
  const {data,setData}=useCarFiltersContext()
  const navigation = useNavigation()
  const marcas = [{name:"Toyota",image:require('../assets/marcasLogos/toyota.png')},{name:"Ford",image:require('../assets/marcasLogos/ford.png')},{name:"Mitsubishi",image:require('../assets/marcasLogos/mitsubishi.png')}]
  const [recommendedCars, setRecommendedCars] = useState([]);
  
//ESTO PUEDE JODER MAS ADELANTE
  // useEffect(() => {
  //   // Este efecto se ejecutará una vez cuando el componente se monte
  //   navigation.navigate("Home");
  // }, []);

  useEffect(() => {
    const fetchRecommendedCars = async () => {
      try {
        const snapshot = await firebase.firestore().collection('auto').where('recomendado', '==', true).get();
        const recommendedCarsData = snapshot.docs.map(doc => ({
          key: doc.id, // Agrega el ID del documento aquí
          ...doc.data()
        }));
        setRecommendedCars(recommendedCarsData);
      } catch (error) {
        console.error('Error fetching recommended cars:', error);
      }
    };

    fetchRecommendedCars();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setData({
        seatCount: 2,
        priceRange: [10, 500],
        automaticSelected: false,
        manualSelected: false,
        selectedBrands: [],
        selectedLocations: [],
        search: "",
        filter: false,
        filterByBrand: false
      });
    }, [])
  );
  const goToCarsByBrand=(brand)=>{
    setData({seatCount: 2,priceRange:[10, 500],automaticSelected:false, manualSelected:false, selectedBrands:[brand],selectedLocations:[], search:data.search,filter:false,filterByBrand:true})
    navigation.navigate("Cars")
  }
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
            {marcas.map((marca, index) => (
              <TouchableOpacity onPress={()=>{goToCarsByBrand(marca.name)}}>
              <View key={index} style={styles.brandsContainer}>
                <Image source={marca.image}  style={styles.brandImage} resizeMode='contain'/>
              </View>
              </TouchableOpacity>
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
              <TouchableOpacity   onPress={() => navigation.navigate("Info", { carId: car.key })}>
              <View key={index} style={styles.carInfo}>
                <View style={styles.carRecommendationContainer}>
                  <Image
                    style={styles.imageContainer}
                    source={{uri: car.imagenURL[0]}}
                  />
                  <Text style={styles.carName}>{car.modelo}</Text>
                  <Text style={styles.price}>{car.precio}$/día</Text>
                </View>
              </View>
              </TouchableOpacity>
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
    flexGrow: 1,
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
    display:'flex',
    padding:20
  },
  brandImage:{
width:'100%',
height:'100%',


  },
  subtitle: {
    fontFamily: "Raleway_700Bold",
    color: "#FDFDFD",
    fontSize: 25,
  },
  recommendationsContainer: {
    marginTop: 30,
    paddingBottom: 150,
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

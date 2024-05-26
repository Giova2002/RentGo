import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import Header from "../header/Header";
import Profile from "../header/Profile";
import { useFonts } from "expo-font";
import SearchBar from "../search/SearchBar";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Home() {
  const [fontsLoaded] = useFonts({
    SF: require("../assets/fonts/SF_Pro_Rounded_Regular.ttf"),
    SF_Bold: require("../assets/fonts/SF-Pro-Rounded-Bold.ttf"),
  });

  const marcas = Array.from({ length: 3 });
  return (
    <View style={styles.home}>
      <Header />
      <Text style={styles.title}>Busca Tu Coche de Ensueño Para Conducir</Text>
      <SearchBar />
      <View></View>
      <View style={styles.blueContainer}>
      <ScrollView>
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
          <View style={styles.recommendationsCollection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              {Array.from({ length: 6 }, (_, index) => (
                <View key={index} style={styles.carInfo}>
                  <View style={styles.carRecommendationContainer}>
                    <Image
                      style={styles.imageContainer}
                      source={require("../assets/Toyota-Car.png")}
                    />
                    <Text style={styles.carName}>Toyota Corolla 2016</Text>
                    <Text style={styles.price}>80$/day</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  home: {
    width: windowWidth,
    height: windowHeight,
  },
  title: {
    fontSize: 25,
    width: "70%",
    paddingLeft: 20,
  },
  topBrandsContainer: {
    flexDirection: "column",
    marginTop: 50,
  },
  yellowRectangleContainer: {
    width: windowWidth,
    position: "absolute",
    top: 10,
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
    width: windowWidth,
    height: windowHeight * 0.55,
    borderRadius: 35,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    position: "absolute",
    bottom: 95,
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
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingVertical: 20,
  },

  marcasRow: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // width: '100%',
    // paddingHorizontal: 10,
    // marginTop: 70,
  },
  brandsContainer: {
    width: 115,
    height: 107,
    backgroundColor: "#2F3942",
    borderRadius: 10,
  },
  subtitle: {
    color: "#FDFDFD",
    fontSize: 25,
  },
  recommendationsContainer: {
    flexDirection: "column",
    marginTop: 30,
  },
  recommendationsCollection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  carRecommendationContainer: {
    backgroundColor: "#2F3942",
    borderRadius: 10,
    display:'flex',
    position:'relative',
    width:'100%',
    height:126,
    paddingHorizontal:10
  
  },
  carInfo: {
    marginRight: 35,
    width: 182,
    display:'flex',
    height:'auto',
    overflow: 'hidden',
    paddingTop: 50, 
  

 
  },
  imageContainer: {
    height: 100,
    width:'auto',
    objectFit: "contain",
    marginTop:-50,


  },
  carName:{
    fontSize:16,
    color:"#FDFDFD",
    marginBottom:6,
    marginTop:10,
    

  },
  price:{
    color:"#EBAD36",
    fontSize:14



  }
});

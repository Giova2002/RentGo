import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Dimensions, TouchableOpacity, Text, Modal, Animated, Easing, ScrollView } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Svg, { Rect } from 'react-native-svg';
import { useFonts } from "expo-font";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SearchBar = ({ onSubmit }) => {
  const [term, setTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [seatCount, setSeatCount] = useState(2); 
  const [priceRange, setPriceRange] = useState([10, 500]); 
  const [selectedBrands, setSelectedBrands] = useState([]); 
  const [automaticSelected, setAutomaticSelected] = useState(false); 
  const [manualSelected, setManualSelected] = useState(false); 

  const slideAnim = useState(new Animated.Value(windowHeight))[0]; 

const handleSubmit = () => {
if (term.trim() !== '') {
onSubmit(term);
}
};

  const incrementSeatCount = () => {
    if (seatCount < 9) {
      setSeatCount(seatCount + 1);
    }
  };

  const decrementSeatCount = () => {
    if (seatCount > 2) {
      setSeatCount(seatCount - 1);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: windowHeight,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const toggleBrandSelection = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(selectedBrand => selectedBrand !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleAutomaticPress = () => {
    setAutomaticSelected(true);
    setManualSelected(false);
  };

  const handleManualPress = () => {
    setAutomaticSelected(false);
    setManualSelected(true);
  };

  const minValue = 10;
  const maxValue = 500;
  const numberOfBars = 20;
  const barWidth = (windowWidth * 0.8) / numberOfBars;
  const barData = Array.from({ length: numberOfBars }, (_, index) => minValue + ((maxValue - minValue) / numberOfBars) * index);

  const brands = ['Toyota', 'Chevrolet', 'Kia', 'Hyundai', 'Ford', 'Mitsubishi'];

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <Image source={require('../assets/search.png')} style={styles.image} />
        <TextInput
          style={styles.input}
          placeholder="Busca Tu Carro"
          value={term}
          onChangeText={setTerm}
          onSubmitEditing={handleSubmit}
        />
      </View>
      <TouchableOpacity style={styles.filters} onPress={openModal}>
        <Image source={require('../assets/filter.png')} style={styles.imageFilter} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Filtros</Text>
            <View style={styles.separator} />
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false} >
              <View style={{ marginTop: 10, maxWidth:'100%' }} >
                <View style={styles.option}>
                  <Text style={[styles.title]}>Cantidad de Asientos</Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity onPress={decrementSeatCount} style={styles.counterButton}>
                      <Text style={styles.counterButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterText}>{seatCount}</Text>
                    <TouchableOpacity onPress={incrementSeatCount} style={styles.counterButton}>
                      <Text style={styles.counterButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.option}>
                  <Text style={[styles.title]}>Precio</Text>
                </View>
                {/* Gráfico de barras estático */}
                <View style={styles.chartPriceContainer}>
                  <View style={styles.chartContainer}>
                    <Svg height="100" width={windowWidth * 0.8}>
                      {barData.map((price, index) => {
                        const barHeight = (price / maxValue) * 100;
                        const barColor = price >= priceRange[0] && price <= priceRange[1] ? '#EBAD36' : '#CCCCCC';
                        return (
                          <Rect
                            key={index}
                            x={index * barWidth}
                            y={100 - barHeight}
                            width={barWidth - 2}
                            height={barHeight}
                            fill={barColor}
                          />
                        );
                      })}
                    </Svg>
                  </View>
                  <MultiSlider
                    values={[priceRange[0], priceRange[1]]}
                    sliderLength={windowWidth * 0.8}
                    onValuesChange={(values) => setPriceRange(values)}
                    min={minValue}
                    max={maxValue}
                    step={1}
                    allowOverlap={false}
                    snapped
                    selectedStyle={{ backgroundColor: '#EBAD36' }}
                    unselectedStyle={{ backgroundColor: '#CCCCCC' }}
                    markerStyle={{ backgroundColor: '#FFFFFF', borderColor: '#EBAD36', borderWidth: 2 }}
                  />
                </View>
                <View style={styles.priceRangeContainer}>
                  <TextInput style={styles.priceRangeText} value={`$${priceRange[0]}`} editable={false} />
                  <TextInput style={styles.priceRangeText} value={`$${priceRange[1]}`} editable={false} />
                </View>
                
                {/* <TouchableOpacity onPress={() => console.log("Marca")} style={styles.option}> */}
                <View style={styles.option}>
                  <Text style={[styles.title]}>Marca</Text>
                  </View>
                {/* </TouchableOpacity> */}
                <View style={styles.brandContainer}>
                  {brands.map((brand, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.brandItem,
                        selectedBrands.includes(brand) && { backgroundColor: '#EBAD36' } 
                      ]}
                      onPress={() => toggleBrandSelection(brand)}
                    >
                      <Text style={styles.brandText}>{brand}</Text>
                      </TouchableOpacity>
                  ))}
                </View>
                
                {/* <TouchableOpacity onPress={() => console.log("Tipo")} style={styles.option}> */}
                <View style={styles.option}>
                  <Text style={[styles.title]}>Tipo</Text>
                  </View>
                {/* </TouchableOpacity> */}

                <View style={styles.typeContainer}>
                  <TouchableOpacity 

                    style={[
                      styles.typeButton, 
                      automaticSelected && { backgroundColor: '#EBAD36' } 
                    ]}
                    onPress={handleAutomaticPress}
                  >
                    <Text style={styles.typeButtonText}>Carro Automático</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.typeButton, 
                      manualSelected && { backgroundColor: '#EBAD36' } 
                    ]}
                    onPress={handleManualPress}
                  >
                    <Text style={styles.typeButtonText}>Carro Sincrónico</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    width: windowWidth * 0.68,
    height: windowHeight * 0.07,
    fontFamily:"Raleway_700Bold"
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily:"Raleway_700Bold"
  },
  image: {
    width: windowWidth * 0.068,
    height: windowHeight * 0.028,
  },
  filters: {
    width: windowWidth * 0.17,
    height: windowHeight * 0.07,
    backgroundColor: "#EBAD36",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  imageFilter: {
    width: windowWidth * 0.08,
    height: windowHeight * 0.04,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    width: '100%',
    height: windowHeight * 0.9,
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
    position: 'absolute',
    bottom: 0,
  },
  title: {
    fontFamily:"Raleway_700Bold",
    fontSize: 18,
    marginBottom: 10,
    
  },
  option: {
    paddingVertical: windowHeight*0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  counterButton: {
    width: windowWidth * 0.07,
    height: windowHeight * 0.03,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 5,

  },
  counterButtonText: {
    fontSize: 20,
    color: '#000000',
    fontFamily:"Raleway_700Bold"
  },
  counterText: {
    fontSize: 17,
    fontFamily:"Raleway_700Bold"
  },
  chartContainer: {
    alignItems: 'center', 
    marginBottom: 10,
    
  },
  chartPriceContainer: {
    flexDirection: 'column', 
    alignItems: 'center',
    marginBottom: 10,
    
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.8,
    marginTop: 10,
    alignSelf: "center"
  },
  priceRangeText: {
    width: windowWidth * 0.15,
    height: windowHeight * 0.04,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingHorizontal: 5,
    fontFamily:"Raleway_700Bold"
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  closeButtonText: {
    fontFamily:"Raleway_700Bold",
    fontSize: 18,
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
    width: '100%',
    marginVertical: 10,
  },
  brandContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brandItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 16,
    fontFamily:"Raleway_700Bold",
    color: '#000000',
  },
  typeContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent:"center",
    paddingBottom:20
  },
  typeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    
  },
  typeButtonText: {
    fontSize: 16,
    fontFamily:"Raleway_700Bold"
  },
});

export default SearchBar;

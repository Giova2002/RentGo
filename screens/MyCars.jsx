import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Dimensions, Modal, Alert  } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Header from "../header/Header";
import { UserContext } from '../context/UserContext';
import { firebase } from "../firebase/firebaseConfig";

const back = require("../assets/Img/arrow.png");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MyCars = () => {

    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(null);

    const fetchCars = async () => {
        try {
            const carsRef = firebase.firestore().collection("auto");
            const userRef = firebase.firestore().collection("usuario").doc(user.uid); // Obtener la referencia del usuario
            const snapshot = await carsRef.where("arrendatarioRef", "==", userRef).get(); // Comparar con la referencia del usuario
            
            if (!snapshot.empty) {
                const fetchedCars = snapshot.docs.map(doc => ({                    
                    key: doc.id,
                    ...doc.data()
                }));
                setCars(fetchedCars);                
            } else {
                setCars([]);
            }
        } catch (error) {
            console.error("Error fetching cars: ", error);
        } finally {
            setLoading(false);
        }
    }

    const checkReservations = async (carId) => {
        try {
            const reservationsRef = firebase.firestore().collection("reserva");
            const today = new Date();
            const snapshot = await reservationsRef.where("id_auto", "==", carId).get();
            const hasPendingReservations = snapshot.docs.some(doc => {
                const reservation = doc.data();
                const fechaFin = new Date(reservation.fecha_fin);
                return fechaFin >= today;
            });
            return hasPendingReservations;
        } catch (error) {
            console.error("Error checking reservations: ", error);
            return false;
        }
    };

    const handleDelete = async () => {
        if (selectedCarId) {
            const hasPendingReservations = await checkReservations(selectedCarId);
            if (hasPendingReservations) {
                Alert.alert("Error", "No se puede eliminar el auto porque tiene reservas pendientes.");
            } else {
                try {
                    await firebase.firestore().collection("auto").doc(selectedCarId).delete();
                    setCars((prevCars) => prevCars.filter(car => car.key !== selectedCarId));
                    setModalVisible(false);
                    Alert.alert("Auto eliminado correctamente");
                } catch (error) {
                    console.error("Error deleting car: ", error);
                }
            }
        }
    };

    const confirmDelete = (carId) => {
        setSelectedCarId(carId);
        setModalVisible(true);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCars();

            return () => {
                // Tareas de limpieza si es necesario
            };
        }, [user])
    );

    if (loading) {
        return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#EBAD36" />
            <Text style={styles.cargando}>Cargando</Text>
          </View>
        );
    };

    return (
        <GestureHandlerRootView>            
            <Header />
            <View style={styles.headerContainer}>                
                <View style={styles.arrow}>
                    <TouchableOpacity          
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.9}>
                        <Image  source={back} resizeMode="contain" style={{height:30}}/>
                    </TouchableOpacity>
                </View>  
                <Text style={styles.title}>Mis Carros</Text>
            </View>
                      

            {cars.length === 0 ? (
                <View style={styles.noCarsView} >
                    <Text style={styles.noCarsText}>No tienes carros publicados</Text>
                </View>
                
            ) : (
                <View style={styles.listSection}>
                    <FlatList 
                        data={cars}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.element}
                                onPress={() => navigation.navigate('Info', { carId: item.key } ) }>

                                <TouchableOpacity          
                                    onPress={() => confirmDelete(item.key)}
                                    activeOpacity={0.9} style={styles.trashContainer}>
                                    <FontAwesomeIcon icon={faTrash} size={22} color="white"/>
                                </TouchableOpacity>

                                <View style={styles.infoArea}>
                                    <Text style={styles.infoTitle}>{item.modelo}</Text>
                                    <Text style={styles.infoSub}>{item.tipo}</Text>
                                    <Text style={styles.infoPrice}>
                                        <Text style={styles.listAmount}>{item.precio}$/día</Text>
                                    </Text>
                                </View>
                                <View style={styles.imageArea}>
                                    <Image source={{ uri: item.imagenURL }} resizeMode='cover' style={styles.vehicleImage}/>
                                </View>
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item.key}
                    />
                </View>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar este vehículo?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonDelete]}
                                onPress={handleDelete}>
                                <Text style={styles.textStyle}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </GestureHandlerRootView>        
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#000000",
        paddingLeft: 28,
    },
    listSection: {
        flexDirection: "column",
        alignItems: "center",
        height: windowHeight * 0.8,
        paddingBottom:90,
    },
    element: {
        height: windowHeight * 0.14,
        padding: 13,
        borderRadius: 10,
        backgroundColor: "#1C252E",
        flexDirection: "row",
        marginTop: 30,       
        width:windowWidth*0.85        
    },
    infoArea: {
        flexDirection: "column",
        flex: 1,
    },
    infoTitle: {
        color: "#FDFDFD",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Raleway_400Regular",
        numberOfLines: 1,
        width: windowWidth * 0.85,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        marginLeft: 10,
    },
    infoSub: {
        color: "#77828B",
        fontSize: 10,
        fontFamily: "Raleway_400Regular",
        fontWeight: "bold",
        marginLeft: 10,
    },
    infoPrice: {
        flex: 1,
        color: "#EBAD36",
        fontSize: 14,
        fontFamily: "Raleway_700Bold",
        position: "absolute",
        bottom: 0,
    },
    listAmount: {
        fontFamily: "Raleway_400Regular",
    },
    imageArea: {
        left: 15,
    },
    vehicleImage: {
        width: windowWidth * 0.45,
        height: windowHeight * 0.12,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cargando: {
        alignSelf: "center",
        color: 'black',
        fontSize: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#EBAD36',
        marginRight: 10,
    },
    buttonDelete: {
        backgroundColor: '#FF0000',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerContainer: {        
        justifyContent: "center",
        alignItems: "center",        
        flexDirection: "row",        
        marginBottom: 20,          
    },
    arrow: {
        position: "absolute",
        top: 0,
        left: 15,
        zIndex:1
    },
    noCarsText: {
        fontSize: 20,
        color: '#77828B',        
    },
    noCarsView: {                
        height: windowHeight * 0.6,        
        justifyContent: "center",
        alignItems: 'center',
    },
    trashContainer: {
        height: windowHeight * 0.12,        
        justifyContent: 'center',
        marginRight: 7,
    },      
  });

export default MyCars;
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, Likes, Cars, MyCarsOnRent, AddCar, Login, Signin } from "../screens";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; //se importa desde terminal con npm install @react-navigation/bottom-tabs
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDLC-pS5Vo8WDeWHnJXnrIe4608MrVyak4",
  authDomain: "rentgo-c7fab.firebaseapp.com",
  projectId: "rentgo-c7fab",
  storageBucket: "rentgo-c7fab.appspot.com",
  messagingSenderId: "625456398357",
  appId: "1:625456398357:web:10302507e32033badcce1c",
  measurementId: "G-ML4RSSK39M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 107,
    backgroundColor: '#2F3942',
    borderRadius: 15
  }
};

function TabsNavigator() {
  const navigation = useNavigation();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigation.navigate("Login");
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
              <Image
                source={focused ? require('../assets/homepageamarillo.png') : require('../assets/homepagegris.png')}
                style={{ width: 30, height: 35.2 }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Likes'
        component={Likes}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
              <Image
                source={focused ? require('../assets/corazonamarillo.png') : require('../assets/corazongris.png')}
                style={{ width: 35, height: 33 }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Cars'
        component={Cars}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
              <Image
                source={focused ? require('../assets/autoamarillo.png') : require('../assets/autogris.png')}
                style={{ width: 57, height: 57 }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='MyCarsOnRent'
        component={MyCarsOnRent}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
              <Image
                source={focused ? require('../assets/listamarillo.png') : require('../assets/listgris.png')}
                style={{ width: 35, height: 35 }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='AddCar'
        component={AddCar}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
              <Image
                source={focused ? require('../assets/masamarillo.png') : require('../assets/masgris.png')}
                style={{ width: 35, height: 35 }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signin" component={Signin} />
    </Stack.Navigator>
  );
}

export default function App() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      <TouchableOpacity
        style={styles.signinButton}
        onPress={() => navigation.navigate("Signin")}
      >
        <Text style={{ color: 'white' }}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  signinButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'orange',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25, // mitad del ancho y alto para hacerlo circular
  },
});

import React, { useContext, useState } from 'react';
import {Home,Likes,Cars,MyCarsOnRent,AddCar} from "../screens";
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; //se importa desde terminal con npm install @react-navigation/bottom-tabs
import { StyleSheet, View, Dimensions } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InfoScreen from '../screens/InfoScreen';
import Reserva from '../screens/Reserva';
import ProfileScreen from '../screens/ProfileScreen';



const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const screenOptions = {
  tabBarShowLabel:false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom:0,
    right:0,
    left:0,
    elevation:0,
    height:107,
    backgroundColor: '#2F3942',
    borderRadius: 15
  }

}

function Car() {
  return (

    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Cars" component={Cars} />
      <Stack.Screen name="Info" component={InfoScreen} />
      <Stack.Screen name="Reserva" component={Reserva} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      
    </Stack.Navigator>

  )
}

export default TabsNavigator = props =>{


    return (

        <Tab.Navigator screenOptions ={screenOptions}>

        <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: ({focused})=>{
            return(
            <View style = {{alignItems: "center", justifyContent:"center",top:10}}>
               <Image
                    source={focused ? require('../assets/homepageamarillo.png') : require('../assets/homepagegris.png')}
                    style={{ width: 30, height: 35.2 }} 
                  />
            </View>
            );

          }
         } }

          />
        <Tab.Screen
         name='Likes'
        component={Likes}
        options={{
          tabBarIcon: ({focused})=>{
            return(
            <View style = {{alignItems: "center", justifyContent:"center",top:10}}>
               <Image
                    source={focused ? require('../assets/corazonamarillo.png') : require('../assets/corazongris.png')}
                    style={{ width: 35, height: 33 }} 
                  />
            </View>
            );

          }
         } }
        
        />
        <Tab.Screen
         name='Cars' 
         component={Car}
         options={{
          tabBarIcon: ({focused})=>{
            return(
            <View style = {{alignItems: "center", justifyContent:"center",top:10}}>
               <Image
                    source={focused ? require('../assets/autoamarillo.png') : require('../assets/autogris.png')}
                    style={{ width: 57, height: 57 }} 
                  />
            </View>
            );

          }
         } }
         
         />
        <Tab.Screen
        name='MyCarsOnRent' 
        component={MyCarsOnRent}
        options={{
          tabBarIcon: ({focused})=>{
            return(
            <View style = {{alignItems: "center", justifyContent:"center",top:10}}>
               <Image
                    source={focused ? require('../assets/listamarillo.png') : require('../assets/listgris.png')} 
                    style={{ width: 35, height: 35 }} 
                  />
            </View>
            );

          }
         } }
        
        />
        <Tab.Screen 
        name='AddCar' 
        component={AddCar}
        options={{
          tabBarIcon: ({focused})=>{
            return(
            <View style = {{alignItems: "center", justifyContent:"center",top:10}}>
               <Image
                    source={focused ? require('../assets/masamarillo.png') : require('../assets/masgris.png')} 
                    style={{ width: 35, height: 35 }} 
                  />
            </View>
            );

          }
         } }
        
        />
        
      </Tab.Navigator>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
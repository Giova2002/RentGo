import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabsNavigator from './navigation/TabsNavigator';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {Home,Likes,Cars,MyCarsOnRent,AddCar,Login,Signin} from "./screens";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Likes" component={Likes} />
        <Stack.Screen name="Cars" component={Cars} />
        <Stack.Screen name="MyCarsOnRent" component={MyCarsOnRent} />
        <Stack.Screen name="AddCar" component={AddCar} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signin" component={Signin} />
      <TabsNavigator/>
      
  </NavigationContainer>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

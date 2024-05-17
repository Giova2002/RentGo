import {Home,Likes,Cars,MyCarsOnRent,AddCar} from "../screens";
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; //se importa desde terminal con npm install @react-navigation/bottom-tabs
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator();
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
                    source={require('../assets/homepage.png')} 
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
                    source={require('../assets/heart.png')} 
                    style={{ width: 35, height: 33 }} 
                  />
            </View>
            );

          }
         } }
        
        />
        <Tab.Screen
         name='Cars' 
         component={Cars}
         options={{
          tabBarIcon: ({focused})=>{
            return(
            <View style = {{alignItems: "center", justifyContent:"center",top:10}}>
               <Image
                    source={require('../assets/car.png')} 
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
                    source={require('../assets/lista.png')} 
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
                    source={require('../assets/boton-mas.png')} 
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
  
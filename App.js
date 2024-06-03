
import { AppRegistry } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabsNavigator from './navigation/TabsNavigator';
import {
  useFonts,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
  Raleway_900Black,
} from '@expo-google-fonts/raleway';
import { useCarFiltersContext,CarFiltersProvider } from './context/CarFiltersContext'
import { UserProvider } from './context/UserContext';




export default function App() {
  
    let [fontsLoaded] = useFonts({
      Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
  Raleway_900Black,
  
    });
  

  if (!fontsLoaded) {
    return null;
  }
  return (
    <UserProvider>
    <CarFiltersProvider>
    <NavigationContainer>
    
 

      <TabsNavigator/>


    </NavigationContainer>
    </CarFiltersProvider>
    </UserProvider>
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

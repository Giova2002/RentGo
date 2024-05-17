import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabsNavigator from './navigation/TabsNavigator';
import {useFonts} from 'expo-font';




export default function App() {
  const [fontsLoaded] = useFonts({
    SF: require("./assets/fonts/SF_Pro_Rounded_Regular.ttf")
  })
  return (
    <NavigationContainer>
 

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

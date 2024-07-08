import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
//the log in screen
import { Login } from './login';
//screen for testing *only accesable when testing  
import { Test } from './test';
//the Storage screen
import { Storage  } from './Storage/storage';
//the add item screen
import { Additem  } from './Storage/additem';
//the camera screen
import { Cam  } from './cam/cam';


//component for making and using the drawer
const Drawer = createDrawerNavigator();


export default function App() {
  return (
    // Navigation container for the entire app 
<NavigationContainer>
  {/* Drawer navigator that make that the ifrs screen will be Logout(the log in screen) */}
  <Drawer.Navigator initialRouteName="Logout">
    {/* Screen for the Log in screen */}
    <Drawer.Screen
      name="Logout"
      component={Login}
      //hide the pre made navigation bar
      options={{ headerShown: false }}
    />
    {/* Screen for testing */}
    <Drawer.Screen
      name="Test"
      component={Test}
      options={{
        // Hide the screen in the drawer
        drawerItemStyle: { display: 'none' },
        //hide the pre made navigation bar
        headerShown: false
      }}
    />
    {/* Screen for storage */}
    <Drawer.Screen
      name="Storage"
      component={Storage}
      //hide the pre made navigation bar
      options={{ headerShown: false }}
    />
    {/* Screen for adding items, component is Additem */}
    <Drawer.Screen
      name="Additem"
      component={Additem}
      options={{
        // Hide the screen in the drawer
        drawerItemStyle: { display: 'none' },
        //hide the pre made navigation bar
        headerShown: false
      }}
    />
    {/* Screen for the camera */}
    <Drawer.Screen
      name="Cam"
      component={Cam}
      //hide the pre made navigation bar
      options={{ headerShown: false }}
    />
  </Drawer.Navigator>
</NavigationContainer>

  );
 
}

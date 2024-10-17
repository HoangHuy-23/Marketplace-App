import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './Apps/Screens/LoginScreen';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store'
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './Apps/Navigations/TabNavigation';
import { useEffect } from 'react';


export default function App() {
  const tokenCache = {
    async getToken(key) {
      try {
        const item = await SecureStore.getItemAsync(key)
        if (item) {
          console.log(`${key} was used 🔐 \n`)
        } else {
          console.log('No values stored under key: ' + key)
        }
        return item
      } catch (error) {
        console.error('SecureStore get item error: ', error)
        await SecureStore.deleteItemAsync(key)
        return null
      }
    },
    async saveToken(key , value) {
      try {
        return SecureStore.setItemAsync(key, value)
      } catch (err) {
        return
      }
    },
  }
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey='pk_test_bGlnaHQtc25haWwtODIuY2xlcmsuYWNjb3VudHMuZGV2JA'>

    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      <SignedIn>
        <NavigationContainer>
          <TabNavigation/>
        </NavigationContainer>
      </SignedIn>
      <SignedOut>
      <LoginScreen/>

      </SignedOut>
    </View>
    </ClerkProvider>
  );
}


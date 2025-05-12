
import React from 'react'
import { Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { setCustomText } from 'react-native-global-props';
import { useColorScheme } from '@/hooks/useColorScheme';
// import 'react-native-reanimated';

// Prevent auto-hide until we’re ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      setCustomText({ style: { fontFamily: 'Inter_400Regular' } });
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  const Wrapper = Platform.OS === 'web' ? React.Fragment : GestureHandlerRootView;

  return (
    <Wrapper style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Wrapper>
  );
}



//wokring for mobile app but not web

// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import { Platform } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import 'react-native-reanimated';
//
// import { useColorScheme } from '@/hooks/useColorScheme';
//
// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();
//
// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });
//
//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);
//
//   if (!loaded) {
//     return null;
//   }
//
//   // Use GestureHandlerRootView for native, Fragment for web
//   const Wrapper = Platform.OS === 'web' ? React.Fragment : GestureHandlerRootView;
//
//   return (
//     <Wrapper style={{ flex: 1 }}>
//       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//         <Stack>
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="+not-found" />
//         </Stack>
//         <StatusBar style="auto" />
//       </ThemeProvider>
//     </Wrapper>
//   );
// }
//import 'react-native-url-polyfill/auto'
//import * as SecureStore from 'expo-secure-store'
//import { createClient } from '@supabase/supabase-js'
//
//const ExpoSecureStoreAdapter = {
//  getItem: (key) => {
//    return SecureStore.getItemAsync(key)
//  },
//  setItem: (key, value) => {
//    SecureStore.setItemAsync(key, value)
//  },
//  removeItem: (key) => {
//    SecureStore.deleteItemAsync(key)
//  },
//}
//
//const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
//const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
//
//export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//  auth: {
//    storage: ExpoSecureStoreAdapter,
//    autoRefreshToken: true
//  },
//}

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase credentials
const supabaseUrl = "https://xnriewxccgaohmxvgmur.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhucmlld3hjY2dhb2hteHZnbXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzODk0NDQsImV4cCI6MjA1Nzk2NTQ0NH0.m3E0MUu5DB6CLeASQ0mYwqu54dVgnKobK8E4heshJkY";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import Cookies from 'js-cookie';
import Constants from 'expo-constants';

// const { BACKEND_URL } = Constants.expoConfig?.extra ?? Constants.manifest.extra;
const BACKEND_URL = process.env.BACKEND_URL;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleLogout = async () => {
    try {
      // Step 1: Ensure the CSRF cookie is available
      await fetch(`${BACKEND_URL}/api/csrf/`, {
        credentials: 'include',
      });

      // Step 2: Get the CSRF token from cookies
      const csrfToken = Cookies.get('csrftoken');

      // Step 3: Perform logout with CSRF token
      const res = await fetch(`${BACKEND_URL}/accounts/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!res.ok) throw new Error('Logout failed');

      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Logout error:', e);
      Alert.alert('Logout Failed', 'Unable to log out.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <Text style={[styles.title, { color: theme.text }]}>Welcome to ShortyURL</Text>
      <Text style={[styles.subtitle, { color: theme.muted }]}>
        Your ultimate URL shortener and analytics dashboard
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/(main)/CreateUrl')}
      >
        <Text style={styles.buttonText}>Create URL</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/(main)/Analytics')}
      >
        <Text style={styles.buttonText}>View Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#DC3545' }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.95,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

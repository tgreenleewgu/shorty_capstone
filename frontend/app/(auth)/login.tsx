import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';

export default function LoginPage() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/me/`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.username) {
            router.replace('/(main)/index');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleGitHubLogin = () => {
    window.location.href = `${BACKEND_URL}/accounts/github/login/`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/accounts/google/login/`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={[styles.title, { color: theme.text }]}>Welcome to ShortyURL</Text>
      <Text style={[styles.subtitle, { color: theme.muted }]}>Log in to continue</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#333' }]}
        onPress={handleGitHubLogin}
      >
        <Text style={styles.buttonText}>Login with GitHub</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#DB4437' }]}
        onPress={handleGoogleLogin}
      >
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  useColorScheme,
  Linking,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RadioButton } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Constants from 'expo-constants';

// const { BACKEND_URL } = Constants.expoConfig?.extra ?? Constants.manifest.extra;
const BACKEND_URL = process.env.BACKEND_URL;

const API_ENDPOINT = `${BACKEND_URL}/api/shorten/`;
const USER_INFO_API = `${BACKEND_URL}/api/me/`;
const CSRF_API = `${BACKEND_URL}/api/csrf/`;

function getCSRFToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

export default function CreateURL() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [urlType, setUrlType] = useState('default');
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(USER_INFO_API, { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.username) {
          setUsername(data.username);
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    fetchUser();
  }, []);

  const shortenUrl = async () => {
    if (!longUrl.trim()) {
      setResponseStatus('error');
      setResponseMessage('Please enter a URL to shorten');
      return;
    }
    if (urlType === 'custom' && !customAlias.trim()) {
      setResponseStatus('error');
      setResponseMessage('Please enter a custom alias');
      return;
    }

    setIsLoading(true);
    setShortUrl('');
    setResponseMessage('');
    setResponseStatus('');

    try {
      await fetch(CSRF_API, { credentials: 'include' });
      const csrfToken = getCSRFToken();
      if (!csrfToken) throw new Error('CSRF token missing from cookies.');

      const requestBody = urlType === 'default'
        ? { original_url: longUrl }
        : { original_url: longUrl, custom_code: customAlias };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.error || data.detail || `Server error: ${response.status}`;
        setResponseStatus('error');
        setResponseMessage(errorMsg);
      } else {
        const shortenedUrl = data.short_url || data.shortened_url || data.url || '';
        if (shortenedUrl) {
          setShortUrl(shortenedUrl);
          setResponseStatus('success');
          setResponseMessage('URL shortened successfully!');
        }
      }
    } catch (err) {
      setResponseStatus('error');
      setResponseMessage(`API Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setLongUrl('');
    setCustomAlias('');
    setShortUrl('');
    setResponseMessage('');
    setResponseStatus('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <TouchableOpacity
        onPress={() => router.replace('/(main)')}
        style={{ position: 'absolute', top: 20, left: 20, zIndex: 999, padding: 10 }}
      >
        <Ionicons name="home-outline" size={28} color={theme.text} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace('/(main)/Analytics')}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 999, padding: 10 }}
      >
        <Ionicons name="bar-chart-outline" size={35} color={theme.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Text style={[styles.pageTitle, { color: theme.text }]}>Shorten a URL</Text>
          <Text style={[styles.subtext, { color: theme.muted }]}>Paste a long link and get a short one you can share.</Text>

          <View style={styles.radioGroup}>
            {['default', 'custom'].map(type => (
              <TouchableOpacity
                key={type}
                style={styles.radioOption}
                onPress={() => setUrlType(type)}
              >
                <RadioButton
                  value={type}
                  status={urlType === type ? 'checked' : 'unchecked'}
                  onPress={() => setUrlType(type)}
                  color={theme.primary}
                />
                <Text style={[styles.radioText, { color: theme.text }]}>Use {type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
            value={longUrl}
            onChangeText={setLongUrl}
            placeholder="Enter long URL..."
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
          />

          {urlType === 'custom' && (
            <TextInput
              style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
              value={customAlias}
              onChangeText={setCustomAlias}
              placeholder="Enter custom alias (optional)"
              placeholderTextColor={theme.muted}
              autoCapitalize="none"
            />
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={shortenUrl}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Shorten URL</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.primary }]}
            onPress={resetForm}
          >
            <Text style={[styles.buttonText, { color: theme.primary }]}>Reset</Text>
          </TouchableOpacity>

          {responseMessage !== '' && (
            <Text style={[styles.message, { color: responseStatus === 'success' ? 'limegreen' : 'red' }]}>
              {responseMessage}
            </Text>
          )}

          {shortUrl !== '' && (
            <>
              <TouchableOpacity onPress={() => Linking.openURL(shortUrl)}>
                <Text style={[styles.resultUrl, { color: theme.primary }]}>{shortUrl}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await Clipboard.setStringAsync(shortUrl);
                  Alert.alert('Copied!', 'Short URL copied to clipboard.');
                }}
                style={[styles.button, {
                  backgroundColor: theme.primary,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }]}
              >
                <Ionicons name="copy-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Copy Link</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  radioText: { marginLeft: 4 },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    width: '100%',
    backgroundColor: '#2C2C2C',
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  message: { marginTop: 16, textAlign: 'center', fontSize: 16 },
  resultUrl: { marginTop: 16, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme,
  View,
  Text,
  TextInput,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Cookies from 'js-cookie';
import Constants from 'expo-constants';

// const { BACKEND_URL } = Constants.expoConfig?.extra ?? Constants.manifest.extra;
const BACKEND_URL = process.env.BACKEND_URL;

export const unstable_settings = {
  initialRouteName: 'Analytics',
  screenOptions: {
    tabBarStyle: { display: 'none' },
  },
};

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();

  const [urls, setUrls] = useState([]);
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedShortCode, setCopiedShortCode] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [username, setUsername] = useState("");

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/me/`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.username) {
        setUsername(data.username);
        return data.username;
      } else {
        throw new Error("User not logged in.");
      }
    } catch (err) {
      setError("Please log in first.");
    }
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await fetchUser();
      if (!currentUser) return;

      const res = await axios.get(`${BACKEND_URL}/api/analytics/`, {
        withCredentials: true,
        params: { username: currentUser },
      });

      setUrls(res.data);
      setFilteredUrls(res.data);
    } catch (err) {
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (shortCode) => {
    try {
      await fetch(`${BACKEND_URL}/api/csrf/`, {
        credentials: 'include',
      });

      const csrfToken = Cookies.get('csrftoken');

      await axios.delete(`${BACKEND_URL}/api/analytics/${shortCode}/`, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });

      fetchAnalytics();
    } catch (err) {
      setError("Failed to delete URL.");
    }
  };

  const copyToClipboard = (shortCode) => {
    Clipboard.setString(`${BACKEND_URL}/s/${shortCode}`);
    setCopiedShortCode(shortCode);
    setCopyMessage("Short URL copied to clipboard!");
    setTimeout(() => {
      setCopyMessage("");
      setCopiedShortCode(null);
    }, 3000);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUrls(urls);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = urls.filter((url) =>
        url.original_url.toLowerCase().includes(lowerQuery) ||
        url.short_code.toLowerCase().includes(lowerQuery)
      );
      setFilteredUrls(filtered);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatDate = (isoString) => {
    if (!isoString || typeof isoString !== 'string') return null;
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.replace('/(main)')}>
          <Ionicons name="home-outline" size={28} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={fetchAnalytics}>
          <Ionicons name="refresh-outline" size={28} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(main)/CreateUrl')}>
          <Ionicons name="link-sharp" size={32} color={theme.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUrls}
        keyExtractor={(item) => item.short_code}
        contentContainerStyle={[styles.list, { alignItems: 'center', paddingTop: 24, paddingBottom: 100 }]}
        ListHeaderComponent={
          <View style={styles.innerContainer}>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Your Analytics</Text>
            <Text style={[styles.subtext, { color: theme.muted }]}>Track performance of your shortened URLs</Text>
            <TextInput
              style={[styles.searchInput, { borderColor: theme.primary, color: theme.text }]}
              placeholder="Search URLs or short codes..."
              placeholderTextColor={theme.muted}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" />
          ) : error ? (
            <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          ) : (
            <Text style={{ color: theme.text, textAlign: 'center' }}>No URLs found.</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card, borderLeftColor: theme.primary, width: width - 60 }]}>
            <Text style={[styles.urlText, { color: theme.text }]}>{item.original_url}</Text>
            <Text style={{ color: theme.text }}>Short code: {item.short_code}</Text>
            <Text style={{ color: theme.text }}>Clicks: {item.clicks}</Text>
            {item.created_at && formatDate(item.created_at) && (
              <Text style={{ color: theme.muted, marginTop: 6 }}>
                Created on: {formatDate(item.created_at)}
              </Text>
            )}

            <TouchableOpacity onPress={() => copyToClipboard(item.short_code)}>
              <Text style={[styles.copyText, { color: theme.primary }]}>Copy Short URL</Text>
            </TouchableOpacity>

            {copiedShortCode === item.short_code && copyMessage && (
              <Text style={styles.copyConfirmation}>{copyMessage}</Text>
            )}

            <TouchableOpacity
              onPress={() => handleDelete(item.short_code)}
              style={[styles.deleteButton, { backgroundColor: '#DC3545' }]}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerBar: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 999,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 700,
    marginBottom: 24,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: '#2C2C2C',
  },
  list: {
    width: '100%',
  },
  card: {
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    borderLeftWidth: 5,
  },
  urlText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  copyText: {
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  copyConfirmation: {
    color: '#28a745',
    marginTop: 8,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 14,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

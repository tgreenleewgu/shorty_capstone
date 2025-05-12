import { Stack, router } from "expo-router";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import Constants from "expo-constants";

// const { BACKEND_URL } = Constants.expoConfig?.extra ?? Constants.manifest.extra;
const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL || 'http://localhost:8000';

export default function SettingsPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/me/`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not logged in");

      const data = await res.json();

      if (data?.username) {
        setUser({ username: data.username });
      } else {
        throw new Error("Invalid session");
      }
    } catch (err) {
      console.log("No valid session, redirecting");
      router.replace("/(auth)/login");
    }
  };

  const doLogout = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        router.replace("/(auth)/login");
      } else {
        const data = await res.json();
        Alert.alert("Logout Error", data.error || "Logout failed.");
      }
    } catch (err) {
      Alert.alert("Logout Error", "Network issue during logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      <View style={{ padding: 16 }}>
        {user ? (
          <>
            <Text style={styles.userInfo}>Logged in as:</Text>
            <Text style={styles.userEmail}>{user.username}</Text>

            <TouchableOpacity
              onPress={() => setShowMetadata(!showMetadata)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleButtonText}>
                {showMetadata ? "Hide Details" : "Show Details"}
              </Text>
            </TouchableOpacity>

            {showMetadata && (
              <View style={styles.userDetails}>
                <Text style={styles.jsonText}>{JSON.stringify(user, null, 2)}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={doLogout}
              style={styles.buttonContainer}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "LOGGING OUT..." : "LOGOUT"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading user information...</Text>
        )}

        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
          style={styles.goBackButton}
        >
          <Text style={styles.goBackButtonText}>Go to Login</Text>
        </TouchableOpacity>

        {user && (
          <TouchableOpacity
            onPress={() => router.replace("/")}
            style={styles.homeButton}
          >
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    padding: 16,
  },
  userInfo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#FFFFFF",
  },
  userEmail: {
    fontSize: 18,
    color: "#DDDDDD",
    marginBottom: 10,
    textAlign: "center",
  },
  toggleButton: {
    backgroundColor: "#8A2BE2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  userDetails: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
  },
  jsonText: {
    fontSize: 16,
    fontFamily: "monospace",
    color: "#CCCCCC",
  },
  buttonContainer: {
    backgroundColor: "#8A2BE2",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  goBackButton: {
    backgroundColor: "#dc3545",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
  },
  goBackButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  homeButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
  },
  homeButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    padding: 20,
    color: "#FFFFFF",
  },
});

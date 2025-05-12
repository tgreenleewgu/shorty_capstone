import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router, Redirect } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

export default function App() {
  useEffect(() => {
    // Initial check for existing session
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log("User logged in, going to home");
          router.replace("app/(tabs)/CreateUrl");
        } else {
          console.log("No user, going to login");
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // On error, safest to redirect to login
        router.replace("/(auth)/login");
      }
    };

    checkAuth();

    // Setup listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)/CreateUrl/");
      } else {
        router.replace("/(auth)/login");
      }
    });

    // Clean up subscription
    return () => subscription.unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Redirect href="/(auth)/login" />
    </GestureHandlerRootView>
  );
}
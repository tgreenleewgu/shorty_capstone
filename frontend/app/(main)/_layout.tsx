import { Tabs, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Constants from 'expo-constants';

const BACKEND_URL = process.env.BACKEND_URL;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        console.log("🔍 Checking session...");
        const res = await fetch(`${BACKEND_URL}/api/me/`, {
          credentials: 'include',
        });

        console.log("✅ Status:", res.status);

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        console.log("✅ Response data:", data);

        if (data.username) {
          isMounted && setUser(data.username);
        } else {
          throw new Error("No username found");
        }
      } catch (err) {
        console.log("❌ Redirecting to login:", err.message);
        router.replace("/(auth)/login");
      } finally {
        isMounted && setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: { display: 'none' }, // You can toggle this for prod/dev
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifying glass.circle.fill" color={color} />,
        }}
      />
       <Tabs.Screen
              name="CreateURL"
              options={{
                title: 'Create URL',
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name="link.badge.plus" color={color} />
                ),
              }}
            />
          </Tabs>
        ) : null;
      }

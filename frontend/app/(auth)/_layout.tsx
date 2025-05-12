import { Stack } from "expo-router";

// Optional: hide route group name in dev mode
export const unstable_settings = {
  initialRouteName: "login",
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
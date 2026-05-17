import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import "@/global.css";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

SplashScreen.preventAutoHideAsync().catch((error) => {
  console.error("SplashScreen.preventAutoHideAsync failed:", error);
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "sans-regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch((error) => {
        console.error("SplashScreen.hideAsync failed:", error);
      });
    }
  }, [fontsLoaded, fontError]);

  if (!publishableKey) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          backgroundColor: "#fff9e3",
        }}
      >
        <Text style={{ fontSize: 16, textAlign: "center", color: "#081126" }}>
          Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file, then restart
          Expo.
        </Text>
      </View>
    );
  }

  if (fontError) {
    console.error("Font loading failed:", fontError);
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          backgroundColor: "#fff9e3",
        }}
      >
        <Text style={{ fontSize: 16, textAlign: "center", color: "#081126" }}>
          Unable to load app fonts.
        </Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return <AppLoadingScreen />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}

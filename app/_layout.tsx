import { Stack } from "expo-router";
import '@/global.css'
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

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
    "sans-extrabold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf")
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch((error) => {
        console.error("SplashScreen.hideAsync failed:", error);
      });
    }
  }, [fontsLoaded, fontError]);

  if (fontError) {
    console.error("Font loading failed:", fontError);
    return (
      <View className="flex-1 items-center justify-center bg-background p-5">
        <Text className="text-base font-sans-medium text-primary">
          Unable to load app fonts.
        </Text>
      </View>
    );
  }

  if (!fontsLoaded) return null;


  return <Stack screenOptions={{headerShown: false}}/>;
}

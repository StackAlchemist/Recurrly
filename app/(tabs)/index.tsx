import "@/global.css"
import { Text } from "react-native";
import {Link} from "expo-router"
import { styled } from "nativewind";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSSafeAreaView);
 
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
 
      <Text className="text-5xl font-sans-bold text-primary">
        Home
      </Text>

      <Link href="/onboarding" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go to Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go to Sign In</Link>
      <Link href="/(auth)/sign-up" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go to Sign Up</Link>

    
    </SafeAreaView>
  );
}
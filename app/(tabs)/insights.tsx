import { Text, View } from 'react-native'
import { styled } from "nativewind";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSSafeAreaView);

const insights = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>insights</Text>
    </SafeAreaView>
  )
}
export default insights
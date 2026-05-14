import { Text } from 'react-native'
import { styled } from "nativewind";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSSafeAreaView);

const subscriptions = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>subscriptions</Text>
    </SafeAreaView>
  )
}
export default subscriptions
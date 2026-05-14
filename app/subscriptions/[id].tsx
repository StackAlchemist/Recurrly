import { View, Text } from 'react-native'
import { useLocalSearchParams, Link } from "expo-router"
const SubscriptionDetails = () => {
    // Destructure the id
    const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Subscription Details: {id} </Text>
      <Link href="/">Go back</Link>
    </View>
  )
}
export default SubscriptionDetails
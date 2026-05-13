import { View, Text } from 'react-native'
import {Link} from "expo-router"
const SignUp = () => {
  return (
    <View>
      <Text>Sign Up</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  )
}
export default SignUp
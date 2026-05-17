import { useClerk, useUser } from "@clerk/expo";
import { formatJoinedDate, getUserDisplayName } from "@/lib/utils";
import { Pressable, Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSSafeAreaView);

type ProfileRowProps = {
  label: string;
  value?: string;
  mono?: boolean;
};

function ProfileRow({ label, value, mono }: ProfileRowProps) {
  if (!value) return null;

  return (
    <View className="settings-row">
      <Text className="settings-label">{label}</Text>
      <Text className={mono ? "settings-value-mono" : "settings-value"}>
        {value}
      </Text>
    </View>
  );
}

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName = getUserDisplayName(user);
  const email = user?.primaryEmailAddress?.emailAddress;
  const accountId = user?.id;
  const joinedDate = formatJoinedDate(user?.createdAt);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-6 text-2xl font-sans-bold text-primary">Settings</Text>

      <View className="settings-profile-card">
        <ProfileRow label="Name" value={displayName} />
        <ProfileRow label="Email" value={email} />
        <ProfileRow label="Account ID" value={accountId} mono />
        <ProfileRow label="Joined" value={joinedDate} />
      </View>

      <Pressable className="auth-button" onPress={signOut}>
        <Text className="auth-button-text">Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;

import "@/global.css";
import { Text, View, FlatList, Image } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import {
  HOME_BALANCE,
  UPCOMING_SUBSCRIPTIONS,
  HOME_SUBSCRIPTIONS,
} from "@/constants/data";
import { useUser } from "@clerk/expo";
import { icons } from "@/constants/icons";
import { formatCurrency, getUserDisplayName } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionsCard from "@/components/UpcomingSubscriptionsCard";
import SubscriptionsCard from "@/components/SubscriptionsCard";
import { useState } from "react";
const SafeAreaView = styled(RNSSafeAreaView);

export default function App() {
  const { user } = useUser();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const displayName = getUserDisplayName(user);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                {displayName ? (
                  <Text
                    className="home-user-name"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {displayName}
                  </Text>
                ) : null}
              </View>
              <Image source={icons.add} className="home-add-icon" />
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionsCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <Text className="home-empty-text">
                    No upcoming subscriptions yet.
                  </Text>
                )}
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionsCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No Subscriptions yet.</Text>
        }
        contentContainerClassName="pb-30"
      />

      {/* <SubscriptionsCard   
        {...HOME_SUBSCRIPTIONS[0]} 
          expanded={expandedSubscriptionId === HOME_SUBSCRIPTIONS[0].id}
          onPress={()=>setExpandedSubscriptionId(
            (currentId)=>(currentId === HOME_SUBSCRIPTIONS[0].id ? 
              null : HOME_SUBSCRIPTIONS[0].id))}
        /> */}
    </SafeAreaView>
  );
}

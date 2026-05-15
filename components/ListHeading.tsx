import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";


const ListHeading = ({ title, onViewAllPress }: ListHeadingProps) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      <TouchableOpacity
        className="list-action"
        onPress={onViewAllPress}
        disabled={!onViewAllPress}
        accessibilityRole="button"
        accessibilityState={{ disabled: !onViewAllPress }}
      >
        <Text className="list-action-text">View All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListHeading;


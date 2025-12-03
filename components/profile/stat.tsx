import { View, Text } from 'react-native';
import React from 'react';

type StatsType = {
  icon: React.ReactNode;
  text: string;
  value: string;
};

export default function Stat({ text, icon, value }: StatsType) {
  return (
    <View className="flex-1 items-center">
      {icon}
      <Text className="mt-1 text-xs text-gray-500">{text}</Text>
      <Text className="mt-1 font-semibold text-gray-900">{value}</Text>
    </View>
  );
}

import { View, Text } from 'react-native';
import React from 'react';

type StatProps = {
  text: string;
  value: number;
};

export const formatDistance = (value: number) => {
  return (value / 1000).toFixed(2) + ' km';
};

export const formatDuration = (value: number) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes} min` : `${minutes} min`;
};

export const formatElevation = (value: number) => {
  return Math.round(value) + ' m';
};

export default function Stat({ value, text }: StatProps) {
  const formatValue = () => {
    if (text === 'Distance') {
      return formatDistance(value);
    } else if (text === 'Duration') {
      return formatDuration(value);
    } else if (text === 'Elevation') {
      return formatElevation(value);
    }
    return value;
  };

  return (
    <View className="flex-1">
      <Text className="mb-1 text-sm text-gray-500">{text}</Text>
      <Text className="text-2xl font-bold text-gray-900">{formatValue()}</Text>
    </View>
  );
}

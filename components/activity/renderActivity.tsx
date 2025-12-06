import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Chip from 'components/chip';
import { router } from 'expo-router';
import { formatDistance, formatDuration } from './stat';
import { Activity } from 'types/types';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function RenderActivity({ item }: { item: Activity }) {
  return (
    <TouchableOpacity
      className="mb-3 rounded-lg border border-gray-200 bg-white p-4"
      onPress={() => router.push(`/activity/${item.id}`)}>
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="flex-1 text-lg font-semibold text-gray-900">{item.title}</Text>
        <Chip type={item.type} />
      </View>

      <Text className="mb-3 text-sm text-gray-500">{formatDate(item.created_at)}</Text>

      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-gray-500">Distance</Text>
          <Text className="font-semibold text-gray-900">{formatDistance(item.distance)}</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Duration</Text>
          <Text className="font-semibold text-gray-900">{formatDuration(item.duration)}</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Elevation</Text>
          <Text className="font-semibold text-gray-900">{Math.round(item.elevation_gain)}m</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

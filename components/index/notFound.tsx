import { View, Text } from 'react-native';
import React from 'react';

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-center text-lg text-gray-500">No activities yet</Text>
      <Text className="text-center text-gray-400">Upload your first activity to get started!</Text>
    </View>
  );
}

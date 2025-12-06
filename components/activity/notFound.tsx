import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function NotFound() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      style={{ paddingTop: insets.top }}>
      <Text className="mb-4 text-xl font-semibold text-gray-900">Activity not found</Text>
      <Text className="mb-6 text-gray-500">The activity you're looking for doesn't exist</Text>
      <TouchableOpacity className="rounded-lg bg-blue-600 px-6 py-3" onPress={() => router.back()}>
        <Text className="font-medium text-white">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

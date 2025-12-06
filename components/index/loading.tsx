import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

export default function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

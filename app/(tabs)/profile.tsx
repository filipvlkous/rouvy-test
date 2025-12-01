import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { useRouter } from 'expo-router';
import { useAuthStore } from 'store/authStore';

export default function Profile() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'ride' | 'run'>('ride');
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="mb-8 text-3xl font-bold">Upload Activity</Text>

      <TouchableOpacity
        className="mb-4 rounded-lg bg-blue-600 py-4"
        onPress={handleSignOut}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-base font-semibold text-white">
            Choose File & Upload
          </Text>
        )}
      </TouchableOpacity>

      <Text className="mt-4 text-center text-sm text-gray-500">
        Supported formats: GPX, FIT, TCX
      </Text>
    </View>
  );
}

import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from 'store/authStore';

export default function Profile() {
  const { signOut, user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    signOut();
  };

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-white px-6 pt-12">
      <Text className="mb-8 text-3xl font-bold">User profile</Text>
      <Text>{user?.email}</Text>
      <TouchableOpacity className="mb-4 rounded-lg bg-blue-600 py-4" onPress={handleSignOut}>
        <Text className="text-center text-base font-semibold text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

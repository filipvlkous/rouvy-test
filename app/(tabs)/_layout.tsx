import { Tabs } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function TabLayout() {
  const { signOut } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2563eb',
        headerRight: () => (
          <TouchableOpacity onPress={signOut} className="mr-4">
            <Text className="font-medium text-blue-600">Sign Out</Text>
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Activities',
          tabBarLabel: 'Activities',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarLabel: 'Upload',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

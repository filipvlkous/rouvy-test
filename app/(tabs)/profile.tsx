import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';
import { Mail, TrendingUp, MapPin, Clock, Mountain, Bike, Footprints, LogOut } from 'lucide-react-native';

import { useAuthStore } from 'store/authStore';
import { useActivityStore } from 'store/activityStore';

export default function Profile() {
  const { signOut, user } = useAuthStore();
  const { activities, loading, fetchActivities } = useActivityStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchActivities();
  }, []);

  const stats = useMemo(() => {
    if (!activities.length) {
      return {
        totalActivities: 0,
        totalDistance: 0,
        totalDuration: 0,
        totalElevation: 0,
        totalRides: 0,
        totalRuns: 0,
      };
    }

    return activities.reduce(
      (acc, activity) => ({
        totalActivities: acc.totalActivities + 1,
        totalDistance: acc.totalDistance + (activity.distance || 0),
        totalDuration: acc.totalDuration + (activity.duration || 0),
        totalElevation: acc.totalElevation + (activity.elevation_gain || 0),
        totalRides: acc.totalRides + (activity.type === 'ride' ? 1 : 0),
        totalRuns: acc.totalRuns + (activity.type === 'run' ? 1 : 0),
      }),
      {
        totalActivities: 0,
        totalDistance: 0,
        totalDuration: 0,
        totalElevation: 0,
        totalRides: 0,
        totalRuns: 0,
      }
    );
  }, [activities]);

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading && activities.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: Platform.OS === 'ios' ? 0 : insets.bottom }}
      className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 pb-4">
          <Text className="text-3xl font-bold">Profile</Text>
        </View>

        <View className="px-6">
          {/* User Info */}
          <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
            <View className="mb-2 flex-row items-center">
              <Mail size={16} color="#6b7280" />
              <Text className="ml-2 text-xs text-gray-500">Email</Text>
            </View>
            <Text className="font-semibold text-gray-900">{user?.email}</Text>
          </View>

          {/* Stats Overview */}
          <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
            {/* First Row */}
            <View className="mb-4 flex-row justify-between">
              <View className="flex-1 items-center">
                <TrendingUp size={20} color="#2563eb" />
                <Text className="mt-1 text-xs text-gray-500">Activities</Text>
                <Text className="mt-1 font-semibold text-gray-900">{stats.totalActivities}</Text>
              </View>
              <View className="flex-1 items-center">
                <MapPin size={20} color="#2563eb" />
                <Text className="mt-1 text-xs text-gray-500">Distance</Text>
                <Text className="mt-1 font-semibold text-gray-900">
                  {formatDistance(stats.totalDistance)} km
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Clock size={20} color="#2563eb" />
                <Text className="mt-1 text-xs text-gray-500">Duration</Text>
                <Text className="mt-1 font-semibold text-gray-900">
                  {formatDuration(stats.totalDuration)}
                </Text>
              </View>
            </View>

            {/* Second Row */}
            <View className="flex-row justify-between">
              <View className="flex-1 items-center">
                <Mountain size={20} color="#2563eb" />
                <Text className="mt-1 text-xs text-gray-500">Elevation</Text>
                <Text className="mt-1 font-semibold text-gray-900">
                  {Math.round(stats.totalElevation)}m
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Bike size={20} color="#2563eb" />
                <Text className="mt-1 text-xs text-gray-500">Rides</Text>
                <Text className="mt-1 font-semibold text-gray-900">{stats.totalRides}</Text>
              </View>
              <View className="flex-1 items-center">
                <Footprints size={20} color="#2563eb" />
                <Text className="mt-1 text-xs text-gray-500">Runs</Text>
                <Text className="mt-1 font-semibold text-gray-900">{stats.totalRuns}</Text>
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            className="mb-4 flex-row items-center justify-center rounded-lg bg-red-600 py-4"
            onPress={handleSignOut}>
            <LogOut size={18} color="white" />
            <Text className="ml-2 text-center text-base font-semibold text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

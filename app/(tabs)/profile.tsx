import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActionState, useEffect, useState } from 'react';
import {
  Mail,
  TrendingUp,
  MapPin,
  Clock,
  Mountain,
  Bike,
  Footprints,
  LogOut,
} from 'lucide-react-native';

import { useAuthStore } from 'store/authStore';
import { getUserStatistics } from 'api/supabase';
import { useActivityStore } from 'store/activityStore';
import Stat from 'components/profile/stat';

export type StatsType = {
  total_activities: number;
  total_distance: number;
  total_duration: number;
  total_elevation: number;
  total_rides: number;
  total_runs: number;
};

const initData = {
  total_activities: 0,
  total_distance: 0,
  total_duration: 0,
  total_elevation: 0,
  total_rides: 0,
  total_runs: 0,
};

export default function Profile() {
  const [statsData, setStatsData] = useState<StatsType>(initData);
  const { signOut, user } = useAuthStore();
  const { activities } = useActivityStore();
  const insets = useSafeAreaInsets();

  const getData = async () => {
    if (user?.id) {
      const { data, error } = await getUserStatistics({ user_id: user?.id });

      if (!error && data) {
        setStatsData(data);
      } else {
        setStatsData(initData);
      }
    }
  };

  useEffect(() => {
    getData();
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
              <Stat
                icon={<TrendingUp size={20} color="#2563eb" />}
                text={'Activities'}
                value={statsData.total_activities.toString()}
              />
              <Stat
                icon={<MapPin size={20} color="#2563eb" />}
                text={'Distance'}
                value={`${formatDistance(statsData.total_distance)} km`}
              />
              <Stat
                icon={<Clock size={20} color="#2563eb" />}
                text={'Duration'}
                value={`${formatDuration(statsData.total_duration)}`}
              />
            </View>

            {/* Second Row */}
            <View className="flex-row justify-between">
              <Stat
                icon={<Mountain size={20} color="#2563eb" />}
                text={'Elevation'}
                value={`${Math.round(statsData.total_elevation)} m`}
              />
              <Stat
                icon={<Bike size={20} color="#2563eb" />}
                text={'Rides'}
                value={`${statsData.total_rides}`}
              />
              <Stat
                icon={<Footprints size={20} color="#2563eb" />}
                text={'Runs'}
                value={`${statsData.total_runs}`}
              />
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

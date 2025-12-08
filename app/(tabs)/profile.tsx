import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import {
  Mail,
  TrendingUp,
  MapPin,
  Clock,
  Mountain,
  Bike,
  Footprints,
  LogOut,
  AlertCircle,
} from 'lucide-react-native';

import { useAuthStore } from 'store/authStore';
import { getUserStatistics } from 'api/supabase';
import { useActivityStore } from 'store/activityStore';
import Stat from 'components/profile/stat';
import ButtonCustom from 'components/buttonCustom';
import { formatDistance, formatDuration } from 'services/profile';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signOut, user } = useAuthStore();
  const { activities } = useActivityStore();
  const insets = useSafeAreaInsets();

  const getData = async () => {
    if (user?.id) {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await getUserStatistics({ user_id: user?.id });

        if (!error && data) {
          setStatsData(data);
        } else {
          setStatsData(initData);
          if (error) {
            setError(error.message || 'Failed to load statistics');
          }
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setStatsData(initData);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [activities]);

  const handleSignOut = async () => {
    await signOut();
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
          <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
            <View className="mb-2 flex-row items-center">
              <Mail size={16} color="#6b7280" />
              <Text className="ml-2 text-xs text-gray-500">Email</Text>
            </View>
            <Text className="font-semibold text-gray-900">{user?.email}</Text>
          </View>

          {error && (
            <View className="mb-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <View className="mb-3 flex-row items-start">
                <View className="rounded-full bg-red-100 p-2">
                  <AlertCircle size={20} color="#dc2626" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="mb-1 font-semibold text-red-900">Failed to load statistics</Text>
                  <Text className="text-sm text-red-600">{error}</Text>
                </View>
              </View>
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-lg bg-red-600 px-4 py-2.5"
                onPress={() => {
                  setError(null);
                  getData();
                }}>
                <Text className="font-semibold text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {loading ? (
            <View className="mb-3 rounded-lg border border-gray-200 bg-white p-8">
              <View className="items-center">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="mt-4 text-sm text-gray-500">Loading your statistics...</Text>
              </View>
            </View>
          ) : (
            <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
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
          )}

          <ButtonCustom
            onPress={handleSignOut}
            icon={<LogOut size={20} color="white" />}
            text={'Sign out'}
            buttonStyle={'bg-red-600'}
            textStyle={'color-white'}
          />
        </View>
      </ScrollView>
    </View>
  );
}

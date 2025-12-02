import { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { useRouter } from 'expo-router';
import { Activity } from '../../utils/types';

export default function Activities() {
  const { activities, loading, fetchActivities } = useActivityStore();
  const router = useRouter();

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + ' km';
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderActivity = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      className="mb-3 rounded-lg border border-gray-200 bg-white p-4"
      onPress={() => router.push(`/activity/${item.id}`)}>
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="flex-1 text-lg font-semibold text-gray-900">{item.name}</Text>
        <View className="rounded-full bg-blue-100 px-3 py-1">
          <Text className="text-xs font-medium uppercase text-blue-700">{item.type}</Text>
        </View>
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

  if (loading && activities.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pb-4 pt-12">
        <Text className="text-3xl font-bold">My Activities</Text>
      </View>

      {activities.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center text-lg text-gray-500">No activities yet</Text>
          <Text className="text-center text-gray-400">
            Upload your first activity to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchActivities} colors={['#2563eb']} />
          }
        />
      )}
    </View>
  );
}

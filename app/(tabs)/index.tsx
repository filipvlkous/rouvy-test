import { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { useRouter } from 'expo-router';
import { Activity } from '../../lib/types';

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
      className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
      onPress={() => router.push(`/activity/${item.id}`)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-900 flex-1">
          {item.name}
        </Text>
        <View className="bg-blue-100 px-3 py-1 rounded-full">
          <Text className="text-blue-700 text-xs font-medium uppercase">
            {item.type}
          </Text>
        </View>
      </View>

      <Text className="text-gray-500 text-sm mb-3">
        {formatDate(item.created_at)}
      </Text>

      <View className="flex-row justify-between">
        <View>
          <Text className="text-gray-500 text-xs">Distance</Text>
          <Text className="text-gray-900 font-semibold">
            {formatDistance(item.distance)}
          </Text>
        </View>
        <View>
          <Text className="text-gray-500 text-xs">Duration</Text>
          <Text className="text-gray-900 font-semibold">
            {formatDuration(item.duration)}
          </Text>
        </View>
        <View>
          <Text className="text-gray-500 text-xs">Elevation</Text>
          <Text className="text-gray-900 font-semibold">
            {Math.round(item.elevation_gain)}m
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && activities.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 pt-12 pb-4 bg-white">
        <Text className="text-3xl font-bold">My Activities</Text>
      </View>

      {activities.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-gray-500 text-center text-lg mb-4">
            No activities yet
          </Text>
          <Text className="text-gray-400 text-center">
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
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchActivities}
              colors={['#2563eb']}
            />
          }
        />
      )}
    </View>
  );
}

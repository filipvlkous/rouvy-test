import { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { useRouter } from 'expo-router';
import { Activity } from '../../utils/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RenderActivity from 'components/activity/renderActivity';

export default function Activities() {
  const { activities, loading, loadingMore, hasMore, fetchActivities, loadMore } =
    useActivityStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchActivities();
  }, []);

  const renderActivity = ({ item }: { item: Activity }) => (
    <RenderActivity key={item.id} item={item} />
  );

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
      <View className="flex-1 ">
        <View className="border-2-b border-gray-400 px-6 pb-4 ">
          <Text className="text-3xl font-bold ">My Activities</Text>
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => fetchActivities(true)}
                colors={['#2563eb']}
              />
            }
            onEndReached={() => {
              if (hasMore && !loadingMore) {
                loadMore();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              <View style={{ height: 100 }}>
                {loadingMore && (
                  <View className="py-4">
                    <ActivityIndicator size="small" color="#2563eb" />
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

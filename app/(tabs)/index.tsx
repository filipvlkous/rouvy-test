import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { Activity, FilterType } from '../../types/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RenderActivity from 'components/activity/renderActivity';
import Loading from 'components/index/loading';
import NotFound from 'components/index/notFound';
import FilterButton from 'components/index/filterButton';

export default function Activities() {
  const { activities, loading, loadingMore, hasMore, fetchActivities, loadMore } =
    useActivityStore();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    const filterParam = newFilter === 'all' ? undefined : newFilter;
    fetchActivities(true, filterParam);
  };

  const renderActivity = ({ item }: { item: Activity }) => (
    <RenderActivity key={item.id} item={item} />
  );

  if (loading && activities.length === 0) {
    return <Loading />;
  }

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: Platform.OS === 'ios' ? 0 : insets.bottom }}
      className="flex-1 bg-gray-50">
      <View className="flex-1 ">
        <View className="border-2-b border-gray-400 px-6 pb-4 ">
          <Text className="text-3xl font-bold ">My Activities</Text>

          <View className="mt-4 flex-row gap-2">
            <FilterButton
              selectedFilter={filter}
              filter={'All'}
              handleFilterChange={() => handleFilterChange('all')}
            />

            <FilterButton
              selectedFilter={filter}
              filter={'Ride'}
              handleFilterChange={() => handleFilterChange('ride')}
            />

            <FilterButton
              selectedFilter={filter}
              filter={'Run'}
              handleFilterChange={() => handleFilterChange('run')}
            />
          </View>
        </View>

        {activities.length === 0 ? (
          <NotFound />
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

import { useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActivityStore } from '../../store/activityStore';
import { LineChart } from 'react-native-gifted-charts';

type ChartType = 'speed' | 'heart_rate' | 'elevation' | 'power';

export default function ActivityDetail() {
  const { id } = useLocalSearchParams();
  const { getActivityById } = useActivityStore();
  const activity = getActivityById(id as string);
  const router = useRouter();
  const [chartType, setChartType] = useState<ChartType>('speed');

  if (!activity) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Activity not found</Text>
      </View>
    );
  }

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + ' km';
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getChartData = () => {
    if (!activity.activity_data || activity.activity_data.length === 0) {
      return [{ value: 0 }];
    }

    // Sample data if too many points (for performance)
    const data = activity.activity_data;
    const maxPoints = 100;
    const step = Math.max(1, Math.floor(data.length / maxPoints));

    return data
      .filter((_, index) => index % step === 0)
      .map((point) => ({
        value: Number(point[chartType]) || 0,
      }));
  };

  const getChartLabel = () => {
    switch (chartType) {
      case 'speed':
        return 'Speed (km/h)';
      case 'heart_rate':
        return 'Heart Rate (bpm)';
      case 'elevation':
        return 'Elevation (m)';
      case 'power':
        return 'Power (W)';
    }
  };

  const getChartColor = () => {
    switch (chartType) {
      case 'speed':
        return '#2563eb';
      case 'heart_rate':
        return '#dc2626';
      case 'elevation':
        return '#16a34a';
      case 'power':
        return '#9333ea';
    }
  };

  const chartButtons: { type: ChartType; label: string }[] = [
    { type: 'speed', label: 'Speed' },
    { type: 'heart_rate', label: 'HR' },
    { type: 'elevation', label: 'Elevation' },
    { type: 'power', label: 'Power' },
  ];

  const screenWidth = Dimensions.get('window').width;
  const chartData = getChartData();
  const chartColor = getChartColor();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pb-6 pt-12">
        <TouchableOpacity className="mb-4" onPress={() => router.back()}>
          <Text className="text-base text-blue-600">← Back</Text>
        </TouchableOpacity>

        <Text className="mb-2 text-3xl font-bold">{activity.name}</Text>
        <View className="mb-6 self-start rounded-full bg-blue-100 px-3 py-1">
          <Text className="text-xs font-medium uppercase text-blue-700">{activity.type}</Text>
        </View>

        <View className="mb-8 flex-row justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-sm text-gray-500">Distance</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {formatDistance(activity.distance)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-sm text-gray-500">Duration</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {formatDuration(activity.duration)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-sm text-gray-500">Elevation</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {Math.round(activity.elevation_gain)}m
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="mb-3 text-lg font-semibold">Activity Data</Text>
          <View className="mb-4 flex-row justify-between">
            {chartButtons.map((button) => (
              <TouchableOpacity
                key={button.type}
                className={`mx-1 flex-1 rounded-lg border py-2 ${
                  chartType === button.type
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 bg-white'
                }`}
                onPress={() => setChartType(button.type)}>
                <Text
                  className={`text-center text-sm font-medium ${
                    chartType === button.type ? 'text-white' : 'text-gray-700'
                  }`}>
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="rounded-lg bg-gray-50 p-4">
            <Text className="mb-4 text-center font-medium text-gray-700">{getChartLabel()}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={chartData}
                width={screenWidth - 80}
                height={200}
                color={chartColor}
                thickness={2}
                hideDataPoints
                curved
                areaChart
                startFillColor={chartColor}
                endFillColor={chartColor}
                startOpacity={0.3}
                endOpacity={0.05}
                initialSpacing={0}
                endSpacing={0}
                spacing={Math.max(2, (screenWidth - 100) / chartData.length)}
                backgroundColor="transparent"
                rulesColor="#e5e7eb"
                rulesType="solid"
                xAxisColor="#e5e7eb"
                yAxisColor="#e5e7eb"
                yAxisTextStyle={{ color: '#9ca3af', fontSize: 10 }}
                hideYAxisText
                noOfSections={4}
              />
            </ScrollView>
          </View>
        </View>

        <View className="mt-4 rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 font-medium text-gray-700">File Info</Text>
          <Text className="text-sm text-gray-600">{activity.file_name}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

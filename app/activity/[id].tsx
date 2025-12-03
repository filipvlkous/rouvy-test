import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActivityStore } from '../../store/activityStore';
import { getActivityData } from 'api/supabase';
import { ChartType, DataPoint } from 'utils/types';
import { LineChart } from 'react-native-gifted-charts';
import Chip from 'components/chip';
import Stat from 'components/activity/stat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDate } from 'components/activity/renderActivity';
import MapView, { Polyline, Marker } from 'react-native-maps';

export default function ActivityDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [activityData, setActivityData] = useState<DataPoint[]>([]);
  const [chartType, setChartType] = useState<ChartType>('speed');
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { getActivityById } = useActivityStore();
  const activity = getActivityById(id as string);
  if (!activity) return;
  const router = useRouter();

  const onChartTypeChange = (chartType: ChartType) => {
    setSelectedValue(null);
    setChartType(chartType);
  };

  const getActivityDataId = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getActivityData({ activity_id: activity?.id });
      if (!error && data) {
        setActivityData(data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getActivityDataId();
  }, [id]);

  if (!activity) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Activity not found</Text>
      </View>
    );
  }

  const getChartData = () => {
    if (!activityData || activityData.length === 0) {
      return [{ value: 0 }];
    }

    const maxPoints = 100;
    const step = Math.max(1, Math.floor(activityData.length / maxPoints));

    return activityData
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

  const getMapRegion = () => {
    if (!activityData || activityData.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    const validPoints = activityData.filter(
      (point) => point.latitude !== 0 && point.longitude !== 0
    );

    if (validPoints.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    const latitudes = validPoints.map((p) => p.latitude);
    const longitudes = validPoints.map((p) => p.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.3;
    const lngDelta = (maxLng - minLng) * 1.3;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  const getRouteCoordinates = () => {
    if (!activityData || activityData.length === 0) return [];

    return activityData
      .filter((point) => point.latitude !== 0 && point.longitude !== 0)
      .map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));
  };

  const mapRegion = getMapRegion();
  const routeCoordinates = getRouteCoordinates();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-white">
      <View className=" px-6 pb-6 ">
        <View className="mb-2 flex-row items-start justify-between">
          <TouchableOpacity className="border-1 mb-4" onPress={() => router.back()}>
            <Text className="text-base text-blue-600">← Back</Text>
          </TouchableOpacity>
          <Text className="mb-3 text-sm text-gray-500">{formatDate(activity.created_at)}</Text>
        </View>

        <View className="mb-2 flex-row items-start justify-between">
          <Text className="flex-1 text-3xl font-semibold text-gray-900">{activity.title}</Text>

          <Chip type={activity.type} />
        </View>

        <View className="mb-8 flex-row justify-between">
          <Stat text={'Distance'} value={activity.distance} />
          <Stat text={'Duration'} value={activity.duration} />
          <Stat text={'Elevation'} value={activity.elevation_gain} />
        </View>

        <View className="mb-4">
          <Text className="mb-3 text-lg font-semibold">Activity Data</Text>

          <>
            <View className="mb-4 flex-row justify-between">
              {chartButtons.map((button) => (
                <TouchableOpacity
                  key={button.type}
                  className={`mx-1 flex-1 rounded-lg border py-2 ${
                    chartType === button.type
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => onChartTypeChange(button.type)}>
                  <Text
                    className={`text-center text-sm font-medium ${
                      chartType === button.type ? 'text-white' : 'text-gray-700'
                    }`}>
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {isLoading ? (
              <View className="h-[200px] flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="mt-4 text-gray-500">Loading activity data...</Text>
              </View>
            ) : (
              <View className="rounded-lg bg-gray-50 p-4">
                <View className="mb-4 flex-row items-center justify-center">
                  <Text className="text-center font-medium text-gray-700">{getChartLabel()}</Text>
                  {selectedValue !== null && (
                    <Text
                      className="ml-2 rounded-md px-3  text-sm font-bold"
                      style={{ color: chartColor }}>
                      {selectedValue.toFixed(1)}
                    </Text>
                  )}
                </View>
                <LineChart
                  isAnimated={false}
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
                  pointerConfig={{
                    pointerStripHeight: 200,
                    pointerStripColor: chartColor,
                    pointerStripWidth: 2,
                    pointerColor: chartColor,
                    radius: 6,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 90,
                    activatePointersOnLongPress: false,
                    autoAdjustPointerLabelPosition: false,
                    pointerLabelComponent: (items: any) => {
                      const value = items[0]?.value;
                      if (value !== undefined) {
                        setTimeout(() => setSelectedValue(value), 0);
                      }
                      return null;
                    },
                  }}
                />
              </View>
            )}
          </>
        </View>
        {isLoading ? (
          <View className="mb-8 h-[300px] items-center justify-center rounded-lg bg-gray-50">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="mt-4 text-gray-500">Loading map...</Text>
          </View>
        ) : routeCoordinates.length > 0 ? (
          <View className="mb-8">
            <Text className="mb-3 text-lg font-semibold">Route Map</Text>
            <View className="overflow-hidden rounded-lg">
              <MapView
                style={{ width: screenWidth - 48, height: 300 }}
                region={mapRegion}
                scrollEnabled={true}
                zoomEnabled={true}
                pitchEnabled={false}
                rotateEnabled={false}>
                <Polyline coordinates={routeCoordinates} strokeColor="#2563eb" strokeWidth={4} />

                {routeCoordinates.length > 0 && (
                  <>
                    <Marker
                      coordinate={routeCoordinates[0]}
                      pinColor="green"
                      title="Start"
                      description="Activity start point"
                    />
                    <Marker
                      coordinate={routeCoordinates[routeCoordinates.length - 1]}
                      pinColor="red"
                      title="End"
                      description="Activity end point"
                    />
                  </>
                )}
              </MapView>
            </View>
          </View>
        ) : null}

        <View className="mt-4 rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 font-medium text-gray-700">File Info</Text>
          <Text className="text-sm text-gray-600">{activity.file_name}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

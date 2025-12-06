import { ChartType, DataPoint } from 'types/types';

export const getChartLabel = (chartType: ChartType) => {
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

export const getChartColor = (chartType: ChartType) => {
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

export const getChartData = (activityData: DataPoint[], chartType: ChartType) => {
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

export const getMapRegion = (activityData: DataPoint[]) => {
  if (!activityData || activityData.length === 0) {
    return {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const validPoints = activityData.filter((point) => point.latitude !== 0 && point.longitude !== 0);

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

export const getRouteCoordinates = (activityData: DataPoint[]) => {
  if (!activityData || activityData.length === 0) return [];

  return activityData
    .filter((point) => point.latitude !== 0 && point.longitude !== 0)
    .map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    }));
};

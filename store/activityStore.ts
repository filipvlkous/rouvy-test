import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { Activity, DataPoint, ParsedActivity } from '../utils/types';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { getAllActions, postActions } from 'api/supabase';
import { parseGPX } from 'utils/parseGPX';
import { Toast } from 'toastify-react-native';

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  page: number;
  pageSize: number;
  fetchActivities: (refresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  uploadActivity: (name: string, type: 'ride' | 'run') => Promise<void>;
  getActivityById: (id: string) => Activity | undefined;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  page: 0,
  pageSize: 10,
  fetchActivities: async (refresh = false) => {
    const currentState = get();

    if (refresh) {
      set({ loading: true, page: 0, activities: [], hasMore: true });
    } else {
      set({ loading: true });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      set({ loading: false });
      return;
    }

    const { data, error } = await getAllActions({
      user_id: user.id,
      limit: currentState.pageSize,
      offset: 0
    });

    if (!error && data) {
      set({
        activities: data as Activity[],
        loading: false,
        page: 0,
        hasMore: data.length === currentState.pageSize
      });
    } else {
      set({ loading: false });
    }
  },

  loadMore: async () => {
    const currentState = get();

    if (currentState.loadingMore || !currentState.hasMore) return;

    set({ loadingMore: true });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      set({ loadingMore: false });
      return;
    }

    const nextPage = currentState.page + 1;
    const offset = nextPage * currentState.pageSize;

    const { data, error } = await getAllActions({
      user_id: user.id,
      limit: currentState.pageSize,
      offset
    });

    if (!error && data) {
      set({
        activities: [...currentState.activities, ...(data as Activity[])],
        loadingMore: false,
        page: nextPage,
        hasMore: data.length === currentState.pageSize
      });
    } else {
      set({ loadingMore: false });
    }
  },

  uploadActivity: async (name: string, type: 'ride' | 'run') => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/gpx+xml', 'application/octet-stream', '*/*'],
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileContent = await FileSystem.readAsStringAsync(file.uri);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('activity-files')
      .upload(filePath, fileContent, {
        contentType: file.mimeType || 'application/octet-stream',
      });

    if (uploadError) throw uploadError;

    const parsedData = parseActivityFile(fileContent, file.name);

    const { data: activityData, error: activityError } = await postActions({
      user_id: user.id,
      title: name,
      type,
      file_name: uploadData.id,
      file_url: uploadData.fullPath,
      distance: parsedData.distance,
      duration: Math.round(parsedData.duration),
      elevation_gain: parsedData.elevationGain,
    });

    if (activityError) throw activityError;

    const dataPointsWithActivityId = parsedData.dataPoints.map((dataPoint: DataPoint) => ({
      ...dataPoint,
      activity_id: activityData?.id,
      timestamp: dataPoint.timestamp / 1000,
    }));

    const { error } = await supabase
      .from('activity_data')
      .insert(dataPointsWithActivityId)
      .select();

    await get().fetchActivities();
  },

  getActivityById: (id: string) => {
    return get().activities.find((a) => a.id === id);
  },
}));

function parseActivityFile(content: string, fileName: string): ParsedActivity {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'gpx') {
    return parseGPX(content);
  } else if (extension === 'fit') {
    return parseFIT(content);
  }

  return {
    distance: 0,
    duration: 0,
    elevationGain: 0,
    dataPoints: [],
  };
}

function parseFIT(content: string): ParsedActivity {
  // FIT files are binary and require a specialized parser
  // For now, return empty data - consider using a library like 'fit-file-parser'
  console.warn('FIT file parsing not implemented - consider using fit-file-parser library');
  return {
    distance: 0,
    duration: 0,
    elevationGain: 0,
    dataPoints: [],
  };
}

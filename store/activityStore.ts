import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { Activity, DataPoint, ParsedActivity } from '../types/types';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { getAllActions, postActions } from 'api/supabase';
import { parseGPX } from 'utils/parseGPX';

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  loadingMore: boolean;
  uploading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  pageSize: number;
  fetchActivities: (refresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  uploadActivity: (name: string, type: 'ride' | 'run') => Promise<boolean>;
  getActivityById: (id: string) => Activity | undefined;
  clearError: () => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  loading: false,
  loadingMore: false,
  uploading: false,
  error: null,
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
      offset: 0,
    });

    if (!error && data) {
      set({
        activities: data as Activity[],
        loading: false,
        page: 0,
        hasMore: data.length === currentState.pageSize,
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
      offset,
    });

    if (!error && data) {
      set({
        activities: [...currentState.activities, ...(data as Activity[])],
        loadingMore: false,
        page: nextPage,
        hasMore: data.length === currentState.pageSize,
      });
    } else {
      set({ loadingMore: false });
    }
  },

  uploadActivity: async (name: string, type: 'ride' | 'run') => {
    try {
      set({ uploading: true, error: null });

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/gpx+xml', 'application/octet-stream', '*/*'],
      });

      if (result.canceled) {
        set({ uploading: false });
        return false;
      }

      const file = result.assets[0];

      if (!file) {
        set({ uploading: false, error: 'No file selected' });
        return false;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        set({ uploading: false, error: 'You must be logged in to upload activities' });
        return false;
      }

      let fileContent: string;
      try {
        fileContent = await FileSystem.readAsStringAsync(file.uri);
      } catch (error) {
        set({ uploading: false, error: 'Failed to read file. Please try again.' });
        return false;
      }

      const filePath = `${user.id}/${Date.now()}_${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('activity-files')
        .upload(filePath, fileContent, {
          contentType: file.mimeType || 'application/octet-stream',
        });

      if (uploadError) {
        set({ uploading: false, error: `Failed to upload file: ${uploadError.message}` });
        return false;
      }

      if (!uploadData) {
        set({ uploading: false, error: 'Upload failed. Please try again.' });
        return false;
      }

      let parsedData: ParsedActivity;
      try {
        parsedData = parseActivityFile(fileContent, file.name);

        if (!parsedData.dataPoints || parsedData.dataPoints.length === 0) {
          set({ uploading: false, error: 'Invalid file format. No activity data found.' });
          return false;
        }
      } catch (error) {
        set({ uploading: false, error: 'Failed to parse activity file. Please check the file format.' });
        return false;
      }

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

      if (activityError) {
        set({ uploading: false, error: `Failed to save activity: ${activityError.message}` });
        return false;
      }

      if (!activityData?.id) {
        set({ uploading: false, error: 'Activity created but no ID returned' });
        return false;
      }

      const dataPointsWithActivityId = parsedData.dataPoints.map((dataPoint: DataPoint) => ({
        ...dataPoint,
        activity_id: activityData.id,
        timestamp: dataPoint.timestamp / 1000,
      }));

      const { error: dataPointsError } = await supabase
        .from('activity_data')
        .insert(dataPointsWithActivityId)
        .select();

      if (dataPointsError) {
        set({ uploading: false, error: `Activity saved but failed to save data points: ${dataPointsError.message}` });
        return false;
      }

      await get().fetchActivities();
      set({ uploading: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      set({ uploading: false, error: `Upload failed: ${errorMessage}` });
      return false;
    }
  },

  getActivityById: (id: string) => {
    return get().activities.find((a) => a.id === id);
  },

  clearError: () => {
    set({ error: null });
  },
}));

function parseActivityFile(content: string, fileName: string): ParsedActivity {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'gpx') {
    return parseGPX(content);
  }

  return {
    distance: 0,
    duration: 0,
    elevationGain: 0,
    dataPoints: [],
  };
}

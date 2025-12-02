import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { Activity, DataPoint, ParsedActivity } from '../utils/types';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { getAllActions, postActions } from 'api/supabase';
import { parseGPX } from 'utils/parseGPX';

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  fetchActivities: () => Promise<void>;
  uploadActivity: (name: string, type: 'ride' | 'run') => Promise<void>;
  getActivityById: (id: string) => Activity | undefined;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  loading: false,

  fetchActivities: async () => {
    set({ loading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      set({ loading: false });
      return;
    }

    const { data, error } = await getAllActions({ user_id: user.id });

    if (!error && data) {
      set({ activities: data as Activity[], loading: false });
    } else {
      set({ loading: false });
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

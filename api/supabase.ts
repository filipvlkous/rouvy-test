import { supabase } from 'utils/supabase';
import { DataPoint } from 'utils/types';

type postActionsProps = {
  user_id: string;
  title: string;
  type: 'ride' | 'run';
  file_name: string;
  file_url: string;
  distance: number;
  duration: number;
  elevation_gain: number;
};

export async function postActions({
  user_id,
  title,
  type,
  file_name,
  file_url,
  distance,
  duration,
  elevation_gain,
}: postActionsProps) {
  const { data, error } = await supabase
    .from('activities')
    .insert({
      user_id: user_id,
      title: title,
      type,
      file_name: file_name,
      file_url: file_url,
      distance: distance,
      duration: duration,
      elevation_gain: elevation_gain,
    })
    .select()
    .single();

  return { data, error };
}

export async function getAllActions({
  user_id,
  limit = 10,
  offset = 0
}: {
  user_id: string;
  limit?: number;
  offset?: number;
}) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return { data, error };
}

export async function getActivityData({
  activity_id,
}: {
  activity_id: string;
}): Promise<{ data: DataPoint[] | null; error: any }> {
  const { data, error } = await supabase
    .from('activity_data')
    .select('*')
    .eq('activity_id', activity_id);

  return { data, error };
}

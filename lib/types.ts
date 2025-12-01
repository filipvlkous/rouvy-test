export interface Activity {
  id: string;
  user_id: string;
  name: string;
  type: 'ride' | 'run';
  file_name: string;
  file_url: string;
  distance: number;
  duration: number;
  elevation_gain: number;
  created_at: string;
  activity_data: ActivityDataPoint[];
}

export interface ActivityDataPoint {
  timestamp: number;
  speed?: number;
  heart_rate?: number;
  elevation?: number;
  cadence?: number;
  power?: number;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: string;
  email: string;
}

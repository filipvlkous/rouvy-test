export type ActivityType = 'ride' | 'run';

export interface Activity {
  id: string;
  user_id: string;
  name: string;
  type: ActivityType;
  file_url: string | null;
  file_name: string | null;
  distance: number;
  duration: number;
  elevation_gain: number;
  created_at: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface ParsedActivity {
  distance: number;
  duration: number;
  elevationGain: number;
  dataPoints: DataPoint[];
}

export interface DataPoint {
  id?: string;
  activity_id?: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  elevation: number;
  speed: number;
  heart_rate: number | null;
  cadence: number | null;
  power: number | null;
}

export interface ActivityStats {
  averageSpeed: number;
  maxSpeed: number;
  averageHeartRate: number | null;
  maxHeartRate: number | null;
  averageCadence: number | null;
  averagePower: number | null;
}

export interface ActivityWithStats extends Activity {
  stats?: ActivityStats;
  dataPointsCount?: number;
}

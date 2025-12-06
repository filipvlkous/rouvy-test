import { DataPoint, ParsedActivity } from '../types/types';

export function parseGPX(content: string): ParsedActivity {
  const dataPoints: DataPoint[] = [];
  let totalDistance = 0;
  let totalElevationGain = 0;
  let previousPoint: { lat: number; lon: number; ele: number; time: number } | null = null;

  const trkptRegex = /<trkpt[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*>([\s\S]*?)<\/trkpt>/gi;
  let match;

  while ((match = trkptRegex.exec(content)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    const pointContent = match[3];

    const eleText = getElementText(pointContent, 'ele');
    const elevation = eleText ? parseFloat(eleText) : 0;

    const timeText = getElementText(pointContent, 'time');
    const timestamp = timeText ? new Date(timeText).getTime() : Date.now();

    const hrMatch = pointContent.match(/<gpxtpx:hr>(\d+)<\/gpxtpx:hr>/i);
    const heartRate = hrMatch ? parseInt(hrMatch[1], 10) : null;

    const cadMatch = pointContent.match(/<gpxtpx:cad>(\d+)<\/gpxtpx:cad>/i);
    const cadence = cadMatch ? parseInt(cadMatch[1], 10) : null;

    const powerMatch = pointContent.match(/<power>(\d+)<\/power>/i);
    const power = powerMatch ? parseInt(powerMatch[1], 10) : null;

    let speed = 0;
    if (previousPoint) {
      const segmentDistance = calculateDistance(previousPoint.lat, previousPoint.lon, lat, lon);
      totalDistance += segmentDistance;

      const elevationDiff = elevation - previousPoint.ele;
      if (elevationDiff > 0) {
        totalElevationGain += elevationDiff;
      }

      const timeDiff = (timestamp - previousPoint.time) / 1000;
      if (timeDiff > 0) {
        speed = segmentDistance / timeDiff;
      }
    }

    dataPoints.push({
      timestamp,
      latitude: lat,
      longitude: lon,
      elevation,
      speed,
      heart_rate: heartRate,
      cadence,
      power,
    });

    previousPoint = { lat, lon, ele: elevation, time: timestamp };
  }

  let duration = 0;
  if (dataPoints.length >= 2) {
    duration = (dataPoints[dataPoints.length - 1].timestamp - dataPoints[0].timestamp) / 1000;
  }

  return {
    distance: totalDistance,
    duration,
    elevationGain: totalElevationGain,
    dataPoints,
  };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getElementText(element: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([^<]*)</${tagName}>`, 'i');
  const match = element.match(regex);
  return match ? match[1].trim() : null;
}

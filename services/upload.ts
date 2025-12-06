import { Alert } from 'react-native';
import { Router } from 'expo-router';

interface HandleUploadParams {
  name: string;
  type: 'ride' | 'run';
  setLoading: (loading: boolean) => void;
  uploadActivity: (name: string, type: 'ride' | 'run') => Promise<boolean>;
  setName: (name: string) => void;
  router: Router;
}

export async function handleUpload({
  name,
  type,
  setLoading,
  uploadActivity,
  setName,
  router,
}: HandleUploadParams) {
  if (!name.trim()) {
    Alert.alert('Missing Information', 'Please enter an activity name');
    return;
  }

  setLoading(true);
  try {
    const success = await uploadActivity(name, type);
    if (success) {
      setName('');
      Alert.alert('Success', 'Activity uploaded successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/'),
        },
      ]);
    }
  } catch (error) {
    // Error is already handled in the store
  } finally {
    setLoading(false);
  }
}

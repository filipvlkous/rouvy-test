import { Alert } from 'react-native';
import { Router } from 'expo-router';

interface HandleUploadParams {
  name: string;
  type: 'ride' | 'run';
  uploadActivity: (name: string, type: 'ride' | 'run') => Promise<boolean>;
  setName: (name: string) => void;
  router: Router;
  error: string;
}

export async function handleUpload({
  name,
  type,
  uploadActivity,
  error,
  setName,
  router,
}: HandleUploadParams) {
  if (!name.trim()) {
    Alert.alert('Missing Information', 'Please enter an activity name');
    return;
  }

  const success = await uploadActivity(name, type);
  if (success) {
    setName('');
    Alert.alert('Success', 'Activity uploaded successfully!', [
      {
        text: 'OK',
        onPress: () => router.push('/'),
      },
    ]);
  } else if (error !== '') {
    Alert.alert('Upload Failed', error);
  }
}

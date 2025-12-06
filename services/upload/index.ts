import { Alert } from 'react-native';
import { Toast } from 'toastify-react-native';
import type { Router } from 'expo-router';

interface HandleUploadParams {
  name: string;
  type: 'ride' | 'run';
  setLoading: (loading: boolean) => void;
  uploadActivity: (name: string, type: 'ride' | 'run') => Promise<void>;
  setName: (name: string) => void;
  router: Router;
}

export const handleUpload = async ({
  name,
  type,
  setLoading,
  uploadActivity,
  setName,
  router,
}: HandleUploadParams) => {
  // Validate activity name
  if (!name.trim()) {
    Alert.alert('Error', 'Please enter an activity name');
    return;
  }

  // Validate name length
  if (name.trim().length < 2) {
    Alert.alert('Error', 'Activity name must be at least 2 characters');
    return;
  }

  if (name.trim().length > 100) {
    Alert.alert('Error', 'Activity name must be less than 100 characters');
    return;
  }

  setLoading(true);
  try {
    await uploadActivity(name.trim(), type);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Successfully uploaded activity',
      visibilityTime: 1500,
      backgroundColor: '#0c9500',
      textColor: '#fff',
      autoHide: true,
      icon: false,
      closeIcon: 'close',
      closeIconFamily: 'MaterialIcons',
      closeIconSize: 18,
    });
    setName('');
    router.push('/(tabs)');
  } catch (error: any) {
    // Handle specific error cases
    let errorTitle = 'Upload Failed';
    let errorMessage = 'Failed to upload activity';

    if (error.message) {
      // Network/connection errors
      if (error.message.includes('network') || error.message.includes('Network')) {
        errorTitle = 'Network Error';
        errorMessage = 'Please check your internet connection and try again';
      }
      // Authentication errors
      else if (error.message.includes('authenticated') || error.message.includes('auth')) {
        errorTitle = 'Authentication Error';
        errorMessage = 'Please sign in again to upload activities';
      }
      // File read errors
      else if (error.message.includes('read') || error.message.includes('file')) {
        errorTitle = 'File Error';
        errorMessage = 'Unable to read the selected file. Please try another file';
      }
      // Storage errors
      else if (error.message.includes('storage') || error.message.includes('upload')) {
        errorTitle = 'Storage Error';
        errorMessage = 'Failed to upload file to storage. Please try again';
      }
      // Database errors
      else if (error.message.includes('database') || error.message.includes('insert')) {
        errorTitle = 'Database Error';
        errorMessage = 'Failed to save activity data. Please try again';
      }
      // File format/parsing errors
      else if (error.message.includes('parse') || error.message.includes('invalid')) {
        errorTitle = 'Invalid File';
        errorMessage =
          'The selected file is invalid or corrupted. Please upload a valid GPX or FIT file';
      }
      // File too large
      else if (error.message.includes('size') || error.message.includes('large')) {
        errorTitle = 'File Too Large';
        errorMessage = 'The selected file is too large. Please try a smaller file';
      }
      // Generic error with message
      else {
        errorMessage = error.message;
      }
    }

    // Show error alert
    Alert.alert(errorTitle, errorMessage, [{ text: 'OK', style: 'default' }]);

    // Log error for debugging
    console.error('Upload error:', error);
  } finally {
    setLoading(false);
  }
};

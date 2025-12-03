import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bike, Footprints, Upload as UploadIcon, FileText } from 'lucide-react-native';

export default function Upload() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'ride' | 'run'>('ride');
  const [loading, setLoading] = useState(false);
  const { uploadActivity } = useActivityStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleUpload = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter an activity name');
      return;
    }

    setLoading(true);
    try {
      await uploadActivity(name, type);
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
      Alert.alert('Error', error.message || 'Failed to upload activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: Platform.OS === 'ios' ? 0 : insets.bottom }}
      className="flex-1 bg-gray-50">
      <View className="px-6 pb-4">
        <Text className="text-3xl font-bold">Upload Activity</Text>
      </View>

      <View className="px-6">
        {/* Activity Name */}
        <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
          <Text className="mb-2 text-xs text-gray-500">Activity Name</Text>
          <TextInput
            className="text-base font-semibold text-gray-900"
            placeholder="Morning Ride"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Activity Type */}
        <View className="mb-3">
          <Text className="mb-3 text-xs text-gray-500">Activity Type</Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`mr-2 flex-1 rounded-lg border py-4 ${
                type === 'ride' ? 'border-blue-600 bg-blue-600' : 'border-gray-200 bg-white'
              }`}
              onPress={() => setType('ride')}>
              <View className="items-center">
                <Bike size={24} color={type === 'ride' ? '#ffffff' : '#2563eb'} />
                <Text
                  className={`mt-2 font-semibold ${
                    type === 'ride' ? 'text-white' : 'text-gray-700'
                  }`}>
                  Ride
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`ml-2 flex-1 rounded-lg border py-4 ${
                type === 'run' ? 'border-blue-600 bg-blue-600' : 'border-gray-200 bg-white'
              }`}
              onPress={() => setType('run')}>
              <View className="items-center">
                <Footprints size={24} color={type === 'run' ? '#ffffff' : '#2563eb'} />
                <Text
                  className={`mt-2 font-semibold ${
                    type === 'run' ? 'text-white' : 'text-gray-700'
                  }`}>
                  Run
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          className="mb-3 flex-row items-center justify-center rounded-lg bg-blue-600 py-4"
          onPress={handleUpload}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <UploadIcon size={18} color="white" />
              <Text className="ml-2 text-center text-base font-semibold text-white">
                Choose File & Upload
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Supported Formats Info */}
        <View className="rounded-lg border border-gray-200 bg-white p-4">
          <View className="flex-row items-center">
            <FileText size={16} color="#6b7280" />
            <Text className="ml-2 text-xs text-gray-500">Supported formats</Text>
          </View>
          <Text className="mt-1 text-sm font-semibold text-gray-700">GPX, FIT</Text>
        </View>
      </View>
    </View>
  );
}

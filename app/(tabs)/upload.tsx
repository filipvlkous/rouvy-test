import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-white px-6 pt-12">
      <Text className="mb-8 text-3xl font-bold">Upload Activity</Text>

      <Text className="mb-2 font-medium text-gray-700">Activity Name</Text>
      <TextInput
        className="mb-6 rounded-lg border border-gray-300 px-4 py-3 text-base"
        placeholder="Morning Ride"
        value={name}
        onChangeText={setName}
      />

      <Text className="mb-3 font-medium text-gray-700">Activity Type</Text>
      <View className="mb-8 flex-row">
        <TouchableOpacity
          className={`mr-2 flex-1 rounded-lg border-2 py-3 ${
            type === 'ride' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
          }`}
          onPress={() => setType('ride')}>
          <Text
            className={`text-center font-semibold ${
              type === 'ride' ? 'text-white' : 'text-gray-700'
            }`}>
            Ride
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`ml-2 flex-1 rounded-lg border-2 py-3 ${
            type === 'run' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
          }`}
          onPress={() => setType('run')}>
          <Text
            className={`text-center font-semibold ${
              type === 'run' ? 'text-white' : 'text-gray-700'
            }`}>
            Run
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mb-4 rounded-lg bg-blue-600 py-4"
        onPress={handleUpload}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-base font-semibold text-white">
            Choose File & Upload
          </Text>
        )}
      </TouchableOpacity>

      <Text className="mt-4 text-center text-sm text-gray-500">
        Supported formats: GPX, FIT, TCX
      </Text>
    </View>
  );
}
